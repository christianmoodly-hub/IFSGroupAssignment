"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAuthErrorMessage,
  signInWithEmailPassword,
  subscribeAuth,
} from "@/lib/firebase-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    return subscribeAuth((user) => {
      if (user) {
        router.replace("/dashboard");
        return;
      }
      setAuthReady(true);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailPassword(email.trim(), password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : "";
      setError(getAuthErrorMessage(code || "unknown"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!authReady) {
    return (
      <div
        className="min-h-screen bg-slate-900"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Group 15 — Assignment Portal
          </h1>
          <p className="mt-2 text-slate-300">IFS03A1 &amp; BAY03A1</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-teal-600/40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-teal-600/40"
            />
          </div>

          {error ? (
            <p
              className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#0d9488] py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Invite only — contact your group leader if you need access.
        </p>

        <p className="mt-4 text-center text-xs text-slate-600">
          <Link href="/" className="text-slate-500 hover:text-slate-400">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
