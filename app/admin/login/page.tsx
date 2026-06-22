'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);
    if (data.user.user_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      return toast.error("Not authorized as admin");
    }
    toast.success("Welcome, Nupur 🧡 — Admin access granted");
    nav.push("/admin/dashboard");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-sidebar text-sidebar-foreground">
      <div className="w-full max-w-sm rounded-3xl border border-sidebar-border bg-sidebar-accent/40 p-8 backdrop-blur">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">Snackwize Admin</h1>
        <p className="mt-1 text-sm text-sidebar-foreground/70">Internal operations portal</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-sidebar-foreground/80">Email</Label>
            <Input id="email" type="email" required className="bg-sidebar text-sidebar-foreground" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@snackwize.com" />
          </div>
          <div>
            <Label htmlFor="pw" className="text-sidebar-foreground/80">Password</Label>
            <Input id="pw" type="password" required className="bg-sidebar text-sidebar-foreground" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button type="submit" id="admin-login-btn" className="w-full bg-primary hover:bg-primary-dark">Login</Button>
        </form>
      </div>
    </div>
  );
}
