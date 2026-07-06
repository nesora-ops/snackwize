# Production Readiness Audit Plan

After wiring up Resend, Razorpay, and Shiprocket, this audit reconciles the codebase, fixes conflicts introduced across the build phases, and hardens everything for production.

---

## Phase 1 — Fix the `local` → `domestic` Rename Across Remaining Files

We renamed `local` to `domestic` in `lib/data.ts` and the admin UI, and ran an `UPDATE` on the `products` table. But several backend files still reference `'local'` — these will silently mismatch the DB values.

> [!CAUTION]
> These are **live bugs** — the shipping router, validation schema, order types, and cart logic all still say `'local'`. After the DB rename to `'domestic'`, new orders will fail to route correctly.

### Files to fix

| File | Line(s) | What's wrong |
|------|---------|-------------|
| [validation.ts](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/validation.ts#L58) | 58 | `z.enum(['local', 'hyperlocal']).default('local')` — must become `'domestic'` |
| [types.ts](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/types.ts#L1) | 1, 30 | `OrderItem.delivery_type` and `Order.delivery_mode` both use `'local'` — must be `'domestic'` |
| [shipping.ts](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/shipping.ts#L33-L37) | 33–37 | `orderDeliveryMode()` returns and checks `'local'` — must match DB |
| [CartContext.tsx](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/context/CartContext.tsx#L77-L80) | 77–80 | Cart mixing check uses `'local'` string — must be `'domestic'` |

### DB column: `orders.delivery_mode`

The `orders` table stores `delivery_mode` values. Any existing orders with `delivery_mode = 'local'` must be updated to `'domestic'`, and the DB check constraint (if one exists) must be altered — same pattern as the products migration.

---

## Phase 2 — Dead Code & Leftover Cleanup

| Item | Location | Action |
|------|----------|--------|
| `lovable-error-reporting.ts` | [lib/](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/lovable-error-reporting.ts) | Delete — scaffold-generated dead code |
| `error-capture.ts` | [lib/](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/error-capture.ts) | Check if imported anywhere; delete if unused |
| `error-page.ts` | [lib/](file:///c:/Users/hrida/Documents/AA%20A/bizprojects/Nesora/Snackwize/lib/error-page.ts) | Check if imported anywhere; delete if unused |
| `migrate-delivery-type.js` | root | Already deleted — confirm it's gone |
| `hyperlocal_cutoff` field | `lib/data.ts` | This was added but `hyperlocal_cutoff` message was rolled back — verify it's still useful for the sold-out cart-drop logic or remove it |
| `lib/api/` subdir | `lib/api/` | Inspect — may be a leftover empty or duplicate directory |

---

## Phase 3 — Security Hardening

| Check | Detail |
|-------|--------|
| **`.env` not in git** | Verify `.gitignore` has `.env*` — the `.env` file contains the Supabase service role key and DB password in plaintext |
| **RLS on `app_settings`** | The `app_settings` table is used for `parcel_box` and `accepting_hyperlocal_orders` — ensure RLS is enabled and only service_role can read/write |
| **RLS on `orders`, `products`, `stock_movements`** | Audit that anon/authenticated users can't bypass the API and directly read/write via the Supabase client |
| **Admin route protection** | All `/api/admin/*` routes use `getAdmin()` — verify `getAdmin` actually checks a role/flag, not just "is authenticated" |
| **Webhook endpoints are public but validated** | `/api/webhooks/razorpay` (HMAC), `/api/webhooks/shiprocket` (x-api-key) — confirm these reject unsigned payloads |
| **Env var validation at startup** | No crash guard if `RAZORPAY_KEY_ID` is empty — the app builds but `/api/orders POST` returns 503. Add a startup health check or clear error page |

---

## Phase 4 — Functional Reconciliation

### Cart → Checkout → Payment flow
- Verify the `RAZORPAY_KEY_ID` is passed to the Razorpay checkout modal (client-side needs `NEXT_PUBLIC_RAZORPAY_KEY_ID`)
- Confirm the Razorpay script loads correctly (`checkout.razorpay.com/v1/checkout.js`)
- Trace: `POST /api/orders` → Razorpay order created → modal opens → user pays → `POST /api/payments/verify` → `confirmPaymentAndConsume` → stock consumed → shipment booked

### Shipment routing
- Domestic orders → `createStandardShipment()` → Shiprocket adhoc order + AWB
- Hyperlocal orders → `createQuickShipment()` → Shiprocket Quick (the `is_hyperlocal: true` flag — **verify this is the correct Shiprocket API parameter**)
- `cancelOrder()` → blocks hyperlocal, refunds + restocks domestic, cancels Shiprocket booking

### Hyperlocal cutoff toggle
- Toggle OFF → `/api/products` returns `in_stock: false` for hyperlocal products → cart reconciliation auto-drops them → menu shows "Sold Out"
- Toggle ON → products return to their real `in_stock` value

### Order status webhook chain
- Shiprocket status update → `/api/webhooks/shiprocket` → updates `orders.status` to Shipped/Delivered
- Razorpay payment.captured → `/api/webhooks/razorpay` → idempotent `confirmPaymentAndConsume`

---

## Phase 5 — Environment Variable Audit

Verify every env var is documented, has a placeholder in `.env`, and is set on Vercel:

| Variable | Required? | Set in `.env`? | Set on Vercel? |
|----------|-----------|----------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ? |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ? |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ? |
| `RESEND_API_KEY` | ✅ | Placeholder | ? |
| `RESEND_FROM` | Optional | ✅ | ? |
| `CRON_SECRET` | ✅ (for campaigns) | Placeholder | ? |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | ? |
| `RAZORPAY_KEY_ID` | ✅ | Placeholder | ? |
| `RAZORPAY_KEY_SECRET` | ✅ | Placeholder | ? |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Placeholder | ? |
| `SHIPROCKET_EMAIL` | ✅ | Placeholder | ? |
| `SHIPROCKET_PASSWORD` | ✅ | Placeholder | ? |
| `SHIPROCKET_PICKUP_LOCATION` | ✅ | Placeholder | ? |
| `SHIPROCKET_CHANNEL_ID` | Optional | Placeholder | ? |
| `SHIPROCKET_WEBHOOK_TOKEN` | ✅ | Placeholder | ? |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ (client modal) | **Missing?** | ? |

> [!IMPORTANT]
> The checkout page loads the Razorpay script and opens the modal. Double check that `RAZORPAY_KEY_ID` is exposed to the client as `NEXT_PUBLIC_RAZORPAY_KEY_ID`, or that the API returns it in the order creation response (it does via `keyId: process.env.RAZORPAY_KEY_ID`). Confirm this reaches the frontend properly.

---

## Phase 6 — Build Verification

```
1. npm run build          → zero errors, zero warnings
2. npm run dev            → smoke test all routes
3. git diff --stat HEAD~5 → review all recent changes are intentional
```

---

## Open Questions

> [!IMPORTANT]
> 1. **`orders.delivery_mode` DB constraint** — Does the `orders` table have a CHECK constraint on `delivery_mode` like `products` did? If so, we need to alter it to accept `'domestic'` before the code change goes live.
> 2. **Existing orders** — Are there any existing orders in production with `delivery_mode = 'local'`? If yes, do we migrate them to `'domestic'` or leave them as historical data?
> 3. **Shiprocket Quick** — The `createQuickShipment` function passes `is_hyperlocal: true` in the adhoc payload. Have you confirmed with Shiprocket that this is the correct API parameter for Quick (Borzo) orders, or is there a separate endpoint?

---

## Execution Order

```
Phase 1 (Critical bugs)  → Fix local→domestic in all remaining files + DB
Phase 2 (Cleanup)         → Remove dead files
Phase 3 (Security)        → RLS audit + env validation
Phase 4 (Functional)      → End-to-end trace of every flow
Phase 5 (Env vars)        → Verify all vars are set on Vercel
Phase 6 (Build)           → Clean build + smoke test
```
