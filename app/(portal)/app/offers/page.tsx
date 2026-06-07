'use client'

import { Tag, Copy, Check } from "lucide-react";
import { useState } from "react";

const OFFERS = [
  {
    code: "FRESH15",
    title: "15% Off Your First Order",
    desc: "Use on any order above ₹200. Valid for new customers.",
    discount: "15% OFF",
    color: "#F97316",
    bg: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    expires: "Expires June 30, 2026",
    emoji: "🎉",
  },
  {
    code: "SNACK50",
    title: "Flat ₹50 Off",
    desc: "On orders above ₹500. Stackable with referral credits.",
    discount: "₹50 OFF",
    color: "#7C3AED",
    bg: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
    expires: "Valid all of June 2026",
    emoji: "⚡",
  },
  {
    code: "HEALTHY20",
    title: "20% Off Energy Bites",
    desc: "Applies to all Energy Bites category products only.",
    discount: "20% OFF",
    color: "#059669",
    bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    expires: "Limited time offer",
    emoji: "🌱",
  },
  {
    code: "REFER100",
    title: "₹100 Referral Credit",
    desc: "Share your code with a friend. You both get ₹100 credit.",
    discount: "₹100 OFF",
    color: "#DC2626",
    bg: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    expires: "No expiry",
    emoji: "🤝",
  },
];

function CouponCard({
  code, title, desc, discount, color, bg, expires, emoji,
}: typeof OFFERS[0]) {
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
        {OFFERS.map((offer) => (
          <CouponCard key={offer.code} {...offer} />
        ))}
      </div>

      {/* Referral CTA */}
      <div
        style={{
          margin: "0 16px 24px",
          background: "linear-gradient(135deg, #FFF7F0, #FEE9D7)",
          borderRadius: "20px",
          padding: "20px",
          border: "1.5px solid #FDBA74",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "24px", margin: "0 0 8px" }}>🎁</p>
        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1C1917", margin: "0 0 6px", fontFamily: "'Playfair Display', serif" }}>
          Refer a Friend
        </h3>
        <p style={{ fontSize: "12px", color: "#6B5E52", margin: "0 0 14px", lineHeight: 1.5 }}>
          Share Snackwize with someone you love. Both of you get ₹100 off your next order!
        </p>
        <button
          style={{
            backgroundColor: "#F97316",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 24px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Try Snackwize!",
                text: "Use my code REFER100 to get ₹100 off on Snackwize homemade healthy snacks!",
                url: "https://snackwize.com",
              });
            }
          }}
        >
          Share &amp; Earn ₹100
        </button>
      </div>
    </div>
  );
}
