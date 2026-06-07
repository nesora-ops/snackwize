'use client'

import Image from 'next/image'
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "@/lib/useAuthGuard";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3, LogOut, Eye, Plus, Search, Pencil, Trash2,
} from "lucide-react";
import { DEMO_ORDERS, DEMO_CUSTOMERS, PRODUCTS, type DemoOrder } from "@/lib/data";
import { setAdmin } from "@/lib/auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";



type Tab = "overview" | "orders" | "products" | "customers" | "analytics";

const STATUS_COLOR: Record<DemoOrder["status"], string> = {
  Pending: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  Confirmed: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  Packed: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Shipped: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  Delivered: "bg-green-500/15 text-green-700 border-green-500/30",
  Cancelled: "bg-red-500/15 text-red-700 border-red-500/30",
};

export default function AdminPanel() {
  useAdminGuard();
  const nav = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<DemoOrder[]>(DEMO_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [openOrder, setOpenOrder] = useState<DemoOrder | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const filtered = useMemo(() => orders.filter(o =>
    (filterStatus === "all" || o.status === filterStatus) &&
    (search === "" || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  ), [orders, search, filterStatus]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    revenue: orders.filter(o => o.status !== "Cancelled").reduce((a, o) => a + o.amount, 0),
  }), [orders]);

  const updateStatus = (id: string, status: DemoOrder["status"]) => {
    setOrders(cur => cur.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`${id} → ${status}`);
  };

  const logoutAdmin = () => { setAdmin(false); nav.push("/admin/login"); };

  const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
          <Logo className="h-8 w-8" />
          <div>
            <p className="font-display text-lg font-bold leading-none">Snackwize</p>
            <p className="font-mono-accent text-[10px] uppercase tracking-wider text-primary">Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${tab === n.id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={logoutAdmin} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <h1 className="font-display text-2xl font-bold capitalize">{tab}</h1>
            <p className="text-xs text-muted-foreground">Manage your Snackwize storefront</p>
          </div>
          <div className="flex gap-2 md:hidden">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} aria-label={n.label} className={`grid h-9 w-9 place-items-center rounded-lg ${tab === n.id ? "bg-primary text-primary-foreground" : "bg-surface"}`}><n.icon className="h-4 w-4" /></button>
            ))}
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Orders" value={String(stats.total)} accent="bg-primary-light text-primary-dark" />
                <StatCard label="Pending" value={String(stats.pending)} accent="bg-yellow-100 text-yellow-700" />
                <StatCard label="Delivered" value={String(stats.delivered)} accent="bg-green-100 text-green-700" />
                <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} accent="bg-primary text-primary-foreground" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">Recent Orders</h3>
                <OrdersTable orders={orders.slice(0, 5)} onOpen={setOpenOrder} onStatus={updateStatus} />
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name or order ID" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-border bg-card">
                <OrdersTable orders={filtered} onOpen={setOpenOrder} onStatus={updateStatus} />
              </div>
            </div>
          )}

          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowAddProduct(true)} className="bg-primary hover:bg-primary-dark"><Plus className="mr-2 h-4 w-4" />Add Product</Button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Weight</th><th className="px-4 py-3">Price</th><th className="px-4 py-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map(p => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="flex items-center gap-3 px-4 py-3">
                          <Image width={800} height={600} src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-semibold">{p.name}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                        <td className="px-4 py-3 font-mono-accent text-xs">{p.weight}</td>
                        <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{p.price}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => toast("Edit (demo)")} className="mr-1 inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-surface"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => toast("Delete (demo)")} className="inline-grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-surface"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Spent</th><th className="px-4 py-3">Joined</th></tr>
                </thead>
                <tbody>
                  {DEMO_CUSTOMERS.map(c => (
                    <tr key={c.email} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                      <td className="px-4 py-3 font-mono-accent text-xs">{c.phone}</td>
                      <td className="px-4 py-3">{c.orders}</td>
                      <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{c.spent}</td>
                      <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "analytics" && <Analytics orders={orders} />}
        </div>
      </main>

      <Dialog open={!!openOrder} onOpenChange={(v) => !v && setOpenOrder(null)}>
        <DialogContent className="max-w-lg">
          {openOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{openOrder.id}</DialogTitle>
                <DialogDescription>Placed on {openOrder.date}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Customer</p>
                  <p className="font-semibold">{openOrder.customer}</p>
                  <p className="text-muted-foreground">{openOrder.phone}</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Items</p>
                  <p>{openOrder.items}</p>
                  <p className="mt-2 font-mono-accent text-lg font-bold text-primary-dark">₹{openOrder.amount}</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Delivery Address</p>
                  <p className="text-muted-foreground">Will be wired to Shiprocket — placeholder.</p>
                </div>
                <div>
                  <p className="mb-2 font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">Update Status</p>
                  <Select value={openOrder.status} onValueChange={(v) => { updateStatus(openOrder.id, v as DemoOrder["status"]); setOpenOrder({ ...openOrder, status: v as DemoOrder["status"] }); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a product</DialogTitle>
            <DialogDescription>Demo only — wire to the database to persist.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Product name" />
            <Input placeholder="Category" />
            <Input placeholder="Weight (e.g. 200g)" />
            <Input placeholder="Price (₹)" type="number" />
            <Button onClick={() => { toast.success("Product added (demo)"); setShowAddProduct(false); }} className="w-full bg-primary hover:bg-primary-dark">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      <span className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono-accent text-[10px] uppercase ${accent}`}>Live</span>
    </div>
  );
}

function OrdersTable({ orders, onOpen, onStatus }: { orders: DemoOrder[]; onOpen: (o: DemoOrder) => void; onStatus: (id: string, s: DemoOrder["status"]) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono-accent text-xs font-bold">{o.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold">{o.customer}</p>
                <p className="font-mono-accent text-[10px] text-muted-foreground">{o.phone}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
              <td className="px-4 py-3 font-mono-accent font-bold text-primary-dark">₹{o.amount}</td>
              <td className="px-4 py-3 font-mono-accent text-xs text-muted-foreground">{o.date}</td>
              <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 font-mono-accent text-[10px] uppercase ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onOpen(o)} className="inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-surface" aria-label="View"><Eye className="h-4 w-4" /></button>
                <Select value={o.status} onValueChange={(v) => onStatus(o.id, v as DemoOrder["status"])}>
                  <SelectTrigger className="ml-1 inline-flex h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_COLOR).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Analytics({ orders }: { orders: DemoOrder[] }) {
  const revenue = [
    { m: "Jan", r: 18500 }, { m: "Feb", r: 22100 }, { m: "Mar", r: 27800 },
    { m: "Apr", r: 31200 }, { m: "May", r: 38400 }, { m: "Jun", r: 42800 },
  ];
  const statusData = Object.entries(orders.reduce<Record<string, number>>((a, o) => ({ ...a, [o.status]: (a[o.status] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const COLORS = ["#F97316", "#16A34A", "#C2410C", "#3B82F6", "#A855F7", "#DC2626"];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Monthly Revenue</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer><BarChart data={revenue}><XAxis dataKey="m" stroke="#78716C" /><YAxis stroke="#78716C" /><Tooltip /><Bar dataKey="r" fill="#F97316" radius={8} /></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Order Status Mix</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
        <h3 className="font-display text-lg font-bold">Top Products</h3>
        <ul className="mt-4 space-y-2 text-sm">
          {PRODUCTS.slice(0, 5).map((p, i) => (
            <li key={p.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <span><span className="mr-3 font-mono-accent text-xs text-muted-foreground">#{i + 1}</span>{p.name}</span>
              <span className="font-mono-accent font-bold text-primary-dark">₹{p.price * (50 - i * 6)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}