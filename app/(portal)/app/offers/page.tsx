'use client'

import { Tag, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Offer = {
  id?: string;
  code: string;
  title: string;
  desc: string;
  discount: string;
  color: string;
  bg: string;
  expires: string;
  emoji: string;
};

function CouponCard({
  code, title, desc, discount, color, bg, expires, emoji,
}: Offer) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        marginBottom: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}
    >
      {/* Top colored band */}
      <div
        style={{
          background: bg,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "26px" }}>{emoji}</span>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "0 0 2px", fontWeight: 600 }}>
              {title}
            </p>
            <p style={{ fontSize: "24px", fontWeight: 900, color: "#fff", margin: 0, fontFamily: "'Playfair Display', serif" }}>
              {discount}
            </p>
          </div>
        </div>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: "2px dashed #F0ECE8", margin: "0 16px" }} />

      {/* Bottom */}
      <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "12px", color: "#6B5E52", margin: "0 0 4px", lineHeight: 1.4 }}>
            {desc}
          </p>
          <p style={{ fontSize: "10px", color: "#C4B8AE", margin: 0 }}>{expires}</p>
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: color,
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            minWidth: "72px",
            justifyContent: "center",
            transition: "opacity 0.2s",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : code}
        </button>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: true });
      if (data) {
        setOffers(data);
      }
      setLoading(false);
    }
    fetchOffers();
  }, []);

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Tag size={18} style={{ color: "#F97316" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1917", margin: 0, fontFamily: "'Playfair Display', serif" }}>
            Offers & Coupons
          </h1>
        </div>
        <p style={{ fontSize: "12px", color: "#9E9083", margin: 0 }}>
          Tap a code to copy it. Apply at checkout!
        </p>
      </div>

      {/* Offer cards */}
      <div style={{ padding: "0 16px 24px" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#9E9083", fontSize: "14px", padding: "20px" }}>Loading offers...</p>
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <CouponCard key={offer.code} {...offer} />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#9E9083", fontSize: "14px", padding: "20px" }}>No offers available right now.</p>
        )}
      </div>


    </div>
  );
}
