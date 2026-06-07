// TODO: Replace localStorage auth with Supabase Auth
export type MockUser = { name: string; email: string; phone?: string };

const USER_KEY = "snackwize_user";
const ADMIN_KEY = "snackwize_admin";

export function getUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
}
export function setUser(u: MockUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("snackwize-auth"));
}
export function logout() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("snackwize-auth"));
}
export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "true";
}
export function setAdmin(v: boolean) {
  if (v) localStorage.setItem(ADMIN_KEY, "true");
  else localStorage.removeItem(ADMIN_KEY);
}