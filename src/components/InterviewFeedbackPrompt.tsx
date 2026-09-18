'use client';

import { JobStatus } from '@/types/job';

interface InterviewFeedbackPromptProps {
  onUpdateStatus: (status: JobStatus) => void;
  className?: string;
}

export default function InterviewFeedbackPrompt({
  onUpdateStatus,
  className = '',
}: InterviewFeedbackPromptProps) {
  return (
    <div
      className={`p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/90 dark:border-purple-800/80 shadow-2xs space-y-1.5 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-200">
        <span className="text-sm">🤔</span>
        <span>How did it go?</span>
      </div>
      <p className="text-[11px] text-purple-700/90 dark:text-purple-300/80">
        Interview passed. Update application status:
      </p>
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => onUpdateStatus('Offer')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-2xs"
        >
          Got Offer 🎉
        </button>
        <button
          type="button"
          onClick={() => onUpdateStatus('Rejected')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs"
        >
          Rejected
        </button>
      </div>
    </div>
  );
}
