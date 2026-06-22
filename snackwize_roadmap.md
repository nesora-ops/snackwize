# Snackwize — Production Roadmap for Claude Code
**Prepared by:** Antigravity (Architect)  
**For:** Claude Code (Implementor)  
**Project:** Snackwize by Nupur | Nesora Ventures  
**Stack:** Next.js 14 (App Router) · Tailwind CSS v4 · TypeScript · Vercel · GitHub

---

> **Read CLAUDE.md before starting any phase.**  
> Rules: Simplicity First · Surgical Changes · Think Before Coding · Goal-Driven Execution.  
> Touch only the files listed per phase. No speculative abstractions.

---

## Current State Snapshot

| Layer | Status |
|---|---|
| Frontend / UI | ~85% complete — all pages exist, all data is hardcoded mock |
| Auth | Mock `localStorage` (`snackwize_user`, `snackwize_admin`) — no real auth |
| Database | **None** — `lib/data.ts` contains static TypeScript arrays |
| Cart | `localStorage` via `CartContext` — works, keep as-is |
| Payments | **None** |
| Delivery | **None** |
| Deployment | **Not yet on Vercel** |

### Key Files to Know
| File | What it does |
|---|---|
| `lib/data.ts` | Static product, order, customer data — will be replaced by DB calls |
| `lib/auth.ts` | Mock localStorage auth — will be replaced by Supabase Auth |
| `context/CartContext.tsx` | localStorage cart — **DO NOT touch in any phase** |
| `app/layout.tsx` | Root layout with `CartProvider` + `ConditionalShell` |
| `app/(portal)/` | PWA-style app shell (bottom nav, mobile layout) |
| `app/admin/dashboard/` | Admin operations portal |
| `app/checkout/page.tsx` | 3-step checkout — needs real payment integration |

---

## Database Decision: Use Supabase (PostgreSQL)

**Recommendation: Supabase**

Reasoning for this specific project:
- **Vercel-native**: First-class Vercel integration, free tier works for MVP
- **Auth included**: Supabase Auth replaces the mock `localStorage` auth with zero extra infrastructure
- **Row-level security**: Admin vs. customer data isolation built-in
- **Real-time**: Order status updates can be pushed live to customer dashboard without polling
- **Small scale**: Snackwize is a D2C small brand — no need for MongoDB's complexity or Firebase's vendor lock-in
- **TypeScript SDK**: `@supabase/supabase-js` integrates cleanly with Next.js App Router

**Do NOT use:** Firebase (vendor lock-in, pricing), MongoDB (overkill for relational order data), PlanetScale (deprecated free tier).

---

## Phase 1 — Database Setup & Schema (Supabase)

**Goal:** Supabase project live with correct schema. No frontend changes yet.

### 1.1 — Manual Steps (You do these in Supabase dashboard)

1. Create a new Supabase project at https://supabase.com
2. Note: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
3. Run the SQL schema below in the Supabase SQL editor

### 1.2 — SQL Schema (Run in Supabase SQL editor)

```sql
-- Products table (seeded from lib/data.ts)
create table products (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  weight text not null,
  price integer not null,
  image text not null,
  badge text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  phone text,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id text primary key, -- format: SW-XXXX
  user_id uuid references profiles(id),
  guest_name text,
  guest_phone text,
  guest_email text,
  items jsonb not null, -- [{id, name, qty, price}]
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  address jsonb not null, -- {line1, city, state, pin}
  payment_method text not null,
  payment_status text default 'pending', -- pending | paid | failed
  razorpay_order_id text,
  razorpay_payment_id text,
  status text default 'Pending', -- Pending | Confirmed | Packed | Shipped | Delivered | Cancelled
  created_at timestamptz default now()
);

-- Row Level Security
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;

-- Products: public read
create policy "Public can read products" on products for select using (true);

-- Profiles: user can read/update own profile
create policy "User owns profile" on profiles for all using (auth.uid() = id);

-- Orders: user sees own orders
create policy "User sees own orders" on orders for select using (auth.uid() = user_id);
create policy "User inserts own orders" on orders for insert with check (auth.uid() = user_id or user_id is null);
```

### 1.3 — Files to Create/Modify

#### [MODIFY] `.env` (add these lines)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### [NEW] `lib/supabase.ts`
Create a single shared Supabase client:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

#### [NEW] `lib/supabase.server.ts`
Server-side admin client (for API routes only, uses service role key):
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

#### Install dependency
```bash
bun add @supabase/supabase-js
```

#### [NEW] `scripts/seed.ts`
A one-time seed script that reads `PRODUCTS` from `lib/data.ts` and inserts them into Supabase. Run once manually:
```bash
bun run scripts/seed.ts
```

