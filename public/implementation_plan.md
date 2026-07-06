# Subdomain Architecture Shift (app.snackwize.vercel.app / app.snackwize.co.in)

This plan outlines the steps to separate your web application portal into a subdomain (`app.snackwize.vercel.app`, eventually `app.snackwize.co.in`) while keeping your marketing site on the root domain (`snackwize.vercel.app` / `snackwize.co.in`), all within your existing single Next.js codebase.

## User Review Required

> [!WARNING]
> **Environment Variables**: To ensure cookies work correctly on `localhost` during development and on `.snackwize.vercel.app` (or `.snackwize.co.in`) in production, we will use an environment variable `NEXT_PUBLIC_COOKIE_DOMAIN`. You will need to add this to your Vercel Environment Variables.

> [!CAUTION]
> **Next.js Rewrites vs Redirects**: By default, I will configure the middleware to *rewrite* requests. This means if a user visits `app.snackwize.vercel.app/`, they see the contents of your `/app` (or `/dashboard`) folder, but the URL in their browser stays `app.snackwize.vercel.app/`. Please confirm if you want the URL structure to hide the `/app` segment completely, and what the default route should be for the portal.

> [!NOTE]
> **Supabase SSR Migration**: Snackwize currently uses `@supabase/supabase-js` without a dedicated cookie storage mechanism for Next.js. To share auth securely across subdomains in Next.js, we should migrate the auth initialization to `@supabase/ssr` to securely manage domain-level cookies.

---

## Phase 1: Code Agent Sprints

These are the tasks your AI Agent (or myself, if you approve this plan) will execute directly in the codebase.

### Sprint 1: Supabase Cookie Configuration
**Goal:** Ensure authentication cookies are shared across all subdomains.

#### [MODIFY] `package.json`
- Install `@supabase/ssr` to easily manage cookies in Next.js.

#### [MODIFY] `lib/supabase.ts`
- Replace `createClient` with `createBrowserClient` from `@supabase/ssr`.
- Inject `cookieOptions: { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }`.

#### [MODIFY] `lib/supabase.server.ts`
- Replace `createClient` with `createServerClient` from `@supabase/ssr`.
- Inject `cookieOptions: { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }` for both `setAll` and standard cookie operations.

#### [MODIFY] `.env` & `.env.local`
- Add `NEXT_PUBLIC_COOKIE_DOMAIN=localhost` for local development.

### Sprint 2: Domain Routing & Middleware
**Goal:** Intercept incoming requests and route them to either the app or the marketing site based on the domain.

#### [NEW] `middleware.ts`
- Create a new file in the root directory.
- Implement Supabase session refresh logic (standard for `@supabase/ssr`).
- Add Next.js Rewrite logic:
  - If `req.headers.get('host')` starts with `app.`, rewrite the request to serve the application routes (e.g., mapping `/` to `/app` or `/dashboard`).
  - Otherwise, let the request proceed normally to serve the marketing pages.
- Add a matcher configuration to avoid running middleware on static assets, API routes, and images.

### Sprint 3: Marketing Site UI Updates
**Goal:** Leverage the shared cookie on the main website to improve user experience.

#### [MODIFY] Main Navigation / Header Component (e.g., `app/page.tsx` or `components/...`)
- Read the Supabase session state (via `useAuthGuard` or directly).
- If a user is logged in, change the "Log In" or "Sign Up" button to a "Go to Portal" button that links directly to `https://app.snackwize.vercel.app` (or your chosen production domain).

---

## Phase 2: Manual User Steps

These are the steps you must perform manually outside of the codebase.

### 1. Update Vercel Settings
1. Go to your Vercel dashboard for the Snackwize project.
2. Navigate to **Settings > Domains**.
3. Add your new subdomains: `app.snackwize.vercel.app` (and `app.snackwize.co.in` once verified).
4. Add the `NEXT_PUBLIC_COOKIE_DOMAIN` environment variable in Vercel. Set its value to `.snackwize.vercel.app` (and later change it to `.snackwize.co.in` when you go live on the main domain).

### 2. Update DNS Records (for custom domains)
1. Go to your DNS provider for `snackwize.co.in`.
2. Look at the instructions Vercel gave you in step 1.
3. Add a **CNAME** record for `app` pointing to Vercel (usually `cname.vercel-dns.com`).

---

## Phase 3: Testing & Verification Cycle

Once the code is deployed and DNS is updated, execute this manual testing cycle.

### Local Environment Testing
1. **Host File Edit (Optional but Recommended):** To test locally, you can edit your Windows `hosts` file (`C:\Windows\System32\drivers\etc\hosts`) and add: `127.0.0.1 app.localhost`.
2. Run `npm run dev`.
3. Visit `http://app.localhost:3000` and ensure it serves the app content.
4. Log in. Check your browser's dev tools (Application -> Cookies) to ensure the cookie domain is set to `localhost`.

### Production Verification
1. **Visit Main Domain:** Go to `https://snackwize.vercel.app`. Ensure the marketing site loads.
2. **Visit App Domain:** Go to `https://app.snackwize.vercel.app`. Ensure the login page or portal loads.
3. **Login Test:** Log in on `app.snackwize.vercel.app`. Verify you enter the portal.
4. **Cross-Domain Test:** Open a new tab and go back to `https://snackwize.vercel.app`. Verify that the UI recognizes you are logged in (e.g., the "Log In" button has changed).
5. **Logout Test:** Log out from the app. Visit the main domain and verify you are logged out there as well.
