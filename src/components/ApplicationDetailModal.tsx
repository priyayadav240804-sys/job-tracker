'use client';

import { useState, useEffect } from 'react';
import { AppSettings, JobApplication, JobStatus } from '@/types/job';
import { getDaysSince, isFollowUpNeeded } from '@/lib/storage';
import StatusBadge from './StatusBadge';
import FollowUpBadge from './FollowUpBadge';
import ActivityTimeline from './ActivityTimeline';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onUpdateInterviewDateTime: (id: string, dateTime: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'no response'];

export default function ApplicationDetailModal({
  application,
  settings,
  isOpen,
  onClose,
  onUpdateNotes,
  onUpdateStatus,
  onUpdateInterviewDateTime,
  onDelete,
}: ApplicationDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
      setIsSaved(false);
    }
  }, [application]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const needsFollowUp = isFollowUpNeeded(application, settings.followUpDaysThreshold);
  const daysSince = getDaysSince(application.dateApplied);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 my-auto space-y-5 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                {application.company}
              </h2>
              <StatusBadge status={application.status} />
              {needsFollowUp && <FollowUpBadge daysSince={daysSince} />}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              {application.role}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Application Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <span className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Date Applied
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 block">
              {application.dateApplied} ({daysSince === 0 ? 'Today' : `${daysSince}d ago`})
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Update Status
            </span>
            <select
              value={application.status}
              onChange={(e) => onUpdateStatus(application.id, e.target.value as JobStatus)}
              className="mt-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-2xs"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="modalInterviewDateTime"
                className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Interview Date &amp; Time
              </label>
              {application.interviewDateTime && (
                <button
                  type="button"
                  onClick={() => onUpdateInterviewDateTime(application.id, '')}
                  className="text-[11px] font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline cursor-pointer"
                >
                  Clear interview time
                </button>
              )}
            </div>
            <input
              id="modalInterviewDateTime"
              type="datetime-local"
              value={application.interviewDateTime || ''}
              onChange={(e) => onUpdateInterviewDateTime(application.id, e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-2xs"
            />
          </div>

          {application.jobUrl && (
            <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
              <span className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Job Posting Link
              </span>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 break-all font-medium"
              >
                {application.jobUrl}
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Editable Notes Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="app-notes"
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Notes &amp; Interview Log
            </label>

            {isSaved && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved to storage!
              </span>
            )}
          </div>

          <textarea
            id="app-notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record interviewer names, questions asked, salary discussed, recruiter contacts, or next steps..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Read-only Activity Log Timeline */}
        <ActivityTimeline
          activityLog={application.activityLog}
          createdAt={application.createdAt}
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete the application for ${application.company}?`)) {
                onDelete(application.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Application
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
