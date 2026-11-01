'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Save,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: 'Enterprise Software & Cloud',
    location: '',
    size: '51-200',
    description: '',
    careersUrl: '',
    logoUrl: '',
  });

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await apiClient.get('/companies/workspace/profile');
        if (res.data.company) {
          const c = res.data.company;
          setCompanyId(c._id);
          setVerified(c.verified);
          setFormData({
            name: c.name || '',
            domain: c.domain || '',
            industry: c.industry || 'Technology',
            location: c.location || '',
            size: c.size || '51-200',
            description: c.description || '',
            careersUrl: c.careersUrl || '',
            logoUrl: c.logoUrl || '',
          });
        }
      } catch (err: any) {
        console.error('Error loading company profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await apiClient.post('/companies/workspace/profile', formData);
      if (res.data.company) {
        setCompanyId(res.data.company._id);
        setVerified(res.data.company.verified);
      }
      setFeedback({
        type: 'success',
        message: 'Company profile updated successfully. Public directory updated.',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save company profile',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Company Profile & Branding</h1>
            {verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            This information is shown to candidates on public job listings and in the Company Directory.
          </p>
        </div>

        {companyId && (
          <Link
            href={`/companies/${companyId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Public Profile
          </Link>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Company Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Inc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Domain *</label>
              <input
                type="text"
                required
                placeholder="e.g. stripe.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                placeholder="e.g. Financial Infrastructure"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Headquarters</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Employee Count</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Logo Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About Company</label>
            <textarea
              rows={4}
              placeholder="Describe your company mission, culture, and what it's like to build here..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Changes...' : 'Save Company Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

