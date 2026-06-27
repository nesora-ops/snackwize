import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  const { data } = await supabaseAdmin.from('app_settings').select('value').eq('key', 'accepting_hyperlocal_orders').maybeSingle()
  const isAccepting = data?.value !== 'false' // defaults to true if not set
  return NextResponse.json({ accepting: isAccepting })
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  let body: any
  try { body = await req.json() } catch { return badRequest('Malformed request body') }
  
  if (typeof body?.accepting !== 'boolean') return badRequest('Missing or invalid accepting boolean')

  const { error } = await supabaseAdmin
    .from('app_settings')
    .upsert({ key: 'accepting_hyperlocal_orders', value: body.accepting ? 'true' : 'false', updated_at: new Date().toISOString() })
  
  if (error) return serverError(error, 'Failed to save hyperlocal status')
  return NextResponse.json({ accepting: body.accepting })
}
