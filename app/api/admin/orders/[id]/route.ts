import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { updateStatusSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed request body')
  }

  const parsed = updateStatusSchema.safeParse(body)
  if (!parsed.success) return badRequest('Invalid status')

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', params.id)

  if (error) return serverError(error, 'Failed to update order')
  return NextResponse.json({ success: true })
}
