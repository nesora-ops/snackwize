# Snackwize Wire-up Guide: Integrations

This guide details the manual steps required to fully wire up the external services needed for Snackwize to go live.

---

## 1. Resend Emails & Supabase SMTP

Supabase uses a built-in email server by default with strict limits. To ensure reliable delivery of magic links, auth emails, and order confirmations, we must configure a Custom SMTP provider using Resend.

### Steps:
1. **Create Account**: Sign up at [Resend.com](https://resend.com) and add your domain (`nesora.co.in`).
2. **Verify Domain**: Add the DNS records (TXT/MX) provided by Resend to your domain registrar (GoDaddy, Namecheap, etc.). Wait until Resend shows the domain as **Verified**.
3. **Generate API Key**: In the Resend dashboard, create a new API key with sending permissions.
4. **Configure Supabase** (for auth emails — magic links, OTP):
   - Go to **Supabase Dashboard** > **Authentication** > **Providers** > **Email**.
   - Scroll down to **Custom SMTP**.
   - Toggle **Enable Custom SMTP** and enter:
     - **Host**: `smtp.resend.com`
     - **Port**: `465`
     - **Username**: `resend`
     - **Password**: `<YOUR_RESEND_API_KEY>`
     - **Sender email**: `noreply@nesora.co.in`
5. **Vercel Env Variables** (for the app's transactional emails — order confirmations, new-drop campaigns — sent via the Resend SDK in `lib/email.ts`):
   - `RESEND_API_KEY` — the same API key.
   - `RESEND_FROM` — the verified sender, e.g. `Snackwize <noreply@nesora.co.in>`. *(Optional — if unset the code defaults to `Snackwize <noreply@nesora.co.in>`, but set it explicitly so it matches your verified domain.)*

---

## 2. Razorpay Integration

Razorpay is used for processing prepaid orders (UPI, Cards, Netbanking).

### Steps:
1. **Account & KYC**: Create a [Razorpay](https://razorpay.com/) account and complete the business KYC to activate live payments.
2. **Generate API Keys**:
   - Go to **Settings** > **API Keys**.
   - Generate keys for **Test Mode** first. You will get a `Key ID` and `Key Secret`.
3. **Add to Vercel**: 
   - Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to your Vercel environment variables.
   - *(No `NEXT_PUBLIC_*` key is needed — the checkout receives the public Key ID from the order API response, not from a client env var.)*
4. **Configure Webhook** (Crucial for order status updates):
   - In Razorpay, go to **Settings** > **Webhooks** > **Add New Webhook**.
   - **URL**: `https://<your-vercel-domain>.vercel.app/api/webhooks/razorpay`
   - **Secret**: Create a strong, random string (e.g., `snackwize_sec_9930`).
   - **Events**: Select `payment.captured`, `order.paid`, and `refund.processed`. *(These are the exact events the webhook handler acts on — `payment.captured`/`order.paid` confirm the order and consume stock; `refund.processed` marks it refunded. `payment.failed` is not used.)*
   - Add this webhook secret to Vercel as `RAZORPAY_WEBHOOK_SECRET`.
5. **Go Live**: Once testing is complete, switch the Razorpay dashboard to **Live Mode**, generate Live API keys, and update Vercel.

---

## 3. Shiprocket (Domestic & Hyperlocal Delivery)

Shiprocket will handle both domestic courier assignments and Shiprocket Quick for hyperlocal Mumbai deliveries.

### Steps:
1. **Account Setup**: Create a [Shiprocket](https://www.shiprocket.in/) account.
2. **Add Pickup Location**:
   - Go to **Settings** > **Pickup Address** and add the kitchen address, phone number, and exact PIN code. *This is critical for Shiprocket Quick to calculate hyperlocal delivery feasibility.*
   - Note the **nickname** you give this pickup location — it must be passed as `SHIPROCKET_PICKUP_LOCATION` (the code sends this exact string as `pickup_location` when creating shipments). A mismatch makes every shipment fail.
3. **API User**:
   - Go to **Settings** > **API** > **Configure** and create an **API user** (a dedicated email + password). The code authenticates with email/password against `/v1/external/auth/login` and caches the token — there is no separate API-token env var.
4. **Add to Vercel** (environment variables):
   - `SHIPROCKET_EMAIL` — API user email *(required)*
   - `SHIPROCKET_PASSWORD` — API user password *(required)*
   - `SHIPROCKET_PICKUP_LOCATION` — the pickup nickname from step 2 *(required for shipments)*
   - `SHIPROCKET_CHANNEL_ID` — *(optional)* channel ID if you route orders through a specific Shiprocket channel
   - `SHIPROCKET_DEFAULT_EMAIL` — *(optional)* fallback billing email for guest orders that have no email (defaults to `orders@nesora.co.in`)
5. **Configure Status Webhook** (so orders auto-advance to Shipped / Delivered):
   - In Shiprocket, go to **Settings** > **API** > **Webhooks** (or **Configure Webhook**).
   - **URL**: `https://<your-vercel-domain>.vercel.app/api/webhooks/shiprocket`
   - **Token**: create a strong random string. Shiprocket sends it on each call as the `x-api-key` header; the handler rejects anything that doesn't match.
   - Add that same string to Vercel as `SHIPROCKET_WEBHOOK_TOKEN`.
6. **Add Hyperlocal Pincodes**: In the app, go to **Admin > Settings** and add the Mumbai pincodes you serve (seeded with 400001–400104 by default). Same-day (hyperlocal) checkout is allowed only for pincodes in this list.
7. **Hyperlocal (Quick) Setup**: Ensure you have a positive wallet balance in Shiprocket. Shiprocket Quick deducts from the wallet on courier assignment. *(Note: all current products are Domestic, so the Quick path stays dormant until you mark a product as Hyperlocal — validate the Quick request payload against Shiprocket Quick's docs when you enable the first one.)*
