'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter()
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('snackwize_auth')
    if (!isLoggedIn) router.push(redirectTo)
  }, [router, redirectTo])
}

export function useAdminGuard() {
  const router = useRouter()
  useEffect(() => {
    const isAdmin = localStorage.getItem('snackwize_admin_auth')
    if (!isAdmin) router.push('/admin/login')
  }, [router])
}
