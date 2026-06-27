import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT = { l: 20, b: 15, h: 10, buffer_g: 50 }

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  const { data } = await supabaseAdmin.from('app_settings').select('value').eq('key', 'parcel_box').maybeSingle()
  let box = DEFAULT
  try { if (data?.value) box = { ...DEFAULT, ...JSON.parse(data.value) } } catch { /* default */ }
  return NextResponse.json(box)
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()
  let body: any
  try { body = await req.json() } catch { return badRequest('Malformed request body') }
  const box = {
    l: Number(body?.l) || DEFAULT.l,
    b: Number(body?.b) || DEFAULT.b,
    h: Number(body?.h) || DEFAULT.h,
    buffer_g: Number(body?.buffer_g) || DEFAULT.buffer_g,
  }
  const { error } = await supabaseAdmin
    .from('app_settings')
    .upsert({ key: 'parcel_box', value: JSON.stringify(box), updated_at: new Date().toISOString() })
  if (error) return serverError(error, 'Failed to save box')
  return NextResponse.json(box)
}
