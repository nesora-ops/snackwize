import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Marks an order's backordered units for a product as baked & shipped. These
// were made-to-order (never in stock_today), so we log them for the report but
// do NOT touch the live counter. Clears the bake-later flag on the line.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let productId: string | undefined
  try { productId = (await req.json())?.productId } catch { /* ignore */ }
  if (!productId) return badRequest('productId required')

  const { data: order, error } = await supabaseAdmin
    .from('orders').select('items').eq('id', params.id).single()
  if (error || !order) return serverError(error, 'Order not found')

  const items = Array.isArray(order.items) ? order.items : []
  const item = items.find((i: any) => i.id === productId && i.is_preorder)
  if (!item) return badRequest('No pending backorder for that product on this order')

  const n = item.preorder_qty ?? 0

  if (n > 0) {
    await supabaseAdmin.from('stock_movements').insert({
      product_id: productId, delta: -n, reason: 'backorder', ref: params.id,
      note: 'shipped backorder', created_by: admin.email ?? admin.id,
    })
  }

  const newItems = items.map((i: any) =>
    i.id === productId && i.is_preorder
      ? { ...i, is_preorder: false, preorder_qty: undefined, fulfilled_qty: n }
      : i,
  )
  const { error: upErr } = await supabaseAdmin.from('orders').update({ items: newItems }).eq('id', params.id)
  if (upErr) return serverError(upErr, 'Failed to update order')

  return NextResponse.json({ success: true })
}
