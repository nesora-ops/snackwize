import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { adjustStockSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

// Relative stock change with a reason (offline sale, wastage, extra batch, correction).
export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Malformed request body') }

  const parsed = adjustStockSchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid request')
  const { productId, delta, note } = parsed.data

  const { data: newVal, error } = await supabaseAdmin.rpc('adjust_stock', { p_id: productId, p_delta: delta })
  if (error) return serverError(error, 'Failed to adjust stock')

  await supabaseAdmin.from('stock_movements').insert({
    product_id: productId, delta, reason: 'adjust', note: note ?? null,
    created_by: admin.email ?? admin.id,
  })

  return NextResponse.json({ stock_today: newVal })
}
