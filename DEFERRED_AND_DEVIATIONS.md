# Snackwize — Deferred & Deviated Items

**Date:** 2026-06-22
**Context:** Companion to `FINAL_AUDIT_REPORT.md`. The pre-Phase-4 hardening pass closed every in-scope gap (security, data integrity, validation, scale, UX). This document records the items that were **intentionally not built** (deferred) and the two places where the implementation **diverged** from the report's recommendation, with rationale and what's needed to revisit.

> Scope decision (from the user): *fill current gaps only — do not integrate Phase 4 (Razorpay), Phase 5 (Shiprocket), or touch Vercel/infra; do not build future functionality.*

---

## A. Deferred Items

Each entry: what it is, **why deferred**, **risk while deferred**, and **what unblocks it**.

### A.1 — Razorpay payment integration  · _Audit 1.5_
- **What:** Create-order → checkout modal → HMAC signature verify → webhook fallback. `razorpay_signature` column, `/api/webhooks/razorpay`, `razorpay` npm package.
- **Why deferred:** This *is* Phase 4. Explicitly out of scope.
- **Risk while deferred:** None today — no real payments flow yet. Checkout currently records the order with `payment_status: 'pending'`.
- **Unblocks when:** Phase 4 starts. Prereqs already in place: server-authoritative `total` (1.1), DB-generated order id, `razorpay_order_id` / `razorpay_payment_id` columns exist.
- **Still needed at that point:** add `razorpay_signature` column, the webhook route, signature verification, and wire the modal into [app/checkout/page.tsx](app/checkout/page.tsx).

### A.2 — Courier / delivery fields & integration  · _Audit 3.1, 3.3, 3.4, 3.5_
- **What:** `courier_name`, `awb_number`, `tracking_url`, `estimated_delivery`, `shipped_at`, `delivered_at` on orders; pincode serviceability check; stored pickup location; box dimensions + `shipping_label_url`.
- **Why deferred:** This is Phase 5 (3rd-party delivery). Explicitly out of scope.
- **Risk while deferred:** The customer-facing **track page is still demo data** ([app/(portal)/app/track/page.tsx](app/(portal)/app/track/page.tsx) uses `DEMO_ORDERS`). Real customers will see fake tracking. *This is the one deferred item with live customer-visible impact.*
- **Unblocks when:** Phase 5 starts.
- **Interim option (not done):** wire the track page to the real `/api/orders` so customers at least see their actual order + status, even before courier AWB tracking exists. Recommend doing this before first real customer, independent of Phase 5.

### A.3 — Numeric stock + overselling lock  · _Audit 2.8, 4.6_
- **What:** `stock_quantity` column, atomic deduct-on-order RPC, inventory UI for setting quantities.
- **Why deferred:** User chose to keep the boolean `in_stock` / `allow_backorder` model for now.
- **Risk while deferred:** No oversell protection if two customers race for the last unit. Acceptable for a made-to-order / pre-order home bakery model where `allow_backorder` is the norm.
- **Unblocks when:** Demand makes per-unit stock tracking worthwhile. Additive change — no rework of current inventory system.

### A.4 — Coupon / promo validation system  · _Audit 5.5_
- **What:** `coupons` table, `/api/coupons/validate`, server-side discount applied to the total at checkout.
- **Why deferred:** Net-new **feature**, not a gap-fill. Also touches the money path, so best built alongside Phase 4 pricing.
- **Risk while deferred:** The Offers page advertises codes (`FRESH15`, etc.) that don't work at checkout — a broken promise to customers.
- **Unblocks when:** Phase 4, or sooner if marketing pushes the codes. The `offers` table already exists (display-only); it needs a real `discount` amount/type and validation logic.

### A.5 — Profiles auth trigger / email verification  · _Audit 2.4_
- **What:** Postgres `on_auth_user_created` trigger to auto-insert `profiles`; email confirmation flow.
- **Why deferred:** Per user — email verification will be configured later with Resend + Supabase SMTP. Today, signup creates a session immediately, so the client-side profile insert in [app/signup/page.tsx](app/signup/page.tsx) works.
- **Risk while deferred:** If email confirmation is turned **on** before the trigger exists, `data.session` is null at signup and the profile row is never created (customer shows "Unknown", analytics gaps).
- **Unblocks when:** SMTP/Resend setup. **Action coupled to that work:** add the DB trigger at the same time you enable email confirmation, otherwise profile creation silently breaks.

