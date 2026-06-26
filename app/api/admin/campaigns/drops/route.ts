import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Pending drops = products not yet featured in any campaign.
export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, name, image, price, net_weight_grams, category')
    .is('campaigned_at', null)
    .order('created_at', { ascending: false })

  if (error) return serverError(error, 'Failed to load drops')
  return NextResponse.json(data)
}
