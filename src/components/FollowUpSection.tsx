'use client';

import { AppSettings, JobApplication } from '@/types/job';
import { getDaysSince, getFollowUpOverdueDays, isFollowUpNeeded } from '@/lib/storage';
import StatusBadge from './StatusBadge';
import NotesIcon from './NotesIcon';

interface FollowUpSectionProps {
  applications: JobApplication[];
  settings: AppSettings;
  onOpenSettings: () => void;
  onDelete: (id: string) => void;
  onSelectApplication: (app: JobApplication) => void;
}

export default function FollowUpSection({
  applications,
  settings,
  onOpenSettings,
  onDelete,
  onSelectApplication,
}: FollowUpSectionProps) {
  const followUpApps = applications
    .filter((app) => isFollowUpNeeded(app, settings.followUpDaysThreshold))
    .sort((a, b) => {
      const overdueA = getFollowUpOverdueDays(a, settings.followUpDaysThreshold);
      const overdueB = getFollowUpOverdueDays(b, settings.followUpDaysThreshold);
      return overdueB - overdueA; // Most overdue first
    });

  if (followUpApps.length === 0) return null;

  return (
    <section className="rounded-2xl border border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 p-5 sm:p-6 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/80 dark:border-amber-900/40">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
              Follow-ups Needed
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                {followUpApps.length}
              </span>
            </h2>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
              Applications awaiting response past {settings.followUpDaysThreshold} days (most overdue first)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          type="button"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-amber-900 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 bg-amber-100/90 hover:bg-amber-200/90 dark:bg-amber-900/50 dark:hover:bg-amber-800/50 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 transition-colors cursor-pointer shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Threshold: {settings.followUpDaysThreshold}d
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {followUpApps.map((app) => {
          const daysSince = getDaysSince(app.dateApplied);
          const overdue = getFollowUpOverdueDays(app, settings.followUpDaysThreshold);
          const hasNotes = Boolean(app.notes && app.notes.trim().length > 0);

          return (
            <div
              key={app.id}
              onClick={() => onSelectApplication(app)}
              className="bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-900/50 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {app.company}
                  </h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                  {app.role}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Applied: {app.dateApplied}
                  </span>
                  <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-900/50 px-2 py-0.5 rounded-md text-[11px] border border-amber-200 dark:border-amber-800">
                    {overdue === 0 ? 'Due today' : `${overdue}d overdue`}
                  </span>
                </div>

                {hasNotes && (
                  <div className="mt-2">
                    <NotesIcon />
                  </div>
                )}
              </div>

              <div
                className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {daysSince} days ago
                </span>
                <div className="flex items-center gap-2">
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      Posting
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => onDelete(app.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete application"
                    aria-label="Delete application"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
