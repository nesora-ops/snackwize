import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { updateProductSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v : '')
const num = (v: FormDataEntryValue | null) => (v === null || v === '' ? undefined : Number(v))

async function uploadPhoto(file: File): Promise<{ url?: string; error?: string }> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, await file.arrayBuffer(), { contentType: file.type || 'image/jpeg' })
  if (error) return { error: error.message }
  return { url: supabaseAdmin.storage.from('product-images').getPublicUrl(path).data.publicUrl }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return badRequest('Expected multipart form data')
  }

  // Only include fields actually present in the form.
  const fields: Record<string, unknown> = {}
  if (form.has('name')) fields.name = str(form.get('name'))
  if (form.has('category')) fields.category = str(form.get('category'))
  if (form.has('description')) fields.description = str(form.get('description'))
  if (form.has('price')) fields.price = num(form.get('price'))
  if (form.has('net_weight_grams')) fields.net_weight_grams = num(form.get('net_weight_grams'))
  if (form.has('shelf_life')) fields.shelf_life = str(form.get('shelf_life'))
  if (form.has('delivery_type')) fields.delivery_type = str(form.get('delivery_type'))
  if (form.has('nutrition')) fields.nutrition = str(form.get('nutrition'))
  if (form.has('badge')) fields.badge = str(form.get('badge'))

  const parsed = updateProductSchema.safeParse(fields)
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid product')

  const update: Record<string, unknown> = { ...parsed.data }

  const photo = form.get('photo')
  if (photo instanceof File && photo.size > 0) {
    const upload = await uploadPhoto(photo)
    if (upload.error) return serverError(upload.error, 'Failed to upload photo')
    update.image = upload.url
  }

  if (Object.keys(update).length === 0) return badRequest('Nothing to update')

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(update)
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) return serverError(error, 'Failed to update product')
  return NextResponse.json(data)
}
