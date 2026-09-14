import { JobApplication } from '@/types/job';

interface StatsOverviewProps {
  applications: JobApplication[];
}

export default function StatsOverview({ applications }: StatsOverviewProps) {
  const total = applications.length;

  // Active applications: not Offer or Rejected
  const active = applications.filter(
    (app) => app.status !== 'Offer' && app.status !== 'Rejected'
  ).length;

  // Interviews in progress
  const interviews = applications.filter(
    (app) => app.status === 'Interview'
  ).length;

  // Response rate: % of applications that moved past "Applied" (and not "no response")
  const responded = applications.filter(
    (app) => app.status !== 'Applied' && app.status !== 'no response'
  ).length;

  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Applications',
      value: total,
      detail: total === 1 ? '1 application' : `${total} applications`,
      icon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40',
    },
    {
      label: 'Active Applications',
      value: active,
      detail: 'Excl. Offer & Rejected',
      icon: (
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40',
    },
    {
      label: 'Interviews',
      value: interviews,
      detail: interviews === 1 ? '1 in progress' : `${interviews} in progress`,
      icon: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40',
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      detail: `${responded}/${total || 0} moved past Applied`,
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {stat.label}
            </span>
            <div className={`p-2 rounded-lg border ${stat.bg} shrink-0`}>
              {stat.icon}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
              {stat.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
