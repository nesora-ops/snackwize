'use client'

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { InstallAppButton } from "@/components/layout/InstallAppButton";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";

// Customers sign in with an email and a password — no confirmation mail, no OTP.
// The form toggles between signing in and creating an account, so /signup is no
// longer linked from anywhere. Admins still use /admin/login, which this page
// deliberately does not surface.
export default function Login() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Sign in to save your details and see past orders
        </p>

        <div className="mt-6">
          <EmailAuthForm next="/app/menu" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          You don&apos;t need an account to order —{" "}
          <Link href="/order" className="font-semibold text-primary hover:text-primary-dark">
            order as a guest
          </Link>
          .
        </p>

        <div className="mt-6 border-t border-border pt-5">
          <InstallAppButton variant="outline" className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
}
