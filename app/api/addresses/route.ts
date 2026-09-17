import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerUserClient } from '@/lib/supabase.server'

// Cookie-bound client so RLS does the authorization — a user can only ever see
// or write their own rows. Mirrors app/api/profile/route.ts.
const addressInput = z.object({
  label: z.string().trim().max(40).optional(),
  line1: z.string().trim().min(1, 'Address is required').max(200),
  landmark: z.string().trim().max(120).optional(),
  city: z.string().trim().min(1, 'City is required').max(80),
  state: z.string().trim().min(1, 'State is required').max(80),
  pin: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  is_default: z.boolean().optional(),
})

export async function GET() {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request body' }, { status: 400 })
  }

  const parsed = addressInput.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid address' }, { status: 400 })
  }

  const { count } = await supabase
    .from('addresses')
    .select('id', { count: 'exact', head: true })

  // First address is the default by definition; otherwise honour the request.
  // A partial unique index enforces one default per user, so clear the old one.
  const isDefault = parsed.data.is_default || (count ?? 0) === 0
  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', session.user.id)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...parsed.data, is_default: isDefault, user_id: session.user.id })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
