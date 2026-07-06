import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

// Browser Supabase client. Uses @supabase/ssr so the auth session is stored in
// a cookie (instead of localStorage) and can be scoped to a parent domain via
// NEXT_PUBLIC_COOKIE_DOMAIN (e.g. ".snackwize.co.in"). That lets the marketing
// site and the app.* subdomain share a single login.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!_supabase) {
      _supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookieOptions: {
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
          },
        }
      )
    }
    return Reflect.get(_supabase, prop, receiver)
  },
})
