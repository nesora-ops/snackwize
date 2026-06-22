import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const [{ data: products }, { data: orders }, { count: togglesThisMonth }] = await Promise.all([
    supabaseAdmin.from('products').select('in_stock'),
    supabaseAdmin.from('orders').select('items, status').neq('status', 'Delivered').neq('status', 'Cancelled'),
    supabaseAdmin.from('inventory_logs').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  const inStock = products?.filter(p => p.in_stock).length ?? 0
  const soldOut = products?.filter(p => !p.in_stock).length ?? 0

  let preordersPending = 0
  for (const order of orders ?? []) {
    const items = Array.isArray(order.items) ? order.items : []
    for (const item of items) {
      if (item.is_preorder) preordersPending += item.qty ?? 1
    }
  }

  return NextResponse.json({ inStock, soldOut, preordersPending, togglesThisMonth: togglesThisMonth ?? 0 })
}
