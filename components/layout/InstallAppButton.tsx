'use client'

import { useState, useEffect } from "react"
import { Download, Share, MoreVertical, MonitorSmartphone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function InstallAppButton({ 
  variant = "outline",
  className = "",
  children
}: { 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
  className?: string,
  children?: React.ReactNode
}) {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop")

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType("ios")
    } else if (/android/.test(ua)) {
      setDeviceType("android")
    } else {
      setDeviceType("desktop")
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          <div className={className}>{children}</div>
        ) : (
          <Button variant={variant} size="sm" className={className}>
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MonitorSmartphone className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">Install Snackwize App</DialogTitle>
          <DialogDescription className="text-center">
            Get quick access to healthy snacks directly from your home screen.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {deviceType === "ios" && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h4 className="mb-3 font-semibold text-foreground">How to install on iPhone/iPad</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">1</span>
                  <span>Tap the <Share className="mx-1 inline-h-4 inline-w-4 align-text-bottom" /> <strong>Share</strong> button in Safari's bottom menu bar.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">3</span>
                  <span>Tap <strong>Add</strong> in the top right corner.</span>
                </li>
              </ol>
            </div>
          )}

          {deviceType === "android" && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h4 className="mb-3 font-semibold text-foreground">How to install on Android</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">1</span>
                  <span>Tap the <MoreVertical className="mx-1 inline-h-4 inline-w-4 align-text-bottom" /> <strong>Menu</strong> icon in the top right of Chrome.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">2</span>
                  <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">3</span>
                  <span>Follow the on-screen prompt to install.</span>
                </li>
              </ol>
            </div>
          )}

          {deviceType === "desktop" && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h4 className="mb-3 font-semibold text-foreground">How to install on Desktop</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">1</span>
                  <span>Look for the <Download className="mx-1 inline-h-4 inline-w-4 align-text-bottom" /> <strong>Install</strong> icon in the right side of your browser's address bar.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">2</span>
                  <span>Click it and select <strong>Install</strong>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground">3</span>
                  <span>The app will now be available in your applications list.</span>
                </li>
              </ol>
            </div>
          )}

          <div className="mt-2 text-center text-xs text-muted-foreground">
            Works best on Safari (iOS) and Chrome (Android/Desktop).
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
