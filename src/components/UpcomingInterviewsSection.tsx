'use client';

import { JobApplication } from '@/types/job';
import { formatInterviewCountdown, isInterviewUpcoming } from '@/lib/interview';
import StatusBadge from './StatusBadge';

interface UpcomingInterviewsSectionProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
}

export default function UpcomingInterviewsSection({
  applications,
  onSelectApplication,
}: UpcomingInterviewsSectionProps) {
  const upcoming = applications
    .filter((app) => isInterviewUpcoming(app.interviewDateTime))
    .sort((a, b) => {
      const timeA = new Date(a.interviewDateTime!).getTime();
      const timeB = new Date(b.interviewDateTime!).getTime();
      return timeA - timeB; // Soonest first
    });

  if (upcoming.length === 0) return null;

  return (
    <section className="rounded-2xl border border-indigo-200/90 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 dark:from-indigo-950/20 dark:to-blue-950/10 p-5 sm:p-6 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-200/80 dark:border-indigo-900/40">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xs shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
              Upcoming Interviews
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800">
                {upcoming.length}
              </span>
            </h2>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80">
              Scheduled interviews sorted soonest first
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {upcoming.map((app) => {
          const countdown = formatInterviewCountdown(app.interviewDateTime!);

          return (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="bg-white dark:bg-slate-900 border border-indigo-200/90 dark:border-indigo-900/50 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {app.company}
                  </h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                  {app.role}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{countdown}</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>Applied {app.dateApplied}</span>
                {app.jobUrl && (
                  <span className="text-blue-500 font-medium">View details &rarr;</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
