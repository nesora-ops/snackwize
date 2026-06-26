'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type InventoryLog = {
  id: string;
  product_id: string;
  action: string;
  changed_by: string;
  note: string | null;
  created_at: string;
  products: { name: string } | null;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const res = await fetch(`/api/admin/inventory/logs?limit=50&offset=${(page - 1) * 50}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        setLogs(await res.json())
        setTotalCount(Number(res.headers.get('X-Total-Count')) || 0)
      }
    })
  }, [page])

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Audit Logs</h1>
        <p className="text-xs text-muted-foreground">Track changes to your inventory and products</p>
      </header>

      <div className="p-6">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Changed By</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-semibold">{log.products?.name ?? log.product_id}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border bg-surface px-2 py-1 font-mono-accent text-[10px] uppercase">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{log.changed_by}</td>
                  <td className="px-4 py-3 text-muted-foreground italic">{log.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Showing {logs.length} logs (Total: {totalCount})</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page * 50 >= totalCount} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
