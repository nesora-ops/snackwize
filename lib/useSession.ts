'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getUser, toMockUser, type MockUser } from './auth'

export type Session = {
  user: MockUser | null
  /** True until the first session read settles, so UI can avoid flashing "signed out". */
  loading: boolean
}

// Thin hook over lib/auth.ts's module cache. That module already mirrors
// onAuthStateChange and announces changes on the 'snackwize-auth' window event;
// this only adds the first read (the event may fire before a component mounts)
// and the re-render.
export function useSession(): Session {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const sync = () => setUser(getUser())
    window.addEventListener('snackwize-auth', sync)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setUser(session?.user ? toMockUser(session.user) : null)
      setLoading(false)
    })

    return () => {
      cancelled = true
      window.removeEventListener('snackwize-auth', sync)
    }
  }, [])

  return { user, loading }
}

// The repo's established way to call an API route as the logged-in user:
// a Bearer access token that lib/api.ts's getUser() resolves server-side.
export function useAuthHeader() {
  return useCallback(async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session ? { Authorization: `Bearer ${session.access_token}` } : {}
  }, [])
}
