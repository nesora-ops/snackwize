import { supabaseAdmin } from './supabase.server'
import { sendEmail, newDropsEmail, type DropProduct } from './email'

// Sends the next daily batch (≤ daily_limit) for a campaign. Skips recipients
// who unsubscribed after the snapshot. Marks the campaign completed when the
// queue is drained. Shared by the start endpoint (first batch) and the cron.
export async function sendNextBatch(campaignId: string): Promise<{ sent: number; skipped: number; failed: number; done: boolean }> {
  const { data: campaign } = await supabaseAdmin
    .from('campaigns').select('*').eq('id', campaignId).single()

  if (!campaign || campaign.status !== 'active') {
    return { sent: 0, skipped: 0, failed: 0, done: true }
  }

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, description, price, image, net_weight_grams')
    .in('id', campaign.product_ids as string[])

  const { data: recipients } = await supabaseAdmin
    .from('campaign_recipients')
    .select('id, email')
    .eq('campaign_id', campaignId)
    .eq('status', 'pending')
    .limit(campaign.daily_limit)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  let sent = 0, skipped = 0, failed = 0

  for (const r of recipients ?? []) {
    const { data: sub } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, unsubscribed_at')
      .eq('email', r.email)
      .maybeSingle()

    if (!sub || sub.unsubscribed_at) {
      await supabaseAdmin.from('campaign_recipients').update({ status: 'skipped' }).eq('id', r.id)
      skipped++
      continue
    }

    const unsubscribeUrl = `${siteUrl}/unsubscribe?id=${sub.id}`
    const { subject, html } = newDropsEmail((products ?? []) as DropProduct[], unsubscribeUrl)

    try {
      const resendId = await sendEmail({ to: r.email, subject, html })
      await supabaseAdmin.from('campaign_recipients')
        .update({ status: 'sent', sent_at: new Date().toISOString(), resend_id: resendId })
        .eq('id', r.id)
      sent++
    } catch (e) {
      await supabaseAdmin.from('campaign_recipients')
        .update({ status: 'failed', error: e instanceof Error ? e.message : String(e) })
        .eq('id', r.id)
      failed++
    }
  }

  const { count } = await supabaseAdmin
    .from('campaign_recipients')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('status', 'pending')

  const done = (count ?? 0) === 0
  if (done) {
    await supabaseAdmin.from('campaigns')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', campaignId)
  }

  return { sent, skipped, failed, done }
}
