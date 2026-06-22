export type OrderItem = { id: string; name: string; qty: number; price: number }
export type OrderAddress = { line1: string; city: string; pin: string }
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
  total: number
  address: OrderAddress
  payment_method: string
  payment_status: string
  status: OrderStatus
  created_at: string
  profiles?: { name: string | null; phone: string | null } | null
}
