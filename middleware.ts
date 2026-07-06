import { NextRequest, NextResponse } from 'next/server'

// The ordering app lives ONLY on the app.* subdomain; the marketing site lives
// on the root domain. This middleware enforces that split and auth-gates the
// app, so a visitor's login and cart never straddle two origins.
//
//   • Consolidation (production only, when NEXT_PUBLIC_PORTAL_URL is set):
//       root domain  + /app/*        → app subdomain
//       app subdomain + marketing    → root domain
//   • App subdomain entry (shop-first):
//       "/"                            → menu (the app home, open to everyone)
//       /login|/signup while logged in → menu
//     The menu & cart are open to logged-out users; login is enforced only at
//     checkout (see the checkout page's client guard).
//
// Login state is read from the shared Supabase session cookie (no network call).

const AUTH_COOKIE = /^sb-.+-auth-token(\.\d+)?$/
const MARKETING_PATHS = ['/about', '/menu', '/testimonials', '/contact']
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || ''

function isLoggedIn(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => AUTH_COOKIE.test(c.name) && !!c.value)
}

function isMarketingPath(pathname: string): boolean {
  return MARKETING_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isAppHost = host.startsWith('app.')
  const url = request.nextUrl
  const { pathname } = url

  // ── Consolidate the app onto the subdomain (production only) ──
  if (PORTAL_URL) {
    // Marketing origin: any /app/* URL belongs on the app subdomain.
    if (!isAppHost && pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL(pathname + url.search, PORTAL_URL))
    }
    // App subdomain: marketing pages belong on the root domain (derive the
    // root origin from PORTAL_URL by dropping its "app." label).
    if (isAppHost && isMarketingPath(pathname)) {
      const rootOrigin = PORTAL_URL.replace('//app.', '//')
      return NextResponse.redirect(new URL(pathname + url.search, rootOrigin))
    }
  }

  // ── App subdomain entry (shop-first; menu & cart open to logged-out) ──
  if (isAppHost) {
    const to = (path: string) => {
      const dest = url.clone()
      dest.pathname = path
      return NextResponse.redirect(dest)
    }
    // The menu is the app home.
    if (pathname === '/') return to('/app/menu')
    // Don't leave a logged-in user sitting on the auth screens.
    if (isLoggedIn(request) && (pathname === '/login' || pathname === '/signup')) {
      return to('/app/menu')
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run on all pages except API routes, Next internals, and static assets.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt)).*)',
  ],
}
