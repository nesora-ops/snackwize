'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdmin } from "@/lib/auth";
import { Lock, Zap } from "lucide-react";

export default function AdminLogin() {
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdmin(true);
    toast.success("Welcome, Nupur 🧡 — Admin access granted");
    nav.push("/admin/dashboard");
  };

  const quickLogin = () => {
    setAdmin(true);
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
            <Input id="email" className="bg-sidebar text-sidebar-foreground" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@snackwize.com" />
          </div>
          <div>
            <Label htmlFor="pw" className="text-sidebar-foreground/80">Password</Label>
            <Input id="pw" type="password" className="bg-sidebar text-sidebar-foreground" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button type="submit" id="admin-login-btn" className="w-full bg-primary hover:bg-primary-dark">Login</Button>
        </form>

        {/* Quick access — no credentials needed */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 border-t border-sidebar-border" />
          <span className="text-[10px] font-mono-accent uppercase tracking-wider text-sidebar-foreground/50">or</span>
          <div className="flex-1 border-t border-sidebar-border" />
        </div>
        <Button
          id="admin-quick-access"
          variant="outline"
          className="mt-3 w-full border-primary/40 text-primary hover:bg-primary/10 gap-2"
          onClick={quickLogin}
          type="button"
        >
          <Zap className="h-4 w-4" />
          Quick Access (Demo)
        </Button>

        <p className="mt-4 text-center font-mono-accent text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
          demo: admin@snackwize.com / snackwize2024
        </p>
      </div>
    </div>
  );
}