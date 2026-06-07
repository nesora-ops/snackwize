'use client'

import Image from "next/image";
import { PRODUCTS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Plus, Sparkles } from "lucide-react";

// "New Drops" = newest products (last 4 in the list, with a NEW badge)
const NEW_DROPS = PRODUCTS.slice(-4);

const COMING_SOON = [
  { name: "Rose Pistachio Nankhatai", teaser: "A fragrant twist on the Indian classic. Coming this week.", emoji: "🌹" },
  { name: "Dark Choco Seed Bar", teaser: "Protein-packed, rich cocoa, and zero guilt. Dropping soon.", emoji: "🍫" },
  { name: "Masala Chai Cookies", teaser: "Your morning chai in cookie form. Limited batch.", emoji: "☕" },
];

export default function NewDropsPage() {
  const { add } = useCart();

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Sparkles size={18} style={{ color: "#F97316" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1917", margin: 0, fontFamily: "'Playfair Display', serif" }}>
            New Drops
          </h1>
        </div>
        <p style={{ fontSize: "12px", color: "#9E9083", margin: 0 }}>
          Fresh from Nupur's kitchen — just dropped this week!
        </p>
      </div>

      {/* New arrivals */}
      <div style={{ padding: "8px 16px" }}>
        {NEW_DROPS.map((product) => (
          <div
            key={product.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              marginBottom: "10px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* NEW ribbon */}
            <span
              style={{
                position: "absolute",
                top: "10px",
                left: "-1px",
                backgroundColor: "#F97316",
                color: "#fff",
                fontSize: "9px",
                fontWeight: 800,
                padding: "2px 8px 2px 6px",
                borderRadius: "0 6px 6px 0",
                letterSpacing: "0.06em",
              }}
            >
              NEW
            </span>
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
              <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} sizes="90px" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1C1917", margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>
                {product.name}
              </h3>
              <p style={{ fontSize: "11px", color: "#9E9083", margin: "0 0 8px", lineHeight: 1.4 }}>
                {product.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#1C1917", fontFamily: "'Playfair Display', serif" }}>
                  ₹{product.price}
                </span>
                <button
                  onClick={() => add(product)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#F97316",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(249,115,22,0.4)",
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div style={{ padding: "8px 16px 24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1C1917", margin: "0 0 12px", fontFamily: "'Playfair Display', serif" }}>
          🚀 Coming Soon
        </h2>
        {COMING_SOON.map((item) => (
          <div
            key={item.name}
            style={{
              backgroundColor: "#FFF7F0",
              border: "1.5px dashed #FDBA74",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "28px", flexShrink: 0 }}>{item.emoji}</span>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#1C1917", margin: "0 0 3px" }}>
                {item.name}
              </h3>
              <p style={{ fontSize: "11px", color: "#9E9083", margin: 0, lineHeight: 1.4 }}>
                {item.teaser}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
