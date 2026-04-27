import { badgeLabel, TEAM_MEMBERS } from "@/lib/team";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">The Team</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM_MEMBERS.map((member) => {
          const label = badgeLabel(member.assignments);
          return (
            <article
              key={member.name}
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-6"
            >
              <h2 className="text-xl font-semibold text-white">
                {member.name}
              </h2>
              <p className="mt-1 text-sm text-slate-300">{member.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                    label === "BAY"
                      ? "bg-teal-900/50 text-teal-300 ring-teal-700/60"
                      : label === "IFS"
                        ? "bg-indigo-900/50 text-indigo-300 ring-indigo-700/60"
                        : "bg-slate-700/80 text-slate-200 ring-slate-600"
                  }`}
                >
                  {label}
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {member.tasks.BAY ? (
                  <li>
                    <span className="font-medium text-teal-400">BAY: </span>
                    {member.tasks.BAY}
                  </li>
                ) : null}
                {member.tasks.IFS ? (
                  <li>
                    <span className="font-medium text-indigo-400">IFS: </span>
                    {member.tasks.IFS}
                  </li>
                ) : null}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
