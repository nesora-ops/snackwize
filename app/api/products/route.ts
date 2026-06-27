import { supabaseAdmin } from '@/lib/supabase.server'
import { serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  let query = supabaseAdmin.from('products').select('*').order('created_at')
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  const [settingsRes, queryRes] = await Promise.all([
    supabaseAdmin.from('app_settings').select('value').eq('key', 'accepting_hyperlocal_orders').maybeSingle(),
    query
  ])

  if (queryRes.error) return serverError(queryRes.error, 'Failed to load products')

  const isAccepting = settingsRes.data?.value !== 'false'
  
  const products = queryRes.data.map(p => {
    if (p.delivery_type === 'hyperlocal' && !isAccepting) {
      return { ...p, in_stock: false, allow_backorder: false, hyperlocal_cutoff: true }
    }
    return p
  })

  return NextResponse.json(products)
}
