import { createServerUserClient } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, phone')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The profiles row is created by a trigger on auth.users; fall back to the
  // session so a brand-new Google sign-in still gets a name to pre-fill.
  return NextResponse.json({
    id: session.user.id,
    name: data?.name ?? session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? '',
    phone: data?.phone ?? '',
    email: session.user.email ?? '',
  })
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerUserClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, phone } = await req.json()
  
  if (typeof name !== 'string' || typeof phone !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name, phone })
    .eq('id', session.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update user_metadata too so session.user keeps the correct name in auth context
  await supabase.auth.updateUser({
    data: { name, phone }
  })

  return NextResponse.json({ success: true })
}
