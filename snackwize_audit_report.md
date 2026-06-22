# Snackwize — Deep Scale & Architecture Audit

As we approach **Phase 4 (Razorpay)** and **Phase 5 (Shiprocket)**, the platform shifts from a "showcase" to a "financial engine." Before we connect real money and real delivery trucks, we must harden the application. 

Here is a deep audit of what a scalable, baked-goods e-commerce platform requires, compared directly against your current Next.js/Supabase codebase.

---

## 1. Security & Data Integrity (CRITICAL GAPS)

### The "₹1 Cookie" Exploit (Pricing Trust)
- **Standard:** The backend MUST recalculate cart totals using secure server-side prices before creating an order or payment link.
- **Current State:** In `app/api/orders/route.ts`, the server blindly accepts `body.subtotal`, `body.delivery_fee`, and `body.total` from the client.
- **Risk:** A malicious user can intercept the POST request, change `total` to `1`, and successfully checkout a ₹5000 order for ₹1. 
- **Fix Needed:** The `/api/orders` route must fetch the latest prices from Supabase using `body.items`, multiply them server-side, calculate the delivery fee dynamically, and ensure the total matches before generating a Razorpay order.

### Zod Validation
- **Standard:** All incoming API payloads must be strictly validated.
- **Current State:** Endpoints like `/api/orders` cast `await req.json()` blindly.
- **Fix Needed:** Implement `zod` schemas for order payloads to prevent database injection or malformed data crashing the admin dashboard.

---

## 2. Payments & Checkout Reliability (Phase 4 Prep)

### Razorpay Webhooks & Idempotency
- **Standard:** Payments fail, connections drop, and users refresh pages. You need idempotency and webhook fallback.
- **Current State:** The checkout flow relies on client-side success (e.g., placing the order on clicking "Pay"). 
- **Fix Needed:** 
  1. Create the order in Supabase as `payment_status: 'pending'` BEFORE opening Razorpay.
  2. Build a secure `/api/webhooks/razorpay` endpoint to verify the Razorpay HMAC signature and mark the order as `Paid`. Never trust the client-side "payment success" callback as the sole source of truth.

### Inventory Race Conditions
- **Standard:** If 3 people try to buy the last 2 cookies simultaneously, the database must use row-level locks or transactional RPCs to prevent overselling.
- **Current State:** The database just inserts the order.
- **Fix Needed:** When integrating the Stock & Inventory system, we must use a Supabase PostgreSQL function (RPC) to atomically deduct `stock_quantity`. If stock falls below zero during the transaction, it rolls back and alerts the customer.

---

## 3. Shipping & Logistics (Phase 5 Prep)

### Order Items Data Structure (✅ RESOLVED)
- **Previous State:** `orders.items` was a `JSONB` array, which made pre-order tracking difficult.
- **Current State:** The new inventory system successfully handles the JSONB extraction via API routes and JavaScript mapping to generate the pre-order lists. This bypasses the need for relational joins for now.
- **Next Steps:** We will stick with the JSONB array for Phase 5 unless Shiprocket explicitly requires relational breakdown.

### Delivery Meta-data
- **Standard:** Orders need specific fields for logistics engines.
- **Current State:** We capture a flat JSON `address`.
- **Fix Needed:** Shiprocket requires explicit fields: `pickup_location`, `length`, `width`, `height`, `weight` (of the box), `billing_city`, `billing_pincode`. We must add `awb_number`, `courier_name`, and `shipping_label_url` columns to the `orders` table.

---

## 4. Performance & Scalability

### Edge Caching & Revalidation
- **Standard:** Product menus should load instantly from a CDN cache, but update immediately when Nupur changes a price or stock level.
- **Current State:** `/api/products` is a standard dynamic route. 
- **Fix Needed:** Use Next.js Incremental Static Regeneration (ISR). The menu page should be statically generated. When Nupur toggles "Sold Out" in the admin dashboard, the admin API should call `revalidateTag('products')` to instantly update the cache worldwide.

### Rate Limiting
- **Standard:** Prevent bots from spamming the checkout API or scraping your inventory.
- **Current State:** No rate limiting.
- **Fix Needed:** Implement Upstash Redis (or Supabase equivalent) rate limiting on `/api/orders` (e.g., max 5 orders per IP per hour) to prevent card-testing attacks when Razorpay is live.

---

## 5. Observability

### Error Leaking
- **Standard:** Never expose raw database errors to the frontend.
- **Current State:** API routes return `NextResponse.json({ error: error.message })`. If a query fails, the user (or attacker) sees the exact Postgres error, potentially revealing table structures.
- **Fix Needed:** Catch errors, log them securely, and return generic messages to the client ("Failed to process order").

---

> [!WARNING]
> **Priority Action Plan before Razorpay:**
> 1. Secure the Checkout API (Server-side price calculation).
> 2. Add Zod Validation.
> 3. Lock down Database Errors.
> 
> *The Inventory System architecture has been successfully completed! Shall we execute the 3 critical security patches above to prepare for Razorpay?*
