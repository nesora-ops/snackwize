import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { error } = await supabaseAdmin
    .from('campaigns')
    .update({ status: 'cancelled', completed_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('status', 'active')

  if (error) return serverError(error, 'Failed to cancel campaign')
  return NextResponse.json({ success: true })
}
