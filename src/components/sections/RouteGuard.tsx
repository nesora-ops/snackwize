import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getUser, isAdmin } from "@/lib/auth";

export function UserGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getUser()) navigate({ to: "/login" });
    else setReady(true);
  }, [navigate]);
  if (!ready) return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading…</div>;
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
    else setReady(true);
  }, [navigate]);
  if (!ready) return <div className="grid min-h-screen place-items-center bg-sidebar text-sidebar-foreground">Verifying…</div>;
  return <>{children}</>;
}