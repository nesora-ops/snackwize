'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/data'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Sparkles, Send, X, Users } from 'lucide-react'

type Drop = { id: string; name: string; image: string | null; price: number; net_weight_grams: number | null; category: string }
type ActiveCampaign = {
  id: string; daily_limit: number; total: number; sent: number; created_at: string
  products: { id: string; name: string }[]
} | null

const BLANK = {
  name: '', category: 'Crispies', description: '', price: '', net_weight_grams: '',
  shelf_life: '', delivery_type: 'local', nutrition: '', badge: '', flavours: '',
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}

export default function AdminNewDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [active, setActive] = useState<ActiveCampaign>(null)
  const [subscribers, setSubscribers] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [dailyLimit, setDailyLimit] = useState(25)
  const [submitting, setSubmitting] = useState(false)
  const [starting, setStarting] = useState(false)

  const [f, setF] = useState(BLANK)
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const load = useCallback(async () => {
    const headers = await authHeaders()
    const [d, c] = await Promise.all([
      fetch('/api/admin/campaigns/drops', { headers }).then(r => r.json()),
      fetch('/api/admin/campaigns', { headers }).then(r => r.json()),
    ])
    setDrops(Array.isArray(d) ? d : [])
    setActive(c.active ?? null)
    setSubscribers(c.subscribers ?? 0)
  }, [])

  useEffect(() => { load() }, [load])

  // When ≤3 pending drops, preselect all; when >3, require a manual pick of 3.
  useEffect(() => {
    setSelected(drops.length <= 3 ? drops.map(d => d.id) : [])
  }, [drops])

  const toggleSelect = (id: string) => {
    setSelected(cur => {
      if (cur.includes(id)) return cur.filter(x => x !== id)
      if (drops.length > 3 && cur.length >= 3) return cur
      return [...cur, id]
    })
  }

  const onPhoto = (file: File | null) => {
    setPhoto(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo) return toast.error('Add a product photo')
    setSubmitting(true)
    const fd = new FormData()
    fd.set('name', f.name)
    fd.set('category', f.category)
    fd.set('description', f.description)
    fd.set('price', f.price)
    if (f.net_weight_grams) fd.set('net_weight_grams', f.net_weight_grams)
    if (f.shelf_life) fd.set('shelf_life', f.shelf_life)
    fd.set('delivery_type', f.delivery_type)
    if (f.nutrition) fd.set('nutrition', f.nutrition)
    if (f.badge) fd.set('badge', f.badge)
    if (f.flavours) fd.set('flavours', f.flavours)
    fd.set('photo', photo)

    const res = await fetch('/api/admin/products', { method: 'POST', headers: await authHeaders(), body: fd })
    setSubmitting(false)
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to add product')
    }
    toast.success('Product added — it’s live on the menu and queued as a drop')
    setF(BLANK)
    onPhoto(null)
    load()
  }

  const startCampaign = async () => {
    if (selected.length < 1 || selected.length > 3) return
    setStarting(true)
    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: selected, dailyLimit }),
    })
    setStarting(false)
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to start campaign')
    }
    const r = await res.json()
    toast.success(`Campaign started — ${r.sent} sent${r.done ? '' : ', rest queued for the days ahead'}`)
    load()
  }

  const dismiss = async (id: string) => {
    await fetch(`/api/admin/drops/${id}/dismiss`, { method: 'POST', headers: await authHeaders() })
    load()
  }

  const cancelCampaign = async () => {
    if (!active) return
    await fetch(`/api/admin/campaigns/${active.id}/cancel`, { method: 'POST', headers: await authHeaders() })
    toast.success('Campaign cancelled')
    load()
  }

  const n = Math.min(drops.length, 3)
  const needsPick = drops.length > 3
  const canStart = !active && drops.length > 0 && selected.length >= 1 && selected.length <= 3 && (!needsPick || selected.length === 3)

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">New Drops</h1>
        <p className="text-xs text-muted-foreground">Add products and announce them to your customers</p>
      </header>

      <div className="p-6 grid gap-6 lg:grid-cols-2">
        {/* Section A — Add Product */}
        <form onSubmit={addProduct} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-bold">Add a Product</h3>

          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-surface">
              {preview
                ? <img src={preview} alt="preview" className="h-full w-full object-cover" />
                : <Sparkles className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div>
              <Label htmlFor="photo">Photo</Label>
              <Input id="photo" type="file" accept="image/*" className="mt-1"
                onChange={e => onPhoto(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={f.category} onValueChange={v => setF({ ...f, category: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fulfillment</Label>
              <Select value={f.delivery_type} onValueChange={v => setF({ ...f, delivery_type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic (Shiprocket)</SelectItem>
                  <SelectItem value="hyperlocal">Hyperlocal (Shiprocket Quick)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" min="1" required value={f.price} onChange={e => setF({ ...f, price: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="netwt">Net Weight (g)</Label>
              <Input id="netwt" type="number" min="1" value={f.net_weight_grams} onChange={e => setF({ ...f, net_weight_grams: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="shelf">Shelf Life</Label>
              <Input id="shelf" placeholder="e.g. 15 days" value={f.shelf_life} onChange={e => setF({ ...f, shelf_life: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="badge">Badge (optional)</Label>
              <Input id="badge" placeholder="e.g. NEW" value={f.badge} onChange={e => setF({ ...f, badge: e.target.value })} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="nutri">Nutrition (optional)</Label>
              <Input id="nutri" placeholder="e.g. 450 cal, 40g protein" value={f.nutrition} onChange={e => setF({ ...f, nutrition: e.target.value })} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="flavours">Flavours (optional, comma-separated)</Label>
              <Input id="flavours" placeholder="e.g. Classic, Peri Peri, Schezwan" value={f.flavours} onChange={e => setF({ ...f, flavours: e.target.value })} className="mt-1" />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-dark">
            {submitting ? 'Adding…' : 'Add Product'}
          </Button>
        </form>

        {/* Section B — Pending Drops & Campaign */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Email Campaign</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 font-mono-accent text-[11px] text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {subscribers} subscribers
            </span>
          </div>

          {active ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-mono-accent text-[10px] uppercase tracking-wider text-primary">Campaign in progress</p>
                <p className="mt-1 text-sm font-semibold">{active.products.map(p => p.name).join(', ')}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div className="h-full bg-primary" style={{ width: `${active.total ? (active.sent / active.total) * 100 : 0}%` }} />
                </div>
                <p className="mt-2 font-mono-accent text-xs text-muted-foreground">
                  {active.sent} / {active.total} sent · {active.daily_limit}/day
                </p>
              </div>
              <Button variant="outline" onClick={cancelCampaign} className="w-full">Cancel campaign</Button>
              <p className="text-xs text-muted-foreground">Finish or cancel this campaign before starting another.</p>
            </div>
          ) : drops.length === 0 ? (
            <p className="rounded-xl bg-surface p-6 text-center text-sm text-muted-foreground">
              No pending drops. Add a product to feature it in a campaign.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {needsPick
                  ? `You have ${drops.length} drops — select any 3 to feature.`
                  : `${drops.length} drop${drops.length > 1 ? 's' : ''} ready to announce.`}
              </p>

              <div className="space-y-2">
                {drops.map(d => {
                  const checked = selected.includes(d.id)
                  return (
                    <div key={d.id} className={`flex items-center gap-3 rounded-xl border p-2.5 ${checked ? 'border-primary/40 bg-primary/5' : 'border-border'}`}>
                      <Checkbox checked={checked} onCheckedChange={() => toggleSelect(d.id)} />
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                        {d.image && <img src={d.image} alt={d.name} className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{d.name}</p>
                        <p className="font-mono-accent text-[11px] text-muted-foreground">₹{d.price} · {d.category}</p>
                      </div>
                      <button onClick={() => dismiss(d.id)} aria-label="Dismiss" className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <Label htmlFor="limit" className="text-xs">Emails per day</Label>
                  <Input id="limit" type="number" min={1} max={50} value={dailyLimit}
                    onChange={e => setDailyLimit(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} className="mt-1" />
                </div>
                <p className="pt-5 text-[11px] text-muted-foreground">Max 50/day</p>
              </div>

              <Button onClick={startCampaign} disabled={!canStart || starting} className="w-full gap-2 bg-primary hover:bg-primary-dark">
                <Send className="h-4 w-4" />
                {starting ? 'Starting…' : `Start Email Campaign (${needsPick ? `${selected.length}/3` : n})`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
