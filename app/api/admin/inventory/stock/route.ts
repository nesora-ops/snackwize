import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { updateStockSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

// Edit a product's daily bake plan: daily_stock (template), stock_addon (one-off ±),
// stock_today (live count — used for the evening reconcile).
export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Malformed request body') }

  const parsed = updateStockSchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid request')
  const { productId, ...fields } = parsed.data

  // Capture the previous live count so an evening reconcile is logged as a movement.
  let oldToday: number | null = null
  if (fields.stock_today !== undefined) {
    const { data } = await supabaseAdmin.from('products').select('stock_today').eq('id', productId).single()
    oldToday = data?.stock_today ?? null
  }

  const { error } = await supabaseAdmin.from('products').update(fields).eq('id', productId)
  if (error) return serverError(error, 'Failed to update stock')

  if (fields.stock_today !== undefined && oldToday !== null) {
    const delta = fields.stock_today - oldToday
    if (delta !== 0) {
      await supabaseAdmin.from('stock_movements').insert({
        product_id: productId, delta, reason: 'adjust', note: 'recount',
        created_by: admin.email ?? admin.id,
      })
    }
  }

  return NextResponse.json({ success: true })
}
