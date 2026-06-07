import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/data";

export type CartItem = Product & { qty: number };

type Ctx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
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

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p: Product) =>
    setItems((cur) => {
      const existing = cur.find((i) => i.id === p.id);
      if (existing) return cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { ...p, qty: 1 }];
    });
  const remove = (id: string) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, clear, count, total }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}