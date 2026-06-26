import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

type Row = { id: string; name: string; opening: number; restocked: number; sold: number; cancelled: number; adjusted: number; backorder: number; onHand: number }

// Today's stock picture, measured from the last replenish (the start of the
// current stock-day) to now.
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { data: lastReplenish } = await supabaseAdmin
    .from('stock_movements').select('created_at')
    .eq('reason', 'replenish').order('created_at', { ascending: false }).limit(1).maybeSingle()

  const since = lastReplenish?.created_at ?? '1970-01-01T00:00:00Z'

  const [{ data: products, error: pErr }, { data: movements, error: mErr }] = await Promise.all([
    supabaseAdmin.from('products').select('id, name, stock_today'),
    supabaseAdmin.from('stock_movements').select('product_id, delta, reason').gte('created_at', since),
  ])
  if (pErr || mErr) return serverError(pErr ?? mErr, 'Failed to build report')

  const rows = new Map<string, Row>()
  for (const p of products ?? []) {
    rows.set(p.id, { id: p.id, name: p.name, opening: 0, restocked: 0, sold: 0, cancelled: 0, adjusted: 0, backorder: 0, onHand: p.stock_today ?? 0 })
  }
  for (const m of movements ?? []) {
    const r = rows.get(m.product_id)
    if (!r) continue
    if (m.reason === 'replenish') r.restocked += m.delta
    else if (m.reason === 'order') r.sold += -m.delta
    else if (m.reason === 'cancel') r.cancelled += m.delta
    else if (m.reason === 'adjust') r.adjusted += m.delta
    else if (m.reason === 'backorder') r.backorder += -m.delta  // shipped made-to-order units
  }
  // Opening (carried in) makes the day reconcile: opening + restocked - sold + cancelled + adjusted = onHand.
  for (const r of rows.values()) {
    r.opening = r.onHand - (r.restocked - r.sold + r.cancelled + r.adjusted)
  }

  const products_out = [...rows.values()]
  const totals = products_out.reduce(
    (a, r) => ({
      opening: a.opening + r.opening,
      restocked: a.restocked + r.restocked,
      sold: a.sold + r.sold,
      cancelled: a.cancelled + r.cancelled,
      adjusted: a.adjusted + r.adjusted,
      backorder: a.backorder + r.backorder,
      onHand: a.onHand + r.onHand,
    }),
    { opening: 0, restocked: 0, sold: 0, cancelled: 0, adjusted: 0, backorder: 0, onHand: 0 },
  )

  return NextResponse.json({ since, totals, products: products_out })
}
