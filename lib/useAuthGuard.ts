'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'

export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push(redirectTo)
    })
  }, [router, redirectTo])
}

export function useAdminGuard() {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const role = data.session?.user?.user_metadata?.role
      if (role !== 'admin') router.push('/admin/login')
    })
  }, [router])
}
