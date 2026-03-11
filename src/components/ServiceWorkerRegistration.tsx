"use client";

import { useEffect } from "react";
import { env } from "@/lib/env";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production" &&
      env.NEXT_PUBLIC_ENABLE_PWA
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — non-critical
      });
    }
  }, []);

  return null;
}
