# Snackwize — Final Pre-Phase 4 Audit Report

**Stack:** Next.js 14 App Router · Supabase · Tailwind v4 · Vercel  
**Date:** 2026-06-22  
**Sources:** Report A (snackwize_audit_report.md), Report B (audit2), + independent codebase & DB verification

---

## Summary Scorecard

| Area | Status | Phase 4 Ready? | Phase 5 Ready? |
|------|--------|:-:|:-:|
| Security | 🔴 Critical gaps | No | No |
| Data Integrity | 🟠 Moderate gaps | No | No |
| Cart & Checkout | 🟠 Multiple gaps | No | No |
| Authentication | 🟠 Structural issue | Mostly | No |
| Order Management | 🟡 Incomplete | Partially | No |
| Inventory | 🟢 Functional | Yes | Partially |
| API Layer | 🔴 No validation | No | No |
| Delivery Schema | 🔴 Missing fields | N/A | No |
| Frontend/UX | 🟡 Placeholders remain | Partially | Partially |
| Scalability | 🟡 Not addressed | Partially | No |
| Observability | 🟠 Error leaking | No | No |

---

## SEVERITY 1 — Critical: Fix Before Touching Phase 4

### 1.1 Server-side price is never verified
**Files:** `app/api/orders/route.ts`

The POST endpoint accepts `subtotal`, `delivery_fee`, and `total` directly from the client body and inserts them verbatim. Anyone with DevTools or curl can place a ₹1 order for ₹500 of product. For Razorpay, the payment amount is set from `total` — a tampered total flows straight into the payment amount.

> [!CAUTION]
> This is the single most dangerous vulnerability. Real money will flow through this endpoint in Phase 4.

**Fix:** Server must fetch current prices from the `products` table by item IDs, recompute `subtotal`/`delivery_fee`/`total`, and reject if they don't match. Never trust client-computed money values.

---

### 1.2 Admin role stored in `user_metadata` — writable by any client
**Files:** `lib/useAuthGuard.ts:19`, `app/api/admin/orders/route.ts:8`

Every admin check reads `user?.user_metadata?.role === 'admin'`. In Supabase, `user_metadata` is writable by the authenticated user via:
```js
supabase.auth.updateUser({ data: { role: 'admin' } })
```
Any registered customer can elevate themselves to full admin access.

**Fix:** Move role to `app_metadata` (server-only, can only be set by service role key). Update all admin API routes and `useAdminGuard` to check `app_metadata.role`.

---

### 1.3 Order ID is client-generated with only 9,000 possible values
**File:** `app/checkout/page.tsx:66`

```js
const [orderNumber] = useState(() => `SW-${Math.floor(1000 + Math.random() * 9000)}`)
```

This is the primary key inserted as-is into the DB. Problems:
- At ~70 orders, birthday-paradox collision probability exceeds 25%
- Client controls the PK — trivially manipulable
- A collision causes a silent 500 error on checkout (user stuck on "placing")

**Verified via DB:** `orders.id` is `TEXT NOT NULL` with no default — entirely client-supplied.

**Fix:** Remove the client-generated ID entirely. Let Supabase auto-generate a UUID as `id`. Add a separate `display_id` column (e.g., `SW-` + sequence) for human-readable reference.

---

### 1.4 No input validation anywhere in the API layer
**Files:** All routes in `app/api/`

Every route calls `req.json()` and uses the result directly with no schema validation. Currently accepted:
- `POST /api/orders` with `{ total: -1, items: "lol" }` — inserts garbage
- `PATCH /api/admin/orders/[id]` with `{ status: "NotARealStatus" }` — sets invalid status
- `PATCH /api/admin/inventory/toggle` with malformed payloads — unchecked

**Fix:** Add Zod validation at each route entry point. `zod` is already in `package.json`.

---

### 1.5 No Razorpay order scaffolding exists
The checkout creates the DB order and shows a confirmation in a single step. The required Razorpay flow needs 7 steps:

