'use client';

import { useEffect, useState } from 'react';
import { AppSettings, JobApplication, JobStatus } from '@/types/job';
import {
  DEFAULT_SETTINGS,
  getStoredApplications,
  getStoredSettings,
  saveStoredApplications,
  saveStoredSettings,
} from '@/lib/storage';
import Navbar from '@/components/Navbar';
import ApplicationForm from '@/components/ApplicationForm';
import ApplicationList from '@/components/ApplicationList';
import FollowUpSection from '@/components/FollowUpSection';
import SettingsPanel from '@/components/SettingsPanel';
import ApplicationDetailModal from '@/components/ApplicationDetailModal';
import StatsOverview from '@/components/StatsOverview';

export default function Home() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedApps = getStoredApplications();
    const storedSettings = getStoredSettings();
    setApplications(storedApps);
    setSettings(storedSettings);
    setIsLoaded(true);
  }, []);

  // Handler: Add Application
  const handleAddApplication = (
    newAppData: Omit<JobApplication, 'id' | 'createdAt'>
  ) => {
    const newApp: JobApplication = {
      ...newAppData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    saveStoredApplications(updated);
  };

  // Handler: Delete Application
  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter((app) => app.id !== id);
    setApplications(updated);
    saveStoredApplications(updated);

    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
  };

  // Handler: Update Application Status
  const handleUpdateStatus = (id: string, status: JobStatus) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    saveStoredApplications(updated);

    if (selectedApplication?.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Handler: Update Application Notes
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, notes } : app
    );
    setApplications(updated);
    saveStoredApplications(updated);

    if (selectedApplication?.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, notes } : null));
    }
  };

  // Handler: Update Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Loading state indicator */}
        {!isLoaded ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Loading your tracker...
            </p>
          </div>
        ) : (
          <>
            {/* Dashboard Stat Cards */}
            <StatsOverview applications={applications} />

            {/* Follow-ups Needed Section (Displays automatically when any application meets threshold) */}
            <FollowUpSection
              applications={applications}
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onDelete={handleDeleteApplication}
              onSelectApplication={(app) => setSelectedApplication(app)}
            />

            {/* Core Add Application Form */}
            <ApplicationForm onAddApplication={handleAddApplication} />

            {/* Applications List and Pipeline View */}
            <ApplicationList
              applications={applications}
              settings={settings}
              onDelete={handleDeleteApplication}
              onUpdateStatus={handleUpdateStatus}
              onSelectApplication={(app) => setSelectedApplication(app)}
            />
          </>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsPanel
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Application Detail & Notes Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        settings={settings}
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        onUpdateNotes={handleUpdateNotes}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}
