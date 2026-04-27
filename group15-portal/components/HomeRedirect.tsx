"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscribeAuth } from "@/lib/firebase-auth";

export function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    return subscribeAuth((user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  return (
    <div
      className="min-h-screen bg-slate-900"
      aria-busy="true"
      aria-label="Checking sign-in status"
    />
  );
}