1. Client clicks "Pay"
2. Server: create order in DB (`status: awaiting_payment`)
3. Server: create Razorpay Order → get `razorpay_order_id`
4. Client: open Razorpay checkout modal
5. Client: payment success callback → send `razorpay_payment_id` + signature to server
6. Server: verify HMAC signature → update order to `Paid`
7. Server: webhook for fallback confirmation

**DB verified:** `orders` table has `razorpay_order_id` and `razorpay_payment_id` columns but no `razorpay_signature` column. No webhook endpoint exists. No signature verification logic.

**Fix (pre-Phase 4):** Add `razorpay_signature TEXT` column. Create `app/api/webhooks/razorpay/route.ts`. Scaffold the full payment verification flow.

---

### 1.6 Raw database errors leaked to frontend
**Files:** All API routes

API routes return `NextResponse.json({ error: error.message }, { status: 500 })`. If a query fails, the user (or attacker) sees the exact Postgres error, potentially revealing table names, column structures, and constraint details.

**Fix:** Catch errors, log them server-side (console or a logging service), and return generic messages to the client (`"Failed to process order"`).

---

## SEVERITY 2 — High Priority: Fix Before Phase 4 Launch

### 2.1 Guest checkout collects no email
**File:** `app/checkout/page.tsx`

The `Order` type has `guest_email: string | null` and the DB column exists, but the checkout form never collects it. Razorpay requires an email for payment receipts. There is no email fallback for post-order communication.

**Fix:** Add email field to checkout form for unauthenticated users. Make it required when no session exists.

---

### 2.2 No `state` field in delivery address
**Files:** `lib/types.ts:2`, `app/checkout/page.tsx`

`OrderAddress = { line1, city, pin }`. Missing: `state`, `landmark`.

Every courier API (Shiprocket, Delhivery, Shadowfax) requires `state` for rate calculation and serviceability checks. The `address` JSONB in the DB will not contain state data for any orders placed before this is fixed.

