import { supabaseAdmin } from './supabase.server'
import type { OrderItem } from './types'

export type ParcelBox = { l: number; b: number; h: number; buffer_g: number }
export type Parcel = { weightKg: number; lengthCm: number; breadthCm: number; heightCm: number }

const DEFAULT_BOX: ParcelBox = { l: 20, b: 15, h: 10, buffer_g: 50 }

// Editable default box from app_settings (falls back to the code default).
export async function getParcelBox(): Promise<ParcelBox> {
  const { data } = await supabaseAdmin.from('app_settings').select('value').eq('key', 'parcel_box').maybeSingle()
  if (!data?.value) return DEFAULT_BOX
  try {
    const v = JSON.parse(data.value)
    return { l: v.l ?? DEFAULT_BOX.l, b: v.b ?? DEFAULT_BOX.b, h: v.h ?? DEFAULT_BOX.h, buffer_g: v.buffer_g ?? DEFAULT_BOX.buffer_g }
  } catch {
    return DEFAULT_BOX
  }
}

// Weight = Σ(net weight × qty) + packaging buffer; dimensions = the default box.
export function parcelFor(items: OrderItem[], box: ParcelBox = DEFAULT_BOX): Parcel {
  const grams = items.reduce((a, i) => a + (i.net_weight_grams ?? 0) * i.qty, 0) + box.buffer_g
  return {
    weightKg: Math.max(grams / 1000, 0.05), // couriers require a positive weight
    lengthCm: box.l,
    breadthCm: box.b,
    heightCm: box.h,
  }
}

// A cart/order is single-mode by construction; 'mixed' is a server-side safety flag.
export function orderDeliveryMode(items: { delivery_type?: 'local' | 'hyperlocal' }[]): 'local' | 'hyperlocal' | 'mixed' {
  const hasHyper = items.some(i => i.delivery_type === 'hyperlocal')
  const hasLocal = items.some(i => (i.delivery_type ?? 'local') === 'local')
  if (hasHyper && hasLocal) return 'mixed'
  return hasHyper ? 'hyperlocal' : 'local'
}
