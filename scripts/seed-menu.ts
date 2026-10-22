/**
 * Seeds the real Snackwize menu into Supabase and uploads product photos from
 * the local `menu-photos/` folder. Idempotent (upserts by slug id).
 * Run:  npx tsx scripts/seed-menu.ts
 *
 * Mirrors the live catalogue as of 2026-10-22. Running it overwrites live
 * prices, so any price change made in the DB must land here too.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'

// tsx doesn't auto-load .env — parse it manually.
function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let v = m[2].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      if (!(m[1] in process.env)) process.env[m[1]] = v
    }
  } catch { /* ignore */ }
}
loadEnv()

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const PHOTO_DIR = join(process.cwd(), 'menu-photos')
const BUCKET = 'product-images'
const PLACEHOLDER = 'https://placehold.co/600x600/EDE7E0/9E9083/png?text=Photo+coming'

type Seed = {
  id: string; name: string; category: string; description: string
  price: number; net_weight_grams: number | null; badge?: string
  flavours?: string[]; photoFile?: string; in_stock?: boolean; allow_backorder?: boolean
  // A site path served from public/, used as-is instead of uploading a photo.
  image?: string
  // Off every customer-facing surface; kept rather than deleted.
  hidden?: boolean
  // Leaves campaigned_at untouched, so a pending drop stays pending in admin.
  newDrop?: boolean
}

const PRODUCTS: Seed[] = [
  { id: 'swaad-fit-mathri', name: 'Swaad Fit Mathri', category: 'Mathri', description: 'Crispy, healthy, all-time favourite.', price: 145, net_weight_grams: 100, flavours: ['Black Pepper', 'Hot n Spicy', 'Classic', 'Traditional Sweet'], photoFile: 'Swaad fit mathri.png' },
  { id: 'nachni-ninjas', name: 'Nachni Ninjas!', category: 'Crispies', description: 'Guilt-free ragi bites. Crunch king.', price: 190, net_weight_grams: 100, flavours: ['Garlic Sesame', 'Chilli Garlic', 'Peri Peri', 'Onion Sesame'], photoFile: 'Nachni Ninjas.png' },
  { id: 'jowar-jhatka', name: 'Jowar Jhatka', category: 'Crispies', description: 'Airy crisp, pure grain, mindful munch.', price: 145, net_weight_grams: 100, flavours: ['Spicy Garlic', 'Italian', 'Mexican', 'Peri Peri', 'Onion Sesame'], photoFile: 'Jowar Jhatka.jpg' },
  { id: 'beet-it-crunch', name: 'Beet it Crunch', category: 'Crispies', description: 'Baked, bold, beetroot goodness.', price: 180, net_weight_grams: 100, badge: 'NEW', photoFile: 'Beet it crunch.png' },
  { id: 'cheese-tease-stix', name: 'Cheese Tease Stix', category: 'Crispies', description: 'Irresistible — cheesy but healthy.', price: 220, net_weight_grams: 100, flavours: ['Pepper', 'Peri Peri', 'Paprika', 'Classic Cheese'], image: '/cheese_tease_item.png' },
  { id: 'bajre-da-sitta', name: 'Bajre Da Sitta', category: 'Crispies', description: 'Bajra goodness, elite sweetness.', price: 165, net_weight_grams: 100 },
  { id: 'roasty-bhel', name: 'Roasty Bhel', category: 'Bhel & Mixes', description: 'Craving queen, easy snacking.', price: 600, net_weight_grams: 1000, photoFile: 'roasty-bhel.webp' },
  { id: 'oats-bhel-blast', name: 'Oats Bhel Blast', category: 'Bhel & Mixes', description: 'All healthy grains, masala-packed.', price: 145, net_weight_grams: 100, photoFile: 'OATS BHEL BLAST.jpg' },
  { id: 'coc-remix', name: 'COC Remix', category: 'Bhel & Mixes', description: 'Corn, oats & chevda.', price: 145, net_weight_grams: 100 },
  { id: 'almond-cranberry-oat-cake', name: 'Almond Cranberry Oat Cake', category: 'Bakes', description: 'No sugar, no butter, no maida.', price: 715, net_weight_grams: 250, badge: 'NEW', photoFile: 'ALMOND CRANBERRY OAT CAKE.jpg' },
  { id: 'meethi-mathri', name: 'Meethi Mathri', category: 'Mathri', description: 'Sweet festive mathri, jaggery-kissed.', price: 165, net_weight_grams: 100, photoFile: 'Meethi Mathri.jpg' },
  { id: 'thecha-curlies', name: 'Thecha Curlies', category: 'Crispies', description: 'Fiery Maharashtrian thecha meets baked curls.', price: 190, net_weight_grams: 100, photoFile: 'Thecha Curlies .jpg' },
  // New drops (October 2026) — photos to follow.
  { id: 'oats-berry-blast-1kg', name: 'Oats Berry Blast', category: 'Bhel & Mixes', description: 'Wholesome oats with a burst of berry.', price: 2000, net_weight_grams: 1000, badge: 'NEW', newDrop: true, photoFile: 'oats-berry-blast.webp' },
  { id: 'sattu-power-bites', name: 'Sattu Power Bites', category: 'Crispies', description: 'Roasted sattu goodness in every bite.', price: 225, net_weight_grams: 100, badge: 'NEW', newDrop: true, photoFile: 'sattu-power-bites.webp' },
  { id: 'oats-berry-blast', name: 'Oats Berry Blast', category: 'Bhel & Mixes', description: 'Wholesome oats with a burst of berry.', price: 225, net_weight_grams: 100, badge: 'NEW', newDrop: true, photoFile: 'oats-berry-blast.webp' },
  { id: 'rosemary-rockers', name: 'Rosemary Rockers', category: 'Crispies', description: 'Herby rosemary crunch, freshly baked.', price: 190, net_weight_grams: 100, badge: 'NEW', newDrop: true, photoFile: 'rosemary-rockers.webp' },
  { id: 'rosemary-cheese-rockers', name: 'Rosemary Cheese Rockers', category: 'Crispies', description: 'Rosemary and cheese in one baked crunch.', price: 210, net_weight_grams: 100, badge: 'NEW', newDrop: true, photoFile: 'rosemary-cheese-rockers.webp' },
  { id: 'roasty-oats-bhel', name: 'Roasty Oats Bhel', category: 'Bhel & Mixes', description: 'Roasted oats bhel, light and masala-packed.', price: 180, net_weight_grams: 100, badge: 'NEW', newDrop: true },
  // Retired from the menu (hidden, not deleted).
  { id: 'beet-drop-mathri', name: 'Beet Drop Mathri', category: 'Mathri', description: 'Beetroot mathri — baked, bold, beautiful.', price: 145, net_weight_grams: 100, badge: 'NEW', photoFile: 'Beet drop mathri.png', hidden: true },
  { id: 'the-wheat-fix', name: 'The Wheat Fix', category: 'Crispies', description: 'Golden wheat crunch, all-day snack.', price: 145, net_weight_grams: 100, flavours: ['Onion Sesame', 'Schezwan', 'Peri Peri'], photoFile: 'The Wheat Fix.png', hidden: true },
  { id: 'makhana-madness', name: 'Makhana Madness', category: 'Bhel & Mixes', description: 'Fluffy foxnut bhel mix.', price: 1980, net_weight_grams: 1000, photoFile: 'Makhana madness.jpg', hidden: true },
]

