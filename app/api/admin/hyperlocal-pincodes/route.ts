import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  const { data, error } = await supabaseAdmin.from('hyperlocal_pincodes').select('*').order('pincode')
  if (error) return serverError(error, 'Failed to load pincodes')
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  let body: any
  try { body = await req.json() } catch { return badRequest('Malformed request body') }
  const pincode = String(body?.pincode ?? '').trim()
  if (!/^\d{6}$/.test(pincode)) return badRequest('Enter a valid 6-digit pincode')
  const { error } = await supabaseAdmin
    .from('hyperlocal_pincodes')
    .upsert({ pincode, area: body?.area ?? null }, { onConflict: 'pincode' })
  if (error) return serverError(error, 'Failed to add pincode')
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  const pincode = req.nextUrl.searchParams.get('pincode')
  if (!pincode) return badRequest('pincode required')
  const { error } = await supabaseAdmin.from('hyperlocal_pincodes').delete().eq('pincode', pincode)
  if (error) return serverError(error, 'Failed to remove pincode')
  return NextResponse.json({ success: true })
}
