import { supabaseAdmin } from '@/lib/supabase.server'
import { badRequest, serverError } from '@/lib/api'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { confirmPaymentAndConsume } from '@/lib/orders'
import { NextRequest, NextResponse } from 'next/server'

// Called by the checkout modal's success handler. The HMAC signature is the
// proof of a genuine payment, so no auth is required (guests check out too).
export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return badRequest('Malformed request body') }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {}
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return badRequest('Missing payment fields')
  }

  const { data: order } = await supabaseAdmin
    .from('orders').select('id, razorpay_order_id').eq('id', orderId).single()
  if (!order || order.razorpay_order_id !== razorpay_order_id) return badRequest('Order mismatch')

  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    await supabaseAdmin.from('orders').update({ payment_status: 'failed' })
      .eq('id', orderId).eq('payment_status', 'pending')
    return badRequest('Payment verification failed')
  }

  const result = await confirmPaymentAndConsume(orderId, razorpay_payment_id, razorpay_signature)
  if (!result.ok) return serverError(null, 'Could not confirm payment')
  return NextResponse.json({ success: true })
}
