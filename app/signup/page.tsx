'use client'

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/layout/Logo";
import { supabase } from "@/lib/supabase";

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

export default function Signup() {
  const nav = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return toast.error("Please accept the terms");
    if (f.password !== f.confirm) return toast.error("Passwords don't match");

    const { data, error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: { data: { name: f.name, phone: f.phone } },
    });

    if (error) return toast.error(error.message);

    if (data.session) {
      await supabase.from('profiles').insert({ id: data.user!.id, name: f.name, phone: f.phone });
      toast.success("Account created!");
      if (hasCartItems()) {
        nav.push("/cart");
      } else {
        nav.push("/app/menu");
      }
    } else {
      toast.success("Check your email to confirm your account!");
    }
  };

  return (
    <>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
          <h1 className="mt-4 text-center font-display text-3xl font-bold">Join the snack club</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Create your free account</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label htmlFor="name">Full Name</Label><Input id="name" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
              <div><Label htmlFor="cpw">Confirm</Label><Input id="cpw" type="password" required value={f.confirm} onChange={e => setF({ ...f, confirm: e.target.value })} /></div>
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox checked={agree} onCheckedChange={v => setAgree(!!v)} />
              <span>I agree to Snackwize's terms and privacy policy.</span>
            </label>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
