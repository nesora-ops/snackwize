# Snackwize Wire-up Guide: Integrations

This guide details the manual steps required to fully wire up the external services needed for Snackwize to go live.

---

## 1. Resend Emails & Supabase SMTP

Supabase uses a built-in email server by default with strict limits. To ensure reliable delivery of magic links, auth emails, and order confirmations, we must configure a Custom SMTP provider using Resend.

### Steps:
1. **Create Account**: Sign up at [Resend.com](https://resend.com) and add your domain (e.g., `snackwize.com`).
2. **Verify Domain**: Add the DNS records (TXT/MX) provided by Resend to your domain registrar (GoDaddy, Namecheap, etc.).
3. **Generate API Key**: In the Resend dashboard, create a new API key with sending permissions.
4. **Configure Supabase**:
   - Go to **Supabase Dashboard** > **Authentication** > **Providers** > **Email**.
   - Scroll down to **Custom SMTP**.
   - Toggle **Enable Custom SMTP** and enter:
     - **Host**: `smtp.resend.com`
     - **Port**: `465`
     - **Username**: `resend`
     - **Password**: `<YOUR_RESEND_API_KEY>`
     - **Sender email**: `noreply@snackwize.com`
5. **Vercel Env Variables**: If you are using Resend via their Node SDK for custom transactional emails (like "Order Placed" receipts), add `RESEND_API_KEY` to your Vercel project environment variables.

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
4. **Configure Webhook** (Crucial for order status updates):
   - In Razorpay, go to **Settings** > **Webhooks** > **Add New Webhook**.
   - **URL**: `https://<your-vercel-domain>.vercel.app/api/webhooks/razorpay`
   - **Secret**: Create a strong, random string (e.g., `snackwize_sec_9930`).
   - **Events**: Select `order.paid`, `payment.captured`, and `payment.failed`.
   - Add this webhook secret to Vercel as `RAZORPAY_WEBHOOK_SECRET`.
5. **Go Live**: Once testing is complete, switch the Razorpay dashboard to **Live Mode**, generate Live API keys, and update Vercel.

---

## 3. Shiprocket (Domestic & Hyperlocal Delivery)

Shiprocket will handle both domestic courier assignments and Shiprocket Quick for hyperlocal Mumbai deliveries.

### Steps:
1. **Account Setup**: Create a [Shiprocket](https://www.shiprocket.in/) account.
2. **Add Pickup Location**: 
   - Go to **Settings** > **Pickup Address**.
   - Add the kitchen address, phone number, and exact PIN code. *This is critical for Shiprocket Quick to calculate hyperlocal delivery feasibility.*
3. **API Credentials**:
   - Go to **Settings** > **API** > **Configure**.
   - Create API credentials. You will need your login email and password (or generated API token, depending on their current API version).
4. **Add to Vercel**: Add `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` (or `SHIPROCKET_API_TOKEN`) to your Vercel environment variables.
5. **Hyperlocal (Quick) Setup**: Ensure you have a positive wallet balance in Shiprocket. Shiprocket Quick uses Dunzo/Porter/Shadowfax and deducts money directly from the wallet upon courier assignment.
