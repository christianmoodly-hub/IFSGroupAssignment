"use client";

import type { User } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUserContext } from "@/components/AuthUserContext";
import { signOutUser, subscribeAuth } from "@/lib/firebase-auth";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-800 text-teal-400"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    return subscribeAuth((u) => {
      if (!u) {
        router.replace("/login");
      }
      setUser(u);
    });
  }, [router]);

  if (user === undefined) {
    return (
      <div
        className="min-h-screen bg-[#0f172a]"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen bg-[#0f172a]"
        aria-busy="true"
        aria-label="Redirecting to sign in"
      />
    );
  }

  const displayName = user.displayName?.trim() || user.email || "Member";

  return (
    <AuthUserContext.Provider value={user}>
      <div className="min-h-screen bg-[#0f172a] font-[family-name:var(--font-geist-sans)] text-white">
        <header className="border-b border-slate-700 bg-[#0f172a]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="shrink-0 text-lg font-semibold tracking-tight text-white"
            >
              Group 15 Portal
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-6">
              <nav className="flex flex-wrap items-center gap-1">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/team">Team</NavLink>
                <NavLink href="/documents">Documents</NavLink>
              </nav>
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-700 pt-4 sm:border-t-0 sm:pt-0">
                <span className="text-sm text-slate-300">{displayName}</span>
                <button
                  type="button"
                  onClick={() => void signOutUser()}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-teal-600 hover:text-teal-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </AuthUserContext.Provider>
  );
}
