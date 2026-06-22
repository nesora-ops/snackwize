'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/lib/types'
import type { Product } from '@/lib/data'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#F97316', '#16A34A', '#C2410C', '#3B82F6', '#A855F7', '#DC2626']

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

    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  }, [])

  const revenue = [
    { m: 'Jan', r: 18500 }, { m: 'Feb', r: 22100 }, { m: 'Mar', r: 27800 },
    { m: 'Apr', r: 31200 }, { m: 'May', r: 38400 }, { m: 'Jun', r: 42800 },
  ]
  const statusData = Object.entries(
    orders.reduce<Record<string, number>>((a, o) => ({ ...a, [o.status]: (a[o.status] ?? 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
      </header>

      <div className="p-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Monthly Revenue</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={revenue}>
                <XAxis dataKey="m" stroke="#78716C" />
                <YAxis stroke="#78716C" />
                <Tooltip />
                <Bar dataKey="r" fill="#F97316" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Order Status Mix</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Top Products</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {products.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                <span><span className="mr-3 font-mono-accent text-xs text-muted-foreground">#{i + 1}</span>{p.name}</span>
                <span className="font-mono-accent font-bold text-primary-dark">₹{p.price * (50 - i * 6)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
