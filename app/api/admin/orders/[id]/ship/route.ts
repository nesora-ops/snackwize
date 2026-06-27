import { getAdmin, unauthorized, badRequest } from '@/lib/api'
import { createShipmentForOrder } from '@/lib/orders'
import { NextRequest, NextResponse } from 'next/server'

// Admin "Create shipment" — used to retry when auto-booking failed at payment time.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin) return unauthorized()

  const result = await createShipmentForOrder(params.id)
  if (!result.ok) return badRequest(result.error ?? 'Failed to create shipment')
  return NextResponse.json({ success: true })
}
