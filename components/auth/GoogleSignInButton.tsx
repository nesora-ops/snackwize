'use client'

// NOT WIRED UP. Customers currently sign in with EmailAuthForm; this is kept,
// working, for the planned switch to Google. To enable: create a Google Cloud
// OAuth client with redirect URI https://<project-ref>.supabase.co/auth/v1/callback,
// turn the provider on in Supabase with its client ID/secret, allowlist
// /auth/callback on both origins under Auth -> URL Configuration, then render this
// in place of EmailAuthForm. app/auth/callback/route.ts is already in place.

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GoogleIcon } from './GoogleIcon'

type Props = {
  /** Where to land after sign-in. Defaults to the page the button is on. */
  next?: string
  label?: string
  /** Quieter styling for inline use inside the checkout sheet. */
  subtle?: boolean
}

export function GoogleSignInButton({ next, label = 'Continue with Google', subtle }: Props) {
  const pathname = usePathname()
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setBusy(true)
    const dest = next ?? pathname ?? '/order'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(dest)}`,
      },
    })
    // On success the browser has already navigated to Google; only a failure
    // returns here, so the button has to become usable again.
    if (error) setBusy(false)
  }

  return (
    <button
      onClick={signIn}
      disabled={busy}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: subtle ? '9px 12px' : '13px 16px',
        borderRadius: subtle ? '10px' : '12px',
        border: '1px solid #E8E1DB',
        backgroundColor: '#fff',
        color: busy ? '#A79C92' : '#1C1917',
        fontSize: subtle ? '12.5px' : '14px',
        fontWeight: 600,
        cursor: busy ? 'wait' : 'pointer',
      }}
    >
      <GoogleIcon size={subtle ? 15 : 18} />
      {busy ? 'Opening Google…' : label}
    </button>
  )
}
