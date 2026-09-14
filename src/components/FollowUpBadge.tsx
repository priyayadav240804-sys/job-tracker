interface FollowUpBadgeProps {
  daysSince?: number;
  className?: string;
}

export default function FollowUpBadge({ daysSince, className = '' }: FollowUpBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/80 shadow-xs ${className}`}
      title={daysSince !== undefined ? `Applied ${daysSince} days ago - Follow-up recommended` : 'Follow-up recommended'}
    >
      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
      Follow up
      {daysSince !== undefined && (
        <span className="text-[10px] opacity-75 font-normal">({daysSince}d)</span>
      )}
    </span>
  );
}
