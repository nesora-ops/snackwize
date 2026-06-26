'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CATEGORIES } from '@/lib/data'
import { CheckCircle2, XCircle, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'

type Product = {
  id: string; name: string; category: string; price: number
  in_stock: boolean; allow_backorder: boolean
  daily_stock: number; stock_addon: number; stock_today: number
  restock_mode: 'accumulate' | 'reset'
}
type Stats = { inStock: number; soldOut: number; preordersPending: number; togglesThisMonth: number }
type ReportRow = { id: string; name: string; opening: number; restocked: number; sold: number; cancelled: number; adjusted: number; backorder: number; onHand: number }
type Report = { totals: { opening: number; restocked: number; sold: number; cancelled: number; adjusted: number; backorder: number; onHand: number }; products: ReportRow[] }
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
  const [report, setReport] = useState<Report | null>(null)
  const [skipNext, setSkipNext] = useState(false)
  const [adjustFor, setAdjustFor] = useState<Product | null>(null)
  const [adjustDelta, setAdjustDelta] = useState('')
  const [adjustNote, setAdjustNote] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const token = session.access_token
      const headers = { Authorization: `Bearer ${token}` }

      const [productsRes, statsRes, logsRes, ordersRes, reportRes, skipRes] = await Promise.all([
        fetch('/api/products', { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/admin/inventory/stats', { headers }).then(r => r.json()),
        fetch('/api/admin/inventory/logs', { headers }).then(r => r.json()),
        fetch('/api/admin/orders', { headers }).then(r => r.json()),
        fetch('/api/admin/inventory/report', { headers }).then(r => r.json()),
        fetch('/api/admin/inventory/skip-replenish', { headers }).then(r => r.json()),
      ])

      setProducts(productsRes)
      setStats(statsRes)
      setLogs(Array.isArray(logsRes) ? logsRes : [])
      setReport(reportRes)
      setSkipNext(!!skipRes?.skip)

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
            qty: item.preorder_qty ?? item.qty ?? 1,
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
      body: JSON.stringify({ productId: id, in_stock, note: null }),
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

  // Stock fields are edited inline: onChange updates local state, onBlur persists.
  const setLocal = (id: string, patch: Partial<Product>) =>
    setProducts(cur => cur.map(p => p.id === id ? { ...p, ...patch } : p))

  const saveStock = async (id: string, field: 'daily_stock' | 'stock_addon' | 'stock_today') => {
    const p = products.find(x => x.id === id)
    if (!p) return
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: id, [field]: p[field] ?? 0 }),
    })
  }

  const reloadProducts = async () => {
    const res = await fetch('/api/products', { cache: 'no-store' })
    if (res.ok) setProducts(await res.json())
  }

  const refreshReport = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/inventory/report', {
      headers: { Authorization: `Bearer ${session!.access_token}` },
    })
    if (res.ok) setReport(await res.json())
  }

  const saveMode = async (id: string, restock_mode: 'accumulate' | 'reset') => {
    setLocal(id, { restock_mode })
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: id, restock_mode }),
    })
  }

  const replenish = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/inventory/replenish', {
      method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` },
    })
    if (!res.ok) return toast.error('Failed to replenish')
    toast.success("Today's stock rebuilt from each product's daily plan")
    reloadProducts()
    refreshReport()
  }

  const submitAdjust = async () => {
    if (!adjustFor) return
    const delta = Number(adjustDelta)
    if (!delta) return toast.error('Enter a non-zero amount')
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: adjustFor.id, delta, note: adjustNote || undefined }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to adjust')
    }
    const { stock_today } = await res.json()
    setLocal(adjustFor.id, { stock_today })
    setAdjustFor(null); setAdjustDelta(''); setAdjustNote('')
    toast.success('Stock adjusted')
    refreshReport()
  }

  const toggleSkip = async (v: boolean) => {
    setSkipNext(v)
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/skip-replenish', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ skip: v }),
    })
    toast.success(v ? "Next morning's replenish will be skipped" : 'Replenish re-enabled')
  }

  const fulfillBackorder = async (orderId: string, productId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`/api/admin/orders/${orderId}/fulfill-backorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId }),
    })
    if (!res.ok) return toast.error('Failed to mark fulfilled')
    setPreorders(cur => cur.filter(r => !(r.orderId === orderId && r.productId === productId)))
    toast.success('Backorder marked baked & shipped')
    refreshReport()
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
            <TabsTrigger value="report">Today’s Report</TabsTrigger>
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
              <Button variant="outline" onClick={replenish} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Replenish now
              </Button>
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 text-xs text-muted-foreground">
                <Switch checked={skipNext} onCheckedChange={toggleSkip} />
                Skip next replenish
              </label>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              <strong>Daily qty</strong> bakes every morning · <strong>Next bake ±</strong> is a one-off tweak to the next morning’s batch (clears after it runs) · <strong>Today</strong> is the live count (auto-drops as orders come in; edit to reconcile) · <strong>Mode</strong>: “Adds up” keeps yesterday’s leftovers (bars/cookies), “Replaces” discards them (perishables) · use <strong>Adjust</strong> for offline sales &amp; wastage today.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm min-w-[1080px]">
                <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-3 py-3">Daily Qty</th>
                    <th className="px-3 py-3">Next bake ±</th>
                    <th className="px-3 py-3">Today</th>
                    <th className="px-3 py-3">Mode</th>
                    <th className="px-4 py-3">In Stock</th>
                    <th className="px-4 py-3">Allow Pre-order</th>
                    <th className="px-3 py-3">Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{p.name}</p>
                        <p className="font-mono-accent text-[10px] text-muted-foreground capitalize">{p.category}</p>
                      </td>
                      <td className="px-3 py-3">
                        <Input type="number" min={0} className="h-8 w-16 text-xs"
                          value={p.daily_stock}
                          onChange={e => setLocal(p.id, { daily_stock: Number(e.target.value) })}
                          onBlur={() => saveStock(p.id, 'daily_stock')} />
                      </td>
                      <td className="px-3 py-3">
                        <Input type="number" className="h-8 w-16 text-xs"
                          value={p.stock_addon}
                          onChange={e => setLocal(p.id, { stock_addon: Number(e.target.value) })}
                          onBlur={() => saveStock(p.id, 'stock_addon')} />
                      </td>
                      <td className="px-3 py-3">
                        <Input type="number" min={0} className={`h-8 w-16 text-xs ${p.stock_today === 0 ? 'border-amber-400' : ''}`}
                          value={p.stock_today}
                          onChange={e => setLocal(p.id, { stock_today: Number(e.target.value) })}
                          onBlur={() => saveStock(p.id, 'stock_today')} />
                      </td>
                      <td className="px-3 py-3">
                        <Select value={p.restock_mode} onValueChange={v => saveMode(p.id, v as 'accumulate' | 'reset')}>
                          <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accumulate">Adds up</SelectItem>
                            <SelectItem value="reset">Replaces</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Switch checked={p.in_stock} onCheckedChange={v => toggleStock(p.id, v)} />
                      </td>
                      <td className="px-4 py-3">
                        <Switch checked={p.allow_backorder} onCheckedChange={v => toggleBackorder(p.id, v)} />
                      </td>
                      <td className="px-3 py-3">
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs"
                          onClick={() => { setAdjustFor(p); setAdjustDelta(''); setAdjustNote('') }}>
                          <SlidersHorizontal className="h-3.5 w-3.5" /> Adjust
                        </Button>
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
                        <th className="px-4 py-3 text-right">Action</th>
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
                          <td className="px-4 py-3 text-right">
                            <Button variant="outline" size="sm" className="text-xs"
                              onClick={() => fulfillBackorder(r.orderId, r.productId)}>
                              Mark fulfilled
                            </Button>
                          </td>
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
          {/* Tab: Today's Report */}
          <TabsContent value="report">
            {!report ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">Loading…</div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-4">
                  {[
                    { label: 'Opening (carried in)', value: report.totals.opening, color: 'text-stone-600 bg-stone-100' },
                    { label: 'Restocked', value: report.totals.restocked, color: 'text-blue-700 bg-blue-50' },
                    { label: 'Sold online', value: report.totals.sold, color: 'text-green-700 bg-green-50' },
                    { label: 'Backorder shipped', value: report.totals.backorder, color: 'text-orange-700 bg-orange-50' },
                    { label: 'On hand now', value: report.totals.onHand, color: 'text-foreground bg-surface' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
                      <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 font-mono-accent text-[10px] uppercase ${s.color}`}>today</span>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                  <table className="w-full text-sm min-w-[760px]">
                    <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Opening</th>
                        <th className="px-4 py-3">Restocked</th>
                        <th className="px-4 py-3">Sold</th>
                        <th className="px-4 py-3">Cancelled</th>
                        <th className="px-4 py-3">Adjusted</th>
                        <th className="px-4 py-3">Backorder</th>
                        <th className="px-4 py-3">On hand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.products.map(r => (
                        <tr key={r.id} className="border-t border-border">
                          <td className="px-4 py-3 font-semibold">{r.name}</td>
                          <td className="px-4 py-3 font-mono-accent text-muted-foreground">{r.opening}</td>
                          <td className="px-4 py-3 font-mono-accent">{r.restocked}</td>
                          <td className="px-4 py-3 font-mono-accent">{r.sold}</td>
                          <td className="px-4 py-3 font-mono-accent">{r.cancelled}</td>
                          <td className="px-4 py-3 font-mono-accent">{r.adjusted >= 0 ? `+${r.adjusted}` : r.adjusted}</td>
                          <td className="px-4 py-3 font-mono-accent">{r.backorder}</td>
                          <td className="px-4 py-3 font-mono-accent font-bold">{r.onHand}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Opening + Restocked − Sold + Cancelled + Adjusted = On hand. Backorder = made-to-order units shipped (not from stock). Measured since this morning’s replenish.
                </p>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!adjustFor} onOpenChange={v => !v && setAdjustFor(null)}>
        <DialogContent className="max-w-sm">
          {adjustFor && (
            <>
              <DialogHeader><DialogTitle className="font-display text-xl">Adjust “{adjustFor.name}”</DialogTitle></DialogHeader>
              <p className="text-xs text-muted-foreground">
                Today’s stock: <strong>{adjustFor.stock_today}</strong>. Use a negative number for an offline sale or wastage, positive to add an extra batch.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[{ d: '-1', l: 'Sold offline' }, { d: '-1', l: 'Wastage' }, { d: '5', l: 'Extra batch' }].map((b, i) => (
                  <Button key={i} type="button" variant="outline" size="sm" className="text-xs"
                    onClick={() => { setAdjustDelta(b.d); setAdjustNote(b.l) }}>{b.l}</Button>
                ))}
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Amount (±)</label>
                  <Input type="number" value={adjustDelta} onChange={e => setAdjustDelta(e.target.value)} className="mt-1" placeholder="-1" />
                </div>
                <div>
                  <label className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Reason (optional)</label>
                  <Input value={adjustNote} onChange={e => setAdjustNote(e.target.value)} className="mt-1" placeholder="e.g. sold at market" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAdjustFor(null)}>Cancel</Button>
                <Button onClick={submitAdjust} className="bg-primary hover:bg-primary-dark">Apply</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
