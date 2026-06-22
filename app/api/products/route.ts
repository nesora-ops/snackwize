import { supabaseAdmin } from '@/lib/supabase.server'
import { serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  let query = supabaseAdmin.from('products').select('*').order('created_at')
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) return serverError(error, 'Failed to load products')

  // Public, cacheable data — serve from the edge for 60s and revalidate in the
  // background so menu loads are fast without going stale for long.
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
