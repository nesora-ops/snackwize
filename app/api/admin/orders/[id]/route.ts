import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

async function getAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (user?.user_metadata?.role !== 'admin') return null
  return user
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
