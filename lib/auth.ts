import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export type MockUser = { name: string; email: string; phone?: string }

let _user: MockUser | null = null
let _isAdmin = false

function toMockUser(u: User): MockUser {
  return {
    name: u.user_metadata?.name ?? u.email?.split('@')[0] ?? 'User',
    email: u.email ?? '',
    phone: u.user_metadata?.phone,
  }
}

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((_, session) => {
    _user = session?.user ? toMockUser(session.user) : null
    _isAdmin = session?.user?.app_metadata?.role === 'admin'
    window.dispatchEvent(new Event('snackwize-auth'))
  })
}

export function getUser(): MockUser | null {
  return _user
}

export function logout() {
  supabase.auth.signOut()
}

export function isAdmin(): boolean {
  return _isAdmin
}
