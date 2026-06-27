import { supabaseAdmin } from '@/lib/supabase.server'
import { getUser, unauthorized, badRequest, serverError } from '@/lib/api'
import { cancelOrder } from '@/lib/orders'
import { NextRequest, NextResponse } from 'next/server'

// Customer cancels their own order (pre-shipment only). Refund + restock handled
// centrally; hyperlocal same-day orders are refused.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user) return unauthorized()

  const { data: order } = await supabaseAdmin
    .from('orders').select('user_id, status').eq('id', params.id).single()
  if (!order || order.user_id !== user.id) return unauthorized()
  if (!['Pending', 'Confirmed'].includes(order.status)) {
    return badRequest('This order can no longer be cancelled')
  }

  const result = await cancelOrder(params.id, { by: 'customer' })
  if (!result.ok) {
    if (result.reason === 'hyperlocal') return badRequest('Same-day (hyperlocal) orders cannot be cancelled')
    if (result.reason === 'refund_failed') return serverError(null, 'Refund could not be processed — please contact us')
    return badRequest('Could not cancel this order')
  }
  return NextResponse.json({ success: true })
}
