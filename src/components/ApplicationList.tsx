'use client';

import { useState } from 'react';
import { AppSettings, JobApplication, JobStatus } from '@/types/job';
import { getDaysSince, isFollowUpNeeded } from '@/lib/storage';
import StatusBadge from './StatusBadge';
import FollowUpBadge from './FollowUpBadge';
import NotesIcon from './NotesIcon';

interface ApplicationListProps {
  applications: JobApplication[];
  settings: AppSettings;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onSelectApplication: (app: JobApplication) => void;
}

const ALL_STATUSES: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'no response'];

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Applied', value: 'Applied' },
  { label: 'Interview', value: 'Interview' },
  { label: 'Offer', value: 'Offer' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'No Response', value: 'no response' },
];

export default function ApplicationList({
  applications,
  settings,
  onDelete,
  onUpdateStatus,
  onSelectApplication,
}: ApplicationListProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'pipeline'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const query = searchQuery.trim().toLowerCase();

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !query ||
      app.company.toLowerCase().includes(query) ||
      app.role.toLowerCase().includes(query);

    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
  };

  const isFiltering = query.length > 0 || filterStatus !== 'all';

  return (
    <div className="space-y-4">
      {/* Top Header with Title, Count, and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Applications
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
            {isFiltering ? `${filteredApplications.length} of ${applications.length}` : applications.length}
          </span>
        </div>

        {/* View Mode Toggle: List vs Pipeline */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Pipeline
          </button>
        </div>
      </div>

      {/* Search Input and Status Filter Controls */}
      {applications.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or role..."
              aria-label="Search applications by company or role"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filter Buttons / Control */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              Filter:
            </span>
            {FILTER_OPTIONS.map((opt) => {
              const isSelected = filterStatus === opt.value;
              const count =
                opt.value === 'all'
                  ? applications.length
                  : applications.filter((a) => a.status === opt.value).length;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterStatus(opt.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 ml-auto font-medium transition-colors cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Rendering: Empty State vs List vs Pipeline */}
      {applications.length === 0 ? (
        /* Global Empty State */
        <div className="text-center py-14 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs transition-all">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            No applications yet — add your first one
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
            Fill out the form above to log your applications, set reminders, track pipeline progress, and keep interview notes.
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        /* No Results Found State */
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 transition-all">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No results found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery && filterStatus !== 'all'
              ? `No applications matching "${searchQuery}" with status "${filterStatus}".`
              : searchQuery
              ? `No applications matching "${searchQuery}".`
              : `No applications found with status "${filterStatus}".`}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            Clear search &amp; filters
          </button>
        </div>
      ) : activeTab === 'list' ? (
        /* LIST VIEW */
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-all">
          {filteredApplications.map((app) => {
            const needsFollowUp = isFollowUpNeeded(app, settings.followUpDaysThreshold);
            const daysSince = getDaysSince(app.dateApplied);
            const hasNotes = Boolean(app.notes && app.notes.trim().length > 0);

            return (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer group"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {app.company}
                    </h3>
                    <StatusBadge status={app.status} />
                    {needsFollowUp && <FollowUpBadge daysSince={daysSince} />}
                    {hasNotes && <NotesIcon />}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {app.role}
                    </span>
                    <span>•</span>
                    <span>Applied {app.dateApplied}</span>
                    <span>•</span>
                    <span>{daysSince === 0 ? 'Today' : `${daysSince}d ago`}</span>
                    {app.jobUrl && (
                      <>
                        <span>•</span>
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
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
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2.5 self-end sm:self-center shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Status quick changer */}
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as JobStatus)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-2xs"
                    aria-label="Change application status"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(app.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete application"
                    aria-label="Delete application"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            );
          })}
        </div>
      ) : (
        /* PIPELINE VIEW */
        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex md:grid md:grid-cols-5 gap-3.5 min-w-[780px] md:min-w-0 items-start">
            {ALL_STATUSES.map((st) => {
              const columnApps = filteredApplications.filter((a) => a.status === st);

              return (
                <div
                  key={st}
                  className="flex-1 min-w-[200px] md:min-w-0 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 flex flex-col gap-2.5 transition-colors"
                >
                  <div className="flex items-center justify-between px-1">
                    <StatusBadge status={st} />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {columnApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {columnApps.length === 0 ? (
                      <div className="h-28 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic">
                        {isFiltering ? 'No matches' : 'No applications'}
                      </div>
                    ) : (
                      columnApps.map((app) => {
                        const needsFollowUp = isFollowUpNeeded(app, settings.followUpDaysThreshold);
                        const daysSince = getDaysSince(app.dateApplied);
                        const hasNotes = Boolean(app.notes && app.notes.trim().length > 0);

                        return (
                          <div
                            key={app.id}
                            onClick={() => onSelectApplication(app)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs space-y-2 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {app.company}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(app.id);
                                }}
                                className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                                title="Delete application"
                                aria-label="Delete application"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium">
                              {app.role}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {needsFollowUp && <FollowUpBadge daysSince={daysSince} />}
                              {hasNotes && <NotesIcon />}
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                              <span>{app.dateApplied}</span>
                              {app.jobUrl && (
                                <a
                                  href={app.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-500 hover:underline flex items-center gap-0.5 font-medium"
                                >
                                  Link
                                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
