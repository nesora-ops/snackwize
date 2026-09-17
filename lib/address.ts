export type Address = {
  id: string
  label?: string | null
  line1: string
  landmark?: string | null
  city: string
  state: string
  pin: string
  is_default: boolean
}

// One-line form used in the WhatsApp message and in address lists.
export function formatAddress(a: {
  line1: string
  landmark?: string | null
  city: string
  state: string
  pin: string
}): string {
  return [a.line1, a.landmark, a.city, `${a.state} ${a.pin}`]
    .filter(Boolean)
    .join(', ')
}
