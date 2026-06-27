export type OrderItem = { id: string; name: string; qty: number; price: number; flavour?: string; is_preorder?: boolean; preorder_qty?: number; delivery_type?: 'local' | 'hyperlocal' }
export type OrderAddress = { line1: string; city: string; state: string; pin: string; landmark?: string }
export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'

export type Order = {
  id: string
  user_id: string | null
  guest_name: string | null
  guest_phone: string | null
  guest_email: string | null
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  discount?: number
  coupon_code?: string | null
  total: number
  address: OrderAddress
  payment_method: string
  payment_status: string
  razorpay_order_id?: string | null
  razorpay_payment_id?: string | null
  paid_at?: string | null
  refund_id?: string | null
  refunded_at?: string | null
  status: OrderStatus
  created_at: string
  updated_at?: string
  returned_at?: string | null
  profiles?: { name: string | null; phone: string | null } | null
}
