'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  const { loading } = useAuthGuard();
  const nav = useRouter();
  const [user, setUser] = useState(() => getUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleLogout = () => { logout(); nav.push("/"); };

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({ ...user, name, phone, email: user?.email ?? "", id: user?.id ?? "" });
        toast.success("Profile updated!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelOrder = async (id: string) => {
    if (!window.confirm('Cancel this order? Any payment is refunded.')) return;
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/orders/${id}/cancel`, {
      method: 'POST', headers: { Authorization: `Bearer ${session!.access_token}` },
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: null }));
      return toast.error(error ?? 'Could not cancel');
    }
    setOrders(cur => cur.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    toast.success('Order cancelled — refund (if paid) is on its way');
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (res.ok) setOrders(await res.json());
    });
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
                <ShoppingBag className="mx-auto mb-3 h-8 w-8 opacity-20" />
                <p>No orders yet.</p>
                <Link href="/menu" className="mt-4 inline-block font-semibold text-primary hover:underline">
                  Start shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="font-mono-accent text-sm font-bold text-foreground">{o.id}</span>
                        <span className={`rounded-full px-2.5 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider ${STATUS_COLOR[o.status]}`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{o.items.map(i => `${i.name}${i.flavour ? ` (${i.flavour})` : ''} x${i.qty}`).join(', ')}</p>
                      <p className="mt-1 font-mono-accent text-xs text-muted-foreground">Placed on {new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="font-mono-accent text-lg font-bold text-primary-dark">₹{o.total}</p>
                      <div className="mt-1 flex items-center justify-end gap-3">
                        <Link href="/app/track" className="text-xs font-semibold text-primary hover:underline">
                          Track order →
                        </Link>
                        {['Pending', 'Confirmed'].includes(o.status)
                          && !o.items.some(i => i.delivery_type === 'hyperlocal') && (
                          <button onClick={() => cancelOrder(o.id)} className="text-xs font-semibold text-destructive hover:underline">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Your Details</h3>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Name</p>
                      <Input name="name" defaultValue={user?.name ?? ""} required />
                    </div>
                    <div>
                      <p className="mb-1 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Phone</p>
                      <Input name="phone" defaultValue={user?.phone ?? ""} required />
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
                    <Input disabled value={user?.email ?? ""} />
                    <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Name" value={user?.name ?? ""} />
                  <Field label="Email" value={user?.email ?? ""} />
                  <Field label="Phone" value={user?.phone ?? "—"} />
                </div>
              )}
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
