import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { setUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Snackwize" }, { name: "description", content: "Log in to your Snackwize account." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    // TODO: Replace localStorage auth with Supabase Auth
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    setUser({ name, email });
    toast.success("Welcome back!");
    nav({ to: "/menu" });
  };

  return (
    <SiteLayout hideFab>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
          <h1 className="mt-4 text-center font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Log in to continue snacking</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Login</Button>
          </form>

          <button disabled className="mt-3 w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-70">
            Continue with Google · Coming Soon
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">Create an account</Link>
          </p>
          <p className="mt-4 text-center text-[10px] font-mono-accent uppercase tracking-wider text-muted-foreground">Auth powered by Supabase — coming soon</p>
        </div>
      </div>
    </SiteLayout>
  );
}