'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Instagram, MessageCircle, Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { InstallAppButton } from "./InstallAppButton";
import { useCart } from "@/context/CartContext";
import { getUser, logout, type MockUser } from "@/lib/auth";
import { WHATSAPP, INSTAGRAM } from "@/lib/data";
import { toast } from "sonner";

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
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const isMenuPage = pathname === "/menu";

  useEffect(() => {
    const sync = () => setU(getUser());
    sync();
    window.addEventListener("snackwize-auth", sync);
    return () => window.removeEventListener("snackwize-auth", sync);
  }, []);

  // Track scroll to transition navbar from transparent → opaque on /menu
  useEffect(() => {
    if (!isMenuPage) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuPage]);

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast("Please login to view your cart 🛒", {
        description: "Your items are saved — log in to checkout.",
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      router.push("/login");
    }
  };

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

        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className={`hidden rounded-full p-2 transition sm:inline-flex ${
              isWhiteText ? "text-white/70 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/70 hover:bg-primary-light hover:text-primary-dark"
            }`}
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className={`hidden rounded-full p-2 transition sm:inline-flex ${
              isWhiteText ? "text-white/70 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/70 hover:bg-primary-light hover:text-primary-dark"
            }`}
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          <Link
            href="/cart"
            onClick={handleCartClick}
            className={`relative rounded-full p-2 transition inline-flex ${
              isWhiteText ? "text-white/70 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/70 hover:bg-primary-light hover:text-primary-dark"
            }`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono-accent text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <InstallAppButton variant="outline" className={`hidden sm:inline-flex ${isMenuPage ? "text-black border-black/20 bg-white/90 hover:bg-white" : ""}`} />
              <Link
                href="/app/menu"
                className={`hidden text-sm font-medium transition sm:inline ${
                  isWhiteText ? "text-white/80 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                Hi, {user.name.split(" ")[0]}
              </Link>
              <Button size="sm" variant="outline" onClick={() => logout()} className={`hidden sm:inline-flex ${isMenuPage ? "text-black border-black/20 bg-white/90 hover:bg-white" : ""}`}>Logout</Button>
            </>
          ) : (
            <>
              <InstallAppButton variant="outline" className={`hidden sm:inline-flex ${isMenuPage ? "text-black border-black/20 bg-white/90 hover:bg-white" : ""}`} />
              <Link
                href="/login"
                className={`hidden text-sm font-medium transition sm:inline ${
                  isWhiteText ? "text-white/80 hover:text-white" : isBlackText ? "text-black hover:text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Link href="/signup" className="hidden sm:inline-flex">
                <Button size="sm" className="bg-primary hover:bg-primary-dark border-none">Sign up</Button>
              </Link>
            </>
          )}

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