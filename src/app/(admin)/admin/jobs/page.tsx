'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  CheckSquare,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Archive,
  CheckCircle,
  Eye,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface JobItem {
  _id: string;
  title: string;
  location: string;
  workMode: string;
  employmentType: string;
  sourceType: 'company_posted' | 'ingested';
  sourceUrl?: string;
  applicationUrl: string;
  status: 'active' | 'flagged' | 'archived' | 'draft';
  fingerprint?: string;
  companyId?: {
    _id: string;
    name: string;
    domain?: string;
  };
  sourceAttribution?: {
    domain?: string;
    verifiedSource?: boolean;
    lastCheckedAt?: string;
  };
  postedAt: string;
  lastSeenAt?: string;
}

export default function JobModerationPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceTypeFilter !== 'all') params.append('sourceType', sourceTypeFilter);
      if (search) params.append('search', search);

      const res = await apiClient<{ jobs: JobItem[]; total: number }>(
        `/admin/jobs?${params.toString()}`
      );
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, sourceTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string, reason?: string) => {
    try {
      await apiClient(`/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, reason: reason || 'Admin moderation' }),
      });
      fetchJobs();
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      alert(`Error updating job status: ${err.message}`);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Content & Listing Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Job Moderation Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review ingestion accuracy, duplicate fingerprints, and flag unverified listings.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged for Review</option>
            <option value="archived">Archived</option>
          </select>

          {/* Source Type Filter */}
          <select
            value={sourceTypeFilter}
            onChange={(e) => setSourceTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Sources</option>
            <option value="ingested">Bot Ingested</option>
            <option value="company_posted">Company Posted</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading listings for moderation...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No listings found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Job Listing</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Source Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Freshness</th>
                  <th className="px-6 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {jobs.map((job) => {
                  const statusColors = {
                    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    flagged: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    archived: 'bg-slate-800 text-slate-400 border-slate-700',
                    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  };

                  return (
                    <tr key={job._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-white">{job.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {job.location} • <span className="capitalize">{job.workMode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-white font-medium">
                          {job.companyId?.name || 'Verified Company'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {job.companyId?.domain || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        {job.sourceType === 'ingested' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Layers className="h-3 w-3" />
                            <span>Crawler Ingested</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Building2 className="h-3 w-3" />
                            <span>Direct Posted</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase ${
                            statusColors[job.status] || 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {job.lastSeenAt
                          ? new Date(job.lastSeenAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-1.5">
                        {job.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'active')}
                            title="Approve / Activate"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {job.status !== 'flagged' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'flagged', 'Flagged by Admin')}
                            title="Flag for Quality Review"
                            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {job.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'archived')}
                            title="Archive Listing"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Application URL"
                          className="inline-flex p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

