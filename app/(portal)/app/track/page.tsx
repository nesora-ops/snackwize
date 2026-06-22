'use client'

import { MapPin, Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType; step: number }> = {
  Pending:    { label: "Pending",    color: "#92400E", bg: "#FEF3C7", Icon: Clock,          step: 1 },
  Confirmed:  { label: "Confirmed",  color: "#1E40AF", bg: "#DBEAFE", Icon: Package,        step: 2 },
  Packed:     { label: "Packed",     color: "#5B21B6", bg: "#EDE9FE", Icon: Package,        step: 3 },
  Shipped:    { label: "In Transit", color: "#0E7490", bg: "#CFFAFE", Icon: Truck,          step: 4 },
  Delivered:  { label: "Delivered",  color: "#065F46", bg: "#D1FAE5", Icon: CheckCircle2,  step: 5 },
  Cancelled:  { label: "Cancelled",  color: "#991B1B", bg: "#FEE2E2", Icon: XCircle,       step: 0 },
};

const STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

function TrackingSteps({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0;
  if (status === "Cancelled") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0 4px", color: "#DC2626", fontSize: "13px", fontWeight: 600 }}>
        ❌ This order was cancelled
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 0 4px" }}>
      {STEPS.map((step, idx) => {
        const done = currentStep > idx;
        const active = currentStep === idx + 1;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: done || active ? "#F97316" : "#E8E1DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active ? "0 0 0 3px rgba(249,115,22,0.25)" : "none",
                  transition: "all 0.3s",
                }}
              >
                {done ? (
                  <CheckCircle2 size={14} style={{ color: "#fff" }} />
                ) : (
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: active ? "#fff" : "#C4B8AE" }} />
                )}
              </div>
              <span style={{ fontSize: "8px", fontWeight: active ? 700 : 500, color: active ? "#F97316" : "#9E9083", whiteSpace: "nowrap" }}>
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: done ? "#F97316" : "#E8E1DB",
                  margin: "0 3px",
                  marginBottom: "16px",
                  transition: "background-color 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setRecentOrders(await res.json());
    });
  }, []);

  return (
    <div style={{ minHeight: "100%", backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <MapPin size={18} style={{ color: "#F97316" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1C1917", margin: 0, fontFamily: "'Playfair Display', serif" }}>
            Track Orders
          </h1>
        </div>
        <p style={{ fontSize: "12px", color: "#9E9083", margin: 0 }}>
          Real-time updates on your Snackwize deliveries
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SW-1042)"
            style={{
              width: "100%",
              border: "1.5px solid #E8E1DB",
              borderRadius: "14px",
              padding: "12px 16px",
              fontSize: "13px",
              backgroundColor: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ padding: "0 16px 24px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#6B5E52", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recent Orders
        </h2>
        {recentOrders.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          const Icon = cfg?.Icon ?? Package;
          const isOpen = expanded === order.id;

          return (
            <div
              key={order.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                marginBottom: "10px",
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: cfg?.bg ?? "#F5F0EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: cfg?.color ?? "#6B5E52" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1C1917" }}>
                      {order.id}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: cfg?.color ?? "#6B5E52",
                        backgroundColor: cfg?.bg ?? "#F5F0EB",
                        borderRadius: "999px",
                        padding: "2px 8px",
                      }}
                    >
                      {cfg?.label ?? order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#9E9083", margin: "0 0 2px" }}>
                    {order.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                  </p>
                  <p style={{ fontSize: "11px", color: "#C4B8AE", margin: 0 }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · ₹{order.total}
                  </p>
                </div>
                <span style={{ fontSize: "16px", color: "#C4B8AE", flexShrink: 0 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 14px 14px" }}>
                  <div style={{ borderTop: "1px solid #F0ECE8", paddingTop: "12px" }}>
                    <TrackingSteps status={order.status} />
                    {order.status === "Shipped" && (
                      <div
                        style={{
                          marginTop: "12px",
                          backgroundColor: "#CFFAFE",
                          borderRadius: "12px",
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Truck size={16} style={{ color: "#0E7490" }} />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#0E7490" }}>
                          Expected delivery: Tomorrow, before 8 PM
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help CTA */}
      <div
        style={{
          margin: "0 16px 24px",
          backgroundColor: "#FFF7F0",
          borderRadius: "16px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          border: "1px solid #FED7AA",
        }}
      >
        <span style={{ fontSize: "28px" }}>💬</span>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#1C1917", margin: "0 0 3px" }}>
            Need help with your order?
          </p>
          <a
            href="https://wa.me/919930600993"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "12px", color: "#F97316", fontWeight: 600, textDecoration: "none" }}
          >
            WhatsApp Nupur →
          </a>
        </div>
      </div>
    </div>
  );
}
