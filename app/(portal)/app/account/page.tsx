'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MapPin, Trash2, Star, LogOut, UserRound, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/useSession'
import { EmailAuthForm } from '@/components/auth/EmailAuthForm'
import { formatAddress, type Address } from '@/lib/address'

const ORANGE = '#F97316'

const card: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  marginBottom: '14px',
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #E8E1DB',
  fontSize: '13.5px',
  color: '#1C1917',
  fontFamily: 'inherit',
  outline: 'none',
  backgroundColor: '#fff',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#6B5E52',
  marginBottom: '4px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const primaryBtn: React.CSSProperties = {
  borderRadius: '10px',
  border: 'none',
  backgroundColor: ORANGE,
  color: '#fff',
  fontSize: '13px',
  fontWeight: 700,
  padding: '10px 16px',
  cursor: 'pointer',
}

const BLANK = { label: '', line1: '', landmark: '', city: '', state: '', pin: '' }

// The story lives on the marketing site; middleware bounces /about from the app
// subdomain to the root origin, so a plain relative href is all this needs.
function AboutLink() {
  return (
    <a
      href="/about"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #E8E1DB',
        backgroundColor: '#fff',
        color: '#6B5E52',
        fontSize: '13px',
        fontWeight: 700,
        padding: '13px',
        textDecoration: 'none',
        marginBottom: '10px',
      }}
    >
      <Heart size={16} /> Meet Nupur · Our story
    </a>
  )
}

export default function AccountPage() {
  const { user, loading } = useSession()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState(BLANK)
  const [adding, setAdding] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (cancelled || !p) return
        setName(p.name ?? '')
        setPhone(p.phone ?? '')
        setEmail(p.email ?? '')
      })
      .catch(() => {})

    fetch('/api/addresses')
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => { if (!cancelled && Array.isArray(list)) setAddresses(list) })
      .catch(() => {})

    return () => { cancelled = true }
  }, [user])

  const saveProfile = async () => {
    setSavingProfile(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), phone: phone.replace(/\D/g, '').slice(-10) }),
    })
    setSavingProfile(false)
    if (res.ok) toast.success('Saved')
    else toast.error("Couldn't save your details")
  }

  const addAddress = async () => {
    setSavingAddress(true)
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: form.label.trim() || undefined,
        line1: form.line1.trim(),
        landmark: form.landmark.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        pin: form.pin.trim(),
      }),
    })
    setSavingAddress(false)
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      toast.error(body?.error ?? "Couldn't save that address")
      return
    }
    // A new default demotes the incumbent server-side; mirror that locally.
    setAddresses((cur) => [...cur.map((a) => (body.is_default ? { ...a, is_default: false } : a)), body])
    setForm(BLANK)
    setAdding(false)
    toast.success('Address saved')
  }

  const setDefault = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_default: true }),
    })
    if (!res.ok) return toast.error("Couldn't update that address")
    setAddresses((cur) => cur.map((a) => ({ ...a, is_default: a.id === id })))
  }

  const removeAddress = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    if (!res.ok) return toast.error("Couldn't remove that address")
    setAddresses((cur) => cur.filter((a) => a.id !== id))
  }

  if (loading) return null

  if (!user) {
    return (
      <div style={{ padding: '32px 20px' }}>
        <div style={{ ...card, textAlign: 'center', padding: '28px 20px' }}>
          <UserRound size={32} color={ORANGE} style={{ margin: '0 auto 12px' }} />
          <h1 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
            Your account
          </h1>
          <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#6B5E52', lineHeight: 1.6 }}>
            Sign in to save your name and delivery addresses, so ordering takes one tap.
          </p>
          <EmailAuthForm />
        </div>
        <AboutLink />
      </div>
    )
  }

  const formValid = form.line1.trim() && form.city.trim() && form.state.trim() && /^\d{6}$/.test(form.pin.trim())

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 800, color: '#1C1917', fontFamily: "'Playfair Display', serif" }}>
        Your account
      </h1>

      <div style={card}>
        <div style={{ marginBottom: '12px' }}>
          <span style={label}>Email</span>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#6B5E52' }}>{email || user.email}</p>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={label} htmlFor="acc-name">Name</label>
          <input id="acc-name" style={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={label} htmlFor="acc-phone">Phone</label>
          <input
            id="acc-phone"
            style={input}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile number"
          />
        </div>

        <button onClick={saveProfile} disabled={savingProfile} style={{ ...primaryBtn, opacity: savingProfile ? 0.6 : 1 }}>
          {savingProfile ? 'Saving…' : 'Save details'}
        </button>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
          <MapPin size={17} color={ORANGE} />
          <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1C1917' }}>Delivery addresses</h2>
        </div>

        {addresses.length === 0 && !adding && (
          <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#9E9083', lineHeight: 1.5 }}>
            No saved addresses yet. Add one and it&apos;ll be filled into your WhatsApp order automatically.
          </p>
        )}

        {addresses.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F7F4F1' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 700, color: '#1C1917' }}>
                {a.label || 'Address'}
                {a.is_default && (
                  <span style={{ marginLeft: '6px', backgroundColor: '#FFF3E9', color: '#C2410C', fontSize: '9.5px', fontWeight: 700, borderRadius: '999px', padding: '2px 7px' }}>
                    DEFAULT
                  </span>
                )}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6B5E52', lineHeight: 1.5 }}>{formatAddress(a)}</p>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {!a.is_default && (
                <button onClick={() => setDefault(a.id)} aria-label="Make default" title="Make default" style={{ background: 'none', border: 'none', color: '#C6BCB2', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  <Star size={15} />
                </button>
              )}
              <button onClick={() => removeAddress(a.id)} aria-label="Remove address" style={{ background: 'none', border: 'none', color: '#C6BCB2', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {adding ? (
          <div style={{ marginTop: '12px' }}>
            <input style={{ ...input, marginBottom: '8px' }} placeholder="Label — Home, Office (optional)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            <input style={{ ...input, marginBottom: '8px' }} placeholder="Flat / building / street" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <input style={{ ...input, marginBottom: '8px' }} placeholder="Landmark (optional)" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input style={input} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input style={input} placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <input
              style={{ ...input, marginBottom: '12px' }}
              placeholder="6-digit pincode"
              inputMode="numeric"
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addAddress} disabled={!formValid || savingAddress} style={{ ...primaryBtn, opacity: !formValid || savingAddress ? 0.5 : 1, cursor: !formValid ? 'not-allowed' : 'pointer' }}>
                {savingAddress ? 'Saving…' : 'Save address'}
              </button>
              <button onClick={() => { setAdding(false); setForm(BLANK) }} style={{ ...primaryBtn, backgroundColor: '#F5F0EB', color: '#6B5E52' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{ marginTop: '12px', borderRadius: '10px', border: `1.5px dashed ${ORANGE}`, backgroundColor: '#FFF7F0', color: '#C2410C', fontSize: '13px', fontWeight: 700, padding: '10px 16px', cursor: 'pointer', width: '100%' }}
          >
            + Add an address
          </button>
        )}
      </div>

      <AboutLink />

      <button
        onClick={async () => { await supabase.auth.signOut(); window.location.assign('/app/menu') }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', width: '100%', borderRadius: '12px', border: '1px solid #E8E1DB', backgroundColor: '#fff', color: '#6B5E52', fontSize: '13px', fontWeight: 700, padding: '13px', cursor: 'pointer' }}
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  )
}
