# Snackwize Feature Implementation Plan: Coupons & Order Cancellation

You are absolutely right—these are the final two major features remaining before launch. Here is the plan to build them out.

## 1. Coupon Codes at Checkout
Currently, the Offers page advertises codes (like `FRESH15` or `SNACK50`), but there's no way to apply them.

### Database Updates (SQL)
- Create a `coupons` table with columns: `code` (Primary Key), `discount_type` ('percent' or 'fixed'), `discount_value`, `min_order_value`, and `active`.
- Alter the `orders` table to add `coupon_code` (text) and `discount` (numeric, default 0).

### API Changes
- **[NEW] `app/api/coupons/validate/route.ts`**: A `POST` endpoint that takes a `code` and the cart `subtotal`, and returns the exact discount amount if valid.
- **[MODIFY] `app/api/orders/route.ts`**: Update the checkout API to accept an optional `coupon_code`. The server will authoritatively re-validate the coupon, compute the discount, and deduct it from the final `total` before inserting the order.

### UI Changes
- **[MODIFY] `app/checkout/page.tsx`**: Add an "Apply Coupon" input field on the Payment step. When applied, it will fetch the discount from the validation API and dynamically update the `grandTotal` displayed to the user.

## 2. Order Cancellation
Customers currently have no way to cancel an order from their dashboard without contacting support.

### API Changes
- **[NEW] `app/api/orders/[id]/route.ts`**: Create a `PATCH` endpoint that allows a logged-in user to change their order status to `Cancelled`. It will enforce security by ensuring the user is only allowed to cancel their *own* orders, and only if the order status is still `Pending`.

### UI Changes
- **[MODIFY] `app/dashboard/page.tsx`**: Add a "Cancel Order" button next to the "Track order" link for any order that is in the `Pending` state. Clicking it will show a confirmation dialog, and then call the new cancellation API.

---

## User Review Required
1. For coupons, is a simple percentage or fixed-amount discount model sufficient (e.g., 15% off, or ₹50 off)? 
2. Are you ready for me to proceed with building these two features?
