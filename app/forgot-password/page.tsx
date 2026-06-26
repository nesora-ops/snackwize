'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/layout/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return toast.error(error.message)
    setSent(true)
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Reset your password</h1>

        {sent ? (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            If an account exists for <strong>{email}</strong>, we’ve sent a reset link. Check your inbox.
          </p>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-muted-foreground">We’ll email you a link to set a new one.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">Send reset link</Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
