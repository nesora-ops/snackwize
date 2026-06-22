'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORIES } from '@/lib/data'
import { CheckCircle2, XCircle } from 'lucide-react'

type Product = { id: string; name: string; category: string; price: number; in_stock: boolean; allow_backorder: boolean }
type Stats = { inStock: number; soldOut: number; preordersPending: number; togglesThisMonth: number }
type LogEntry = { id: string; product_id: string; action: string; changed_by: string; note: string | null; created_at: string; products: { name: string } | null }
type PreorderRow = { customerName: string; phone: string; productId: string; productName: string; qty: number; orderId: string; orderDate: string; orderStatus: string }

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [preorders, setPreorders] = useState<PreorderRow[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [notes, setNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const token = session.access_token
      const headers = { Authorization: `Bearer ${token}` }

      const [productsRes, statsRes, logsRes, ordersRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/admin/inventory/stats', { headers }).then(r => r.json()),
        fetch('/api/admin/inventory/logs', { headers }).then(r => r.json()),
        fetch('/api/admin/orders', { headers }).then(r => r.json()),
      ])

      setProducts(productsRes)
      setStats(statsRes)
      setLogs(Array.isArray(logsRes) ? logsRes : [])

      // Parse preorders from orders
      const rows: PreorderRow[] = []
      for (const order of (Array.isArray(ordersRes) ? ordersRes : [])) {
        if (order.status === 'Delivered' || order.status === 'Cancelled') continue
        for (const item of (Array.isArray(order.items) ? order.items : [])) {
          if (!item.is_preorder) continue
          rows.push({
            customerName: order.profiles?.name ?? order.guest_name ?? 'Guest',
            phone: order.profiles?.phone ?? order.guest_phone ?? '—',
            productId: item.id,
            productName: item.name,
            qty: item.qty ?? 1,
            orderId: order.id,
            orderDate: new Date(order.created_at).toLocaleDateString('en-IN'),
            orderStatus: order.status,
          })
        }
      }
      rows.sort((a, b) => a.orderDate.localeCompare(b.orderDate))
      setPreorders(rows)
    })
  }, [])

  const toggleStock = async (id: string, in_stock: boolean) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/toggle', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: id, in_stock, note: notes[id] ?? null }),
    })
    setProducts(cur => cur.map(p => p.id === id ? { ...p, in_stock } : p))
    // refresh logs + stats
    const token = session!.access_token
    const [newLogs, newStats] = await Promise.all([
      fetch('/api/admin/inventory/logs', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/inventory/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
    setLogs(Array.isArray(newLogs) ? newLogs : [])
    setStats(newStats)
  }

  const toggleBackorder = async (id: string, allow_backorder: boolean) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/toggle', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: id, allow_backorder }),
    })
    setProducts(cur => cur.map(p => p.id === id ? { ...p, allow_backorder } : p))
  }

  const filteredProducts = products.filter(p =>
    (catFilter === 'all' || p.category === catFilter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  )

  const preorderSummary = preorders.reduce<Record<string, number>>((acc, r) => {
    acc[r.productName] = (acc[r.productName] ?? 0) + r.qty
    return acc
  }, {})

  const statItems = [
    { label: 'In Stock', value: stats?.inStock ?? '—', color: 'text-green-700 bg-green-50' },
    { label: 'Sold Out', value: stats?.soldOut ?? '—', color: 'text-red-700 bg-red-50' },
    { label: 'Pre-orders Pending', value: stats?.preordersPending ?? '—', color: 'text-amber-700 bg-amber-50' },
    { label: 'Toggles This Month', value: stats?.togglesThisMonth ?? '—', color: 'text-blue-700 bg-blue-50' },
  ]

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Inventory</h1>
        <p className="text-xs text-muted-foreground">Manage stock levels and track pre-orders</p>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map(s => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className={`mt-2 font-display text-3xl font-bold ${stats ? '' : 'opacity-40 animate-pulse'}`}>{s.value}</p>
              <span className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono-accent text-[10px] uppercase ${s.color}`}>Live</span>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">All Products</TabsTrigger>
            <TabsTrigger value="preorders">
              Pre-orders
              {preorders.length > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {preorders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="logs">Audit Log</TabsTrigger>
          </TabsList>

          {/* Tab 1: All Products */}
          <TabsContent value="products">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">In Stock</th>
                    <th className="px-4 py-3">Allow Pre-order</th>
                    <th className="px-4 py-3">Quick Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                      <td className="px-4 py-3">
                        <Switch checked={p.in_stock} onCheckedChange={v => toggleStock(p.id, v)} />
                      </td>
                      <td className="px-4 py-3">
                        <Switch checked={p.allow_backorder} onCheckedChange={v => toggleBackorder(p.id, v)} />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          className="h-7 text-xs w-40"
                          placeholder="e.g. batch delayed"
                          value={notes[p.id] ?? ''}
                          onChange={e => setNotes(n => ({ ...n, [p.id]: e.target.value }))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 2: Pre-orders */}
          <TabsContent value="preorders">
            {preorders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                No pending pre-orders
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  <span className="font-bold">You need to bake:</span>{' '}
                  {Object.entries(preorderSummary).map(([name, qty]) => `${qty}× ${name}`).join(', ')}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preorders.map((r, i) => (
                        <tr key={`${r.orderId}-${i}`} className="border-t border-border">
                          <td className="px-4 py-3 font-semibold">{r.productName}</td>
                          <td className="px-4 py-3 font-mono-accent font-bold">{r.qty}</td>
                          <td className="px-4 py-3">{r.customerName}</td>
                          <td className="px-4 py-3 font-mono-accent text-xs">{r.phone}</td>
                          <td className="px-4 py-3 font-mono-accent text-xs">{r.orderId}</td>
                          <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{r.orderDate}</td>
                          <td className="px-4 py-3 text-xs">{r.orderStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>

          {/* Tab 3: Audit Log */}
          <TabsContent value="logs">
            {logs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                No inventory changes yet
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-4">
                    <div className="mt-0.5 shrink-0">
                      {log.action === 'marked_in_stock'
                        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                        : <XCircle className="h-5 w-5 text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">
                        {log.products?.name ?? log.product_id}{' '}
                        <span className="font-normal text-muted-foreground">
                          {log.action === 'marked_in_stock' ? 'marked in stock' : 'marked sold out'} by {log.changed_by}
                        </span>
                      </p>
                      {log.note && <p className="text-xs text-muted-foreground mt-0.5">"{log.note}"</p>}
                    </div>
                    <span className="shrink-0 font-mono-accent text-[11px] text-muted-foreground">{relativeTime(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
