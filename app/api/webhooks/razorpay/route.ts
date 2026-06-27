import { supabaseAdmin } from '@/lib/supabase.server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { confirmPaymentAndConsume } from '@/lib/orders'
import { NextRequest, NextResponse } from 'next/server'

// Fallback confirmation path: even if the browser closes before /verify runs,
// Razorpay's webhook captures the payment. Idempotent via confirmPaymentAndConsume.
export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let event: any
  try { event = JSON.parse(raw) } catch { return NextResponse.json({ ok: true }) }

  try {
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity
      if (payment?.order_id && payment?.id) {
        const { data: order } = await supabaseAdmin
          .from('orders').select('id').eq('razorpay_order_id', payment.order_id).maybeSingle()
        if (order) await confirmPaymentAndConsume(order.id, payment.id)
      }
    } else if (event.event === 'refund.processed') {
      const refund = event.payload?.refund?.entity
      if (refund?.payment_id) {
        await supabaseAdmin.from('orders')
          .update({ payment_status: 'refunded', refund_id: refund.id, refunded_at: new Date().toISOString() })
          .eq('razorpay_payment_id', refund.payment_id).neq('payment_status', 'refunded')
      }
    }
  } catch {
    // Always 200 so Razorpay doesn't retry-storm; failures self-heal on retry.
  }

  return NextResponse.json({ ok: true })
}
