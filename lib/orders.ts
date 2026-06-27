import { supabaseAdmin } from './supabase.server'
import { razorpay } from './razorpay'
import type { OrderItem, Order } from './types'
import { isShiprocketConfigured, createStandardShipment, createQuickShipment, cancelShipment } from './shiprocket'

// Idempotently mark an online order paid and consume its stock. Safe to call
// from both the /verify endpoint and the webhook — a conditional claim ensures
// the stock is consumed exactly once.
export async function confirmPaymentAndConsume(
  ourOrderId: string,
  paymentId: string,
  signature?: string,
): Promise<{ ok: boolean; already?: boolean }> {
  // Claim: flip pending -> paid only if not already paid. Wins the race.
  const { data: claimed } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'paid',
      razorpay_payment_id: paymentId,
      razorpay_signature: signature ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq('id', ourOrderId)
    .neq('payment_status', 'paid')
    .select('id, items')

  if (!claimed || claimed.length === 0) return { ok: true, already: true }

  const items: OrderItem[] = Array.isArray(claimed[0].items) ? claimed[0].items : []
  const newItems: OrderItem[] = []
  const consumed: { id: string; qty: number }[] = []

  for (const item of items) {
    const { data: shortfall } = await supabaseAdmin.rpc('consume_stock', { p_id: item.id, p_qty: item.qty })
    const short = typeof shortfall === 'number' ? shortfall : 0
    const fromStock = (item.qty ?? 0) - short
    if (fromStock > 0) consumed.push({ id: item.id, qty: fromStock })
    newItems.push({ ...item, is_preorder: short > 0, preorder_qty: short > 0 ? short : undefined })
  }

  await supabaseAdmin.from('orders').update({ items: newItems }).eq('id', ourOrderId)

  if (consumed.length > 0) {
    await supabaseAdmin.from('stock_movements').insert(
      consumed.map(c => ({ product_id: c.id, delta: -c.qty, reason: 'order', ref: ourOrderId })),
    )
  }

  // Book the courier shipment now that payment is captured (best-effort; a
  // failure is saved as shipment_error for an admin retry, never thrown).
  await createShipmentForOrder(ourOrderId)

  return { ok: true }
}

// Creates the courier shipment for a paid order (idempotent — no-op if already
// created). Shared by the payment-success path and the admin retry button.
export async function createShipmentForOrder(orderId: string): Promise<{ ok: boolean; error?: string }> {
  if (!isShiprocketConfigured()) return { ok: false, error: 'Shiprocket not configured' }

  const { data: full } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single()
  if (!full) return { ok: false, error: 'Order not found' }
  if (full.shiprocket_order_id) return { ok: true }

  try {
    const result = full.delivery_mode === 'hyperlocal'
      ? await createQuickShipment(full as Order)
      : await createStandardShipment(full as Order)
    await supabaseAdmin.from('orders').update({
      shiprocket_order_id: result.shiprocket_order_id,
      shiprocket_shipment_id: result.shiprocket_shipment_id,
      awb: result.awb,
      courier_name: result.courier_name,
      tracking_url: result.tracking_url,
      label_url: result.label_url,
      shipment_error: null,
      status: 'Confirmed',
    }).eq('id', orderId)
    return { ok: true }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    await supabaseAdmin.from('orders').update({ shipment_error: error }).eq('id', orderId)
    return { ok: false, error }
  }
}

export type CancelResult =
  | { ok: true; already?: boolean }
  | { ok: false; reason: 'not_found' | 'hyperlocal' | 'refund_failed' }

// Central cancellation: refunds paid online orders, restocks consumed units, and
// refuses any order containing a hyperlocal (same-day) item.
export async function cancelOrder(orderId: string, opts?: { by?: string }): Promise<CancelResult> {
  const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single()
  if (!order) return { ok: false, reason: 'not_found' }
  if (order.status === 'Cancelled') return { ok: true, already: true }

  const items: OrderItem[] = Array.isArray(order.items) ? order.items : []

  // Hyperlocal (Shiprocket Quick / Borzo, same-day) cannot be cancelled.
  if (items.some(i => i.delivery_type === 'hyperlocal')) {
    return { ok: false, reason: 'hyperlocal' }
  }

  const wasPaid = order.payment_status === 'paid'

  // Refund a captured online payment (once).
  if (wasPaid && order.razorpay_payment_id && !order.refund_id) {
    try {
      const refund: { id: string } = await razorpay().payments.refund(order.razorpay_payment_id, {
        amount: order.total * 100,
      })
      await supabaseAdmin.from('orders').update({
        payment_status: 'refunded', refund_id: refund.id, refunded_at: new Date().toISOString(),
      }).eq('id', orderId)
    } catch {
      return { ok: false, reason: 'refund_failed' }
    }
  }

  // Restock only the units that were actually taken from stock (paid orders).
  if (wasPaid) {
    for (const item of items) {
      const back = (item.qty ?? 0) - (item.preorder_qty ?? 0)
      if (back > 0) {
        await supabaseAdmin.rpc('adjust_stock', { p_id: item.id, p_delta: back })
        await supabaseAdmin.from('stock_movements').insert({
          product_id: item.id, delta: back, reason: 'cancel', ref: orderId, created_by: opts?.by ?? 'system',
        })
      }
    }
  }

  // Cancel the courier booking for a local order not yet dispatched (hyperlocal
  // is already blocked above, so this only ever runs for local orders).
  if (order.shiprocket_order_id && !order.shipped_at) {
    try { await cancelShipment(order.shiprocket_order_id) } catch { /* best-effort */ }
  }

  await supabaseAdmin.from('orders').update({ status: 'Cancelled' }).eq('id', orderId)
  return { ok: true }
}
