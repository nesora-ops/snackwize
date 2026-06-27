'use client'

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, Star } from 'lucide-react';
import { CATEGORIES, type Product as BaseProduct } from '@/lib/data';

type Product = BaseProduct & { in_stock: boolean; allow_backorder: boolean }
import { useCart, lineKey } from '@/context/CartContext';

const CATEGORY_EMOJIS: Record<string, string> = {
  "All": "🍽️",
  "Mathri": "🫓",
  "Crispies": "🥨",
  "Bhel & Mixes": "🥣",
  "Bakes": "🧁",
};

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "#FEF3C7", color: "#92400E" },
  Seasonal:   { bg: "#D1FAE5", color: "#065F46" },
  Premium:    { bg: "#EDE9FE", color: "#4C1D95" },
  NEW:        { bg: "#FEE2E2", color: "#991B1B" },
};

function MobileProductCard({ product }: { product: Product }) {
  const { items, add, updateQty } = useCart();
  const hasFlavours = (product.flavours?.length ?? 0) > 0;
  const [selFlavour, setSelFlavour] = useState<string | undefined>(product.flavours?.[0]);
  const line = items.find((i) => lineKey(i) === lineKey({ id: product.id }));
  const qty = line?.qty ?? 0;
  const totalForProduct = items.filter((i) => i.id === product.id).reduce((a, i) => a + i.qty, 0);
  const badge = product.badge ? BADGE_COLORS[product.badge] : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "12px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        marginBottom: "10px",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          position: "relative",
          width: "90px",
          height: "90px",
          borderRadius: "12px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "#F5F0EB",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="90px"
        />
        {product.badge && badge && (
          <span
            style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              backgroundColor: badge.bg,
              color: badge.color,
              fontSize: "9px",
              fontWeight: 700,
              borderRadius: "999px",
              padding: "2px 6px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1C1917",
            lineHeight: 1.3,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "11px",
            color: "#9E9083",
            margin: "3px 0 4px",
            lineHeight: 1.4,
          }}
        >
          {product.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
          <Star size={11} style={{ fill: "#F97316", stroke: "#F97316" }} />
          <span style={{ fontSize: "11px", color: "#6B5E52", fontWeight: 600 }}>4.5</span>
          <span style={{ fontSize: "11px", color: "#C4B8AE" }}>· {product.category}</span>
        </div>
        {hasFlavours && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
            {product.flavours!.map((f) => (
              <button
                key={f}
                onClick={() => setSelFlavour(f)}
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: "999px",
                  border: selFlavour === f ? "1.5px solid #F97316" : "1px solid #E8E1DB",
                  backgroundColor: selFlavour === f ? "#FFF3E9" : "#fff",
                  color: selFlavour === f ? "#C2410C" : "#6B5E52",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 800,
              color: "#1C1917",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            ₹{product.price}
            {totalForProduct > 0 && (
              <span style={{ marginLeft: "6px", fontSize: "10px", fontWeight: 700, color: "#F97316" }}>
                {totalForProduct} in bag
              </span>
            )}
          </span>

          {!product.in_stock && !product.allow_backorder ? (
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E9083", padding: "4px 10px", borderRadius: "999px", backgroundColor: "#F5F0EB" }}>
              Sold Out
            </span>
          ) : hasFlavours ? (
            <button
              onClick={() => add(product, selFlavour)}
              id={`app-add-${product.id}`}
              style={{
                height: "32px",
                borderRadius: "999px",
                backgroundColor: product.in_stock ? "#F97316" : "#D97706",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "0 12px",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(249,115,22,0.4)",
              }}
            >
              {product.in_stock ? <>Add <Plus size={12} strokeWidth={2.5} /></> : <>Pre-order <Plus size={12} strokeWidth={2.5} /></>}
            </button>
          ) : qty === 0 ? (
            <button
              onClick={() => add(product)}
              id={`app-add-${product.id}`}
              style={{
                height: "32px",
                borderRadius: "999px",
                backgroundColor: product.in_stock ? "#F97316" : "#D97706",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: product.in_stock ? "0" : "0 10px",
                width: product.in_stock ? "32px" : "auto",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                boxShadow: product.in_stock ? "0 2px 8px rgba(249,115,22,0.4)" : "0 2px 8px rgba(217,119,6,0.4)",
                transition: "transform 0.15s",
              }}
              onMouseDown={(e) => ((e.currentTarget.style.transform = "scale(0.9)"))}
              onMouseUp={(e) => ((e.currentTarget.style.transform = "scale(1)"))}
            >
              {product.in_stock ? <Plus size={16} strokeWidth={2.5} /> : <>Pre-order <Plus size={12} strokeWidth={2.5} /></>}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#FFF3E9",
                borderRadius: "20px",
                padding: "3px 6px",
                border: "1.5px solid #F97316",
              }}
            >
              <button
                onClick={() => updateQty(lineKey({ id: product.id }), -1)}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "#F97316",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#F97316", minWidth: "16px", textAlign: "center" }}>
                {qty}
              </span>
              <button
                onClick={() => updateQty(lineKey({ id: product.id }), +1)}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "#F97316",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const { count, total } = useCart();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, []);

  const filtered = useMemo(
    () => activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory),
    [activeCategory, products]
  );

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#FAFAF8" }}>
      {/* Hero Banner */}
      <div
        style={{
          margin: "12px 16px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-20px",
            top: "-20px",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "30px",
            bottom: "-30px",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "999px",
            padding: "3px 10px",
            fontSize: "11px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "8px",
          }}
        >
          🔥 Hot Deals
        </span>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 4px",
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.2,
          }}
        >
          Craving something healthy?
        </h2>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", margin: 0 }}>
          Order now &amp; get 15% off with code <strong>FRESH15</strong>
        </p>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          padding: "8px 16px 12px",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: active ? 700 : 500,
                border: "none",
                cursor: "pointer",
                backgroundColor: active ? "#F97316" : "#fff",
                color: active ? "#fff" : "#6B5E52",
                boxShadow: active
                  ? "0 2px 10px rgba(249,115,22,0.35)"
                  : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              <span>{CATEGORY_EMOJIS[cat] ?? "🍽️"}</span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products List */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1C1917", margin: 0, fontFamily: "'Playfair Display', serif" }}>
            {activeCategory}
          </h2>
          <span style={{ fontSize: "11px", color: "#9E9083" }}>{filtered.length} items</span>
        </div>

        {filtered.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "76px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: "440px",
            zIndex: 45,
          }}
        >
          <a
            href="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#F97316",
              borderRadius: "16px",
              padding: "14px 18px",
              textDecoration: "none",
              color: "#fff",
              boxShadow: "0 8px 30px rgba(249,115,22,0.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  width: "26px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>View Cart</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{total} →</span>
          </a>
        </div>
      )}
    </div>
  );
}
