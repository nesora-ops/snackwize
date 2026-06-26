'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/layout/Logo'
import { logout } from '@/lib/auth'
import { useAdminGuard } from '@/lib/useAuthGuard'
import {
  LayoutDashboard, ShoppingCart, Package, Sparkles, Boxes, Users, BarChart3, LogOut,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Orders',    icon: ShoppingCart,    href: '/admin/orders' },
  { label: 'New Drops', icon: Sparkles,        href: '/admin/new-drops' },
  { label: 'Products',  icon: Package,         href: '/admin/products' },
  { label: 'Inventory', icon: Boxes,           href: '/admin/inventory' },
  { label: 'Customers', icon: Users,           href: '/admin/customers' },
  { label: 'Analytics', icon: BarChart3,       href: '/admin/analytics' },
]

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAdminGuard()
  const pathname = usePathname()
  const router = useRouter()
  const [soldOutCount, setSoldOutCount] = useState(0)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((products: { in_stock: boolean }[]) => {
        setSoldOutCount(products.filter(p => !p.in_stock).length)
      })
  }, [])

  const logoutAdmin = () => { logout(); router.push('/admin/login') }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
          <Logo className="h-8 w-8" />
          <div>
            <p className="font-display text-lg font-bold leading-none">Snackwize</p>
            <p className="font-mono-accent text-[10px] uppercase tracking-wider text-primary">Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5">
          {NAV.map(n => {
            const active = pathname.startsWith(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
                {n.label === 'Inventory' && soldOutCount > 0 && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
            )
          })}
        </nav>
        <button onClick={logoutAdmin} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
          {NAV.map(n => {
            const active = pathname.startsWith(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-label={n.label}
                className={`relative grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-primary text-primary-foreground' : 'bg-surface'}`}
              >
                <n.icon className="h-4 w-4" />
                {n.label === 'Inventory' && soldOutCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Link>
            )
          })}
          <button onClick={logoutAdmin} aria-label="Logout" className="ml-auto grid h-9 w-9 place-items-center rounded-lg bg-surface text-destructive">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') return <>{children}</>
  return <ProtectedShell>{children}</ProtectedShell>
}
