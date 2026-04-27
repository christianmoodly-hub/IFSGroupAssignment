"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
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
