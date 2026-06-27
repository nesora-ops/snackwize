import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

// Shiprocket shipment-status webhook. Configure the same token in the Shiprocket
// dashboard (sent as x-api-key). Maps courier status → order status.
export async function POST(req: NextRequest) {
  const token = req.headers.get('x-api-key')
  if (!process.env.SHIPROCKET_WEBHOOK_TOKEN || token !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }

  try {
    const awb = body.awb ?? body.awb_code
    const statusRaw = (body.current_status ?? body.shipment_status ?? '').toString()
    if (awb) {
      const s = statusRaw.toUpperCase()
      const update: Record<string, unknown> = { shipment_status: statusRaw }
      if (s.includes('DELIVERED')) {
        update.status = 'Delivered'
        update.delivered_at = new Date().toISOString()
      } else if (s.includes('SHIPPED') || s.includes('TRANSIT') || s.includes('PICKED') || s.includes('OUT FOR')) {
        update.status = 'Shipped'
        update.shipped_at = new Date().toISOString()
      }
      await supabaseAdmin.from('orders').update(update).eq('awb', awb)
    }
  } catch {
    // Always 200 so Shiprocket doesn't retry-storm; self-heals on the next event.
  }

  return NextResponse.json({ ok: true })
}
