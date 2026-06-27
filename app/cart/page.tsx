'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, Lock } from 'lucide-react';
import { useCart, lineKey } from '@/context/CartContext';
import { getUser, type MockUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FREE_DELIVERY_THRESHOLD, deliveryFeeFor } from '@/lib/pricing';

export default function CartPage() {
  const { items, updateQty, remove, total, count } = useCart();
  const [user, setUser] = useState<MockUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener('snackwize-auth', sync);
    return () => window.removeEventListener('snackwize-auth', sync);
  }, []);

  if (!mounted) return null;

  const deliveryFee = deliveryFeeFor(total);
  const grandTotal = total + deliveryFee;

  // ─── EMPTY CART ────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="relative h-24 w-24 mb-6 opacity-30">
          <ShoppingBag className="h-24 w-24 text-muted-foreground" strokeWidth={1} />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Your bag is empty</h2>
        <p className="text-muted-foreground text-sm max-w-xs mb-8">
          Looks like you haven't added anything yet. Browse our homemade snacks and start snacking!
        </p>
        <Link href="/menu">
          <Button className="bg-primary hover:bg-primary-dark rounded-full px-8">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  // ─── GUEST VIEW (items in cart but not logged in) ────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          {/* Login Prompt Banner */}
          <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Login to proceed to checkout</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your {count} item{count > 1 ? 's' : ''} are saved. Login to place your order.
              </p>
              <Link href="/login">
                <Button size="sm" className="mt-3 bg-primary hover:bg-primary-dark rounded-full">
                  Login / Sign up
                </Button>
              </Link>
            </div>
          </div>

          {/* Cart Preview (read-only for guests) */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-display text-lg font-bold">Your Bag ({count} {count === 1 ? 'item' : 'items'})</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Login to modify and checkout</p>
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={lineKey(item)} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-surface">
                    <Image src={item.image} alt={item.name} fill className="object-cover opacity-70" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    {item.flavour && <p className="text-xs font-medium text-primary">{item.flavour}</p>}
                    <p className="text-xs text-muted-foreground">{item.net_weight_grams ? `${item.net_weight_grams}g` : item.weight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">₹{item.price * item.qty}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-surface border-t border-border">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGGED-IN CART VIEW ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary mb-1">Your Order</p>
          <h1 className="font-display text-3xl font-bold text-foreground">Your Bag</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{count} item{count !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Cart Items */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Items from Snackwize</span>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={lineKey(item)} className="flex items-center gap-4 px-6 py-4 hover:bg-surface/50 transition-colors">
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Name + details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                    {item.flavour && <p className="text-xs font-medium text-primary mt-0.5">{item.flavour}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">{item.net_weight_grams ? `${item.net_weight_grams}g` : item.weight}</p>
                    <p className="text-xs text-primary font-semibold mt-0.5">₹{item.price} each</p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-0 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <button
                      onClick={() => updateQty(lineKey(item), -1)}
                      className="flex h-8 w-8 items-center justify-center bg-primary text-white hover:bg-primary-dark transition active:scale-95"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-primary">{item.qty}</span>
                    <button
                      onClick={() => updateQty(lineKey(item), +1)}
                      className="flex h-8 w-8 items-center justify-center bg-primary text-white hover:bg-primary-dark transition active:scale-95"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-16 text-right shrink-0">
                    <p className="font-bold text-sm text-foreground">₹{item.price * item.qty}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => remove(lineKey(item))}
                    className="ml-1 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add more link */}
            <div className="border-t border-border px-6 py-3">
              <Link href="/menu" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add more items
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-foreground/80">
                  <span>Item total</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Delivery fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-muted-foreground bg-surface rounded-lg px-3 py-2">
                    Add ₹{FREE_DELIVERY_THRESHOLD - total} more for free delivery
                  </p>
                )}
                <hr className="border-border" />
                <div className="flex justify-between font-bold text-base text-foreground">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <Link href="/checkout" id="proceed-to-checkout">
                <Button className="mt-6 w-full bg-primary hover:bg-primary-dark rounded-xl py-6 text-base font-semibold gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Secure checkout · Orders dispatched within 24 hrs
              </p>
            </div>

            {/* Savings / trust */}
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>Homemade with love — no preservatives, fresh every batch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
