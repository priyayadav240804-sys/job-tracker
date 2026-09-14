export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'no response';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string; // YYYY-MM-DD
  jobUrl?: string;
  status: JobStatus;
  notes?: string;
  createdAt: number;
}

export interface AppSettings {
  followUpDaysThreshold: number;
}
