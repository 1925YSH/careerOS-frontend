'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Users, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function CompanySettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    syncAlerts: true,
    applicantDigest: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Company Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure notifications, recruitment team members, and data management.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-800 bg-emerald-950/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Settings updated successfully.
        </div>
      )}

      {/* Notification Preferences */}
      <form onSubmit={handleSavePreferences} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <Bell className="h-4 w-4 text-cyan-400" />
          Notification Preferences
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Ingestion & Sync Failure Alerts</p>
              <p className="text-[11px] text-slate-400">Receive instant email if your career portal crawler encounters issues or returns 404s.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.syncAlerts}
              onChange={(e) => setNotifications({ ...notifications, syncAlerts: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Real-Time Applicant Alerts</p>
              <p className="text-[11px] text-slate-400">Receive email notifications when pre-qualified candidates match &gt;80% and apply.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.applicantDigest}
              onChange={(e) => setNotifications({ ...notifications, applicantDigest: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Weekly Pipeline Summary</p>
              <p className="text-[11px] text-slate-400">A weekly executive digest summarizing listing views, application velocity, and candidate matches.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
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

      {/* Account & Team */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <Users className="h-4 w-4 text-purple-400" />
          Hiring Team Account
        </div>
        <div className="text-xs text-slate-300">
          <p>
            Active Employer Administrator: <span className="font-semibold text-white">{user?.email}</span>
          </p>
          <p className="text-slate-500 mt-1">Multi-user enterprise team invitation seats are available on the Verified Employer tier.</p>
        </div>
      </div>

      {/* Subscription & Posting Quotas */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
            <CreditCard className="h-4 w-4 text-cyan-400" />
            Employer Plan & Job Posting Capacity
          </div>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-950/80 text-blue-400 border border-blue-800">
            Active Employer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
            <p className="text-[11px] text-slate-400 font-medium">Job Posting Quota</p>
            <p className="text-sm font-bold text-white">Active Limit Enforced</p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
            <p className="text-[11px] text-slate-400 font-medium">Verified Shield Badge</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Enabled on Tiers
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
            <p className="text-[11px] text-slate-400 font-medium">Crawler Ingestion</p>
            <p className="text-sm font-bold text-cyan-400">Scheduled 24h Sync</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Need more active job postings or priority featured feed placement?
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
          >
            <span>Upgrade Employer Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
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
            <p className="text-xs font-bold text-white">Pause Automated Ingestion & De-index Listings</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instantly removes your roles from public candidate search feeds and halts the 24-hour crawler.
            </p>
          </div>
          <button
            onClick={() => alert('Please contact security@careeros.internal or use the Career Source tab to pause your source.')}
            className="rounded-lg border border-rose-800 bg-rose-950/80 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900 transition-colors whitespace-nowrap"
          >
            De-index All Listings
          </button>
        </div>
      </div>
    </div>
  );
}

