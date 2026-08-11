# Stall event — emergency notes

For the Royal Orchid stall, 13 Aug 2026. Read this before touching anything mid-event.

## The one thing that can break

`/order` loads its products from `/api/products`, which reads Supabase. The
Supabase project is on the free tier and **pauses itself after a stretch of
inactivity** — that is exactly what happened on 12 Aug, and while paused its
hostname stops resolving entirely (NXDOMAIN), so the API returns a 500 and the
order page has nothing to list.

### Symptom

`/order` shows: *"Couldn't load the menu just now."*

Confirm it with:

```bash
curl -s https://www.snackwize.co.in/api/products
```

A JSON array means healthy. `{"error":"Failed to load products"}` means the DB
is down.

### Fix 1 — un-pause (preferred, ~2 minutes)

Open the Supabase dashboard, find the project, hit Resume. Re-run the curl above
until it returns JSON. Nothing needs redeploying.

### Fix 2 — cut the page over to the static catalogue (~3 minutes)

Only if Supabase cannot be resumed. `lib/data.ts` holds a hardcoded `PRODUCTS`
array that needs no database. In `app/order/page.tsx`, replace the fetch in the
mount effect:

```ts
// from
fetch('/api/products')
  .then((r) => r.json())
  .then((data) => setProducts(Array.isArray(data) ? data : []))
  .catch(() => setProducts([]))

// to
setProducts(PRODUCTS)
```

`PRODUCTS` is already imported for its type. Commit, push to `main`, and Vercel
redeploys in about a minute.

Caveat: the static list has no stock flags, so nothing will show as sold out,
and it will not reflect admin edits made after this file was written.

### Fix 3 — no site at all

The stall poster is a fallback in itself: Nupur takes the order on WhatsApp
directly, exactly as she does today. Nothing on the site is load-bearing for
taking money.

## Things deliberately hidden, not removed

Login, sign-up, password reset, the customer dashboard and the `/app/*` ordering
portal all still work at their URLs — they are simply not linked from anywhere a
visitor will tap. `/admin/login` is reachable by direct URL for Nupur.

The full Razorpay + Shiprocket build is preserved on the **`app` branch** at
commit `9f8e0c8`. Note that `app` is also a directory name, so git needs
`refs/heads/app` to disambiguate:

```bash
git diff refs/heads/app refs/heads/main --stat
```

## Do not set this env var

`NEXT_PUBLIC_PORTAL_URL` must stay **unset** in Vercel. `app.snackwize.co.in`
does not resolve; setting it would send every order button to a dead host.

## Photos still outstanding

`cheese-tease-stix`, `coc-remix` and `bajre-da-sitta` render an on-brand "photo
coming soon" tile. To swap in a real photo: upload to the `product-images`
bucket in Supabase Storage and set the row's `image` column to the public URL.
No deploy needed — the page picks it up on next load.
