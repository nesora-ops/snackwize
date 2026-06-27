'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/lib/types'
import { Eye } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import type { OrderStatus } from '@/lib/types'

const STATUS_COLOR: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-500/15 text-yellow-700 border-yellow-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  Packed:    'bg-orange-500/15 text-orange-700 border-orange-500/30',
  Shipped:   'bg-purple-500/15 text-purple-700 border-purple-500/30',
  Delivered: 'bg-green-500/15 text-green-700 border-green-500/30',
  Cancelled: 'bg-red-500/15 text-red-700 border-red-500/30',
}

function orderCustomer(o: Order) { return o.profiles?.name ?? o.guest_name ?? 'Guest' }
function orderPhone(o: Order) { return o.profiles?.phone ?? o.guest_phone ?? '—' }
function orderItems(o: Order) { return o.items.map(i => `${i.name}${i.flavour ? ` (${i.flavour})` : ''} x${i.qty}`).join(', ') }
function orderDate(o: Order) { return new Date(o.created_at).toLocaleDateString('en-IN') }

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [openOrder, setOpenOrder] = useState<Order | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) setOrders(await res.json())
    })
  }, [])

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.filter(o => o.status !== 'Cancelled').reduce((a, o) => a + o.total, 0),
  }), [orders])

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ status }),
    })
    setOrders(cur => cur.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
      </header>

      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Orders" value={String(stats.total)} accent="bg-primary-light text-primary-dark" />
          <StatCard label="Pending" value={String(stats.pending)} accent="bg-yellow-100 text-yellow-700" />
          <StatCard label="Delivered" value={String(stats.delivered)} accent="bg-green-100 text-green-700" />
          <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} accent="bg-primary text-primary-foreground" />
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono-accent text-xs font-bold">{o.id}</td>
                    <td className="px-4 py-3 font-semibold">{orderCustomer(o)}</td>
                    <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{o.total}</td>
                    <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{orderDate(o)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 font-mono-accent text-[10px] uppercase ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setOpenOrder(o)} className="inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-surface"><Eye className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!openOrder} onOpenChange={v => !v && setOpenOrder(null)}>
        <DialogContent className="max-w-lg">
          {openOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{openOrder.id}</DialogTitle>
                <DialogDescription>Placed on {orderDate(openOrder)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Customer</p>
                  <p className="font-semibold">{orderCustomer(openOrder)}</p>
                  <p className="text-muted-foreground">{orderPhone(openOrder)}</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Items</p>
                  <p>{orderItems(openOrder)}</p>
                  <p className="mt-2 font-mono-accent text-lg font-bold text-primary-dark">₹{openOrder.total}</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Address</p>
                  <p>{openOrder.address.line1}, {openOrder.address.city} — {openOrder.address.pin}</p>
                </div>
                <div>
                  <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Update Status</p>
                  <Select value={openOrder.status} onValueChange={v => { updateStatus(openOrder.id, v as OrderStatus); setOpenOrder({ ...openOrder, status: v as OrderStatus }) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      <span className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono-accent text-[10px] uppercase ${accent}`}>Live</span>
    </div>
  )
}
