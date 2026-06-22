import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { toggleInventorySchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed request body')
  }

  const parsed = toggleInventorySchema.safeParse(body)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid request')
  const { productId, in_stock, allow_backorder, note } = parsed.data

  const update: Record<string, unknown> = {}
  if (typeof in_stock === 'boolean') update.in_stock = in_stock
  if (typeof allow_backorder === 'boolean') update.allow_backorder = allow_backorder

  const { error: updateError } = await supabaseAdmin
    .from('products')
    .update(update)
    .eq('id', productId)

  if (updateError) return serverError(updateError, 'Failed to update product')

  if (typeof in_stock === 'boolean') {
    await supabaseAdmin.from('inventory_logs').insert({
      product_id: productId,
      action: in_stock ? 'marked_in_stock' : 'marked_sold_out',
      changed_by: admin.email ?? admin.id,
      note: note ?? null,
    })
  }

  return NextResponse.json({ success: true })
}
