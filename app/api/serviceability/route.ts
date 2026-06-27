import { supabaseAdmin } from '@/lib/supabase.server'
import { NextRequest, NextResponse } from 'next/server'

// Public: is this pincode serviceable for same-day (hyperlocal/Borzo) delivery?
export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get('pin')
  if (!pin || !/^\d{6}$/.test(pin)) return NextResponse.json({ serviceable: false })
  const { data } = await supabaseAdmin
    .from('hyperlocal_pincodes').select('pincode').eq('pincode', pin).maybeSingle()
  return NextResponse.json({ serviceable: !!data })
}
