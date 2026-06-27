# Snackwize Manual Testing Guide

Once the external services (Razorpay, Supabase SMTP, Shiprocket) are wired up, use this guide to test the end-to-end flows of the application.

---

## 1. Inventory & New Drops (Admin)

**Goal:** Verify that the admin panel correctly manipulates what the customer sees.

1. **Add a Product**: 
   - Go to `/admin/products`. Add a new product (e.g., "Test Cookie").
   - Give it a price, image, and mark it as `Local/Hyperlocal` or `Domestic`.
   - Verify it appears on the customer `/app/menu`.
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

**Goal:** Verify Shiprocket logic distinguishes between local and national orders.

1. **Hyperlocal Order (Mumbai)**:
   - Create an order using a Mumbai PIN code that falls within your local delivery radius.
   - Verify that the system assigns the delivery type as `Hyperlocal` and routes it to Shiprocket Quick.
2. **Domestic Order (Outside Mumbai)**:
   - Create an order using a non-Mumbai PIN code (e.g., Delhi `110001`).
   - Verify that the system assigns the delivery type as `Domestic` and routes it to standard Shiprocket surface/air shipping.

---

## 4. Hyperlocal Cutoff & Order Cancellation

**Goal:** Test the operational controls.

1. **Global Hyperlocal Cutoff (The Stop Toggle)**:
   - In the Admin Dashboard Settings, hit the **"Stop accepting hyperlocal orders"** toggle.
   - As a customer, refresh `/app/menu`.
   - Verify that all products marked as `Hyperlocal` are instantly shown as Sold Out with the message: *"Come back tomorrow!"*
   - Toggle it back ON, and verify products become available again.
2. **Order Cancellation**:
   - As an admin, go to `/admin/orders` and cancel an order.
   - Verify that the order status updates to `Cancelled`.
   - **Constraint Check**: Ensure that if an order is `Hyperlocal` and has already been dispatched via Shiprocket Quick, it *cannot* be cancelled (as requested: "No cancellation on hyperlocal orders").
