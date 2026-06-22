import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

async function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user ?? null
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  const body = await req.json()

  const { error } = await supabaseAdmin.from('orders').insert({
    id: body.id,
    user_id: user?.id ?? null,
    guest_name: body.guest_name ?? null,
    guest_phone: body.guest_phone ?? null,
    guest_email: body.guest_email ?? null,
    items: body.items,
    subtotal: body.subtotal,
    delivery_fee: body.delivery_fee,
    total: body.total,
    address: body.address,
    payment_method: body.payment_method,
    payment_status: 'pending',
    status: 'Pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
