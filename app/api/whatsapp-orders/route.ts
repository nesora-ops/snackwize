import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase.server'
import { getUser, badRequest, serverError } from '@/lib/api'
import { whatsappOrderSchema } from '@/lib/validation'

// Records the order the customer is about to send on WhatsApp. Sign-in is
// optional — guests order too — but name and phone are always required, which
// is also what the orders_contact_check DB constraint enforces for guest rows.
//
// The row is written with status 'Sent': the customer opened WhatsApp with this
// order pre-filled. It is NOT a placed order. Nupur moves it to Confirmed or
// Cancelled from admin once she has seen the chat, matching on client_ref.
//
// Stock is deliberately NOT consumed here — nothing is confirmed yet, and the
// daily bake plan stays managed from the admin inventory page.

// An unauthenticated write endpoint, so it gets a crude per-IP ceiling to keep
// the admin order list from being floodable. In-memory: this is a best-effort
// speed bump per serverless instance, not a security boundary.
const RATE_LIMIT = 10
const WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // crude ceiling on unbounded growth
  return recent.length > RATE_LIMIT
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many orders — try again in a minute' }, { status: 429 })
  }

  const user = await getUser(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed request body')
  }

  const parsed = whatsappOrderSchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid order')
  const input = parsed.data

  // Authoritative pricing — never trust client-sent money. Look up live prices
  // from the DB and rebuild every line item server-side.
  const ids = input.items.map((i) => i.id)
  const { data: products, error: prodErr } = await supabaseAdmin
    .from('products')
    .select('id, name, price, in_stock, allow_backorder, delivery_type, net_weight_grams')
    .in('id', ids)

  if (prodErr) return serverError(prodErr, 'Failed to validate cart')

  const byId = new Map((products ?? []).map((p) => [p.id, p]))
  const lineItems = []
  for (const item of input.items) {
    const p = byId.get(item.id)
    if (!p) return badRequest('One or more items are no longer available')
    if (!p.in_stock && !p.allow_backorder) return badRequest(`Sold out: ${p.name}`)
    lineItems.push({
      id: p.id,
      name: p.name,
      qty: item.qty,
      price: p.price,
      net_weight_grams: p.net_weight_grams ?? undefined,
      delivery_type: p.delivery_type,
      ...(item.flavour ? { flavour: item.flavour } : {}),
    })
  }

  const subtotal = lineItems.reduce((a, i) => a + i.price * i.qty, 0)

  // A structured saved address wins; a guest's free text is kept as line1 so
  // admin has one place to look. No address at all is fine — it comes in chat.
  const address = input.address
    ? input.address
    : input.address_text
      ? { line1: input.address_text, city: '', state: '', pin: '' }
      : null

  const { data: created, error } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      // Filled for signed-in customers too: one place for admin to read contact
      // details, and it captures what they actually typed on this order.
      guest_name: input.name,
      guest_phone: input.phone,
      guest_email: user?.email ?? null,
      items: lineItems,
      subtotal,
      delivery_fee: 0, // quoted by distance and agreed in the chat
      discount: 0,
      total: subtotal,
      address,
      client_ref: input.ref,
      payment_method: 'whatsapp',
      payment_status: 'pending',
      status: 'Sent',
    })
    .select('id, client_ref')
    .single()

  if (error) return serverError(error, 'Failed to record order')

  return NextResponse.json({ id: created.id, ref: created.client_ref })
}
