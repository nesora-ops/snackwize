'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Product = { id: string; name: string; category: string; price: number; in_stock: boolean }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  const toggleStock = async (id: string, in_stock: boolean) => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/admin/inventory/toggle', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session!.access_token}` },
      body: JSON.stringify({ productId: id, in_stock }),
    })
    setProducts(cur => cur.map(p => p.id === id ? { ...p, in_stock } : p))
  }

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Products</h1>
            <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
          </div>
          <Link href="/admin/inventory" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
            Full Inventory <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <Switch checked={p.in_stock} onCheckedChange={v => toggleStock(p.id, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
