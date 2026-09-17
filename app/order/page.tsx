'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { X, Menu, User } from 'lucide-react'
import { INSTAGRAM, FACEBOOK, WHATSAPP } from '@/lib/data'
import { Storefront } from '@/components/order/Storefront'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from '@/components/layout/SocialIcons'
import { Logo } from '@/components/layout/Logo'
import { useSession } from '@/lib/useSession'
import { appHref } from '@/lib/portal'

const ORANGE = '#F97316'

// /order has no site chrome, so it carries its own way back to the rest of the site.
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
] as const

const navItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '14px 20px',
  fontSize: '15px',
  fontWeight: 600,
  color: '#1C1917',
  textDecoration: 'none',
  borderBottom: '1px solid #F7F4F1',
}

function OrderPageBody() {
  const [navOpen, setNavOpen] = useState(false)
  const { user } = useSession()
  const params = useSearchParams()

  // Set by "Order again", which refills the cart and sends the customer here.
  const openSheet = params.get('checkout') === '1'

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#FAFAF8', maxWidth: '520px', margin: '0 auto' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#fff',
          borderBottom: '1px solid #F0ECE8',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Logo className="h-8 w-8" />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: 700, color: '#1C1917', letterSpacing: '-0.02em' }}>
            Snack<span style={{ color: ORANGE }}>wize</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: 'flex' }}><InstagramIcon size={22} /></a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ display: 'flex' }}><FacebookIcon size={22} /></a>
          <button
            onClick={() => setNavOpen((o) => !o)}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#1C1917', display: 'flex' }}
          >
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {navOpen && (
        <nav style={{ position: 'sticky', top: '56px', zIndex: 39, backgroundColor: '#fff', borderBottom: '1px solid #F0ECE8', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setNavOpen(false)} style={navItemStyle}>
              {label}
            </Link>
          ))}

          {/* Signing in is optional — it only unlocks saved details and history. */}
          {user ? (
            <>
              <a href={appHref('/app/orders')} style={navItemStyle}>My orders</a>
              <a href={appHref('/app/account')} style={{ ...navItemStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> {user.name}
              </a>
            </>
          ) : (
            <Link href="/login" onClick={() => setNavOpen(false)} style={navItemStyle}>
              Sign in
            </Link>
          )}

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', fontSize: '15px', fontWeight: 600, color: '#1C1917', textDecoration: 'none' }}
          >
            <WhatsAppIcon size={18} /> Chat on WhatsApp
          </a>
        </nav>
      )}

      <Storefront openSheetOnMount={openSheet} />
    </div>
  )
}

export default function OrderPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <OrderPageBody />
    </Suspense>
  )
}
