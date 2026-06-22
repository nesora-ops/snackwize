import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './supabase.server'

function bearerToken(req: NextRequest): string | null {
  return req.headers.get('authorization')?.split(' ')[1] ?? null
}

// Resolves the authenticated user from the Bearer token, or null.
export async function getUser(req: NextRequest) {
  const token = bearerToken(req)
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user ?? null
}

// Resolves the user only if they hold the admin role in app_metadata.
// app_metadata is server-only (settable just by the service role key), so
// unlike user_metadata it cannot be self-assigned by a client.
export async function getAdmin(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return null
  const role = (user.app_metadata as { role?: string } | undefined)?.role
  return role === 'admin' ? user : null
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function badRequest(message = 'Invalid request') {
  return NextResponse.json({ error: message }, { status: 400 })
}

// Logs the real error server-side; returns a generic message to the client so
// Postgres details (table/column names, constraints) never leak.
export function serverError(err: unknown, message = 'Something went wrong') {
  console.error('[api]', err)
  return NextResponse.json({ error: message }, { status: 500 })
}
