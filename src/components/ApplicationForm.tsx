'use client';

import { useState } from 'react';
import { JobApplication, JobStatus } from '@/types/job';

interface ApplicationFormProps {
  onAddApplication: (application: Omit<JobApplication, 'id' | 'createdAt'>) => void;
}

const STATUS_OPTIONS: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'no response'];

export default function ApplicationForm({ onAddApplication }: ApplicationFormProps) {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [dateApplied, setDateApplied] = useState(getTodayString());
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<JobStatus>('Applied');
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !dateApplied) return;

    onAddApplication({
      company: company.trim(),
      role: role.trim(),
      dateApplied,
      jobUrl: jobUrl.trim() || undefined,
      status,
    });

    // Reset form
    setCompany('');
    setRole('');
    setDateApplied(getTodayString());
    setJobUrl('');
    setStatus('Applied');

    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 2500);
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Add New Application
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log details for a job you applied to
            </p>
          </div>
        </div>

        {showSuccessBadge && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-fade-in transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Name */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="company"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              required
              placeholder="e.g. Google, Stripe, Linear"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Role Title */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="role"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Role / Position <span className="text-rose-500">*</span>
            </label>
            <input
              id="role"
              type="text"
              required
              placeholder="e.g. Product Manager, Frontend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Date Applied */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="dateApplied"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Date Applied <span className="text-rose-500">*</span>
            </label>
            <input
              id="dateApplied"
              type="date"
              required
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
            />
          </div>

          {/* Status */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="status"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Job Posting URL (optional) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label
              htmlFor="jobUrl"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Job Posting URL <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="jobUrl"
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Application
          </button>
        </div>
      </form>
    </section>
  );
}
