import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerUserClient } from '@/lib/supabase.server'

const addressPatch = z.object({
  label: z.string().trim().max(40).nullish(),
  line1: z.string().trim().min(1).max(200).optional(),
  landmark: z.string().trim().max(120).nullish(),
  city: z.string().trim().min(1).max(80).optional(),
  state: z.string().trim().min(1).max(80).optional(),
  pin: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
  is_default: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request body' }, { status: 400 })
  }

  const parsed = addressPatch.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid address' }, { status: 400 })
  }

  // One default per user is a partial unique index; clear the incumbent first.
  if (parsed.data.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', session.user.id)
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(parsed.data)
    .eq('id', params.id)
    .select('*')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('addresses').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
