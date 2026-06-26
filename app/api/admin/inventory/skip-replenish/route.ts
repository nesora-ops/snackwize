import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const { data, error } = await supabaseAdmin
    .from('app_settings').select('value').eq('key', 'skip_next_replenish').maybeSingle()
  if (error) return serverError(error, 'Failed to read setting')
  return NextResponse.json({ skip: data?.value === 'true' })
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let skip: boolean | undefined
  try { skip = (await req.json())?.skip } catch { /* ignore */ }
  if (typeof skip !== 'boolean') return badRequest('skip (boolean) required')

  const { error } = await supabaseAdmin
    .from('app_settings')
    .upsert({ key: 'skip_next_replenish', value: skip ? 'true' : 'false', updated_at: new Date().toISOString() })
  if (error) return serverError(error, 'Failed to update setting')
  return NextResponse.json({ skip })
}
