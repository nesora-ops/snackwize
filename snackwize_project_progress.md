# Snackwize — Project Progress & Status Report
**Date:** June 8, 2026  
**Prepared by:** Antigravity (AI Engineering Partner)  
**Brand:** Snackwize by Nupur | Nesora Ventures

---

## 🧡 What is Snackwize?

Snackwize is a **direct-to-consumer (D2C) healthy snack brand** built by Nupur under the Nesora umbrella. The brand sells homemade, baked-not-fried snacks — granola bars, cookies, energy bites, muffins, trail mix, and seasonal specials — with a core promise:

> *"No preservatives. No shortcuts. Made fresh from our Mumbai kitchen."*

The digital platform serves two audiences:
1. **Customers** — browsing, ordering, and tracking snacks
2. **Admin (Nupur)** — managing orders, products, customers, and analytics from an internal operations dashboard

---

## 📍 Where We Are Today

The project is at **MVP-complete stage for the frontend**. The full customer journey — from landing on the homepage to placing an order — is now built, navigable, and demo-ready. The admin portal is also functional as a management cockpit.

### Current Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 + custom design tokens |
| Fonts | Playfair Display (headings) + DM Sans (body) |
| State | React Context (CartContext) + localStorage |
| Auth | Mock localStorage auth (Supabase-ready) |
| Deployment | Not yet deployed (local dev on port 3001) |
| Backend / DB | None yet — all frontend demo data |

---

## ✅ What Has Been Built

### 🌐 Public Website (Marketing + Storefront)

| Page | Status | Notes |
|---|---|---|
| `/` — Homepage | ✅ Done | Full editorial homepage: hero, features, product preview, testimonials, CTA |
| `/menu` — Menu | ✅ Done | **Swiggy/Zomato-style** product grid with category filter tabs, inline qty controls, floating cart bar |
| `/about` | ✅ Done | Brand story page |
| `/testimonials` | ✅ Done | Customer reviews grid |
| `/contact` | ✅ Done | Contact form + WhatsApp CTA |

### 🛒 Shopping Experience

| Feature | Status | Notes |
|---|---|---|
| Product listing with category filters | ✅ Done | 6 categories: All, Granola Bars, Cookies, Energy Bites, Muffins, Trail Mix, Seasonal |
| Add to bag (inline `+ ADD` / `– qty +`) | ✅ Done | Works for both guests and logged-in users |
| Cart badge count in navbar | ✅ Done | Updates live, persists in localStorage |
| Guest cart persistence | ✅ Done | Items saved in `snackwize_cart` key; survive login |
| Guest → login → cart merge | ✅ Done | Login redirects to `/cart` if pre-login items exist |
| `/cart` — Cart page | ✅ Done | 3 states: empty / guest preview / full logged-in cart |
| Delivery fee logic | ✅ Done | ₹50 below ₹500; FREE above ₹500 |
| `/checkout` — Checkout flow | ✅ Done | 3-step: Address → Payment → Confirmation |
| Order confirmation screen | ✅ Done | Random order number, delivery estimate, WhatsApp note |

### 👤 Auth (Customer)

| Feature | Status | Notes |
|---|---|---|
| `/login` | ✅ Done | Works with or without creds; guest fallback auto-creates user |
| `/signup` | ✅ Done | Registration form |
| `/dashboard` — User account | ✅ Done | My Orders tab, Profile, Wishlist (placeholders) |
| Auth state in navbar | ✅ Done | Shows "Hi, [Name]" when logged in |
| Logout | ✅ Done | Clears session, fires custom event |
| Auth guard (customer) | ✅ Fixed | Was checking wrong localStorage key — now resolved |

### 🔧 Admin Operations Portal (`/admin`)

| Feature | Status | Notes |
|---|---|---|
| `/admin/login` | ✅ Done | Works with or without creds — Quick Access (Demo) button |
| Auth guard (admin) | ✅ Fixed | Was checking wrong key — now resolved |
| Dashboard overview | ✅ Done | Stat cards: Total Orders, Pending, Delivered, Revenue |
| Orders management | ✅ Done | Filterable table, status updates, order detail modal |
| Products management | ✅ Done | Product list with edit/delete (demo); Add Product modal |
| Customer directory | ✅ Done | Customer table with lifetime spend |
| Analytics | ✅ Done | Revenue bar chart + Order status pie chart (Recharts) |

### 🎨 Design System

