import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
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
