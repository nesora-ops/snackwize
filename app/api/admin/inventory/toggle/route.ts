import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

async function getAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (user?.user_metadata?.role !== 'admin') return null
  return user
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, in_stock, allow_backorder, note } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (typeof in_stock === 'boolean') update.in_stock = in_stock
  if (typeof allow_backorder === 'boolean') update.allow_backorder = allow_backorder

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('products')
    .update(update)
    .eq('id', productId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

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
