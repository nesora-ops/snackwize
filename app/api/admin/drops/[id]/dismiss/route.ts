import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Clear a product from the pending-drops list without emailing it.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { error } = await supabaseAdmin
    .from('products')
    .update({ campaigned_at: new Date().toISOString() })
    .eq('id', params.id)
    .is('campaigned_at', null)

  if (error) return serverError(error, 'Failed to dismiss drop')
  return NextResponse.json({ success: true })
}
