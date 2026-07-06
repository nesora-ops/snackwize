'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { InstallAppButton } from "@/components/layout/InstallAppButton";
import { supabase } from "@/lib/supabase";
import { PORTAL_URL } from "@/lib/portal";

const CART_KEY = "snackwize_cart";

function hasCartItems(): boolean {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return false;
    const items = JSON.parse(raw);
    return Array.isArray(items) && items.length > 0;
  } catch {
    return false;
  }
}

export default function Login() {
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);
    const name = data.user.user_metadata?.name ?? email.split('@')[0];
    toast.success(`Welcome back, ${name.split(" ")[0]}! 🧡`);

    if (data.user.app_metadata?.role === 'admin') {
      nav.push("/admin/dashboard");
      return;
    }

    // Land in the app on the subdomain (prod). The shared cookie means the
    // portal recognises this login instantly. Locally, stay same-origin.
    const dest = hasCartItems() ? "/app/cart" : "/app/menu";
    if (PORTAL_URL) window.location.assign(PORTAL_URL + dest);
    else nav.push(dest);
  };

  return (
    <>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
          <h1 className="mt-4 text-center font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Log in to continue snacking</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
            <Button type="submit" id="login-submit" className="w-full bg-primary hover:bg-primary-dark">Login</Button>
          </form>

          <p className="mt-3 text-center text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
          </p>

          <button disabled className="mt-3 w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-70">
            Continue with Google · Coming Soon
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link href="/signup" className="font-semibold text-primary hover:text-primary-dark">Create an account</Link>
          </p>

          <div className="mt-6 border-t border-border pt-5">
            <InstallAppButton variant="outline" className="w-full justify-center" />
          </div>
          <p className="mt-4 text-center text-[10px] font-mono-accent uppercase tracking-wider text-muted-foreground">Auth powered by Supabase — coming soon</p>
        </div>
      </div>
    </>
  );
}
