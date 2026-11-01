'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import {
  Activity,
  Layers,
  Database,
  CheckSquare,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface OverviewStats {
  users: number;
  companies: number;
  activeJobs: number;
  ingestedJobs: number;
  activeSources: number;
  failedIngestionRuns: number;
}

interface IngestionRunSummary {
  _id: string;
  sourceId?: {
    careersUrl?: string;
    companyId?: {
      name?: string;
      domain?: string;
    };
  };
  startedAt: string;
  status: 'running' | 'success' | 'partial' | 'failed';
  counts: {
    fetched: number;
    candidateJobs: number;
    extracted: number;
    created: number;
    updated: number;
    rejected: number;
  };
  durationMs?: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentRuns, setRecentRuns] = useState<IngestionRunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await apiClient<{ stats: OverviewStats; recentRuns: IngestionRunSummary[] }>(
        '/admin/overview'
      );
      setStats(res.stats);
      setRecentRuns(res.recentRuns || []);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverview();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Autonomous Ingestion Active
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            System & Operations Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor real-time job crawlers, SSRF security guards, and platform governance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <Link
            href="/admin/ingestion"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-md transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Pipeline Monitor</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Active Jobs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Jobs</span>
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '—' : stats?.activeJobs ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Live listings in search</div>
        </div>

        {/* Ingested Jobs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Ingested via Bot</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {loading ? '—' : stats?.ingestedJobs ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Automated crawler feeds</div>
        </div>

        {/* Active Sources */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Crawl Sources</span>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '—' : stats?.activeSources ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Approved career portals</div>
        </div>

        {/* Failed Runs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Failed Runs</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className={`text-2xl font-bold ${stats?.failedIngestionRuns ? 'text-rose-400' : 'text-slate-300'}`}>
            {loading ? '—' : stats?.failedIngestionRuns ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Crawl policy / network errors</div>
        </div>

        {/* Companies */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Companies</span>
            <Building2 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '—' : stats?.companies ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Verified employers</div>
        </div>

        {/* Total Users */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Registered Users</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? '—' : stats?.users ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Candidates & Recruiters</div>
        </div>
      </div>

      {/* Security & Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/30 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              SSRF & Anti-Abuse Defense Active
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              All crawl targets are strictly validated against RFC 1918 private IP blocks, cloud metadata addresses
              (169.254.169.254), and explicit domain allowlists with DNS resolution verification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/admin/sources"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            Manage Sources
          </Link>
          <Link
            href="/admin/jobs"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
          >
            Moderate Jobs
          </Link>
        </div>
      </div>

      {/* Recent Ingestion Activity */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Ingestion Telemetry</h2>
            <p className="text-xs text-slate-400">Latest automated crawl cycles across verified career portals</p>
          </div>
          <Link
            href="/admin/ingestion"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>View All Runs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading telemetry records...</div>
        ) : recentRuns.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No ingestion runs recorded yet. Register a source and trigger a crawl to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Source / Company</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Jobs Extracted</th>
                  <th className="px-6 py-3">New Created</th>
                  <th className="px-6 py-3">Deduplicated</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentRuns.map((run) => {
                  const companyName = run.sourceId?.companyId?.name || 'Verified Source';
                  const careersUrl = run.sourceId?.careersUrl || '—';
                  const statusColors = {
                    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    partial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    running: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
                  };

                  return (
                    <tr key={run._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-white">{companyName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{careersUrl}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                            statusColors[run.status] || 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {run.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono">{run.counts.extracted}</td>
                      <td className="px-6 py-3.5 font-mono text-emerald-400">+{run.counts.created}</td>
                      <td className="px-6 py-3.5 font-mono text-cyan-400">{run.counts.updated}</td>
                      <td className="px-6 py-3.5 font-mono text-slate-400">
                        {run.durationMs ? `${(run.durationMs / 1000).toFixed(2)}s` : '—'}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {new Date(run.startedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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

