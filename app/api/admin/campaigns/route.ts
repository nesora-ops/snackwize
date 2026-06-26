import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { startCampaignSchema } from '@/lib/validation'
import { sendNextBatch } from '@/lib/campaign'
import { NextRequest, NextResponse } from 'next/server'

async function recipientCount(campaignId: string, status?: string) {
  let q = supabaseAdmin.from('campaign_recipients').select('id', { count: 'exact', head: true }).eq('campaign_id', campaignId)
  if (status) q = q.eq('status', status)
  const { count } = await q
  return count ?? 0
}

// Active campaign + progress (used by the New Drops page).
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { data: campaign } = await supabaseAdmin
    .from('campaigns').select('*').eq('status', 'active').maybeSingle()

  const { count: subscribers } = await supabaseAdmin
    .from('email_subscribers').select('id', { count: 'exact', head: true }).is('unsubscribed_at', null)

  if (!campaign) return NextResponse.json({ active: null, subscribers: subscribers ?? 0 })

  const [total, sent] = await Promise.all([
    recipientCount(campaign.id),
    recipientCount(campaign.id, 'sent'),
  ])
  const { data: products } = await supabaseAdmin
    .from('products').select('id, name').in('id', campaign.product_ids as string[])

  return NextResponse.json({
    active: { ...campaign, total, sent, products: products ?? [] },
    subscribers: subscribers ?? 0,
  })
}

// Start a campaign: snapshot audience, mark products showcased, send first batch.
export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Malformed request body') }

  const parsed = startCampaignSchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid campaign')
  const { productIds, dailyLimit } = parsed.data

  const { data: existing } = await supabaseAdmin
    .from('campaigns').select('id').eq('status', 'active').maybeSingle()
  if (existing) return badRequest('A campaign is already running')

  const { data: prods } = await supabaseAdmin
    .from('products').select('id, campaigned_at').in('id', productIds)
  if (!prods || prods.length !== productIds.length) return badRequest('Some products were not found')
  if (prods.some(p => p.campaigned_at)) return badRequest('Some products were already featured in a campaign')

  const { data: subs } = await supabaseAdmin
    .from('email_subscribers').select('email').is('unsubscribed_at', null)
  if (!subs || subs.length === 0) return badRequest('No subscribers to send to yet')

  const { data: campaign, error } = await supabaseAdmin
    .from('campaigns')
    .insert({ status: 'active', product_ids: productIds, daily_limit: dailyLimit, created_by: admin.email ?? admin.id })
    .select('id')
    .single()
  if (error) return serverError(error, 'Failed to start campaign')

  const { error: snapErr } = await supabaseAdmin
    .from('campaign_recipients')
    .insert(subs.map(s => ({ campaign_id: campaign.id, email: s.email })))
  if (snapErr) return serverError(snapErr, 'Failed to queue recipients')

  await supabaseAdmin.from('products').update({ campaigned_at: new Date().toISOString() }).in('id', productIds)

  const result = await sendNextBatch(campaign.id)
  return NextResponse.json({ id: campaign.id, ...result })
}
