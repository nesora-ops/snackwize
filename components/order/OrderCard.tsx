'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Product } from '@/lib/data'
import { useCart, lineKey } from '@/context/CartContext'
import { ProductImage } from '@/components/sections/ProductImage'
import { InstagramIcon } from '@/components/layout/SocialIcons'

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: '#FEF3C7', color: '#92400E' },
  Seasonal:   { bg: '#D1FAE5', color: '#065F46' },
  Premium:    { bg: '#EDE9FE', color: '#4C1D95' },
  NEW:        { bg: '#FEE2E2', color: '#991B1B' },
}

const ORANGE = '#F97316'

function Stepper({ qty, onDec, onInc, size = 22 }: { qty: number; onDec: () => void; onInc: () => void; size?: number }) {
  const btn = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: ORANGE,
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  } as const

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#FFF3E9',
        borderRadius: '20px',
        padding: '3px 6px',
        border: `1.5px solid ${ORANGE}`,
      }}
    >
      <button onClick={onDec} style={btn} aria-label="Decrease quantity"><Minus size={12} /></button>
      <span style={{ fontSize: '13px', fontWeight: 700, color: ORANGE, minWidth: '16px', textAlign: 'center' }}>{qty}</span>
      <button onClick={onInc} style={btn} aria-label="Increase quantity"><Plus size={12} /></button>
    </div>
  )
}

export function OrderCard({ product }: { product: Product }) {
  const { items, add, updateQty } = useCart()
  const hasFlavours = (product.flavours?.length ?? 0) > 0
  const [selFlavour, setSelFlavour] = useState<string | undefined>(product.flavours?.[0])

  const plainLine = items.find((i) => lineKey(i) === lineKey({ id: product.id }))
  const qty = plainLine?.qty ?? 0
  const totalForProduct = items.filter((i) => i.id === product.id).reduce((a, i) => a + i.qty, 0)
  const badge = product.badge ? BADGE_COLORS[product.badge] : null
  const soldOut = product.in_stock === false && product.allow_backorder !== true

  const addButton = (flavour?: string) => (
    <button
      onClick={() => { add(product, flavour); if (flavour) setSelFlavour(flavour) }}
      id={`order-add-${product.id}`}
      style={{
        height: '32px',
        borderRadius: '999px',
        backgroundColor: product.in_stock ? ORANGE : '#D97706',
        border: 'none',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '0 12px',
        gap: '4px',
        fontSize: '12px',
        fontWeight: 700,
        boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
      }}
    >
      {product.in_stock ? <>Add <Plus size={13} strokeWidth={2.5} /></> : <>Pre-order <Plus size={12} strokeWidth={2.5} /></>}
    </button>
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '12px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          borderRadius: '12px',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: '#F5F0EB',
        }}
      >
        <ProductImage src={product.image} alt={product.name} sizes="90px" compact />
        {product.badge && badge && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: '9px',
              fontWeight: 700,
              borderRadius: '999px',
              padding: '2px 6px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917', lineHeight: 1.3, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {product.name}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: '#7A5C42',
            margin: '3px 0 6px',
            lineHeight: 1.45,
            fontFamily: 'var(--font-dm-serif), serif',
            fontStyle: 'italic',
          }}
        >
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F5EFE6', border: '0.5px solid #D9C9B8', borderRadius: '6px', padding: '2px 6px', fontSize: '11px', color: '#8C6A4E', fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#C4A882' }} />
            {product.category}
          </span>
          {product.net_weight_grams && (
            <span style={{ backgroundColor: '#1E1208', borderRadius: '6px', padding: '2px 6px', fontSize: '11px', color: '#F5EFE6', fontWeight: 600 }}>
              {product.net_weight_grams >= 1000 ? `${product.net_weight_grams / 1000}kg` : `${product.net_weight_grams}g`}
            </span>
          )}
          {product.nutrition && (
            <span style={{ fontSize: '10px', color: '#9E9083' }} title={product.nutrition}>ℹ️ {product.nutrition}</span>
          )}
        </div>

        {/* Flavours already in the bag get an inline stepper so quantities can be
            adjusted without opening the cart; the rest stay selectable chips. */}
        {hasFlavours && !soldOut && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
            {product.flavours!.map((f) => {
              const flavQty = items.find((i) => i.id === product.id && i.flavour === f)?.qty ?? 0
              if (flavQty > 0) {
                return (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', borderRadius: '999px', border: `1.5px solid ${ORANGE}`, backgroundColor: '#FFF3E9', overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQty(lineKey({ id: product.id, flavour: f }), -1)}
                      style={{ width: '20px', height: '20px', backgroundColor: ORANGE, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      aria-label={`Remove one ${f}`}
                    >
                      <Minus size={9} strokeWidth={3} />
                    </button>
                    <span style={{ padding: '0 5px', color: '#C2410C', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>{flavQty}× {f}</span>
                    <button
                      onClick={() => updateQty(lineKey({ id: product.id, flavour: f }), +1)}
                      style={{ width: '20px', height: '20px', backgroundColor: ORANGE, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      aria-label={`Add one ${f}`}
                    >
                      <Plus size={9} strokeWidth={3} />
                    </button>
                  </div>
                )
              }
              return (
                <button
                  key={f}
                  onClick={() => setSelFlavour(f)}
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    border: selFlavour === f ? `1.5px solid ${ORANGE}` : '1px solid #E8E1DB',
                    backgroundColor: selFlavour === f ? '#FFF3E9' : '#fff',
                    color: selFlavour === f ? '#C2410C' : '#6B5E52',
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif", display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ₹{product.price}
            {product.instagram_url && (
              <a
                href={product.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`See ${product.name} on Instagram`}
                style={{ display: 'inline-flex', opacity: 0.75 }}
              >
                <InstagramIcon size={14} />
              </a>
            )}
            {totalForProduct > 0 && (
              <span style={{ fontSize: '10px', fontWeight: 700, color: ORANGE }}>{totalForProduct} in bag</span>
            )}
          </span>

          {soldOut ? (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#9E9083', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#F5F0EB' }}>
              Sold Out
            </span>
          ) : hasFlavours ? (
            (() => {
              // Offer only a flavour that isn't already carted; once every flavour
              // is in the bag the inline steppers cover all of them.
              const carted = new Set(items.filter((i) => i.id === product.id).map((i) => i.flavour))
              const target = !carted.has(selFlavour) ? selFlavour : product.flavours!.find((f) => !carted.has(f))
              return target ? addButton(target) : null
            })()
          ) : qty === 0 ? (
            addButton()
          ) : (
            <Stepper
              qty={qty}
              onDec={() => updateQty(lineKey({ id: product.id }), -1)}
              onInc={() => updateQty(lineKey({ id: product.id }), +1)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
