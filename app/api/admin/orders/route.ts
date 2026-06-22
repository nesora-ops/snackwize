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
    .from('orders')
    .select('*, profiles(name, phone)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return serverError(error, 'Failed to load orders')
  return NextResponse.json(data, { headers: { 'X-Total-Count': String(count ?? 0) } })
}
