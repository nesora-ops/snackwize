import { supabaseAdmin } from '@/lib/supabase.server'
import { getAdmin, unauthorized, badRequest, serverError } from '@/lib/api'
import { createProductSchema } from '@/lib/validation'
import { NextRequest, NextResponse } from 'next/server'

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v : '')
const num = (v: FormDataEntryValue | null) => (v === null || v === '' ? undefined : Number(v))
const csv = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s ? s.split(',').map(x => x.trim()).filter(Boolean) : undefined
}

// Upload a product photo to the public bucket; returns its public URL.
async function uploadPhoto(file: File): Promise<{ url?: string; error?: string }> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, await file.arrayBuffer(), { contentType: file.type || 'image/jpeg' })
  if (error) return { error: error.message }
  return { url: supabaseAdmin.storage.from('product-images').getPublicUrl(path).data.publicUrl }
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return badRequest('Expected multipart form data')
  }

  const parsed = createProductSchema.safeParse({
    name: str(form.get('name')),
    category: str(form.get('category')),
    description: str(form.get('description')),
    price: num(form.get('price')),
    net_weight_grams: num(form.get('net_weight_grams')),
    shelf_life: str(form.get('shelf_life')) || undefined,
    delivery_type: str(form.get('delivery_type')) || 'local',
    nutrition: str(form.get('nutrition')) || undefined,
    badge: str(form.get('badge')) || undefined,
    instagram_url: str(form.get('instagram_url')) || undefined,
    flavours: csv(form.get('flavours')),
  })
  if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? 'Invalid product')

  const photo = form.get('photo')
  if (!(photo instanceof File) || photo.size === 0) return badRequest('A product photo is required')
  const upload = await uploadPhoto(photo)
  if (upload.error) return serverError(upload.error, 'Failed to upload photo')

  // id is DB-generated (prod-N sequence); campaigned_at null => pending drop.
  const { data: created, error } = await supabaseAdmin
    .from('products')
    .insert({ ...parsed.data, image: upload.url, in_stock: true, allow_backorder: true })
    .select('*')
    .single()

  if (error) return serverError(error, 'Failed to create product')
  return NextResponse.json(created)
}
