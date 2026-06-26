import { supabaseAdmin } from '@/lib/supabase.server'
import { badRequest, serverError } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

// Public. The subscriber's uuid is the unguessable unsubscribe token.
export async function POST(req: NextRequest) {
  let id: string | undefined
  try { id = (await req.json())?.id } catch { /* ignore */ }
  if (!id) return badRequest('Missing unsubscribe token')

  const { error } = await supabaseAdmin
    .from('email_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', id)
    .is('unsubscribed_at', null)

  if (error) return serverError(error, 'Failed to unsubscribe')
  return NextResponse.json({ success: true })
}
