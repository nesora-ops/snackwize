'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Instagram, MessageCircle, Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { getUser, logout, type MockUser } from "@/lib/auth";
import { WHATSAPP, INSTAGRAM } from "@/lib/data";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setU] = useState<MockUser | null>(null);
  const { count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setU(getUser());
    sync();
    window.addEventListener("snackwize-auth", sync);
    return () => window.removeEventListener("snackwize-auth", sync);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-9 w-9" />
          <span className="font-display text-2xl font-bold text-primary-dark">Snackwize</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition hover:text-primary ${
                (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href))
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hidden rounded-full p-2 text-foreground/70 transition hover:bg-primary-light hover:text-primary-dark sm:inline-flex" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hidden rounded-full p-2 text-foreground/70 transition hover:bg-primary-light hover:text-primary-dark sm:inline-flex" aria-label="WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </a>

          <Link href="/menu" className="relative hidden rounded-full p-2 text-foreground/70 transition hover:bg-primary-light hover:text-primary-dark sm:inline-flex" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono-accent text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hidden text-sm font-medium text-foreground/80 hover:text-primary sm:inline">
                Hi, {user.name.split(" ")[0]}
              </Link>
              <Button size="sm" variant="outline" onClick={() => logout()} className="hidden sm:inline-flex">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-foreground/80 hover:text-primary sm:inline">Login</Link>
              <Link href="/signup" className="hidden sm:inline-flex">
                <Button size="sm" className="bg-primary hover:bg-primary-dark">Sign up</Button>
              </Link>
            </>
          )}

          <button className="rounded-full p-2 md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full"><User className="mr-2 h-4 w-4" />Dashboard</Button></Link>
                  <Button onClick={() => { logout(); setOpen(false); }} className="flex-1 bg-primary hover:bg-primary-dark">Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full bg-primary hover:bg-primary-dark">Sign up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}