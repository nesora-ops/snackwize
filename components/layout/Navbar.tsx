'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./SocialIcons";
import { useCart } from "@/context/CartContext";
import { WHATSAPP, INSTAGRAM, FACEBOOK } from "@/lib/data";

// Login, sign-up and the account portal are intentionally absent for the stall
// event — the pages still work at their URLs, they are just not linked here.
const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
] as const;

const SOCIALS = [
  { href: INSTAGRAM, label: "Instagram", Icon: InstagramIcon },
  { href: WHATSAPP,  label: "WhatsApp",  Icon: WhatsAppIcon  },
  { href: FACEBOOK,  label: "Facebook",  Icon: FacebookIcon  },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  const isMenuPage = pathname === "/menu";

  // Track scroll to transition navbar from transparent → opaque on /menu
  useEffect(() => {
    if (!isMenuPage) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuPage]);

  // On menu page: always transparent background
  const isTransparentBg = isMenuPage;
  // On menu page: text is white if scrolled, black if not. On other pages: default.
  const isWhiteText = isMenuPage && scrolled;
  const isBlackText = isMenuPage && !scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        isTransparentBg
          ? "border-b border-transparent bg-transparent backdrop-blur-none"
          : "border-b border-border/60 bg-background/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-9 w-9" />
          <span
            className={`font-display text-2xl font-bold transition-colors duration-500 ${
              isWhiteText ? "text-white" : "text-primary-dark"
            }`}
          >
            Snackwize
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href))
                  ? "text-primary"
                  : isWhiteText ? "text-white/80 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/70 shadow-sm ring-1 ring-border/60 backdrop-blur transition hover:scale-105 hover:bg-background"
            >
              <Icon size={20} />
            </a>
          ))}

          <Link
            href="/order"
            className={`relative ml-1 rounded-full p-2 transition inline-flex ${
              isWhiteText ? "text-white/70 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/70 hover:bg-primary-light hover:text-primary-dark"
            }`}
            aria-label="Your bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono-accent text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <Link href="/order" className="hidden sm:inline-flex">
            <Button size="sm" className="bg-primary hover:bg-primary-dark border-none">Order Now</Button>
          </Link>

          <button
            className={`rounded-full p-2 md:hidden ${isWhiteText ? "text-white" : isBlackText ? "text-black" : ""}`}
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
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
            <Link href="/order" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full bg-primary hover:bg-primary-dark">Order Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
