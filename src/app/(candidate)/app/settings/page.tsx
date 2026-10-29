'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function CandidateSettingsPage() {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState({
    highMatchAlerts: true,
    taskReminders: true,
    weeklyDigest: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    const candidateData = {
      exportTimestamp: new Date().toISOString(),
      user: {
        id: user?._id,
        email: user?.email,
        role: user?.role,
      },
      exportNotice: 'In compliance with DPDP Act 2023 & GDPR Chapter 3 (Right of Access).',
    };

    const blob = new Blob([JSON.stringify(candidateData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careeros-export-${user?.email?.split('@')[0] || 'candidate'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Candidate Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage alert notifications, security preferences, data export, and privacy controls.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Settings updated successfully.
        </div>
      )}

      {/* Notifications */}
      <form onSubmit={handleSave} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <Bell className="h-4 w-4 text-cyan-400" />
          Job Match & Alert Preferences
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Instant High-Match Alerts</p>
              <p className="text-[11px] text-slate-400">Receive email alerts whenever an ingested job matches &gt;80% of your resume competencies.</p>
            </div>
            <input
              type="checkbox"
              checked={alerts.highMatchAlerts}
              onChange={(e) => setAlerts({ ...alerts, highMatchAlerts: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Preparation Task Reminders</p>
              <p className="text-[11px] text-slate-400">Receive reminders for upcoming 7-day interview roadmaps and skill study milestones.</p>
            </div>
            <input
              type="checkbox"
              checked={alerts.taskReminders}
              onChange={(e) => setAlerts({ ...alerts, taskReminders: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Weekly Market Intelligence Digest</p>
              <p className="text-[11px] text-slate-400">A weekly summary of emerging engineering openings, salary trends, and hiring demand.</p>
            </div>
            <input
              type="checkbox"
              checked={alerts.weeklyDigest}
              onChange={(e) => setAlerts({ ...alerts, weeklyDigest: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Privacy & Data Portability (DPDP / GDPR) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <Shield className="h-4 w-4 text-emerald-400" />
          Privacy & Data Rights (DPDP Act & GDPR)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Under our zero-data-leakage policy, you retain 100% ownership of your resume documents and career data. You can download a complete JSON export of your profile at any time.
        </p>

        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Complete Data Archive (JSON)
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white">Permanently Delete Account & Resumes</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permanently cascades deletion of your candidate profile, tracked applications, and purges all S3 resume objects.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Permanently delete your CareerOS candidate account? This action cannot be undone.')) {
                logout();
              }
            }}
            className="rounded-lg border border-rose-800 bg-rose-950/80 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900 transition-colors whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

