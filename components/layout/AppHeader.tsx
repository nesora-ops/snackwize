'use client'

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Download, UserRound } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { InstallAppButton } from "./InstallAppButton";
import { useSession } from "@/lib/useSession";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack }: AppHeaderProps) {
  const { count } = useCart();
  const pathname = usePathname();
  const { user } = useSession();

  // Derive a nice title from the route if none given
  const derivedTitle = title ?? (() => {
    if (pathname.includes("new-drops")) return "New Drops";
    if (pathname.includes("offers")) return "Offers";
    if (pathname.includes("orders")) return "Your Orders";
    if (pathname.includes("checkout")) return "Checkout";
    if (pathname.includes("account")) return "My Account";
    return "Menu";
  })();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0ece8",
        padding: "0 16px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: back or spacer */}
      <div style={{ width: "40px", display: "flex", alignItems: "center" }}>
        {showBack ? (
          <Link
            href="#"
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            style={{ color: "#1C1917", display: "flex" }}
          >
            <ArrowLeft size={22} />
          </Link>
        ) : null}
      </div>

      {/* Center: "Snack·o" style brand */}
      <Link href="/app/menu" style={{ textDecoration: "none" }}>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#1C1917",
            letterSpacing: "-0.02em",
          }}
        >
          Snack<span style={{ color: "#F97316" }}>wize</span>
        </span>
      </Link>

      {/* Right: cart */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
        <InstallAppButton>
          <button style={{
            background: "none",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "4px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#1C1917",
            fontSize: "13px",
            fontWeight: 600,
          }}>
            <Download size={15} strokeWidth={2} />
            Install
          </button>
        </InstallAppButton>
        <Link href="/app/menu" aria-label="Your bag" style={{ position: "relative", color: "#1C1917", display: "flex" }}>
          <ShoppingBag size={22} strokeWidth={1.8} />
          {count > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                backgroundColor: "#F97316",
                color: "#fff",
                borderRadius: "999px",
                minWidth: "16px",
                height: "16px",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 3px",
              }}
            >
              {count}
            </span>
          )}
        </Link>
        {/* Signing in is optional: it unlocks saved details and order history,
            and guests order without ever seeing this. */}
        <Link
          href="/app/account"
          aria-label={user ? "Your account" : "Sign in"}
          style={{ color: user ? "#F97316" : "#1C1917", display: "flex" }}
        >
          <UserRound size={22} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  );
}
