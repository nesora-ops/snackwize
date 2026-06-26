import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Manual "Replenish now" — rebuilds every product's today's-stock from its
// daily bake qty + one-off add-on (same as the morning cron).
export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { error } = await supabaseAdmin.rpc('replenish_daily_stock')
  if (error) return serverError(error, 'Failed to replenish stock')
  return NextResponse.json({ success: true })
}
