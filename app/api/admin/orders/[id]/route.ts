import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { updateStatusSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed request body')
  }

  const parsed = updateStatusSchema.safeParse(body)
  if (!parsed.success) return badRequest('Invalid status')
  const newStatus = parsed.data.status

  // Need the current status + items to know whether to restock on cancellation.
  const { data: order } = await supabaseAdmin
    .from('orders').select('status, items').eq('id', params.id).single()

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', params.id)

  if (error) return serverError(error, 'Failed to update order')

  // Transitioning into Cancelled: give back the stock this order took (qty minus
  // the part that was already a bake-later shortfall). Self-heals at next replenish.
  if (newStatus === 'Cancelled' && order && order.status !== 'Cancelled') {
    for (const item of (Array.isArray(order.items) ? order.items : [])) {
      const back = (item.qty ?? 0) - (item.preorder_qty ?? 0)
      if (back > 0) {
        await supabaseAdmin.rpc('adjust_stock', { p_id: item.id, p_delta: back })
        await supabaseAdmin.from('stock_movements').insert({
          product_id: item.id, delta: back, reason: 'cancel', ref: params.id,
          created_by: admin.email ?? admin.id,
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}
