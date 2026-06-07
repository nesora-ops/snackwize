'use client'

import Image from 'next/image'
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image width={800} height={600} src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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
        <div className="flex items-center gap-2">
          <span className="grid h-4 w-4 place-items-center border border-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono-accent text-[10px] uppercase tracking-wider text-muted-foreground">{product.weight}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono-accent text-lg font-bold text-primary-dark">₹{product.price}</span>
          <button
            onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}