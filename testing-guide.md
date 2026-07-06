# Snackwize Manual Testing Guide

Once the external services (Razorpay, Supabase SMTP, Shiprocket) are wired up, use this guide to test the end-to-end flows of the application.

---

## 1. Inventory & New Drops (Admin)

**Goal:** Verify that the admin panel correctly manipulates what the customer sees.

1. **Add a Product**: 
   - Go to `/admin/new-drops` to **add** a new product (e.g., "Test Cookie"). *(The `/admin/products` page only edits existing products — new items are created from New Drops.)*
   - Give it a price, image, and set **Fulfillment** to `Domestic (Shiprocket)` or `Hyperlocal (Shiprocket Quick)`.
   - Verify it appears on the customer `/app/menu`. You can edit any detail afterwards from `/admin/products`.
2. **Manage Stock**:
   - In the admin panel, toggle the "In Stock" switch for "Test Cookie" to OFF.
   - Go to `/app/menu` as a customer. Ensure the product shows as **Sold Out** and cannot be added to the cart.
3. **New Drops System**:
   - Create a New Drop in `/admin/new-drops`. Set a future dispatch date and a limited quantity (e.g., 5).
   - As a customer, go to `/app/new-drops` and place an order.
   - Verify that the inventory count in the admin panel decreases from 5 to 4.

---

## 2. The Order Workflow (Customer → Admin)

**Goal:** Ensure the cart, checkout, payment, and admin dashboard sync perfectly.

1. **Add to Cart & Checkout**:
   - Log in as a customer. Add items to the cart.
   - Proceed to checkout. Verify that the correct delivery fee is applied based on the cart total.
2. **Payment Processing**:
   - In **Test Mode**, select Razorpay. Use Razorpay's test UPI or test cards (e.g., `4111 1111 1111 1111`, CVV `123`) to simulate a successful payment.
   - After payment, ensure you are redirected to the Success Page.
3. **Admin Verification**:
   - Log into `/admin/orders`.
   - Verify the order appears at the top of the list with the status `Confirmed` (or `Pending` if payment failed).
   - Ensure the customer details, items, flavours, and paid amounts match exactly.

---

## 3. Delivery Workflows (Domestic vs Hyperlocal)

**Goal:** Verify the delivery mode is driven by the **product**, not the pincode, and that the serviceability gate works.

> **How it actually works:** Each product is either `Domestic` or `Hyperlocal`. The cart is **single-mode** — you cannot mix a Domestic and a Hyperlocal item in one bag (adding a mismatched item is blocked with a toast). The order's mode comes from its products. A Hyperlocal cart is allowed to check out **only** if the address pincode is in the Admin > Settings hyperlocal list; otherwise it is **rejected at checkout** (never silently converted to Domestic). Domestic carts ship anywhere in India.

1. **Domestic Order (any Indian pincode)**:
   - Add a `Domestic` product to the cart and check out with, e.g., Delhi `110001`.
   - Verify the order is created and (with Shiprocket configured) auto-books a **standard Shiprocket** shipment — an AWB and tracking link appear in `/admin/orders` and on the customer Track page; status moves to `Confirmed`.
2. **Hyperlocal Order — serviceable Mumbai pincode**:
   - Add a `Hyperlocal` product (mark a test product as Hyperlocal first) and check out with a pincode that **is** in the Admin > Settings list (e.g., `400001`).
   - Verify checkout proceeds and the order routes to **Shiprocket Quick** (`courier_name = Shiprocket Quick`).
3. **Hyperlocal Order — non-serviceable pincode (negative test)**:
   - With the same Hyperlocal cart, enter a non-Mumbai pincode (e.g., `110001`) or a Mumbai pincode not in the list.
   - Verify the checkout **warns before payment** ("not serviceable") and the order POST is **rejected** — the customer is never charged and no Domestic shipment is created.
4. **Mixed cart (negative test)**:
   - With a Domestic item in the cart, try to add a Hyperlocal item (or vice-versa).
   - Verify it is blocked with a toast and the cart stays single-mode.

---

## 4. Hyperlocal Cutoff & Order Cancellation

**Goal:** Test the operational controls.

1. **Global Hyperlocal Cutoff (The Stop Toggle)**:
   - In the Admin Dashboard Settings, hit the **"Stop accepting hyperlocal orders"** toggle.
   - As a customer, refresh `/app/menu`.
   - Verify that all products marked as `Hyperlocal` are instantly shown as Sold Out with the message: *"Come back tomorrow!"*
   - Toggle it back ON, and verify products become available again.
2. **Order Cancellation (Domestic)**:
   - As an admin, go to `/admin/orders` and cancel a **paid Domestic** order that has **not** yet shipped.
   - Verify: status → `Cancelled`, the Razorpay payment is **refunded**, consumed stock is **restocked**, and (if a shipment was booked) the **Shiprocket booking is cancelled** too.
3. **Cancellation Constraint (Hyperlocal)**:
   - Try to cancel **any** order that contains a Hyperlocal item — regardless of whether it has been dispatched.
   - Verify it is **refused outright** (reason: `hyperlocal`). Per the rule "No cancellation on hyperlocal orders," hyperlocal orders can **never** be cancelled, not just after dispatch.
