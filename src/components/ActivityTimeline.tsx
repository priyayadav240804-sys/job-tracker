'use client';

import { ActivityLogEntry } from '@/types/job';

interface ActivityTimelineProps {
  activityLog?: ActivityLogEntry[];
  createdAt: number;
}

export default function ActivityTimeline({ activityLog, createdAt }: ActivityTimelineProps) {
  const formatLogDate = (timestamp: number): string => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Ensure there is at least an initial creation entry if log was not yet recorded
  const logs: ActivityLogEntry[] =
    activityLog && activityLog.length > 0
      ? activityLog
      : [
          {
            id: 'init-creation',
            type: 'created',
            description: 'Application created',
            timestamp: createdAt || Date.now(),
          },
        ];

  return (
    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
        <svg
          className="w-4 h-4 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Activity Log</span>
      </div>

      <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-800 space-y-4 ml-1.5 my-2">
        {logs.map((entry, idx) => {
          const isLatest = idx === 0;

          return (
            <div key={entry.id} className="relative">
              {/* Vertical timeline node */}
              <div
                className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                  isLatest
                    ? 'bg-blue-600 border-white dark:border-slate-900 ring-2 ring-blue-500/30'
                    : 'bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-900'
                }`}
              />

              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  {entry.type === 'status_change'
                    ? `${entry.fromStatus} → ${entry.toStatus}`
                    : 'Application created'}
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    {' · '}
                    {formatLogDate(entry.timestamp)}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
