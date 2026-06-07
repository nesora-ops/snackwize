import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/sections/ProductCard";
import { PRODUCTS, CATEGORIES, WHATSAPP } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2 } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Snackwize" },
      { name: "description", content: "Browse our homemade granola bars, cookies, energy bites, muffins and more." },
      { property: "og:title", content: "Menu — Snackwize" },
      { property: "og:description", content: "Hand-baked, healthy snacks shipped Pan India." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<string>("All");
  const { items, count, total, remove } = useCart();
  const list = useMemo(() => cat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat), [cat]);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 grain opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] opacity-90">Our Kitchen Today</p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">The Menu</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">Fresh batches, baked weekly. Pick your favorites — we ship Pan India.</p>
        </div>
      </section>

      <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-surface text-foreground/80 hover:bg-primary-light"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono-accent text-xs uppercase tracking-wider text-muted-foreground">{count} item{count > 1 ? "s" : ""}</p>
                <p className="font-display text-lg font-bold">₹{total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hidden rounded-full border border-foreground/15 px-4 py-2 text-xs font-semibold sm:inline-flex">DM to order</a>
              <button disabled className="relative inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-foreground/80 px-5 py-2.5 text-sm font-semibold text-background opacity-90">
                Proceed to Checkout
                <span className="rounded-full bg-primary px-2 py-0.5 font-mono-accent text-[10px] uppercase">Soon</span>
              </button>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
            {items.map(i => (
              <div key={i.id} className="flex shrink-0 items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs">
                <span className="font-semibold">{i.name}</span>
                <span className="font-mono-accent">×{i.qty}</span>
                <button onClick={() => remove(i.id)} aria-label="Remove"><Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}