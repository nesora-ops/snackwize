import { supabaseAdmin } from '@/lib/supabase.server'
import { unauthorized, serverError } from '@/lib/api'
import { sendNextBatch } from '@/lib/campaign'
import { NextRequest, NextResponse } from 'next/server'

// Called daily by Supabase pg_cron (not admin-gated; guarded by a shared secret).
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) return unauthorized()

  try {
    const { data: campaign } = await supabaseAdmin
      .from('campaigns').select('id').eq('status', 'active').maybeSingle()
    if (!campaign) return NextResponse.json({ message: 'No active campaign' })

    const result = await sendNextBatch(campaign.id)
    return NextResponse.json(result)
  } catch (e) {
    return serverError(e, 'Cron batch failed')
  }
}
