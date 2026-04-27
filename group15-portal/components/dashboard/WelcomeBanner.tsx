"use client";

import { useAuthUser } from "@/components/AuthUserContext";

export function WelcomeBanner() {
  const user = useAuthUser();
  const name = user?.displayName?.trim() || user?.email || "there";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">
        Welcome back, {name}
      </h1>
      <p className="mt-2 text-slate-300">
        Track deadlines, the team, and submissions in one place.
      </p>
    </div>
  );
}
