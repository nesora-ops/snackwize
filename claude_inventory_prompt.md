# 🧡 Snackwize — Stock & Inventory System Implementation Prompt

**Context for Claude/Agent:** 
The Snackwize project has completed Phase 3. The Supabase database *is* active and the frontend *is* connected to it via Next.js API routes (`/api/products`, `/api/orders`, `/api/admin/orders`, etc.). However, **the inventory features from this prompt have NOT been implemented yet.**

**CRITICAL SCHEMA WARNINGS:**
1. **`orders.items` is JSONB:** We do NOT have an `order_items` table. The `items` are stored as a JSONB array inside the `orders` table. You cannot do SQL JOINs on `order_items`. To calculate pre-orders, you must fetch pending `orders` (e.g., via `/api/admin/orders`) and process the `items` JSONB array in TypeScript on the frontend.
2. **`inventory_logs` does NOT exist:** You must create this table (or write the SQL migration for it) before building the UI.
3. **`products` table exists but needs an update:** It already has `in_stock` (boolean), but you must add the `allow_backorder` (boolean) column to it.
4. **API Routes:** Since the app uses API routes for Supabase communication, you must build or modify API routes (e.g., `/api/admin/inventory`, modifying `/api/products`) rather than making direct Supabase client calls from Server/Client components, adhering to the existing pattern.

Additionally, the admin dashboard currently uses a single-page tabbed architecture in `app/admin/dashboard/page.tsx` (the sidebar is hardcoded there, not in a Next.js layout).

Please follow these steps to implement the Inventory System:

---

## STEP 1 — DATABASE SCHEMA UPDATES (SUPABASE)
Run the following updates via Supabase SQL or migrations:
1. **Products:** `ALTER TABLE products ADD COLUMN allow_backorder BOOLEAN DEFAULT true;`
2. **Inventory Logs:** Create the `inventory_logs` table (`id`, `product_id`, `action`, `changed_by`, `note`, `created_at`).
3. **Orders (Pre-order tracking):** Since `items` is JSONB, you can either add a top-level `contains_preorder` boolean to the `orders` table, OR just parse the `items` JSONB array on the frontend to look for `is_preorder: true` flags inside the cart items.

---

## STEP 2 — ADMIN LAYOUT REFACTOR
Currently, the admin sidebar is hardcoded inside `app/admin/dashboard/page.tsx` using a state-based tab system. 
To support dedicated routes like `/admin/inventory`, refactor the admin section to use Next.js layouts:
1. Move the sidebar and mobile header into a new `app/admin/layout.tsx`.
2. Move the dashboard content into `app/admin/dashboard/page.tsx`.
3. *Note: Ensure the existing `useAdminGuard()` hook protects the layout.*

---

## STEP 3 — SIDEBAR NAVIGATION
In the new `app/admin/layout.tsx`, add a new nav item between "Products" and "Customers":
- Label: "Inventory"
- Icon: Lucide `Boxes` or `PackageSearch`
- Route: `/admin/inventory`
- Add a small badge next to it showing the count of sold-out items (e.g., a red dot if any product has `in_stock = false`).

---

## STEP 4 — NEW DEDICATED INVENTORY PAGE
Create: `app/admin/inventory/page.tsx`

### Overview Stat Cards (top of page)
4 cards in a responsive grid (`grid-cols-2 md:grid-cols-4 gap-4`):
1. **"In Stock"** — count of products where `in_stock = true` (neutral card)
2. **"Sold Out"** — count where `in_stock = false` (amber/warning background if > 0)
3. **"Pre-orders Pending"** — count of pending pre-orders. *(Calculate this by fetching `orders` where `status != 'Delivered'` and scanning the `items` JSONB array for pre-order flags)*.
4. **"Toggles This Month"** — count of `inventory_logs` where `created_at >= start of current month`

*Fetch all 4 via a new API route (e.g., `/api/admin/inventory/stats`) on page load, show loading skeletons while fetching.*

### Tabs Component
Use shadcn/ui Tabs with 3 tabs: "All Products" | "Pre-orders" | "Audit Log"

#### TAB 1 — "All Products"
A table with columns: `| Product | Category | Status (toggle) | Last Changed | Changed By | Quick Note |`
- **Status column:** A Switch toggle. Flipping it updates `products.in_stock` AND inserts a record into `inventory_logs` via an API route.
- **Last Changed:** Most recent `created_at` from `inventory_logs` for that product (relative time).
- **Quick Note:** Small text input. When submitted, attaches a note to the NEXT toggle action for that product.
- Add a Search bar and Category filter dropdown above the table.

#### TAB 2 — "Pre-orders"
Table: `| Customer Name | Phone | Product | Qty | Order Date | Order Status | Action |`
- **Fetching:** Fetch all pending orders via API. Process the `items` JSONB array in JavaScript to extract flat rows for every item that was marked as a pre-order.
- **Sorting:** Oldest first (FIFO — first person to pre-order gets it first).
- **Action column:** "Mark Notified" button (you can store this state in the JSONB array, or just make it a local UI placeholder for now).
- **Grouping:** Group rows visually by product name.
- **Summary line:** Add text above the table: *"Across all pending pre-orders, you need to bake: 14 Granola Bars, 6 Cookies, 3 Muffins"* (aggregate quantity by product).

#### TAB 3 — "Audit Log"
Vertical timeline view of `inventory_logs`:
- **Icon:** Green checkmark for 'marked_in_stock', red circle for 'marked_sold_out'.
- **Text:** "[Product Name] marked [Action] by [changed_by]" + relative timestamp and note.
- **Filters:** Product dropdown, Date range picker, Action filter.
- Fetch this data via a dedicated API route (e.g., `/api/admin/inventory/logs`).

---

## STEP 5 — PRODUCTS TAB UPDATES
In `app/admin/dashboard/page.tsx` (Products tab):
- Ensure the products table has a simple toggle switch for quick day-to-day `in_stock` flips (calling the relevant API route).
- Add a small link/button at the top: "View Full Inventory & Pre-orders →" that routes to `/admin/inventory`.

---

## STEP 6 — CHECKOUT SYSTEM INTEGRATION (CUSTOMER UI)
Update the checkout and menu flow:
- On the Menu (`/menu` or `/app/menu`), visually indicate if a product is on "Pre-order" (if `in_stock = false` but `allow_backorder = true`).
- When placing the order via `/api/orders`, save `is_preorder = true` inside the JSON object for those specific out-of-stock items within the `orders.items` JSONB array.

---

## STEP 7 — TESTING CHECKLIST
- [ ] Supabase schema is successfully updated (`allow_backorder` and `inventory_logs`).
- [ ] Admin sidebar is extracted to a layout and persists across routes.
- [ ] `/admin/inventory` loads and is protected by admin auth guard.
- [ ] Stat cards fetch via API and show correct live counts.
- [ ] Toggling stock updates both `products` table and `inventory_logs` via API.
- [ ] "Pre-orders" tab correctly parses JSONB from the API and aggregates quantities needed per product.
- [ ] "Audit Log" fetches via API and shows chronological history.
