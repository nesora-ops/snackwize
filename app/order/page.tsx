'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { X, Trash2, Minus, Plus } from 'lucide-react'
import { CATEGORIES, type Product, INSTAGRAM, FACEBOOK, WHATSAPP } from '@/lib/data'
import { useCart, lineKey } from '@/context/CartContext'
import { OrderCard } from '@/components/order/OrderCard'
import { whatsappOrderLink } from '@/lib/whatsapp'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from '@/components/layout/SocialIcons'
import { Logo } from '@/components/layout/Logo'

const CATEGORY_EMOJIS: Record<string, string> = {
  'All': '🍽️',
  'Mathri': '🫓',
  'Crispies': '🥨',
  'Bhel & Mixes': '🥣',
  'Bakes': '🧁',
}

const ORANGE = '#F97316'

function CheckoutSheet({ onClose }: { onClose: () => void }) {
  const { items, total, updateQty, remove } = useCart()
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(28,25,23,0.5)' }} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          borderRadius: '24px 24px 0 0',
          maxHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 10px', borderBottom: '1px solid #F0ECE8' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
            Your order
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B5E52', display: 'flex', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '8px 18px', flex: 1 }}>
          {items.map((item) => (
            <div key={lineKey(item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F7F4F1' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>{item.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9E9083' }}>
                  {item.flavour ? <span style={{ color: ORANGE, fontWeight: 600 }}>{item.flavour} · </span> : null}
                  {item.net_weight_grams ? (item.net_weight_grams >= 1000 ? `${item.net_weight_grams / 1000}kg` : `${item.net_weight_grams}g`) : null}
                  {' · '}₹{item.price} each
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '999px', border: `1.5px solid ${ORANGE}`, backgroundColor: '#FFF3E9', padding: '2px 4px' }}>
                <button onClick={() => updateQty(lineKey(item), -1)} aria-label="Decrease" style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: ORANGE, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Minus size={11} />
                </button>
                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12.5px', fontWeight: 700, color: ORANGE }}>{item.qty}</span>
                <button onClick={() => updateQty(lineKey(item), +1)} aria-label="Increase" style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: ORANGE, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={11} />
                </button>
              </div>

              <span style={{ width: '58px', textAlign: 'right', fontSize: '13.5px', fontWeight: 800, color: '#1C1917' }}>
                ₹{item.price * item.qty}
              </span>

              <button onClick={() => remove(lineKey(item))} aria-label={`Remove ${item.name}`} style={{ background: 'none', border: 'none', color: '#C6BCB2', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917' }}>Subtotal</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>₹{total}</span>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: '11.5px', color: '#9E9083', lineHeight: 1.5 }}>
            Delivery is charged separately by distance and confirmed with you on WhatsApp before your order is placed.
          </p>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${acknowledged ? ORANGE : '#E8E1DB'}`,
              backgroundColor: acknowledged ? '#FFF3E9' : '#FAFAF8',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: ORANGE, marginTop: '1px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', color: '#5C5049', lineHeight: 1.5 }}>
              I understand that a delivery charge will be calculated separately based on distance from the store, and confirmed with me before my order is placed.
            </span>
          </label>
        </div>

        <div style={{ padding: '12px 18px 18px', borderTop: '1px solid #F0ECE8' }}>
          {acknowledged ? (
            <a
              href={whatsappOrderLink(items, total)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#25D366',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 22px rgba(37,211,102,0.4)',
              }}
            >
              <span style={{ backgroundColor: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WhatsAppIcon size={16} />
              </span>
              Order on WhatsApp · ₹{total}
            </a>
          ) : (
            <button
              disabled
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#E8E1DB',
                color: '#A79C92',
                fontSize: '15px',
                fontWeight: 800,
                border: 'none',
                cursor: 'not-allowed',
              }}
            >
              Tick the box above to continue
            </button>
          )}
          <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '11px', color: '#9E9083' }}>
            Opens WhatsApp with your order ready to send.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
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
    <div style={{ minHeight: '100dvh', backgroundColor: '#FAFAF8', maxWidth: '520px', margin: '0 auto', paddingBottom: count > 0 ? '96px' : '32px' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#fff',
          borderBottom: '1px solid #F0ECE8',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Logo className="h-8 w-8" />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: 700, color: '#1C1917', letterSpacing: '-0.02em' }}>
            Snack<span style={{ color: ORANGE }}>wize</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: 'flex' }}><InstagramIcon size={22} /></a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ display: 'flex' }}><FacebookIcon size={22} /></a>
        </div>
      </header>

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
            Couldn't load the menu just now.<br />
            <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ color: ORANGE, fontWeight: 700 }}>Message us on WhatsApp</a> and we'll take your order directly.
          </p>
        ) : (
          filtered.map((product) => <OrderCard key={product.id} product={product} />)
        )}
      </div>

      {count > 0 && !sheetOpen && (
        <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '480px', zIndex: 45 }}>
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
