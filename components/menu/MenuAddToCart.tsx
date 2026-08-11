'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, Check } from 'lucide-react'
import type { Product } from '@/lib/data'
import { useCart, lineKey } from '@/context/CartContext'

/**
 * Add-to-cart for a single product inside the /menu story.
 *
 * Prices and stock come from the live product feed rather than the hardcoded
 * copy in the section, so the bag can never be filled at a stale price. The
 * cart itself is the same persisted one /order uses, so anything added here is
 * still there at checkout.
 */
// One request for the whole page: /menu renders a dozen of these, and without
// sharing the promise each would fetch the identical product list on mount.
let productsPromise: Promise<Product[]> | null = null
function loadProducts(): Promise<Product[]> {
  if (!productsPromise) {
    productsPromise = fetch('/api/products')
      .then((r) => r.json())
      .then((all) => (Array.isArray(all) ? all : []))
      .catch(() => [])
  }
  return productsPromise
}

export function MenuAddToCart({ productId, tone = 'dark' }: { productId: string; tone?: 'dark' | 'light' }) {
  const { items, add, updateQty } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [flavour, setFlavour] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    loadProducts().then((all) => {
      if (cancelled) return
      const p = all.find((x) => x.id === productId) ?? null
      setProduct(p)
      setFlavour(p?.flavours?.[0])
    })
    return () => { cancelled = true }
  }, [productId])

  if (!product) return null

  const soldOut = product.in_stock === false && product.allow_backorder !== true
  const key = lineKey({ id: product.id, flavour })
  const qty = items.find((i) => lineKey(i) === key)?.qty ?? 0
  const inBag = items.filter((i) => i.id === product.id).reduce((a, i) => a + i.qty, 0)

  const dark = tone === 'dark'
  const chipBase = 'rounded-full px-3 py-1 text-xs font-semibold transition'
  const chipOff = dark
    ? 'border border-white/25 bg-white/5 text-white/70 hover:bg-white/15'
    : 'border border-foreground/15 bg-white text-foreground/70 hover:bg-foreground/5'
  const chipOn = 'border border-primary bg-primary text-white'

  if (soldOut) {
    return (
      <span className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold ${dark ? 'bg-white/10 text-white/50' : 'bg-foreground/5 text-foreground/40'}`}>
        Sold Out
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(product.flavours?.length ?? 0) > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {product.flavours!.map((f) => (
            <button
              key={f}
              onClick={() => setFlavour(f)}
              className={`${chipBase} ${flavour === f ? chipOn : chipOff}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {qty === 0 ? (
        <button
          onClick={() => add(product, flavour)}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add to cart · ₹{product.price}
        </button>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-primary bg-primary/10 px-2 py-1">
          <button
            onClick={() => updateQty(key, -1)}
            aria-label="Decrease quantity"
            className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white transition active:scale-90"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className={`min-w-[4.5rem] text-center text-sm font-bold ${dark ? 'text-white' : 'text-primary-dark'}`}>
            {qty} in bag
          </span>
          <button
            onClick={() => updateQty(key, +1)}
            aria-label="Increase quantity"
            className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white transition active:scale-90"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {inBag > qty && (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${dark ? 'text-white/60' : 'text-foreground/50'}`}>
          <Check className="h-3 w-3" /> {inBag} total in bag
        </span>
      )}
    </div>
  )
}
