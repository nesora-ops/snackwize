import { z } from 'zod'

// ── Orders ────────────────────────────────────────────────────────────────
export const orderItemInput = z.object({
  id: z.string().min(1),
  qty: z.number().int().positive().max(99),
})

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pin: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  landmark: z.string().max(120).optional(),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemInput).min(1, 'Cart is empty'),
  guest_name: z.string().max(120).optional(),
  guest_phone: z.string().max(20).optional(),
  guest_email: z.string().email().optional(),
  address: addressSchema,
  payment_method: z.enum(['upi', 'cod', 'card']),
})

// ── Order status ──────────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled',
] as const

export const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
})

// ── Inventory toggle ──────────────────────────────────────────────────────
export const toggleInventorySchema = z
  .object({
    productId: z.string().min(1),
    in_stock: z.boolean().optional(),
    allow_backorder: z.boolean().optional(),
    note: z.string().max(280).optional(),
  })
  .refine(d => d.in_stock !== undefined || d.allow_backorder !== undefined, {
    message: 'Nothing to update',
  })
