import { z } from 'zod'

// ── Orders ────────────────────────────────────────────────────────────────
export const orderItemInput = z.object({
  id: z.string().min(1),
  qty: z.number().int().positive().max(99),
  flavour: z.string().max(60).optional(),
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
  // Prepaid only — actual method is chosen inside the Razorpay modal. Reserved.
  payment_method: z.enum(['upi', 'card']).optional(),
  coupon_code: z.string().max(40).optional(), // reserved for the future coupon feature
})

// ── WhatsApp orders ───────────────────────────────────────────────────────
// Unlike createOrderSchema, the address is optional (it can be given in the
// chat instead) and name + phone are required for everyone, guest or not —
// they are what lets Nupur match an incoming chat to this row.
export const whatsappOrderSchema = z.object({
  items: z.array(orderItemInput).min(1, 'Cart is empty').max(40, 'Too many items'),
  name: z.string().trim().min(1, 'Name is required').max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number'),
  address: addressSchema.optional(),
  /** Free-text address for guests who don't have a saved one. */
  address_text: z.string().trim().max(300).optional(),
  ref: z.string().regex(/^[A-Z2-9]{5}$/, 'Invalid order reference'),
})

// ── Order status ──────────────────────────────────────────────────────────
// 'Sent' means the customer opened WhatsApp with the order pre-filled. It is
// NOT a placed order — they may never have hit send, or the details may not add
// up. Nupur moves it to Confirmed or Cancelled once she has seen the chat.
export const ORDER_STATUSES = [
  'Sent', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled',
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

// ── Products (admin create / edit) ────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500).optional().default(''),
  price: z.number().int().positive('Price must be greater than 0'),
  net_weight_grams: z.number().int().positive().optional(),
  shelf_life: z.string().max(120).optional(),
  delivery_type: z.enum(['local', 'hyperlocal']).default('local'),
  nutrition: z.string().max(280).optional(),
  badge: z.string().max(40).optional(),
  instagram_url: z.string().url().max(300).optional(),
  flavours: z.array(z.string().max(60)).max(12).optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  in_stock: z.boolean().optional(),
  allow_backorder: z.boolean().optional(),
})

// ── Stock (daily bake plan) ───────────────────────────────────────────────
export const updateStockSchema = z
  .object({
    productId: z.string().min(1),
    daily_stock: z.number().int().min(0).optional(),
    stock_addon: z.number().int().optional(), // one-off, may be negative
    stock_today: z.number().int().min(0).optional(),
    restock_mode: z.enum(['accumulate', 'reset']).optional(),
  })
  .refine(
    d => d.daily_stock !== undefined || d.stock_addon !== undefined
      || d.stock_today !== undefined || d.restock_mode !== undefined,
    { message: 'Nothing to update' },
  )

export const adjustStockSchema = z.object({
  productId: z.string().min(1),
  delta: z.number().int().refine(d => d !== 0, 'Adjustment cannot be zero'),
  note: z.string().max(120).optional(),
})

// ── New-drops campaign ────────────────────────────────────────────────────
export const startCampaignSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1, 'Pick at least one product').max(3, 'Up to 3 products per campaign'),
  dailyLimit: z.number().int().min(1).max(50),
})
