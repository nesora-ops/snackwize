import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { ConditionalShell } from '@/components/layout/ConditionalShell'
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar'
import { Analytics } from '@vercel/analytics/next'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans',
  display: 'swap'
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Snackwize — Guilt-Free Baked Snacks Delivered Pan India',
  description: 'Homemade healthy baked snacks delivered across India. No preservatives, made with love by Nupur.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Snackwize',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <CartProvider>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </CartProvider>
        {/* Vercel Web Analytics — page views for every route, marketing site
            and app subdomain alike. Still has to be switched on in the Vercel
            project for the data to be collected. */}
        <Analytics />
      </body>
    </html>
  )
}
