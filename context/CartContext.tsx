'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";

export type CartItem = Product & { qty: number; flavour?: string };

// A cart line is identified by product + chosen flavour, so the same product in
// two flavours are two separate lines.
export const lineKey = (i: { id: string; flavour?: string }) => `${i.id}|${i.flavour ?? ""}`;

type Ctx = {
  items: CartItem[];
  add: (p: Product, flavour?: string) => void;
  remove: (key: string) => void;
  updateQty: (key: string, delta: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "snackwize_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Reconcile the locally-stored cart against live product data: drop items
  // that no longer exist and refresh prices/names so a stale localStorage cart
  // can't show (or check out at) outdated prices. Flavour + qty are preserved.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        if (cancelled || !Array.isArray(products)) return;
        const byId = new Map(products.map((p) => [p.id, p]));
        setItems((cur) => {
          if (cur.length === 0) return cur;
          let changed = false;
          const next = cur
            .filter((i) => {
              const p = byId.get(i.id);
              if (!p) { changed = true; return false; }
              // Auto-drop items that are sold out and do not allow backorder
              if (p.in_stock === false && p.allow_backorder !== true) { changed = true; return false; }
              return true;
            })
            .map((i) => {
              const p = byId.get(i.id)!;
              if (p.price !== i.price || p.name !== i.name) changed = true;
              return { ...i, ...p, qty: i.qty, flavour: i.flavour };
            });
          if (changed) toast("Your cart was updated to reflect the latest prices & availability.");
          return changed ? next : cur;
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p: Product, flavour?: string) =>
    setItems((cur) => {
      // Disallow mixing same-day (hyperlocal) and standard (local) items — they ship differently.
      const newMode = p.delivery_type === "hyperlocal" ? "hyperlocal" : "local";
      const curMode = cur.some((i) => i.delivery_type === "hyperlocal") ? "hyperlocal" : "local";
      if (cur.length > 0 && curMode !== newMode) {
        toast(`Your bag has ${curMode === "hyperlocal" ? "same-day" : "standard"} items — check out or clear it first.`);
        return cur;
      }
      const key = lineKey({ id: p.id, flavour });
      const existing = cur.find((i) => lineKey(i) === key);
      if (existing) return cur.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { ...p, flavour, qty: 1 }];
    });

  const remove = (key: string) => setItems((cur) => cur.filter((i) => lineKey(i) !== key));

  const updateQty = (key: string, delta: number) =>
    setItems((cur) =>
      cur
        .map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const clear = () => setItems([]);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, count, total }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
