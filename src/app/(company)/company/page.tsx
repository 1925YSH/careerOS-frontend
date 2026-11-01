'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  PlusCircle, 
  Building2,
  Globe,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CompanyDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await apiClient.get('/companies/workspace/dashboard');
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load company workspace data');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-white">Workspace Error</h3>
        <p className="text-sm text-slate-300 mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
        >
          Retry
        </button>
      </div>
    );
  }

  const { company, stats, source, recentJobs, recentApplicants, needsProfileSetup } = data || {};

  return (
    <div className="space-y-8">
      {/* Onboarding Alert if company profile is not yet configured */}
      {needsProfileSetup && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Complete Company Profile</h3>
              <p className="text-xs text-slate-300">Set your official company name, verified domain, and headquarters to publish roles.</p>
            </div>
          </div>
          <Link
            href="/company/profile"
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Configure Profile &rarr;
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {company ? company.name : 'Company Workspace'}
            </h1>
            {company?.verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[11px] font-semibold text-cyan-400">
                <CheckCircle2 className="h-3 w-3" />
                Verified Employer
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {company?.domain ? `${company.domain} • ` : ''}Manage direct postings, crawler ingestion health, and candidate pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/company/jobs?action=new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Role
          </Link>
          <Link
            href="/company/source"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Globe className="h-4 w-4" />
            Source Health
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Jobs</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.activeJobs || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">{stats?.totalJobs || 0} total listings created</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Synced Roles</span>
            <RefreshCw className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.syncedJobs || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Autonomous crawler ingestion</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Applicants</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalApplicants || 0}</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Pre-scored by AI Matcher
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Source Status</span>
            <Globe className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white capitalize">
            {source ? (source.active ? 'Active Sync' : 'Paused') : 'Unconfigured'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {source?.careersUrl ? source.careersUrl : 'Connect your career URL'}
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Postings & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Recent Job Postings</h2>
            <Link href="/company/jobs" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job: any) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {job.location} • <span className="capitalize">{job.workMode}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      job.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {job.status}
                    </span>
                    <Link
                      href={`/company/jobs`}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
              <Briefcase className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No jobs posted yet.</p>
              <Link
                href="/company/jobs?action=new"
                className="mt-3 inline-block text-xs font-semibold text-cyan-400 hover:underline"
              >
                + Post your first role
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applicants */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Recent Applicants</h2>
            <Link href="/company/applicants" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Pipeline <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentApplicants && recentApplicants.length > 0 ? (
            <div className="space-y-3">
              {recentApplicants.map((app: any) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-white truncate">
                      {app.candidateId?.email || 'Candidate'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      Applied for: {app.jobId?.title || 'Unknown Position'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-cyan-400 border border-blue-800 shrink-0">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
              <Users className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No applications received yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Active jobs appear in public candidate search feeds automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

