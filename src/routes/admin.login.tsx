import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdmin } from "@/lib/auth";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Snackwize" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@snackwize.com" && password === "snackwize2024") {
      setAdmin(true);
      toast.success("Welcome, admin");
      nav({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-sidebar text-sidebar-foreground">
      <div className="w-full max-w-sm rounded-3xl border border-sidebar-border bg-sidebar-accent/40 p-8 backdrop-blur">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">Snackwize Admin</h1>
        <p className="mt-1 text-sm text-sidebar-foreground/70">Restricted area</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email" className="text-sidebar-foreground/80">Email</Label>
            <Input id="email" className="bg-sidebar text-sidebar-foreground" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pw" className="text-sidebar-foreground/80">Password</Label>
            <Input id="pw" type="password" className="bg-sidebar text-sidebar-foreground" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Login</Button>
        </form>
        <p className="mt-4 text-center font-mono-accent text-[10px] uppercase tracking-wider text-sidebar-foreground/60">demo: admin@snackwize.com / snackwize2024</p>
      </div>
    </div>
  );
}