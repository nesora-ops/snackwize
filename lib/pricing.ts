// Single source of truth for delivery + order totals.
// Used by the cart, checkout, and the server-side order endpoint so the
// numbers can never drift between client display and what gets charged.

export const FREE_DELIVERY_THRESHOLD = 500
export const DELIVERY_FEE = 50

export function deliveryFeeFor(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export function computeTotals(subtotal: number) {
  const delivery_fee = deliveryFeeFor(subtotal)
  return { subtotal, delivery_fee, total: subtotal + delivery_fee }
}
