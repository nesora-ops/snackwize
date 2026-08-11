'use client'

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

/**
 * Wraps public-facing website pages with Navbar + Footer.
 * Portal pages (/app/*) get none of that — they have their own layout.
 * /order is the stall ordering page: self-contained, its own header, and no
 * footer or chat bubble competing with the sticky order bar.
 * The /menu page has its own embedded footer at the end of its scroll.
 */
export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/app/") || pathname === "/app";
  const isAdmin = pathname.startsWith("/admin");
  const isOrder = pathname === "/order";
  const isMenuPage = pathname === "/menu";
  const isAuth = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname);

  if (isPortal || isAdmin || isOrder) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!isMenuPage && !isAuth && <Footer />}
      <WhatsAppFab />
    </>
  );
}
