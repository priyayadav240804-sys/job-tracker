export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'no response';

export interface ActivityLogEntry {
  id: string;
  type: 'created' | 'status_change';
  fromStatus?: JobStatus;
  toStatus?: JobStatus;
  description: string;
  timestamp: number; // Unix timestamp in ms
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string; // YYYY-MM-DD
  jobUrl?: string;
  status: JobStatus;
  interviewDateTime?: string; // ISO / datetime-local format: YYYY-MM-DDTHH:mm
  notes?: string;
  activityLog?: ActivityLogEntry[];
  createdAt: number;
}

export interface AppSettings {
  followUpDaysThreshold: number;
}
