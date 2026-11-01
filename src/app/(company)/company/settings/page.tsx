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
  ArrowRight,
  Download,
  Loader2,
  KeyRound,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

export default function CompanySettingsPage() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    syncAlerts: true,
    applicantDigest: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data export state
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await apiClient.put('/api/users/password', {
        currentPassword,
        newPassword,
      });
      setPasswordMessage({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password. Please check your current password.';
      setPasswordMessage({ type: 'error', text: msg });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    setExportMessage(null);

    try {
      const res = await apiClient.get('/api/users/export');
      const dataStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `careeros-company-export-${user?.email?.split('@')[0] || 'employer'}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportMessage('Employer data archive exported successfully.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to export company archive.';
      setExportMessage(msg);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await apiClient.delete('/api/users/me', { confirmation: 'DELETE' });
      await logout();
      window.location.href = '/login?deleted=true';
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete company workspace.';
      setDeleteError(msg);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Company Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure notifications, recruitment security, data export, and company governance.
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

      {/* Security & Password */}
      <form onSubmit={handlePasswordChange} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <KeyRound className="h-4 w-4 text-[#06B6D4]" />
          Employer Security & Password
        </div>
        <p className="text-xs text-slate-400">
          Secure your hiring management access. Passwords are encrypted with bcrypt (cost factor 12).
        </p>

        {passwordMessage && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              passwordMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-800 text-rose-300'
            }`}
          >
            {passwordMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
          >
            {passwordLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Update Password
          </button>
        </div>
      </form>

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

      {/* Privacy & Data Portability (DPDP / GDPR) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
          <Shield className="h-4 w-4 text-emerald-400" />
          Employer Data Portability (DPDP Act & GDPR)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Download a complete machine-readable JSON archive of your company profile, published jobs, ingestion sources, applicant pipelines, and audit trails.
        </p>

        {exportMessage && (
          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {exportMessage}
          </p>
        )}

        <div className="pt-2">
          <button
            onClick={handleExportData}
            disabled={exportLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exportLoading ? 'Exporting Company Archive...' : 'Download Company Data Archive (JSON)'}
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
            <p className="text-xs font-bold text-white">Permanently Delete Company Workspace</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permanently purges company profile, all active job listings, ingestion sources, and applicant history.
            </p>
          </div>
          <button
            onClick={() => {
              setDeleteConfirmText('');
              setDeleteError(null);
              setDeleteModalOpen(true);
            }}
            className="rounded-lg border border-rose-800 bg-rose-950/80 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900 transition-colors whitespace-nowrap"
          >
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Deletion Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-900/60 bg-[#0B1220] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confirm Workspace Erasure</h3>
                  <p className="text-xs text-rose-400 font-medium">Right to Erasure (DPDP & GDPR)</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action is <strong className="text-rose-400">permanent and irreversible</strong>. Your employer account, all published job listings, crawler sources, and applicant pipeline data will be completely deleted from CareerOS.
            </p>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 space-y-2">
              <label className="block text-[11px] text-slate-400">
                To confirm deletion, please type <strong className="text-white">DELETE</strong> below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-900/30"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Permanently Delete Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
