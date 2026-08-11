'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

/**
 * Floating bag pill for the /menu story. The navbar carries a cart icon, but it
 * is small and sits in a transparent header over full-bleed photography — this
 * gives anything added mid-scroll a visible way out to checkout.
 */
export function MenuCartBar() {
  const { count, total } = useCart()
  if (count === 0) return null

  return (
    <a
      href="/order"
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-primary/40 transition hover:scale-105"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25">
        <ShoppingBag className="h-3.5 w-3.5" />
      </span>
      {count} {count === 1 ? 'item' : 'items'} · ₹{total}
      <span className="opacity-80">Review →</span>
    </a>
  )
}
