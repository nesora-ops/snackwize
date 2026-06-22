import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 200)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  const { data, error, count } = await supabaseAdmin
    .from('profiles')
    .select('*, orders(id, total, status, created_at)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return serverError(error, 'Failed to load customers')

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

  return NextResponse.json(customers, { headers: { 'X-Total-Count': String(count ?? 0) } })
}
