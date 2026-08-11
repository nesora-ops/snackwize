import { WHATSAPP } from './data'
import type { CartItem } from '@/context/CartContext'

// wa.me expects a bare international number, no "+" or spaces. Derived from the
// single WHATSAPP constant so there is only ever one number to change.
const NUMBER = WHATSAPP.replace(/\D/g, '')

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
 * distance and confirmed in the chat, which is also where the customer gives
 * their address. Their name and number come from WhatsApp itself.
 */
export function buildOrderMessage(items: CartItem[], subtotal: number): string {
  return [
    "Hi Snackwize! I'd like to order:",
    '',
    items.map(line).join('\n'),
    '',
    `Subtotal: ₹${subtotal}`,
    '',
    'Delivery charge to be confirmed separately based on my location.',
    "I'll share my delivery address here in this chat before the order is confirmed.",
    '',
    '— sent from snackwize.co.in',
  ].join('\n')
}

export function whatsappOrderLink(items: CartItem[], subtotal: number): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(buildOrderMessage(items, subtotal))}`
}
