'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type Customer = { id: string; name: string; phone: string; orders: number; spent: number; joined: string }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const res = await fetch(`/api/admin/customers?limit=50&offset=${(page - 1) * 50}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        setCustomers(await res.json())
        setTotalCount(Number(res.headers.get('X-Total-Count')) || 0)
      }
    })
  }, [page])

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
      </header>

      <div className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Spent</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 font-mono-accent text-xs">{c.phone}</td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{c.spent}</td>
                  <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Showing {customers.length} customers (Total: {totalCount})</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page * 50 >= totalCount} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
