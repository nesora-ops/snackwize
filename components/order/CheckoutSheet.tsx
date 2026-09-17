'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Trash2, Minus, Plus } from 'lucide-react'
import { useCart, lineKey } from '@/context/CartContext'
import { whatsappOrderLink, newOrderRef } from '@/lib/whatsapp'
import { formatAddress, type Address } from '@/lib/address'
import { WhatsAppIcon } from '@/components/layout/SocialIcons'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'
import { useSession } from '@/lib/useSession'
import { supabase } from '@/lib/supabase'

const ORANGE = '#F97316'

const SHARE_IN_CHAT = '__chat__'
const TYPE_NEW = '__new__'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #E8E1DB',
  backgroundColor: '#fff',
  fontSize: '13.5px',
  color: '#1C1917',
  fontFamily: 'inherit',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#6B5E52',
  marginBottom: '4px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

// Accepts what people actually type — spaces, +91, leading 0 — and reduces it
// to the bare 10 digits the server validates.
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits.slice(0, 10)
}

const isValidPhone = (p: string) => /^[6-9]\d{9}$/.test(p)

export function CheckoutSheet({ onClose }: { onClose: () => void }) {
  const { items, total, updateQty, remove } = useCart()
  const { user } = useSession()

  const [acknowledged, setAcknowledged] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressChoice, setAddressChoice] = useState<string>(SHARE_IN_CHAT)
  const [addressText, setAddressText] = useState('')
  const [authHeader, setAuthHeader] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  // One reference per open sheet: it goes into the WhatsApp message and onto the
  // order row, and is how Nupur matches the incoming chat to the record.
  const [ref] = useState(newOrderRef)

  // The access token is read up front, not on click: the WhatsApp button is a
  // real anchor and the POST below must be fully synchronous to ride along with
  // the navigation away.
  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setAuthHeader(session ? { Authorization: `Bearer ${session.access_token}` } : {})
    })
    return () => { cancelled = true }
  }, [user])

  // Saved name, phone and addresses pre-fill the form for signed-in customers.
  useEffect(() => {
    if (!user) {
      setAddresses([])
      setAddressChoice(SHARE_IN_CHAT)
      return
    }
    let cancelled = false

    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (cancelled || !p) return
        // Don't clobber anything already typed in this sheet.
        setName((cur) => cur || p.name || '')
        setPhone((cur) => cur || normalisePhone(p.phone || ''))
      })
      .catch(() => {})

    fetch('/api/addresses')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Address[]) => {
        if (cancelled || !Array.isArray(list)) return
        setAddresses(list)
        const preferred = list.find((a) => a.is_default) ?? list[0]
        if (preferred) setAddressChoice(preferred.id)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [user])

  const phoneOk = isValidPhone(phone)
  const nameOk = name.trim().length > 0
  const ready = nameOk && phoneOk && acknowledged

  const selectedAddress = addresses.find((a) => a.id === addressChoice) ?? null

  const resolvedAddress = useMemo(() => {
    if (selectedAddress) return formatAddress(selectedAddress)
    if (addressChoice === TYPE_NEW) return addressText.trim() || undefined
    if (!user && addressText.trim()) return addressText.trim()
    return undefined
  }, [selectedAddress, addressChoice, addressText, user])

  const href = ready
    ? whatsappOrderLink(items, total, { name: name.trim(), phone, address: resolvedAddress, ref })
    : '#'

  // Fired from the anchor's onClick, never awaited: keepalive lets the request
  // outlive the navigation to wa.me. Blocking on it and then calling
  // window.open() instead would be swallowed by iOS Safari's popup blocker.
  const recordOrder = () => {
    fetch('/api/whatsapp-orders', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, qty: i.qty, ...(i.flavour ? { flavour: i.flavour } : {}) })),
        name: name.trim(),
        phone,
        ref,
        ...(selectedAddress
          ? {
              address: {
                line1: selectedAddress.line1,
                landmark: selectedAddress.landmark ?? undefined,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pin: selectedAddress.pin,
              },
            }
          : resolvedAddress
            ? { address_text: resolvedAddress }
            : {}),
      }),
    }).catch(() => {
      // The customer is already in WhatsApp; the message itself carries the
      // order, so a failed record must never interrupt them.
    })
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(28,25,23,0.5)' }} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          borderRadius: '24px 24px 0 0',
          maxHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 10px', borderBottom: '1px solid #F0ECE8' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
            Your order
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B5E52', display: 'flex', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '8px 18px', flex: 1 }}>
          {items.map((item) => (
            <div key={lineKey(item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F7F4F1' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>{item.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#9E9083' }}>
                  {item.flavour ? <span style={{ color: ORANGE, fontWeight: 600 }}>{item.flavour} · </span> : null}
                  {item.net_weight_grams ? (item.net_weight_grams >= 1000 ? `${item.net_weight_grams / 1000}kg` : `${item.net_weight_grams}g`) : null}
                  {' · '}₹{item.price} each
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '999px', border: `1.5px solid ${ORANGE}`, backgroundColor: '#FFF3E9', padding: '2px 4px' }}>
                <button onClick={() => updateQty(lineKey(item), -1)} aria-label="Decrease" style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: ORANGE, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Minus size={11} />
                </button>
                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12.5px', fontWeight: 700, color: ORANGE }}>{item.qty}</span>
                <button onClick={() => updateQty(lineKey(item), +1)} aria-label="Increase" style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: ORANGE, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={11} />
                </button>
              </div>

              <span style={{ width: '58px', textAlign: 'right', fontSize: '13.5px', fontWeight: 800, color: '#1C1917' }}>
                ₹{item.price * item.qty}
              </span>

              <button onClick={() => remove(lineKey(item))} aria-label={`Remove ${item.name}`} style={{ background: 'none', border: 'none', color: '#C6BCB2', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917' }}>Subtotal</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>₹{total}</span>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '11.5px', color: '#9E9083', lineHeight: 1.5 }}>
            Delivery is charged separately by distance and confirmed with you on WhatsApp before your order is placed.
          </p>

          {/* ── Who's ordering ─────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid #F0ECE8', paddingTop: '14px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>
              Your details
            </h3>

            {/* Collapsed by default: a guest should never feel nagged into an
                account on their way to ordering. */}
            {!user && (
              <div style={{ marginBottom: '12px' }}>
                {authOpen ? (
                  <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E8E1DB', backgroundColor: '#FAFAF8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917' }}>Save my details</span>
                      <button
                        type="button"
                        onClick={() => setAuthOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#9E9083', fontSize: '11.5px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                      >
                        Not now
                      </button>
                    </div>
                    <EmailAuthForm compact defaultName={name} defaultPhone={phone} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px dashed #E8E1DB', backgroundColor: '#FAFAF8', color: '#6B5E52', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Save my details for next time
                  </button>
                )}
              </div>
            )}

            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle} htmlFor="sw-name">Name</label>
              <input
                id="sw-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Your name"
                autoComplete="name"
                style={{ ...inputStyle, borderColor: touched && !nameOk ? '#DC2626' : '#E8E1DB' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle} htmlFor="sw-phone">Phone</label>
              <input
                id="sw-phone"
                value={phone}
                onChange={(e) => setPhone(normalisePhone(e.target.value))}
                onBlur={() => setTouched(true)}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                autoComplete="tel"
                style={{ ...inputStyle, borderColor: touched && !phoneOk ? '#DC2626' : '#E8E1DB' }}
              />
              {touched && phone.length > 0 && !phoneOk && (
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#DC2626' }}>
                  Enter a valid 10-digit mobile number.
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="sw-address">Delivery address · optional</label>
              {addresses.length > 0 ? (
                <select
                  id="sw-address"
                  value={addressChoice}
                  onChange={(e) => setAddressChoice(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label ? `${a.label} — ` : ''}{formatAddress(a)}
                    </option>
                  ))}
                  <option value={TYPE_NEW}>Type a different address…</option>
                  <option value={SHARE_IN_CHAT}>I&apos;ll share it on WhatsApp</option>
                </select>
              ) : null}

              {(addresses.length === 0 || addressChoice === TYPE_NEW) && (
                <textarea
                  id={addresses.length === 0 ? 'sw-address' : 'sw-address-new'}
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  rows={2}
                  maxLength={300}
                  placeholder="Flat, street, area, city and pincode — or leave blank and share it in the chat"
                  style={{ ...inputStyle, marginTop: addresses.length === 0 ? 0 : '8px', resize: 'vertical' }}
                />
              )}
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${acknowledged ? ORANGE : '#E8E1DB'}`,
              backgroundColor: acknowledged ? '#FFF3E9' : '#FAFAF8',
              cursor: 'pointer',
              margin: '14px 0 4px',
            }}
          >
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: ORANGE, marginTop: '1px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', color: '#5C5049', lineHeight: 1.5 }}>
              I understand that a delivery charge will be calculated separately based on distance from the store, and confirmed with me before my order is placed.
            </span>
          </label>
        </div>

        <div style={{ padding: '12px 18px 18px', borderTop: '1px solid #F0ECE8' }}>
          {ready ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={recordOrder}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#25D366',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 22px rgba(37,211,102,0.4)',
              }}
            >
              <span style={{ backgroundColor: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WhatsAppIcon size={16} />
              </span>
              Order on WhatsApp · ₹{total}
            </a>
          ) : (
            <button
              disabled
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#E8E1DB',
                color: '#A79C92',
                fontSize: '15px',
                fontWeight: 800,
                border: 'none',
                cursor: 'not-allowed',
              }}
            >
              {!nameOk || !phoneOk ? 'Add your name and phone' : 'Tick the box above to continue'}
            </button>
          )}
          <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '11px', color: '#9E9083' }}>
            Opens WhatsApp with your order ready to send.
          </p>
        </div>
      </div>
    </div>
  )
}
