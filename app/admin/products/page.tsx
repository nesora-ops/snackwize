'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/data'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowRight, Pencil } from 'lucide-react'

type Product = {
  id: string; name: string; category: string; description: string | null; price: number
  net_weight_grams: number | null; shelf_life: string | null
  delivery_type: 'domestic' | 'hyperlocal'; nutrition: string | null; badge: string | null
  image: string | null; in_stock: boolean; flavours: string[] | null
  instagram_url: string | null
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [editFlavours, setEditFlavours] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/products', { cache: 'no-store' }).then(r => r.json()).then(setProducts)
  useEffect(() => { load() }, [])

  const toggleStock = async (id: string, in_stock: boolean) => {
    await fetch('/api/admin/inventory/toggle', {
      method: 'PATCH',
      headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, in_stock }),
    })
    setProducts(cur => cur.map(p => p.id === id ? { ...p, in_stock } : p))
  }

  const openEdit = (p: Product) => { setEditing({ ...p }); setPhoto(null); setEditFlavours((p.flavours ?? []).join(', ')) }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    const fd = new FormData()
    fd.set('name', editing.name)
    fd.set('category', editing.category)
    fd.set('description', editing.description ?? '')
    fd.set('price', String(editing.price))
    if (editing.net_weight_grams != null) fd.set('net_weight_grams', String(editing.net_weight_grams))
    fd.set('shelf_life', editing.shelf_life ?? '')
    fd.set('delivery_type', editing.delivery_type)
    fd.set('nutrition', editing.nutrition ?? '')
    fd.set('badge', editing.badge ?? '')
    fd.set('instagram_url', editing.instagram_url ?? '')
    fd.set('flavours', editFlavours)
    if (photo) fd.set('photo', photo)

    const res = await fetch(`/api/admin/products/${editing.id}`, {
      method: 'PATCH', headers: await authHeaders(), body: fd,
    })
    setSaving(false)
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }))
      return toast.error(error ?? 'Failed to save')
    }
    toast.success('Product updated')
    setEditing(null)
    load()
  }

  const set = (patch: Partial<Product>) => setEditing(e => e ? { ...e, ...patch } : e)

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Products</h1>
            <p className="text-xs text-muted-foreground">All products — edit any detail. Add new ones from New Drops.</p>
          </div>
          <Link href="/admin/inventory" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
            Full Inventory <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">In Stock</th>
                <th className="px-4 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface">
                        {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{p.price}</td>
                  <td className="px-4 py-3"><Switch checked={p.in_stock} onCheckedChange={v => toggleStock(p.id, v)} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-surface"><Pencil className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={v => !v && setEditing(null)}>
        <DialogContent className="max-w-lg">
          {editing && (
            <>
              <DialogHeader><DialogTitle className="font-display text-xl">Edit {editing.name}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <Label>Name</Label>
                  <Input value={editing.name} onChange={e => set({ name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={v => set({ category: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fulfillment</Label>
                  <Select value={editing.delivery_type} onValueChange={v => set({ delivery_type: v as 'domestic' | 'hyperlocal' })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Domestic (Shiprocket)</SelectItem>
                      <SelectItem value="hyperlocal">Hyperlocal (Shiprocket Quick)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" min="1" value={editing.price} onChange={e => set({ price: Number(e.target.value) })} className="mt-1" />
                </div>
                <div>
                  <Label>Net Weight (g)</Label>
                  <Input type="number" min="1" value={editing.net_weight_grams ?? ''} onChange={e => set({ net_weight_grams: e.target.value ? Number(e.target.value) : null })} className="mt-1" />
                </div>
                <div>
                  <Label>Shelf Life</Label>
                  <Input value={editing.shelf_life ?? ''} onChange={e => set({ shelf_life: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Badge</Label>
                  <Input value={editing.badge ?? ''} onChange={e => set({ badge: e.target.value })} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Input value={editing.description ?? ''} onChange={e => set({ description: e.target.value })} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Nutrition</Label>
                  <Input value={editing.nutrition ?? ''} onChange={e => set({ nutrition: e.target.value })} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Instagram post URL</Label>
                  <Input value={editing.instagram_url ?? ''} onChange={e => set({ instagram_url: e.target.value })} placeholder="https://www.instagram.com/snackwize_/reel/..." className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Flavours (comma-separated)</Label>
                  <Input value={editFlavours} onChange={e => setEditFlavours(e.target.value)} placeholder="e.g. Classic, Peri Peri" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Replace Photo (optional)</Label>
                  <Input type="file" accept="image/*" className="mt-1" onChange={e => setPhoto(e.target.files?.[0] ?? null)} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={saveEdit} disabled={saving} className="bg-primary hover:bg-primary-dark">{saving ? 'Saving…' : 'Save'}</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