### 1.4 — Verification
- [ ] `supabase.from('products').select('*')` returns 12 products in browser console
- [ ] Supabase dashboard shows `products`, `profiles`, `orders` tables populated

---

## Phase 2 — Real Authentication

**Goal:** Replace mock `localStorage` auth with Supabase Auth. Frontend feels identical to user.

> **Assumption:** Keep `CartContext.tsx` (localStorage cart) completely untouched. Cart merges on login already work via the existing logic.

### 2.1 — Replace `lib/auth.ts`

**[MODIFY] `lib/auth.ts`** — Delete all mock localStorage code. Replace entirely with Supabase Auth wrappers:

Functions to implement (same signatures so callers don't break):
- `getUser()` → calls `supabase.auth.getUser()`, returns `{name, email, phone}` or null
- `setUser()` → not needed (Supabase handles session); remove callers
- `logout()` → calls `supabase.auth.signOut()`, dispatches `snackwize-auth` event
- `isAdmin()` → reads `user_metadata.role === 'admin'` from Supabase session
- `setAdmin()` → not needed; admin role set via Supabase dashboard

### 2.2 — Update Login/Signup Pages

**[MODIFY] `app/login/page.tsx`**
- Replace `setUser(mockUser)` with `supabase.auth.signInWithPassword({ email, password })`
- Keep the existing 3-state UI (empty/guest/logged-in) — only wire the submit handler

**[MODIFY] `app/signup/page.tsx`**
- Replace mock signup with `supabase.auth.signUp({ email, password, options: { data: { name } } })`
- On success, insert row into `profiles` table

### 2.3 — Admin Auth

**[MODIFY] `app/admin/login/page.tsx`**
- Admin login: `supabase.auth.signInWithPassword({ email: adminEmail, password })`
- Check `user.user_metadata.role === 'admin'` after login
- Remove Quick Access demo button (or keep it clearly labelled as demo-only)

> **Note for Nupur:** Set your admin account's `role: 'admin'` in Supabase dashboard → Authentication → Users → Edit user metadata.

### 2.4 — Protect Routes

**[MODIFY] `lib/useAuthGuard.ts`**
- Replace localStorage check with `supabase.auth.getSession()`
- Redirect to `/login` if no session (customer guard)
- Redirect to `/admin/login` if not admin (admin guard)

### 2.5 — Verification
- [ ] Sign up a new user → profile row appears in Supabase `profiles` table
- [ ] Login → Navbar shows "Hi, [Name]"
- [ ] Logout → clears session, navbar resets
- [ ] `/dashboard` redirects to `/login` when logged out
- [ ] `/admin/dashboard` redirects to `/admin/login` when not admin

---

## Phase 3 — Backend Data Wiring (API Routes)

**Goal:** All pages read from Supabase instead of `lib/data.ts` static arrays. Admin portal shows real data.

### 3.1 — Products

**[NEW] `app/api/products/route.ts`**
- `GET /api/products` → `supabase.from('products').select('*')`
- Optional `?category=Cookies` filter

**[MODIFY] `app/menu/page.tsx`** and **`app/(portal)/app/menu/page.tsx`**
- Replace `import { PRODUCTS } from '@/lib/data'` with `fetch('/api/products')` in a server component
- Keep UI completely unchanged

### 3.2 — Orders

**[NEW] `app/api/orders/route.ts`**
- `POST /api/orders` — creates order record in Supabase (called from checkout)
- `GET /api/orders` — returns current user's orders (for `/dashboard`)

**[NEW] `app/api/admin/orders/route.ts`** (uses `supabaseAdmin`)
- `GET /api/admin/orders` — returns ALL orders (admin only)
- `PATCH /api/admin/orders/[id]` — updates order status

### 3.3 — Admin Dashboard Wiring

**[MODIFY] `app/admin/dashboard/page.tsx`**
- Replace `DEMO_ORDERS` with `fetch('/api/admin/orders')`
- Replace `DEMO_CUSTOMERS` with query from `profiles` + `orders` join
- Stat cards (Total Orders, Revenue etc.) computed from real data

### 3.4 — Customer Dashboard

**[MODIFY] `app/dashboard/page.tsx`**
- "My Orders" tab: replace placeholder with `fetch('/api/orders')` for logged-in user
- Show real order history with status badges

### 3.5 — Verification
- [ ] `/menu` loads products from Supabase (verify in Network tab — no static import)
- [ ] Place test order → row appears in Supabase `orders` table
- [ ] Admin dashboard shows real order count and revenue

---

## Phase 4 — Razorpay Payment Integration

**Goal:** Checkout step 2 (Payment) completes a real Razorpay transaction before order is confirmed.

### 4.1 — Razorpay Setup (Manual)
1. Create account at https://razorpay.com
2. Get `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from dashboard
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
   ```

### 4.2 — Install
```bash
bun add razorpay
```

### 4.3 — Server: Create Razorpay Order

**[NEW] `app/api/payment/create-order/route.ts`**
```typescript
// POST { amount: number (in paise), orderId: string }
// Returns: { razorpayOrderId, amount, currency }
// Uses: new Razorpay({ key_id, key_secret }).orders.create(...)
```

### 4.4 — Server: Verify Payment

**[NEW] `app/api/payment/verify/route.ts`**
```typescript
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature, snackwizeOrderId }
// Validates HMAC signature using crypto.createHmac
// On success: updates order payment_status = 'paid' in Supabase
// Returns: { success: true }
```

### 4.5 — Client: Checkout Payment Step

**[MODIFY] `app/checkout/page.tsx`** — Payment step only (surgical change):
- Add Razorpay checkout script loader (`<Script src="https://checkout.razorpay.com/v1/checkout.js">`)
- On "Pay Now" click:
  1. Call `POST /api/payment/create-order` → get `razorpayOrderId`
  2. Open Razorpay modal with `window.Razorpay({ key, order_id, ... })`
  3. On payment success callback → call `POST /api/payment/verify`
  4. On verify success → call `POST /api/orders` to persist order → redirect to confirmation page

### 4.6 — Verification
- [ ] Test mode payment (card: 4111 1111 1111 1111) completes successfully
- [ ] Order appears in Supabase `orders` table with `payment_status: 'paid'`
- [ ] Admin dashboard shows the new paid order
- [ ] Failed payment does NOT create an order record

---

## Phase 5 — Shiprocket Delivery Integration

**Goal:** When admin marks order as "Confirmed", a Shiprocket shipment is auto-created and tracking is enabled.

### 5.1 — Shiprocket Setup (Manual)
1. Create account at https://shiprocket.in
2. Generate API token from dashboard
3. Add to `.env`:
   ```
   SHIPROCKET_EMAIL=your@email.com
   SHIPROCKET_PASSWORD=yourpassword
   ```

### 5.2 — Auth Token Management

**[NEW] `lib/shiprocket.ts`**
- `getShiprocketToken()` — calls Shiprocket `/auth/login` API, caches token in memory (expires 24h)
- `createShipment(order)` — calls `/orders/create/adhoc` with order data
- `trackShipment(awbCode)` — calls `/courier/track/awb/{awb_code}`

### 5.3 — Trigger on Order Confirmation

**[MODIFY] `app/api/admin/orders/[id]/route.ts`**
- When `PATCH` sets `status = 'Confirmed'`:
  1. Call `createShipment(order)` → get AWB code + shipment ID
  2. Update order in Supabase with `shiprocket_awb`, `shiprocket_shipment_id`

### 5.4 — Customer Order Tracking Page

**[MODIFY] `app/(portal)/app/track/page.tsx`**
- Replace placeholder with real call to `GET /api/track?orderId=SW-XXXX`
- Display status timeline from Shiprocket tracking data

### 5.5 — Verification
- [ ] Admin marks order "Confirmed" → Shiprocket dashboard shows new shipment
- [ ] Customer visits `/track` → sees real-time status
- [ ] AWB code stored in Supabase `orders` table

---

## Phase 6 — Vercel Deployment

**Goal:** Live on Vercel at a custom domain.

### 6.1 — Steps
1. Push all code to GitHub (already done)
2. Import repo into Vercel dashboard
3. Add all env variables from `.env` into Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD`
4. In Supabase Auth settings: add your Vercel production URL to "Redirect URLs"
5. Switch Razorpay from test mode to live mode keys
6. Deploy — Vercel auto-deploys on every `git push main`

### 6.2 — Verification
- [ ] `https://your-domain.vercel.app/` loads homepage
- [ ] Full order flow works end-to-end in production
- [ ] Admin portal accessible at `/admin/login`

---

## Execution Order (for Claude)

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Do not start Phase 2 before Phase 1's verification passes.  
Do not start Phase 4 before Phase 3's verification passes.  
Each phase is independently deployable to Vercel — deploy after each phase.

---

## Files That Must NOT Be Modified (Unless Specified)

| File | Reason |
|---|---|
| `context/CartContext.tsx` | Cart works perfectly, localStorage persistence is intentional |
| `components/ui/*` | shadcn/ui components — stable, don't touch |
| `app/globals.css` | Design tokens — only touch for explicit design changes |
| `tailwind.config.ts` | Design system — stable |
| `public/sw.js` | Service worker for PWA — working, don't touch |

---

## Quick Reference: Env Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
```

---

*Last updated: 2026-06-22 | Architect: Antigravity | Implementor: Claude Code*
