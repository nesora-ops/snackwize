import { redirect } from 'next/navigation'

// The bag now lives in the checkout sheet on the menu, so this page has nothing
// left to show. Kept as a redirect because installed PWAs and the old service
// worker cache still point people here.
export default function CartPage() {
  redirect('/app/menu')
}
