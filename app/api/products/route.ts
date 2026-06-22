import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  let query = supabase.from('products').select('*').order('created_at')
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
