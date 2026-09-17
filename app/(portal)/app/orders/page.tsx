'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { RotateCcw, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/useSession'
import { useCart } from '@/context/CartContext'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'
import type { Order, OrderStatus } from '@/lib/types'
import type { Product } from '@/lib/data'

const ORANGE = '#F97316'

// 'Sent' has to read honestly: the message was composed, not that an order
// exists. Everything else is a state Nupur has actually put the order into.
const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  Sent:      { bg: '#FEF3C7', color: '#92400E', label: 'Sent on WhatsApp' },
  Pending:   { bg: '#F5F0EB', color: '#6B5E52', label: 'Pending' },
  Confirmed: { bg: '#D1FAE5', color: '#065F46', label: 'Confirmed' },
  Packed:    { bg: '#DBEAFE', color: '#1E40AF', label: 'Packed' },
  Shipped:   { bg: '#DBEAFE', color: '#1E40AF', label: 'Shipped' },
  Delivered: { bg: '#D1FAE5', color: '#065F46', label: 'Delivered' },
  Cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
}

const card: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '14px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  marginBottom: '12px',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrdersPage() {
  const { user, loading: sessionLoading } = useSession()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState(false)
  const { addLine } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setOrders(null)
      return
    }
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session) return
      fetch('/api/orders', { headers: { Authorization: `Bearer ${session.access_token}` } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('failed'))))
        .then((data: Order[]) => { if (!cancelled) setOrders(Array.isArray(data) ? data : []) })
        .catch(() => { if (!cancelled) setError(true) })
    })

    return () => { cancelled = true }
  }, [user])

  // Replay a past order against today's catalogue: prices, availability and
  // even the product list may have moved on since it was placed.
  const orderAgain = useCallback(async (order: Order) => {
    let products: Product[] = []
    try {
      const res = await fetch('/api/products')
      products = await res.json()
    } catch {
      toast.error("Couldn't load the menu just now — please try again.")
      return
    }
    if (!Array.isArray(products)) return

    const byId = new Map(products.map((p) => [p.id, p]))
    const skipped: string[] = []
    let added = 0

    for (const item of order.items) {
      const p = byId.get(item.id)
      if (!p || (p.in_stock === false && p.allow_backorder !== true)) {
        skipped.push(item.name)
        continue
      }
      addLine(p, item.flavour, item.qty)
      added++
    }

    if (added === 0) {
      toast.error('Nothing from that order is available right now.')
      return
    }
    if (skipped.length > 0) {
      toast(`Added what's available. Not in stock: ${skipped.join(', ')}.`)
    }
    router.push('/app/menu?checkout=1')
  }, [addLine, router])

  if (sessionLoading) return null

  if (!user) {
    return (
      <div style={{ padding: '32px 20px' }}>
        <div style={{ ...card, textAlign: 'center', padding: '28px 20px' }}>
          <Package size={32} color={ORANGE} style={{ margin: '0 auto 12px' }} />
          <h1 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
            Your order history
          </h1>
          <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#6B5E52', lineHeight: 1.6 }}>
            Sign in to keep your past orders, save your address and re-order in one tap.
            You can always order as a guest without signing in.
          </p>
          <EmailAuthForm />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9E9083', fontSize: '13px' }}>
        Couldn&apos;t load your orders just now. Pull down to refresh, or try again in a moment.
      </div>
    )
  }

  if (orders === null) {
    return <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9E9083', fontSize: '13px' }}>Loading your orders…</div>
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
        <Package size={32} color="#C6BCB2" style={{ margin: '0 auto 12px' }} />
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#9E9083', lineHeight: 1.6 }}>
          No orders yet. Once you send one on WhatsApp it&apos;ll show up here.
        </p>
        <a href="/app/menu" style={{ color: ORANGE, fontWeight: 700, fontSize: '13.5px', textDecoration: 'none' }}>
          Browse the menu →
        </a>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
        Your orders
      </h1>

      {orders.map((order) => {
        const s = STATUS_STYLE[order.status] ?? STATUS_STYLE.Pending
        return (
          <div key={order.id} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>{order.id}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9E9083' }}>
                  {formatDate(order.created_at)}
                  {order.client_ref ? ` · ref ${order.client_ref}` : ''}
                </p>
              </div>
              <span style={{ backgroundColor: s.bg, color: s.color, fontSize: '10.5px', fontWeight: 700, borderRadius: '999px', padding: '4px 9px', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>

            {order.status === 'Sent' && (
              <p style={{ margin: '0 0 8px', fontSize: '11.5px', color: '#92400E', lineHeight: 1.5 }}>
                Nupur will confirm this order and the delivery charge on WhatsApp.
              </p>
            )}

            <div style={{ borderTop: '1px solid #F7F4F1', paddingTop: '8px' }}>
              {order.items.map((item, idx) => (
                <div key={`${item.id}-${item.flavour ?? ''}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '3px 0' }}>
                  <span style={{ fontSize: '12.5px', color: '#5C5049', minWidth: 0 }}>
                    {item.qty} × {item.name}
                    {item.flavour ? <span style={{ color: ORANGE }}> ({item.flavour})</span> : null}
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1C1917', whiteSpace: 'nowrap' }}>
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', borderTop: '1px solid #F7F4F1', marginTop: '8px', paddingTop: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
                ₹{order.total}
              </span>
              <button
                onClick={() => orderAgain(order)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '999px',
                  border: `1.5px solid ${ORANGE}`,
                  backgroundColor: '#FFF3E9',
                  color: '#C2410C',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  padding: '7px 14px',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} strokeWidth={2.5} /> Order again
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
