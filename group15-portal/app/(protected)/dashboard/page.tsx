import Link from "next/link";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { countdownLabel, daysRemainingUntilDueDate } from "@/lib/dates";

export default function DashboardPage() {
  const bayDays = daysRemainingUntilDueDate(2026, 4, 10); // 10 May 2026
  const ifsDays = daysRemainingUntilDueDate(2026, 4, 13); // 13 May 2026

  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <p className="text-sm font-medium text-teal-400">BAY03A1</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Business Analysis
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Due:{" "}
            <span className="font-medium text-white">10 May 2026</span>
          </p>
          <p className="mt-2 text-lg font-semibold text-teal-400">
            {countdownLabel(bayDays)}
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Internal draft deadline:{" "}
            <span className="text-slate-300">Drafts due 6 May</span>
          </p>
        </article>

        <article className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <p className="text-sm font-medium text-indigo-400">IFS03A1</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Project Management
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Due:{" "}
            <span className="font-medium text-white">13 May 2026</span>
          </p>
          <p className="mt-2 text-lg font-semibold text-indigo-400">
            {countdownLabel(ifsDays)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Internal draft deadline:{" "}
            <span className="text-slate-300">
              WBS → Network handoff: 2 May | Risks → Risk Matrix handoff: 5
              May
            </span>
          </p>
        </article>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/team"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-teal-600 hover:text-teal-300 sm:min-w-[10rem]"
        >
          View Team
        </Link>
        <Link
          href="/documents"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-teal-600 hover:text-teal-300 sm:min-w-[10rem]"
        >
          Upload Document
        </Link>
        <Link
          href="/documents"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-teal-600 hover:text-teal-300 sm:min-w-[10rem]"
        >
          View Submissions
        </Link>
      </div>
    </div>
  );
}