- **Warm editorial palette** — cream backgrounds, charcoal text, orange (#F97316) primary
- **Custom tokens** — `--primary`, `--primary-dark`, `--primary-light`, `--surface`, sidebar vars
- **Typography** — Playfair Display (editorial serif) + DM Sans (clean sans-serif)
- **Components** — Button, Input, Label, Dialog, Tabs, Select (shadcn/ui based)
- **WhatsApp FAB** — Floating CTA on all pages
- **Responsive** — Mobile-first, adapts to all screen sizes

---

## 🚧 What Remains (Not Yet Built)

### High Priority (Next Sprint)
- [ ] **Real authentication** — Replace localStorage mock with Supabase Auth (email/password + Google OAuth)
- [ ] **Real database** — Products, orders, and users stored in Supabase (PostgreSQL)
- [ ] **Payment gateway** — Razorpay integration for UPI / card / net banking
- [ ] **Order management backend** — Store orders on checkout; admin sees real orders
- [ ] **Deployment** — Vercel deployment + custom domain (snackwize.in or similar)

### Medium Priority
- [ ] **Product images** — Replace Unsplash placeholders with actual product photography
- [ ] **Shiprocket integration** — Automated shipping label generation + tracking
- [ ] **Email/WhatsApp notifications** — Order confirmations sent to customer and admin
- [ ] **Customer dashboard — My Orders** — Show actual placed orders (currently placeholder)
- [ ] **Wishlist** — Save products for later (currently placeholder)
- [ ] **Search** — Search products by name across the menu

### Lower Priority / Future
- [ ] **Product reviews** — In-app review submission post-delivery
- [ ] **Referral / loyalty system** — Points for repeat orders
- [ ] **Inventory management** — Track stock levels in admin
- [ ] **Mobile app (React Native)** — Optional future expansion
- [ ] **Multi-vendor support** — If Nesora expands to other brands

---

## 🗺️ Journey So Far

```
Phase 1 — Discovery & Setup
  ✅ Brand vision defined: D2C baked snacks, Mumbai-based
  ✅ Next.js project scaffolded
  ✅ Design system created (tokens, fonts, palette)
  ✅ Navbar, Footer, WhatsApp FAB components

Phase 2 — Marketing Website
  ✅ Homepage (editorial, story-driven design)
  ✅ About, Contact, Testimonials pages
  ✅ Story-scroll menu page (now replaced)

Phase 3 — Shopping Platform (Current)
  ✅ Swiggy-style menu with categories & inline cart
  ✅ Cart page with guest login gate
  ✅ 3-step checkout flow (Address → Payment → Confirmation)
  ✅ Guest cart persistence across login
  ✅ Customer dashboard scaffolded

Phase 4 — Admin Portal
  ✅ Admin login (with quick access for demo)
  ✅ Orders, Products, Customers, Analytics tabs
  ✅ Auth guard bugs fixed (localStorage key mismatch resolved)

Phase 5 — Backend & Production (NEXT)
  ⬜ Supabase Auth + Database
  ⬜ Razorpay payments
  ⬜ Shiprocket shipping
  ⬜ Vercel deployment
```

---

## 📊 Progress Snapshot

| Area | Progress |
|---|---|
| Frontend / UI | **~85% complete** |
| Customer shopping flow | **~90% complete** |
| Admin operations portal | **~75% complete** |
| Backend / APIs | **0% — not yet started** |
| Payments | **0% — not yet started** |
| Deployment | **0% — not yet started** |
| **Overall MVP** | **~55% to production-ready** |

---

## 🎯 Immediate Next Actions

1. **Test the full customer flow end-to-end** in browser (menu → cart → checkout)
2. **Set up Supabase project** and replace mock auth with real auth
3. **Design real product photography** or source lifestyle shots
4. **Wire Razorpay** test integration to the checkout payment step
5. **Deploy to Vercel** staging environment for client/investor demo

---

## 🔗 Key URLs (Local Dev)

| Route | Description |
|---|---|
| `http://localhost:3001/` | Homepage |
| `http://localhost:3001/menu` | Swiggy-style menu |
| `http://localhost:3001/cart` | Shopping cart |
| `http://localhost:3001/checkout` | 3-step checkout |
| `http://localhost:3001/login` | Customer login |
| `http://localhost:3001/dashboard` | Customer account |
| `http://localhost:3001/admin/login` | Admin portal login |
| `http://localhost:3001/admin/dashboard` | Admin operations dashboard |

---

*This document was auto-generated as a live snapshot of the Snackwize platform on June 8, 2026. It should be updated at each sprint milestone.*
