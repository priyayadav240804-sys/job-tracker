export function isInterviewUpcoming(dateTimeStr?: string): boolean {
  if (!dateTimeStr) return false;
  const t = new Date(dateTimeStr).getTime();
  return !isNaN(t) && t > Date.now();
}

export function isInterviewPast(dateTimeStr?: string): boolean {
  if (!dateTimeStr) return false;
  const t = new Date(dateTimeStr).getTime();
  return !isNaN(t) && t <= Date.now();
}

export function formatInterviewCountdown(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  const interviewDate = new Date(dateTimeStr);
  if (isNaN(interviewDate.getTime())) return '';

  const now = new Date();
  const timeStr = interviewDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    interviewDate.getFullYear(),
    interviewDate.getMonth(),
    interviewDate.getDate()
  );

  const dayDiff = Math.round(
    (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (dayDiff === 0) {
    return `Today at ${timeStr}`;
  }
  if (dayDiff === 1) {
    return `Tomorrow at ${timeStr}`;
  }
  if (dayDiff > 1 && dayDiff <= 6) {
    return `In ${dayDiff} days (${timeStr})`;
  }
  if (dayDiff > 6) {
    const dateFormatted = interviewDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateFormatted} at ${timeStr}`;
  }

  // Past dates
  if (dayDiff === -1) {
    return `Yesterday at ${timeStr}`;
  }
  return `${Math.abs(dayDiff)} days ago`;
}
