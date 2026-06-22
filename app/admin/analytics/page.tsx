'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/lib/types'
import type { Product } from '@/lib/data'

// recharts is heavy (~80KB) and only needed here — code-split it out and skip
// SSR (it relies on browser layout APIs).
const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), {
  ssr: false,
  loading: () => (
    <div className="lg:col-span-2 grid h-64 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
      Loading charts…
    </div>
  ),
})

function monthlyRevenue(orders: Order[]) {
  const now = new Date()
  const buckets = Array.from({ length: 6 }, (_, k) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1)
    return { m: d.toLocaleString('en-IN', { month: 'short' }), r: 0, key: `${d.getFullYear()}-${d.getMonth()}` }
  })
  const idx = new Map(buckets.map((b, i) => [b.key, i]))
  for (const o of orders) {
    if (o.status === 'Cancelled') continue
    const d = new Date(o.created_at)
    const i = idx.get(`${d.getFullYear()}-${d.getMonth()}`)
    if (i !== undefined) buckets[i].r += o.total
  }
  return buckets.map(({ m, r }) => ({ m, r }))
}

function topProducts(orders: Order[]) {
  const agg = new Map<string, { name: string; revenue: number; units: number }>()
  for (const o of orders) {
    if (o.status === 'Cancelled') continue
    for (const item of o.items ?? []) {
      const cur = agg.get(item.id) ?? { name: item.name, revenue: 0, units: 0 }
      cur.revenue += item.price * item.qty
      cur.units += item.qty
      agg.set(item.id, cur)
    }
  }
  return [...agg.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) setOrders(await res.json())
    })

    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  const revenue = useMemo(() => monthlyRevenue(orders), [orders])
  const topSelling = useMemo(() => topProducts(orders), [orders])
  const statusData = useMemo(
    () => Object.entries(
      orders.reduce<Record<string, number>>((a, o) => ({ ...a, [o.status]: (a[o.status] ?? 0) + 1 }), {})
    ).map(([name, value]) => ({ name, value })),
    [orders],
  )

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
      </header>

      <div className="p-6 grid gap-6 lg:grid-cols-2">
        <AnalyticsCharts revenue={revenue} statusData={statusData} />

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Top Products</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {topSelling.length > 0 ? (
              topSelling.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                  <span>
                    <span className="mr-3 font-mono-accent text-xs text-muted-foreground">#{i + 1}</span>
                    {p.name}
                    <span className="ml-2 font-mono-accent text-xs text-muted-foreground">{p.units} sold</span>
                  </span>
                  <span className="font-mono-accent font-bold text-primary-dark">₹{p.revenue.toLocaleString('en-IN')}</span>
                </li>
              ))
            ) : (
              // No sales yet — show the catalogue as a placeholder
              products.slice(0, 5).map((p, i) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                  <span>
                    <span className="mr-3 font-mono-accent text-xs text-muted-foreground">#{i + 1}</span>
                    {p.name}
                  </span>
                  <span className="font-mono-accent text-xs text-muted-foreground">No sales yet</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  )
}
