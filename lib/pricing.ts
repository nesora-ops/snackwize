// Single source of truth for delivery + order totals.
// Used by the cart, checkout, and the server-side order endpoint so the
// numbers can never drift between client display and what gets charged.

export const FREE_DELIVERY_THRESHOLD = 500
export const DELIVERY_FEE = 50

export function deliveryFeeFor(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

// Discount is reserved for coupons (always 0 until that feature ships). Baked
// into the formula now so the payment amount is coupon-ready: the stored `total`
// is the single source of truth Razorpay charges and Shiprocket reads.
export function computeTotals(subtotal: number, discount = 0) {
  const delivery_fee = deliveryFeeFor(subtotal)
  const total = Math.max(subtotal - discount, 0) + delivery_fee
  return { subtotal, discount, delivery_fee, total }
}