**Fix:** Add `state` and `landmark` to `OrderAddress`. Update checkout form. No DB migration needed (it's JSONB), but existing orders won't have the data.

---

### 2.3 `useAuthGuard` has a blank-screen flash
**File:** `lib/useAuthGuard.ts`

The auth check is async. Between page render and `getSession()` resolving, protected content renders for a frame — or users see a blank screen with no indicator. Logged-out users on `/dashboard` briefly see the page before redirect.

**Fix:** Return a `loading` boolean from the guard hooks. Render a skeleton/spinner while auth resolves.

---

### 2.4 `profiles` not created in email-confirmation signup flow
**File:** `app/signup/page.tsx:47-48`

```js
if (data.session) {
  await supabase.from('profiles').insert(...)
}
```

When email confirmation is required (Supabase default), `data.session` is `null`. The profile row is never created. When that user logs in later, the `profiles` join on orders returns `null`, admin customers page shows "Unknown", and analytics breaks.

**DB verified:** No `on_auth_user_created` trigger exists on `auth.users`. Profile creation is entirely client-side.

**Fix:** Create a Postgres function + trigger on `auth.users` to auto-insert into `public.profiles`. One SQL command via MCP.

---

### 2.5 Delivery fee logic is duplicated and hardcoded
**Files:** `app/cart/page.tsx:29`, `app/checkout/page.tsx:90`

```js
// both files independently:
const deliveryFee = total >= 500 ? 0 : 50
```

Also duplicated in the server-side insert (client sends it). When you change the threshold, it breaks inconsistently across cart, checkout, and API.

**Fix:** Extract to a shared `lib/pricing.ts`. Server must also compute this independently (ties into 1.1).

---

### 2.6 No idempotency on order creation
**File:** `app/api/orders/route.ts`

If a user double-taps "Place Order" before the `placing` state activates (slow connection), two POST requests fire. With the collision-prone client ID, this sometimes fails; sometimes creates duplicate orders.

**Fix:** Use DB-generated IDs. Add an idempotency key header that the server checks before creating a new order.

---

### 2.7 Analytics page uses fabricated revenue data
**File:** `app/admin/analytics/page.tsx:26-29`

Revenue chart data is hardcoded:
```js
const revenue = [
  { m: 'Jan', r: 18500 }, { m: 'Feb', r: 22100 }, ...
]
```

"Top Products" multiplies static prices by arbitrary numbers. Real business decisions could be made based on fake data.

**Fix:** Compute revenue from real orders grouped by month. Top products from aggregating `orders.items` JSONB.

---

### 2.8 Inventory race conditions — no stock locking
**Source:** Report A

If 3 people try to buy the last 2 cookies simultaneously, the database just inserts all orders. There is no row-level lock or transactional RPC to prevent overselling.

**Fix:** When integrating stock quantities (see 4.6), use a Supabase PostgreSQL RPC function to atomically deduct `stock_quantity`. If stock falls below zero, roll back and alert the customer.

---

## SEVERITY 3 — Fix Before Phase 5 (Delivery Integration)

### 3.1 Orders table missing courier fields
**DB verified:** The `orders` table has no:

| Column | Type | Purpose |
|--------|------|---------|
| `courier_name` | TEXT | Which partner (Shiprocket, Delhivery, etc.) |
| `awb_number` | TEXT | Air waybill / tracking number |
| `tracking_url` | TEXT | Customer-facing tracking link |
| `estimated_delivery` | DATE | ETA for the customer |
| `shipped_at` | TIMESTAMPTZ | Timestamp when shipped |
| `delivered_at` | TIMESTAMPTZ | Timestamp when delivered |

**Fix:** DB migration to add these columns. Wire into `OrderStatus` flow.

---

### 3.2 Product weight is a string, not a number
**DB verified:** `products.weight` is `TEXT NOT NULL` (e.g., `"120g"`).

Every courier API needs weight as a number in grams. There's no way to calculate shipping rates per order.

**Fix:** Add `weight_grams INTEGER` column to products table. Parse and migrate existing weight string values.

---

### 3.3 No pincode serviceability check
Checkout accepts any 6-digit string as pincode with no validation. Non-serviceable pincodes accepted at checkout → manual cancellation → bad customer experience.

**Fix:** Add a pincode validation API call on the delivery address step using Shiprocket/Delhivery serviceability APIs.

---

### 3.4 No pickup location stored
Courier APIs require a registered pickup address. This isn't stored anywhere in the app or DB.

**Fix:** Add a `settings` table (or env config) for Nupur's pickup address, needed for Shiprocket merchant registration.

---

### 3.5 Delivery metadata too sparse for courier APIs
**Source:** Report A

Shiprocket requires explicit fields: `pickup_location`, `length`, `width`, `height`, `weight` (of the box), `billing_city`, `billing_pincode`, `shipping_label_url`. None of these exist.

**Fix:** Add product dimension fields and box-sizing logic. Add `shipping_label_url TEXT` to orders.

---

## SEVERITY 4 — Scale & Production Quality

### 4.1 No pagination on any list endpoint
**Files:** `app/api/admin/orders/route.ts`, `app/api/admin/customers/route.ts`

All endpoints return every row. At 1,000 orders (achievable within months), the admin orders page will timeout at Vercel's 10-second limit.

**Fix:** Add `?page=&limit=` query params with Supabase `.range(from, to)`.

---

### 4.2 Cart doesn't reconcile stale data
**File:** `context/CartContext.tsx:24-28`

On app load, the cart is hydrated directly from `localStorage` with no freshness check. If a product is removed, price changes, or goes out of stock after the user added it, the cart is silently wrong.

**Fix:** On cart hydration, fetch current product data from `/api/products`, reconcile prices and stock status, surface warnings to the user.

---

### 4.3 `/api/products` uses the anon key and no caching
**File:** `app/api/products/route.ts:1`

```js
import { supabase } from '@/lib/supabase'  // anon key
```

Products are public data fetched by multiple pages. No HTTP caching headers. Every page load re-queries the DB.

**Fix:** Use `supabaseAdmin` (bypasses RLS for public read). Add `Cache-Control: public, s-maxage=60` header. Or convert to a Server Component with ISR `revalidate`.

---

### 4.4 Heavy dependencies loaded globally
From `package.json`:
- `framer-motion` (~40KB gzip) — used on landing page only
- `gsap` + `@gsap/react` (~120KB gzip) — usage extent unclear
- `recharts` (~80KB gzip) — only on admin analytics page

All bundle into the main chunk unless code-split.

**Fix:** Dynamic imports for `recharts` on analytics page. Audit GSAP — if homepage-only, lazy load it.

---

### 4.5 Two menu pages with different data sources
**Files:** `app/menu/page.tsx`, `app/(portal)/app/menu/page.tsx`

The portal menu (`/app/menu`) correctly fetches from `/api/products`. The public marketing menu (`/menu`) imports from static `lib/data.ts`. Two sources of truth for the same products.

**Fix:** The public `/menu` page is a marketing showcase (hardcoded product sections like "Thecha Curlies" etc.), so it's intentionally static. However, verify that none of the clickable products link to checkout flows that would use stale prices.

---

### 4.6 No stock quantity — only boolean `in_stock`
**DB verified:** `products.in_stock` is `BOOLEAN DEFAULT true`. No numeric `stock_quantity` column.

A homemade bakery doesn't have infinite stock. There's no way to:
- Prevent overselling when multiple customers add the same low-stock item
- Let admin set "I have 20 granola bars"
- Generate production planning numbers

**Fix (for Phase 5 scale):** Add `stock_quantity INTEGER` to products. Decrement atomically on order creation using a Supabase RPC function.

---

### 4.7 No rate limiting on any endpoint
**Source:** Report A

No rate limiting on any API route. Bots can spam checkout, scrape inventory, or perform card-testing attacks when Razorpay is live.

**Fix:** Implement Upstash Redis (or Vercel KV) rate limiting on `/api/orders` (e.g., max 5 orders per IP per hour).

---

### 4.8 Edge caching & revalidation not implemented
**Source:** Report A

Product menus should load instantly from a CDN cache but update immediately when Nupur changes price or stock. Currently `/api/products` is a standard dynamic route with no caching strategy.

**Fix:** Use Next.js ISR. The menu page should be statically generated. When admin toggles stock, call `revalidateTag('products')` to invalidate the cache.

---

## SEVERITY 5 — Additional Gaps (Missed by Both Reports)

### 5.1 RLS policy on `inventory_logs` is wide open
**DB verified:** The RLS policy on `inventory_logs` is:
```sql
Policy: "Admin reads logs" — cmd: ALL, qual: true
```
This means **any authenticated user** (not just admins) can read, insert, update, and delete inventory audit logs via the Supabase client. The policy should restrict to admin roles only.

**Fix:** Update policy: `qual: (auth.jwt() ->> 'role' = 'admin')` or restrict to service role only.

---

### 5.2 Orders `user_id` is nullable with no compound check
**DB verified:** `orders.user_id` is `UUID NULL`. Guest orders set it to `null`. But there's no database constraint ensuring that if `user_id IS NULL`, then `guest_name` and `guest_phone` are populated. A malformed request could create an anonymous order with no contact info.

**Fix:** Add a CHECK constraint: `(user_id IS NOT NULL) OR (guest_name IS NOT NULL AND guest_phone IS NOT NULL)`.

---

### 5.3 No CSRF protection on state-mutating routes
All POST/PATCH routes rely solely on the `Authorization: Bearer` header. While this is standard for SPAs, Supabase stores the JWT in `localStorage`, and Next.js API routes don't have built-in CSRF protection. If the tokens are ever moved to cookies (e.g., for SSR), CSRF becomes a real vector.

**Fix (low priority now, critical if cookies are adopted):** Add `SameSite=Strict` on any future cookie-based auth. Consider CSRF tokens for the webhook endpoint.

---

### 5.4 No `updated_at` column on `orders` or `products`
**DB verified:** Neither `orders` nor `products` has an `updated_at` timestamp. When admin updates order status or toggles stock, there's no record of *when* the last mutation occurred. This makes debugging, analytics, and audit trails incomplete.

**Fix:** Add `updated_at TIMESTAMPTZ DEFAULT now()` columns. Create a trigger to auto-update on row modification.

---

### 5.5 Coupon/promo codes have no backend validation
The Offers page (`app/(portal)/app/offers/page.tsx`) displays coupon codes like `FRESH15`, `SNACK50`, `HEALTHY20` with copy-to-clipboard functionality, but there is no backend `coupons` table, no validation endpoint, and no discount application in the checkout flow. Customers will expect these to work at checkout.

**Fix:** Create a `coupons` table. Add a `/api/coupons/validate` endpoint. Wire into the checkout flow to apply discounts server-side before calculating the total.

---

### 5.6 `orders.id` is `TEXT` but should be `UUID` with auto-default
**DB verified:** `orders.id` is `TEXT NOT NULL` with no default. This is the client-generated `SW-XXXX` from gap 1.3. Unlike other tables (`inventory_logs.id` is `UUID DEFAULT gen_random_uuid()`, `profiles.id` is `UUID`), orders has a string PK with no auto-generation.

**Fix:** Migrate `orders.id` to `UUID DEFAULT gen_random_uuid()`. Add `display_id TEXT` with a sequence-based trigger for `SW-XXXX` format.

---

## Missing Standard Features for a Food D2C Platform

| Feature | Status | Priority |
|---------|--------|----------|
| Order confirmation email | Not implemented | P1 — needed at launch |
| Status change notifications (WhatsApp/email) | Not implemented | P1 |
| Coupon/promo code validation | Marketing copy exists, no backend | P1 (Phase 4 prereq) |
| Product detail page | No route exists | P2 |
| Allergen / ingredient info | No DB fields | P2 (FSSAI compliance) |
| Saved delivery addresses | Not implemented | P2 |
| "Notify when back in stock" | Not implemented | P2 |
| Order cancellation by customer | Not implemented | P2 |
| Profile edit (name, phone) | Read-only dashboard | P3 |
| Wishlist | Placeholder tab, zero logic | P3 |
| Product search (full-text) | Category filter only | P3 |
| `sitemap.xml` + `robots.txt` | Missing | P3 (SEO) |
| Dynamic OG tags per product | Not implemented | P3 |
| Gift packaging option | Not implemented | P4 |

---

## Recommended Fix Order Before Phase 4

| # | Task | Category | Est. Time |
|---|------|----------|-----------|
| 1 | Fix admin role → `app_metadata` | Security | 30 min |
| 2 | Server-side price recomputation | Security | 2 hrs |
| 3 | DB-generated order UUID + `display_id` | Data Integrity | 1 hr |
| 4 | Zod validation on all API routes | Security | 2 hrs |
| 5 | Lock down raw error messages | Security | 30 min |
| 6 | Fix `inventory_logs` RLS policy | Security | 15 min |
| 7 | Create `profiles` trigger on `auth.users` | Data Integrity | 20 min |
| 8 | Extract delivery fee to `lib/pricing.ts` | Reliability | 30 min |
| 9 | Add `guest_email` to checkout form | Payment prereq | 30 min |
| 10 | Add `state` + `landmark` to address form | Delivery prereq | 45 min |
| 11 | Add `razorpay_signature` column + webhook scaffold | Phase 4 schema | 1 hr |
| 12 | Add idempotency key to order creation | Reliability | 45 min |
| 13 | Add `useAuthGuard` loading state | UX | 30 min |
| 14 | Fix analytics to use real order data | Trustworthiness | 2 hrs |
| 15 | Add pagination to admin list endpoints | Scale | 1 hr |
| 16 | Add `updated_at` columns + triggers | Auditability | 30 min |
| 17 | Add guest order contact constraint | Data Integrity | 15 min |
| **Total** | | | **~14 hrs** |

> [!WARNING]
> **Tasks 1–6 are non-negotiable before connecting Razorpay.** A single missed item in this group opens a financial exploit vector or an admin privilege escalation path.

> [!TIP]
> Tasks 7–13 should be completed before the first real customer touches the checkout flow. Tasks 14–17 can be done in parallel with Phase 4 implementation as they don't block payment integration.
