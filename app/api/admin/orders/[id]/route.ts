import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { updateStatusSchema } from '@/lib/validation'
import { cancelOrder } from '@/lib/orders'
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

  // Cancellation goes through the central path: refund (if paid) + restock, and
  // a hard refusal for hyperlocal same-day orders.
  if (newStatus === 'Cancelled') {
    const result = await cancelOrder(params.id, { by: admin.email ?? admin.id })
    if (!result.ok) {
      if (result.reason === 'hyperlocal') return badRequest('Same-day (hyperlocal) orders cannot be cancelled')
      if (result.reason === 'refund_failed') return serverError(null, 'Refund failed — order not cancelled')
      return badRequest('Could not cancel this order')
    }
    return NextResponse.json({ success: true })
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', params.id)

  if (error) return serverError(error, 'Failed to update order')
  return NextResponse.json({ success: true })
}
