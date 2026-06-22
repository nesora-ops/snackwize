'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'

// Returns { loading } so pages can render a spinner instead of flashing
// protected content (or a blank screen) before the session resolves.
export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push(redirectTo)
        return
      }
      setLoading(false)
    })
  }, [router, redirectTo])

  return { loading }
}

export function useAdminGuard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const role = data.session?.user?.app_metadata?.role
      if (role !== 'admin') {
        router.push('/admin/login')
        return
      }
      setLoading(false)
    })
  }, [router])

  return { loading }
}
