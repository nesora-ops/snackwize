import type { Order } from './types'
import { getParcelBox, parcelFor } from './shipping'

const BASE = 'https://apiv2.shiprocket.in/v1/external'

export type ShipmentResult = {
  shiprocket_order_id: string
  shiprocket_shipment_id: string | null
  awb: string | null
  courier_name: string | null
  tracking_url: string | null
  label_url: string | null
}

let _token: { value: string; exp: number } | null = null

export function isShiprocketConfigured(): boolean {
  return !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD)
}

async function token(): Promise<string> {
  if (_token && _token.exp > Date.now()) return _token.value
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Shiprocket auth failed (${res.status})`)
  const data = await res.json()
  _token = { value: data.token, exp: Date.now() + 9 * 24 * 3600 * 1000 } // token lasts ~10 days
  return data.token
}

async function api(path: string, body: unknown): Promise<any> {
  const t = await token()
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || `Shiprocket ${path} failed (${res.status})`)
  return data
}

function contact(order: Order) {
  return {
    name: order.profiles?.name ?? order.guest_name ?? 'Customer',
    phone: order.profiles?.phone ?? order.guest_phone ?? '',
    email: order.guest_email ?? process.env.SHIPROCKET_DEFAULT_EMAIL ?? 'orders@nesora.co.in',
  }
}

function adhocPayload(order: Order, parcel: { weightKg: number; lengthCm: number; breadthCm: number; heightCm: number }) {
  const c = contact(order)
  return {
    order_id: order.id,
    order_date: new Date(order.created_at).toISOString().slice(0, 10),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    channel_id: process.env.SHIPROCKET_CHANNEL_ID || undefined,
    billing_customer_name: c.name,
    billing_last_name: '',
    billing_address: order.address.line1,
    billing_address_2: order.address.landmark ?? '',
    billing_city: order.address.city,
    billing_pincode: order.address.pin,
    billing_state: order.address.state,
    billing_country: 'India',
    billing_email: c.email,
    billing_phone: c.phone,
    shipping_is_billing: true,
    order_items: order.items.map(i => ({
      name: i.name + (i.flavour ? ` - ${i.flavour}` : ''),
      sku: i.id,
      units: i.qty,
      selling_price: i.price,
    })),
    payment_method: 'Prepaid', // never COD
    sub_total: order.subtotal,
    length: parcel.lengthCm,
    breadth: parcel.breadthCm,
    height: parcel.heightCm,
    weight: parcel.weightKg,
  }
}

// Standard pan-India shipment: create order, then assign an AWB.
export async function createStandardShipment(order: Order): Promise<ShipmentResult> {
  const parcel = parcelFor(order.items, await getParcelBox())
  const created = await api('/orders/create/adhoc', adhocPayload(order, parcel))
  const shipmentId = created.shipment_id ? String(created.shipment_id) : null

  let awb: string | null = null
  let courier: string | null = null
  if (shipmentId) {
    try {
      const awbRes = await api('/courier/assign/awb', { shipment_id: Number(shipmentId) })
      awb = awbRes?.response?.data?.awb_code ?? null
      courier = awbRes?.response?.data?.courier_name ?? null
    } catch {
      // Order created but AWB not yet assigned — admin can retry from the dashboard.
    }
  }

  return {
    shiprocket_order_id: String(created.order_id),
    shiprocket_shipment_id: shipmentId,
    awb,
    courier_name: courier,
    tracking_url: awb ? `https://shiprocket.co/tracking/${awb}` : null,
    label_url: null,
  }
}

// Hyperlocal same-city shipment via Shiprocket Quick (Borzo). Dormant until a
// product is marked hyperlocal; endpoint specifics are confirmed when enabled.
export async function createQuickShipment(order: Order): Promise<ShipmentResult> {
  const parcel = parcelFor(order.items, await getParcelBox())
  const created = await api('/orders/create/adhoc', {
    ...adhocPayload(order, parcel),
    is_hyperlocal: true,
  })
  return {
    shiprocket_order_id: String(created.order_id),
    shiprocket_shipment_id: created.shipment_id ? String(created.shipment_id) : null,
    awb: created.awb_code ?? null,
    courier_name: 'Shiprocket Quick',
    tracking_url: created.tracking_url ?? null,
    label_url: null,
  }
}

export async function cancelShipment(shiprocketOrderId: string): Promise<void> {
  await api('/orders/cancel', { ids: [Number(shiprocketOrderId)] })
}
