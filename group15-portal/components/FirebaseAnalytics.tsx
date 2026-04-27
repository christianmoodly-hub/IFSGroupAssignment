"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    const app = getFirebaseApp();
    if (!app) return;

    let cancelled = false;
    void (async () => {
      if (!(await isSupported())) return;
      if (cancelled) return;
      getAnalytics(app);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
