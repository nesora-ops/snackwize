'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/lib/types'
import { Eye, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [openOrder, setOpenOrder] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const res = await fetch(`/api/admin/orders?limit=50&offset=${(page - 1) * 50}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        setOrders(await res.json())
        setTotalCount(Number(res.headers.get('X-Total-Count')) || 0)
      }
    })
  }, [page])

  const filtered = useMemo(() => orders.filter(o => {
    const name = orderCustomer(o)
    return (
      (filterStatus === 'all' || o.status === filterStatus) &&
      (search === '' || name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
    )
  }), [orders, search, filterStatus])

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ status }),
    })
    setOrders(cur => cur.map(o => o.id === id ? { ...o, status } : o))
    toast.success(`${id} → ${status}`)
  }

  const returnToStock = async (o: Order) => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/admin/orders/${o.id}/return-to-stock`, {
      method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` },
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to return to stock')
    }
    const now = new Date().toISOString()
    setOrders(cur => cur.map(x => x.id === o.id ? { ...x, returned_at: now } : x))
    setOpenOrder(p => p ? { ...p, returned_at: now } : p)
    toast.success('Returned units added back to stock')
  }

  const createShipment = async (o: Order) => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/admin/orders/${o.id}/ship`, {
      method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` },
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to create shipment')
    }
    toast.success('Shipment created — reloading')
    location.reload()
  }

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
      </header>

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or order ID" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono-accent text-xs font-bold">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{orderCustomer(o)}</p>
                    <p className="font-mono-accent text-[10px] text-muted-foreground">{orderPhone(o)}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{orderItems(o)}</td>
                  <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{o.total}</td>
                  <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{orderDate(o)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 font-mono-accent text-[10px] uppercase ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setOpenOrder(o)} className="inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-surface"><Eye className="h-4 w-4" /></button>
                    <Select value={o.status} onValueChange={v => updateStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className="ml-1 inline-flex h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Showing {orders.length} orders (Total: {totalCount})</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page * 50 >= totalCount} onClick={() => setPage(p => p + 1)}>Next</Button>
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

                <div className="rounded-xl bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                      Shipment · {openOrder.delivery_mode === 'hyperlocal' ? 'Same-day (Quick)' : 'Standard'}
                    </p>
                    {openOrder.payment_status === 'paid' && (!openOrder.shiprocket_order_id || openOrder.shipment_error) && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => createShipment(openOrder)}>
                        {openOrder.shipment_error ? 'Retry shipment' : 'Create shipment'}
                      </Button>
                    )}
                  </div>
                  {openOrder.shiprocket_order_id ? (
                    <div className="mt-1 text-sm">
                      <p>{openOrder.courier_name ?? 'Courier'} {openOrder.awb ? `· AWB ${openOrder.awb}` : '· AWB pending'}</p>
                      {openOrder.shipment_status && <p className="text-xs text-muted-foreground">{openOrder.shipment_status}</p>}
                      {openOrder.tracking_url && (
                        <a href={openOrder.tracking_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">
                          Track shipment →
                        </a>
                      )}
                    </div>
                  ) : openOrder.shipment_error ? (
                    <p className="mt-1 text-xs text-destructive">Booking failed: {openOrder.shipment_error}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {openOrder.payment_status === 'paid' ? 'Not booked yet.' : 'Awaiting payment.'}
                    </p>
                  )}
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
                {(openOrder.status === 'Delivered' || openOrder.status === 'Shipped') && (
                  <div className="rounded-xl border border-border p-4">
                    <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Returns</p>
                    {openOrder.returned_at ? (
                      <p className="mt-1 text-xs text-muted-foreground">Already returned to stock.</p>
                    ) : (
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => returnToStock(openOrder)}>
                        Return items to stock
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
