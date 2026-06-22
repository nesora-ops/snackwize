'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Heart, ShoppingBag, LogOut } from "lucide-react";
import { useAuthGuard } from "@/lib/useAuthGuard";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_COLOR: Record<OrderStatus, string> = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed:    "bg-orange-100 text-orange-700",
  Shipped:   "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  useAuthGuard();
  const nav = useRouter();
  const [user] = useState(() => getUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const handleLogout = () => { logout(); nav.push("/"); };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (res.ok) setOrders(await res.json());
    });
  }, []);

  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-12">
          <div>
            <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary">Your Account</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Welcome back, {user?.name.split(" ")[0]}! 🧡</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-20 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-display text-xl font-bold">No orders yet — start snacking!</p>
                <p className="mt-1 text-sm text-muted-foreground">Your future snack history will live here.</p>
                <Link href="/menu" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">Browse Menu</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono-accent text-xs uppercase tracking-wider text-muted-foreground">Order ID</p>
                        <p className="font-bold text-primary">{o.id}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {o.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString('en-IN')}</span>
                      <span className="font-bold">₹{o.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-xl font-bold">Profile</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={user?.name ?? ""} />
                <Field label="Email" value={user?.email ?? ""} />
                <Field label="Phone" value={user?.phone ?? "—"} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-20 text-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-display text-xl font-bold">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it for later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm">{value}</p>
    </div>
  );
}
