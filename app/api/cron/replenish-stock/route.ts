import { supabaseAdmin } from '@/lib/supabase.server'
import { unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Called every morning by Supabase pg_cron (guarded by the shared secret).
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) return unauthorized()

  const { error } = await supabaseAdmin.rpc('replenish_daily_stock')
  if (error) return serverError(error, 'Replenish failed')
  return NextResponse.json({ success: true })
}
