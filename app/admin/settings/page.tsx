'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { X } from 'lucide-react'

type Pincode = { pincode: string; area: string | null }
type Box = { l: number; b: number; h: number; buffer_g: number }

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}

export default function AdminSettingsPage() {
  const [pincodes, setPincodes] = useState<Pincode[]>([])
  const [newPin, setNewPin] = useState('')
  const [newArea, setNewArea] = useState('')
  const [box, setBox] = useState<Box>({ l: 20, b: 15, h: 10, buffer_g: 50 })
  const [acceptingHyperlocal, setAcceptingHyperlocal] = useState(true)

  const load = useCallback(async () => {
    const headers = await authHeaders()
    const [p, b, statusRes] = await Promise.all([
      fetch('/api/admin/hyperlocal-pincodes', { headers }).then(r => r.json()),
      fetch('/api/admin/parcel-box', { headers }).then(r => r.json()),
      fetch('/api/admin/hyperlocal-status', { headers }).then(r => r.json()),
    ])
    setPincodes(Array.isArray(p) ? p : [])
    if (b && typeof b === 'object') setBox(b)
    if (statusRes && typeof statusRes.accepting === 'boolean') setAcceptingHyperlocal(statusRes.accepting)
  }, [])

  const toggleHyperlocal = async (v: boolean) => {
    const res = await fetch('/api/admin/hyperlocal-status', {
      method: 'PATCH',
      headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepting: v }),
    })
    if (!res.ok) return toast.error('Failed to update status')
    setAcceptingHyperlocal(v)
    toast.success(v ? 'Hyperlocal orders resumed' : 'Hyperlocal orders suspended')
  }

  useEffect(() => { load() }, [load])

  const addPin = async () => {
    if (!/^\d{6}$/.test(newPin)) return toast.error('Enter a valid 6-digit pincode')
    const res = await fetch('/api/admin/hyperlocal-pincodes', {
      method: 'POST',
      headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: newPin, area: newArea || null }),
    })
    if (!res.ok) { const { error } = await res.json().catch(() => ({ error: null })); return toast.error(error ?? 'Failed') }
    setNewPin(''); setNewArea(''); load()
  }

  const removePin = async (pincode: string) => {
    await fetch(`/api/admin/hyperlocal-pincodes?pincode=${pincode}`, { method: 'DELETE', headers: await authHeaders() })
    setPincodes(cur => cur.filter(p => p.pincode !== pincode))
  }

  const saveBox = async () => {
    const res = await fetch('/api/admin/parcel-box', {
      method: 'PATCH',
      headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
      body: JSON.stringify(box),
    })
    if (!res.ok) return toast.error('Failed to save box')
    toast.success('Default parcel box saved')
  }

  return (
    <main className="flex-1 overflow-x-hidden">
      <header className="border-b border-border bg-background px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground">Hyperlocal delivery area & shipping defaults</p>
      </header>

      <div className="p-6 grid gap-6 lg:grid-cols-2">
        {/* Hyperlocal pincodes */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Hyperlocal (same-day) pincodes</h3>
          <p className="mt-1 text-xs text-muted-foreground">Same-day items deliver only to these pincodes (Borzo / Shiprocket Quick).</p>

          <div className="mt-4 flex gap-2">
            <Input placeholder="400001" value={newPin} onChange={e => setNewPin(e.target.value)} className="w-28" />
            <Input placeholder="Area (optional)" value={newArea} onChange={e => setNewArea(e.target.value)} className="flex-1" />
            <Button onClick={addPin} className="bg-primary hover:bg-primary-dark">Add</Button>
          </div>

          <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {pincodes.map(p => (
                  <tr key={p.pincode} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono-accent">{p.pincode}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.area ?? '—'}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => removePin(p.pincode)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-surface"><X className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
                {pincodes.length === 0 && <tr><td className="px-3 py-4 text-center text-muted-foreground" colSpan={3}>No pincodes yet</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{pincodes.length} serviceable pincodes</p>
        </div>

        {/* Hyperlocal Operations */}
        <div className="rounded-2xl border border-border bg-card p-6 h-fit">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Hyperlocal operations</h3>
              <p className="mt-1 text-xs text-muted-foreground">Toggle to instantly mark all hyperlocal products as sold out.</p>
            </div>
            <Switch checked={acceptingHyperlocal} onCheckedChange={toggleHyperlocal} />
          </div>
          {!acceptingHyperlocal && (
            <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm font-semibold text-red-600">
              Hyperlocal orders are currently suspended. All same-day items show as "Sold out - Come back tomorrow!".
            </p>
          )}
        </div>

        {/* Default parcel box */}
        <div className="rounded-2xl border border-border bg-card p-6 h-fit">
          <h3 className="font-display text-lg font-bold">Default parcel box</h3>
          <p className="mt-1 text-xs text-muted-foreground">Used for courier rate/booking. Weight = product net weights + buffer.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><Label>Length (cm)</Label><Input type="number" value={box.l} onChange={e => setBox({ ...box, l: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Breadth (cm)</Label><Input type="number" value={box.b} onChange={e => setBox({ ...box, b: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Height (cm)</Label><Input type="number" value={box.h} onChange={e => setBox({ ...box, h: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Packaging buffer (g)</Label><Input type="number" value={box.buffer_g} onChange={e => setBox({ ...box, buffer_g: Number(e.target.value) })} className="mt-1" /></div>
          </div>
          <Button onClick={saveBox} className="mt-4 bg-primary hover:bg-primary-dark">Save box</Button>
        </div>
      </div>
    </main>
  )
}
