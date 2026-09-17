'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ORANGE = '#F97316'

type Props = {
  /** Where to send the customer after success. Omit to stay put (e.g. the checkout sheet). */
  next?: string
  /** Tighter styling for inline use inside the checkout sheet. */
  compact?: boolean
  /** Reuse details already typed elsewhere on the page when creating the account. */
  defaultName?: string
  defaultPhone?: string
  onSuccess?: () => void
}

/**
 * Email + password accounts, deliberately minimal: no confirmation email, no
 * OTP, no magic link. The project has mailer_autoconfirm on, so signUp returns a
 * usable session immediately. Google OAuth is the planned replacement — see
 * components/auth/GoogleSignInButton.tsx, which is kept for that switch.
 */
export function EmailAuthForm({ next, compact, defaultName, defaultPhone, onSuccess }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const input: React.CSSProperties = {
    width: '100%',
    padding: compact ? '9px 11px' : '11px 13px',
    borderRadius: '10px',
    border: '1px solid #E8E1DB',
    backgroundColor: '#fff',
    fontSize: compact ? '13px' : '14px',
    color: '#1C1917',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '8px',
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)

    if (mode === 'signup') {
      // The data payload is what the handle_new_user trigger reads to seed the
      // profiles row, so the account starts with the name and phone already given.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: defaultName?.trim() || email.trim().split('@')[0],
            phone: defaultPhone?.replace(/\D/g, '').slice(-10) || null,
          },
        },
      })
      setBusy(false)
      if (error) return setError(error.message)
      if (!data.session) {
        // Only happens if email confirmation gets re-enabled in the dashboard.
        return setError('Check your email to confirm this address, then sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      setBusy(false)
      if (error) return setError(error.message)
    }

    onSuccess?.()
    if (next) router.push(next)
  }

  return (
    <form onSubmit={submit} style={{ width: '100%' }}>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />
      <input
        type="password"
        required
        minLength={6}
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        placeholder={mode === 'signup' ? 'Choose a password (6+ characters)' : 'Password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ ...input, marginBottom: error ? '6px' : '10px' }}
      />

      {error && (
        <p style={{ margin: '0 0 10px', fontSize: '11.5px', color: '#DC2626', lineHeight: 1.5 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        style={{
          width: '100%',
          padding: compact ? '10px' : '13px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: busy ? '#E8E1DB' : ORANGE,
          color: busy ? '#A79C92' : '#fff',
          fontSize: compact ? '13px' : '14px',
          fontWeight: 700,
          cursor: busy ? 'wait' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {busy ? 'Just a moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>

      <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '11.5px', color: '#9E9083' }}>
        {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
        <button
          type="button"
          onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null) }}
          style={{ background: 'none', border: 'none', padding: 0, color: ORANGE, fontWeight: 700, fontSize: '11.5px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {mode === 'signup' ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </form>
  )
}
