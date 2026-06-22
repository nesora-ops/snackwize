import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

async function getAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (user?.user_metadata?.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, orders(id, total, status, created_at)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const customers = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name ?? 'Unknown',
    phone: p.phone ?? '—',
    orders: p.orders?.length ?? 0,
    spent: (p.orders ?? [])
      .filter((o: any) => o.status !== 'Cancelled')
      .reduce((a: number, o: any) => a + o.total, 0),
    joined: new Date(p.created_at).toLocaleDateString('en-IN'),
  }))

  return NextResponse.json(customers)
}
