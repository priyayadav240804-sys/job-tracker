interface NotesIconProps {
  className?: string;
}

export default function NotesIcon({ className = '' }: NotesIconProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 ${className}`}
      title="Has notes"
    >
      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>Notes</span>
    </span>
  );
}
