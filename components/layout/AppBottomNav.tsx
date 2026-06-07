'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Tag, MapPin } from "lucide-react";

const TABS = [
  { href: "/app/menu",      label: "Menu",      Icon: Home      },
  { href: "/app/new-drops", label: "New Drops", Icon: Sparkles  },
  { href: "/app/offers",    label: "Offers",    Icon: Tag       },
  { href: "/app/track",     label: "Track",     Icon: MapPin    },
] as const;

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#fff",
        borderTop: "1px solid #f0ece8",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.07)",
      }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "10px",
              gap: "4px",
              textDecoration: "none",
              color: active ? "#F97316" : "#9E9083",
              transition: "color 0.2s",
              position: "relative",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "28px",
                  height: "3px",
                  borderRadius: "0 0 3px 3px",
                  backgroundColor: "#F97316",
                }}
              />
            )}
            <Icon size={22} strokeWidth={active ? 2.2 : 1.7} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: active ? 700 : 500,
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
