import { NextRequest, NextResponse } from 'next/server'
import { createServerUserClient } from '@/lib/supabase.server'

// Google OAuth return leg. Dormant until the Google provider is enabled in
// Supabase — see components/auth/GoogleSignInButton.tsx. createServerUserClient writes the session cookie with
// cookieOptions.domain from NEXT_PUBLIC_COOKIE_DOMAIN, so one sign-in here is
// valid on both the marketing origin and the app.* subdomain.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  // Only same-origin paths — an absolute ?next= would make this an open redirect.
  const requested = searchParams.get('next') ?? '/order'
  const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/order'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', origin))
  }

  const supabase = createServerUserClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback]', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
  }

  return NextResponse.redirect(new URL(next, origin))
}
