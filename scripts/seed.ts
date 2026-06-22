import { createClient } from '@supabase/supabase-js'
import { PRODUCTS } from '../lib/data'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = PRODUCTS.map((p) => ({ ...p, in_stock: true }))

const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' })

if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}

console.log(`Seeded ${rows.length} products successfully.`)
