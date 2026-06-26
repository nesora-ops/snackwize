'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/layout/Logo'

export default function ResetPassword() {
  const nav = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  // The recovery link from the email establishes a session on load.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true) })
    return () => subscription.unsubscribe()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return toast.error("Passwords don't match")
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) return toast.error(error.message)
    toast.success('Password updated — please log in')
    nav.push('/login')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-center"><Logo className="h-12 w-12" /></div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Set a new password</h1>

        {ready ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="pw">New Password</Label>
              <Input id="pw" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cpw">Confirm Password</Label>
              <Input id="cpw" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary-dark">
              {saving ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Open this page from the reset link in your email to continue.
          </p>
        )}
      </div>
    </div>
  )
}
