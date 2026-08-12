'use client'

import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useCart, lineKey } from "@/context/CartContext";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { items, add, updateQty } = useCart();
  const [liked, setLiked] = useState(false);

  // Same swap the /menu and /order cards do: once the line is in the bag the
  // Add button becomes the stepper, so the card itself confirms the add.
  const key = lineKey({ id: product.id });
  const qty = items.find((i) => lineKey(i) === key)?.qty ?? 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <ProductImage src={product.image} alt={product.name} sizes="(max-width: 768px) 50vw, 300px" className="transition duration-500 group-hover:scale-105" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 font-mono-accent text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setLiked((l) => !l)}
          aria-label="Wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-foreground/70"}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-4 w-4 place-items-center border border-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.net_weight_grams ? (product.net_weight_grams >= 1000 ? `${product.net_weight_grams / 1000}kg` : `${product.net_weight_grams}g`) : product.weight}
            </span>
          </div>
          {product.nutrition && (
            <span className="text-[10px] text-muted-foreground" title={product.nutrition}>ℹ️ {product.nutrition}</span>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono-accent text-lg font-bold text-primary-dark">₹{product.price}</span>
          <AnimatePresence mode="wait" initial={false}>
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary-dark"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary/10 px-1 py-1"
              >
                <button
                  onClick={() => updateQty(key, -1)}
                  aria-label="Decrease quantity"
                  className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-90"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <motion.span
                  key={qty}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="min-w-[1.25rem] text-center text-xs font-bold text-primary-dark"
                >
                  {qty}
                </motion.span>
                <button
                  onClick={() => updateQty(key, +1)}
                  aria-label="Increase quantity"
                  className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-90"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
