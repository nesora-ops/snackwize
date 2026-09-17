'use client'

import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, type Product, WHATSAPP } from '@/lib/data'
import { useCart } from '@/context/CartContext'
import { OrderCard } from '@/components/order/OrderCard'
import { CheckoutSheet } from '@/components/order/CheckoutSheet'

const CATEGORY_EMOJIS: Record<string, string> = {
  'All': '🍽️',
  'Mathri': '🫓',
  'Crispies': '🥨',
  'Bhel & Mixes': '🥣',
  'Bakes': '🧁',
}

const ORANGE = '#F97316'

type Props = {
  /** Distance from the viewport bottom for the sticky review bar — the PWA has
   *  a bottom nav to clear, the website does not. */
  bottomOffset?: number
  /** Set by "Order again" to drop the customer straight into the sheet. */
  openSheetOnMount?: boolean
}

/**
 * The shop itself: category pills, the product list and the review bar that
 * opens the WhatsApp checkout. Rendered by both /order (website) and /app/menu
 * (PWA) so the two can never drift apart.
 */
export function Storefront({ bottomOffset = 16, openSheetOnMount = false }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { count, total } = useCart()

  useEffect(() => {
    setMounted(true)
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
  }, [])

  // "Order again" fills the cart then lands here; wait for the cart to hydrate
  // so the sheet never opens on an empty bag.
  useEffect(() => {
    if (openSheetOnMount && count > 0) setSheetOpen(true)
  }, [openSheetOnMount, count])

  // The sheet has its own scroll; freeze the page behind it.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  // An empty bag can't be reviewed.
  useEffect(() => { if (count === 0) setSheetOpen(false) }, [count])

  const filtered = useMemo(
    () => (activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory, products]
  )

  return (
    <div style={{ paddingBottom: count > 0 ? `${bottomOffset + 80}px` : '32px' }}>
      <div style={{ padding: '16px 16px 4px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
          Order your snacks
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#9E9083', lineHeight: 1.5 }}>
          Add what you like, then send your order to Nupur on WhatsApp.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                borderRadius: '999px',
                padding: '7px 15px',
                fontSize: '12.5px',
                fontWeight: active ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: active ? ORANGE : '#fff',
                color: active ? '#fff' : '#6B5E52',
                boxShadow: active ? '0 2px 10px rgba(249,115,22,0.35)' : '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              <span>{CATEGORY_EMOJIS[cat] ?? '🍽️'}</span>
              {cat}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '0 16px' }}>
        {mounted && products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9E9083', fontSize: '13px', padding: '40px 20px', lineHeight: 1.6 }}>
            Couldn&apos;t load the menu just now.<br />
            <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ color: ORANGE, fontWeight: 700 }}>Message us on WhatsApp</a> and we&apos;ll take your order directly.
          </p>
        ) : (
          filtered.map((product) => <OrderCard key={product.id} product={product} />)
        )}
      </div>

      {count > 0 && !sheetOpen && (
        <div style={{ position: 'fixed', bottom: `${bottomOffset}px`, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '480px', zIndex: 45 }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: ORANGE,
              borderRadius: '16px',
              padding: '15px 18px',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(249,115,22,0.45)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '999px', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                {count}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{count === 1 ? 'item' : 'items'} · ₹{total}</span>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800 }}>Review order →</span>
          </button>
        </div>
      )}

      {sheetOpen && count > 0 && <CheckoutSheet onClose={() => setSheetOpen(false)} />}
    </div>
  )
}
