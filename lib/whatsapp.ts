import { WHATSAPP } from './data'
import type { CartItem } from '@/context/CartContext'

// wa.me expects a bare international number, no "+" or spaces. Derived from the
// single WHATSAPP constant so there is only ever one number to change.
const NUMBER = WHATSAPP.replace(/\D/g, '')

export type OrderCustomer = {
  name: string
  phone: string
  /** Pre-formatted single line; omitted when the customer would rather say it in chat. */
  address?: string
  /** Short code that also lands on the order row, so Nupur can match chat to record. */
  ref: string
}

// Unambiguous alphabet: no O/0, I/1, S/5 to survive being read aloud or retyped.
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRTUVWXYZ23456789'

export function newOrderRef(): string {
  const n = 5
  const pick = (b: number) => REF_ALPHABET[b % REF_ALPHABET.length]
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(n)
    globalThis.crypto.getRandomValues(bytes)
    return Array.from(bytes, pick).join('')
  }
  return Array.from({ length: n }, () => pick(Math.floor(Math.random() * 256))).join('')
}

function weightLabel(grams?: number): string {
  if (!grams) return ''
  return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`
}

// One cart line: "Swaad Fit Mathri (Black Pepper) · 100g" + "2 × ₹130 = ₹260".
function line(item: CartItem, index: number): string {
  const flavour = item.flavour ? ` (${item.flavour})` : ''
  const weight = weightLabel(item.net_weight_grams)
  const title = `${index + 1}. ${item.name}${flavour}${weight ? ` · ${weight}` : ''}`
  return `${title}\n   ${item.qty} × ₹${item.price} = ₹${item.qty * item.price}`
}

/**
 * The order enquiry Nupur receives. Subtotal only — delivery is quoted by
 * distance and confirmed in the chat. Name and phone are collected before the
 * button unlocks so every chat maps to a row; the address is optional and falls
 * back to being shared in the conversation.
 */
export function buildOrderMessage(
  items: CartItem[],
  subtotal: number,
  customer: OrderCustomer
): string {
  return [
    "Hi Snackwize! I'd like to order:",
    '',
    items.map(line).join('\n'),
    '',
    `Subtotal: ₹${subtotal}`,
    '',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    ...(customer.address ? [`Address: ${customer.address}`] : []),
    '',
    'Delivery charge to be confirmed separately based on my location.',
    ...(customer.address
      ? []
      : ["I'll share my delivery address here in this chat before the order is confirmed."]),
    '',
    `Order ref: ${customer.ref}`,
    '— sent from snackwize.co.in',
  ].join('\n')
}

export function whatsappOrderLink(
  items: CartItem[],
  subtotal: number,
  customer: OrderCustomer
): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(
    buildOrderMessage(items, subtotal, customer)
  )}`
}
