'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'

export default function Unsubscribe() {
  const [state, setState] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id) { setState('error'); return }
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(r => setState(r.ok ? 'done' : 'error'))
      .catch(() => setState('error'))
  }, [])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16 text-center">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
        {state === 'loading' && <p className="mt-4 text-sm text-muted-foreground">Updating your preferences…</p>}
        {state === 'done' && (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold">You’re unsubscribed</h1>
            <p className="mt-2 text-sm text-muted-foreground">You won’t receive new-drop emails anymore. You’ll still get order updates.</p>
          </>
        )}
        {state === 'error' && (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold">Link not valid</h1>
            <p className="mt-2 text-sm text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
          </>
        )}
        <p className="mt-6 text-sm">
          <Link href="/app/menu" className="font-semibold text-primary hover:text-primary-dark">Back to Snackwize</Link>
        </p>
      </div>
    </div>
  )
}
