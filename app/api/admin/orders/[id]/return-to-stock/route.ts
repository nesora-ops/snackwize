import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Puts a returned order's resalable units back into today's stock. Guarded by
// returned_at so it can't be applied twice. Use for Delivered/Shipped orders
// that come back good (Cancelled orders already auto-restock).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { data: order, error } = await supabaseAdmin
    .from('orders').select('items, returned_at').eq('id', params.id).single()
  if (error || !order) return serverError(error, 'Order not found')
  if (order.returned_at) return badRequest('This order was already returned to stock')

  for (const item of (Array.isArray(order.items) ? order.items : [])) {
    const back = (item.qty ?? 0) - (item.preorder_qty ?? 0)
    if (back > 0) {
      await supabaseAdmin.rpc('adjust_stock', { p_id: item.id, p_delta: back })
      await supabaseAdmin.from('stock_movements').insert({
        product_id: item.id, delta: back, reason: 'adjust', ref: params.id,
        note: 'returned to stock', created_by: admin.email ?? admin.id,
      })
    }
  }

  const { error: upErr } = await supabaseAdmin
    .from('orders').update({ returned_at: new Date().toISOString() }).eq('id', params.id)
  if (upErr) return serverError(upErr, 'Failed to mark return')

  return NextResponse.json({ success: true })
}
