'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Storefront } from '@/components/order/Storefront'

function PortalMenuBody() {
  const params = useSearchParams()
  // Set by "Order again", which refills the cart and sends the customer here.
  return <Storefront bottomOffset={80} openSheetOnMount={params.get('checkout') === '1'} />
}

// The PWA shop is literally the website's storefront; the portal layout supplies
// the header and bottom nav around it.
export default function PortalMenuPage() {
  return (
    <Suspense fallback={null}>
      <PortalMenuBody />
    </Suspense>
  )
}