async function uploadPhoto(slug: string, file: string): Promise<string> {
  const path = join(PHOTO_DIR, file)
  if (!existsSync(path)) { console.warn(`  ! missing ${file} → placeholder`); return PLACEHOLDER }
  const ext = (extname(file).slice(1) || 'jpg').toLowerCase()
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
  const key = `${slug}.${ext}`
  const { error } = await admin.storage.from(BUCKET).upload(key, readFileSync(path), { contentType, upsert: true })
  if (error) { console.error(`  ! upload ${file}: ${error.message}`); return PLACEHOLDER }
  return admin.storage.from(BUCKET).getPublicUrl(key).data.publicUrl
}

async function main() {
  for (const p of PRODUCTS) {
    const image = p.image ?? (p.photoFile ? await uploadPhoto(p.id, p.photoFile) : PLACEHOLDER)
    const { error } = await admin.from('products').upsert({
      id: p.id, name: p.name, category: p.category, description: p.description,
      price: p.price, net_weight_grams: p.net_weight_grams, image,
      badge: p.badge ?? null, flavours: p.flavours ?? [],
      delivery_type: 'domestic', restock_mode: 'accumulate',
      in_stock: p.in_stock ?? true, allow_backorder: p.allow_backorder ?? true,
      hidden: p.hidden ?? false,
      // baseline: existing menu isn't a "new drop"
      ...(p.newDrop ? {} : { campaigned_at: new Date().toISOString() }),
    }, { onConflict: 'id' })
    console.log(error ? `✗ ${p.name}: ${error.message}` : `✓ ${p.name}`)
  }
  console.log('Done.')
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
