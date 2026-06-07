'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Customer guard: checks snackwize_user (set by setUser() in auth.ts)
export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter()
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('snackwize_user')
    if (!isLoggedIn) router.push(redirectTo)
  }, [router, redirectTo])
}

// Admin guard: checks snackwize_admin (set by setAdmin(true) in auth.ts)
export function useAdminGuard() {
  const router = useRouter()
  useEffect(() => {
    const isAdmin = localStorage.getItem('snackwize_admin')
    if (isAdmin !== 'true') router.push('/admin/login')
  }, [router])
}