### A.6 — Rate limiting  · _Audit 4.7_
- **What:** Per-IP limits on `/api/orders` (and others) via Upstash Redis / Vercel KV.
- **Why deferred:** Needs an external account + is most valuable once Razorpay is live (card-testing defense). Touches infra (out of scope).
- **Risk while deferred:** Endpoints can be spammed; low impact pre-payments.
- **Unblocks when:** Phase 4 (do it with Razorpay). Requires Upstash/KV credentials.

### A.7 — Edge ISR / `revalidateTag`  · _Audit 4.8_
- **What:** Statically generate the menu and invalidate via `revalidateTag('products')` on admin stock changes.
- **Why deferred:** Infra/Vercel-specific (out of scope). **Partially addressed:** `/api/products` now sends `Cache-Control: s-maxage=60, stale-while-revalidate=300`, which gives most of the benefit without infra changes.
- **Unblocks when:** Anytime; it's an optimization on top of the caching already added.

### A.8 — CSRF tokens  · _Audit 5.3_
- **What:** CSRF protection on state-mutating routes.
- **Why deferred:** Auth uses `Authorization: Bearer` headers (not cookies), so CSRF isn't currently exploitable.
- **Risk while deferred:** None now. **Becomes real only if** auth tokens are ever moved to cookies (e.g. for SSR).
- **Unblocks when:** Only if/when adopting cookie-based auth — then add `SameSite=Strict` + CSRF tokens.

### A.9 — Other missing D2C features (catalogue from the report)
Not started; none are gaps in existing functionality — they're roadmap features: order confirmation email, status-change notifications, product detail page, allergen/FSSAI fields, saved addresses, "notify when back in stock", customer-side order cancellation, profile editing, real wishlist, full-text search, `sitemap.xml`/`robots.txt`, per-product OG tags, gift packaging.

---

## B. Deviations from the Report

Where the implementation intentionally differs from what `FINAL_AUDIT_REPORT.md` recommended.

### B.1 — Order ID: sequence-backed `SW-####` instead of UUID + `display_id`  · _Audit 1.3 / 5.6_
- **Report recommended:** migrate `orders.id` to `UUID DEFAULT gen_random_uuid()` and add a separate `display_id TEXT` (`SW-` + sequence) for humans.
- **What was done:** kept `orders.id` as `TEXT`, but gave it a **server-side sequence default**: `'SW-' || nextval('order_display_seq')` (sequence starts at 1042). Client no longer sends or controls the id.
- **Why:** It fully closes the actual vulnerability — no client control, no birthday-paradox collisions, server-authoritative — while keeping the single human-readable `SW-####` identifier the entire UI/UX already references (`o.id` in admin tables, dashboard, confirmation screen). Avoids a breaking PK-type change and a second id field. Tables were empty, so either path was safe; this one is simpler and less invasive.
- **Trade-off / how to revert:** Sequential ids are guessable and leak rough order volume. If that matters, switch to the UUID-PK + `display_id` split — it's a clean migration now (still near-zero rows) but then touches everywhere `o.id` is shown.

### B.2 — Idempotency: button-guard + unique server ids, no idempotency-key header  · _Audit 2.6_
- **Report recommended:** DB-generated ids **plus** an idempotency-key header the server checks to dedupe.
- **What was done:** DB-generated ids (removes the duplicate-PK / collision failure mode) + the existing `placing` state disables the "Place Order" button during submit.
- **Why:** Together these cover the realistic double-tap case. A full idempotency-key store (persisting keys, checking on insert) is meaningfully more plumbing for a small residual risk.
- **Trade-off:** A determined double-submit on a very slow connection (two requests in flight before the button disables) could still create two distinct orders. If/when this is observed, add an idempotency-key header keyed to the checkout session.

### B.3 — `/menu` (public marketing page) left static  · _Audit 4.5_
- **Report note:** the public `/menu` reads from static `lib/data.ts` while `/app/menu` uses live `/api/products` — two sources of truth.
- **What was done:** left `/menu` static (it's a marketing showcase), **but** the risk is now neutralized by two other changes: the cart **reconciles against live products on load**, and the server **recomputes price at checkout**. So even if `/menu` shows a stale price, an order can never be placed at one.
- **Trade-off:** Display price on `/menu` can drift from the real price until someone updates `lib/data.ts`. Cosmetic only; not a money-path risk.

---

## C. Recommended near-term follow-ups (independent of Phase 4/5)

| Priority | Item | Ref |
|---|---|---|
| **High** | Wire the customer **track page** to real `/api/orders` (stop showing demo data) | A.2 |
| Medium | Add the **profiles DB trigger** at the same moment email confirmation is enabled | A.5 |
| Low | Decide on order-id scheme (keep `SW-####` vs UUID+`display_id`) before volume grows | B.1 |
