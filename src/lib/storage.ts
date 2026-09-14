import { AppSettings, JobApplication } from '@/types/job';

const APPLICATIONS_KEY = 'job_tracker_applications';
const SETTINGS_KEY = 'job_tracker_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  followUpDaysThreshold: 5,
};

export function getStoredApplications(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JobApplication[]) : [];
  } catch (error) {
    console.error('Failed to load applications from localStorage:', error);
    return [];
  }
}

export function saveStoredApplications(applications: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Failed to save applications to localStorage:', error);
  }
}

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      followUpDaysThreshold:
        typeof parsed.followUpDaysThreshold === 'number' && parsed.followUpDaysThreshold > 0
          ? parsed.followUpDaysThreshold
          : DEFAULT_SETTINGS.followUpDaysThreshold,
    };
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

export function getDaysSince(dateString: string): number {
  if (!dateString) return 0;
  // Parse applied date at start of local day
  const parts = dateString.split('-');
  if (parts.length !== 3) return 0;
  const appliedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = todayStart.getTime() - appliedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function isFollowUpNeeded(app: JobApplication, threshold: number): boolean {
  if (app.status !== 'Applied') return false;
  return getDaysSince(app.dateApplied) >= threshold;
}

export function getFollowUpOverdueDays(app: JobApplication, threshold: number): number {
  const daysSince = getDaysSince(app.dateApplied);
  return Math.max(0, daysSince - threshold);
}
