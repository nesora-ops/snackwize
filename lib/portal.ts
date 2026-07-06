// Absolute origin of the app (the app.* subdomain) in production; empty in
// local dev, where the app and marketing share one origin.
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || ''

// Build a link into the app: absolute (to the app subdomain) in production, or
// a same-origin relative path locally where PORTAL_URL is unset.
export function appHref(path: string): string {
  return PORTAL_URL ? PORTAL_URL + path : path
}
