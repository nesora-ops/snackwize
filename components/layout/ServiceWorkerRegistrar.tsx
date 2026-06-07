'use client'

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[Snackwize SW] Registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[Snackwize SW] Registration failed:", err);
        });
    }
  }, []);

  return null;
}
