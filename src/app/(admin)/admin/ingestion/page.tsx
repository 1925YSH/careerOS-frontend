'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Layers,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Filter,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface IngestionError {
  stage: string;
  message: string;
  timestamp: string;
}

interface IngestionRun {
  _id: string;
  sourceId?: {
    _id: string;
    careersUrl: string;
    allowedDomains: string[];
    companyId?: {
      name: string;
      domain: string;
    };
  };
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'success' | 'partial' | 'failed';
  counts: {
    fetched: number;
    candidateJobs: number;
    extracted: number;
    rejected: number;
    duplicates: number;
    created: number;
    updated: number;
  };
  errors: IngestionError[];
  durationMs?: number;
}

export default function IngestionMonitorPage() {
  const [runs, setRuns] = useState<IngestionRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  const [triggeringAll, setTriggeringAll] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRuns = async () => {
    try {
      const endpoint =
        statusFilter === 'all'
          ? '/admin/ingestion/runs'
          : `/admin/ingestion/runs?status=${statusFilter}`;
      const res = await apiClient<{ runs: IngestionRun[] }>(endpoint);
      setRuns(res.runs || []);
    } catch (err) {
      console.error('Failed to fetch runs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, [statusFilter]);

  const handleRunAll = async () => {
    setTriggeringAll(true);
    setMessage(null);
    try {
      const res = await apiClient<{ message: string; results: any[] }>('/admin/ingestion/run-all', {
        method: 'POST',
      });
      setMessage(res.message || 'Triggered ingestion across all active sources.');
      fetchRuns();
    } catch (err: any) {
      alert(`Error triggering runs: ${err.message}`);
    } finally {
      setTriggeringAll(false);
    }
  };

  const pipelineStages = [
    { title: '1. Safe Fetch', desc: 'SSRF pre-check & DNS rebinding guard' },
    { title: '2. Clean DOM', desc: 'Noise, cookie banners & scripts stripped' },
    { title: '3. Detect & Parse', desc: 'JSON-LD schema & semantic fallback' },
    { title: '4. AI Extraction', desc: 'Gemini structured fallback' },
    { title: '5. Validate', desc: 'Schema conformance & sanity checks' },
    { title: '6. Deduplicate', desc: 'SHA-256 fingerprint matching' },
    { title: '7. Persist', desc: 'Live publishing & index updates' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Autonomous Pipeline Monitor
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Ingestion Pipeline Observability
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end execution logs, duplicate filtering, and validation error analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRuns}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleRunAll}
            disabled={triggeringAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-md transition-all disabled:opacity-50"
          >
            <Play className={`h-3.5 w-3.5 ${triggeringAll ? 'animate-spin' : ''}`} />
            <span>{triggeringAll ? 'Executing...' : 'Run All Active Sources'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Visual Pipeline Progression Diagram */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Autonomous Ingestion Pipeline Architecture</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.title}
              className="relative p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold text-amber-400">{stage.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">{stage.desc}</div>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['all', 'success', 'partial', 'failed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              statusFilter === st
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {st} Runs
          </button>
        ))}
      </div>

      {/* Runs Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading ingestion run telemetry...</div>
        ) : runs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No runs recorded for this filter. Trigger a crawl to start.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {runs.map((run) => {
              const isExpanded = expandedRunId === run._id;
              const companyName = run.sourceId?.companyId?.name || 'Verified Source';
              const careersUrl = run.sourceId?.careersUrl || '—';

              const statusBadge = {
                success: {
                  cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  icon: CheckCircle2,
                },
                partial: {
                  cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  icon: AlertTriangle,
                },
                failed: {
                  cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  icon: XCircle,
                },
                running: {
                  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
                  icon: RotateCw,
                },
              }[run.status] || {
                cls: 'bg-slate-800 text-slate-400 border-slate-700',
                icon: Clock,
              };

              const StatusIcon = statusBadge.icon;

              return (
                <div key={run._id} className="hover:bg-slate-800/20 transition-colors">
                  <div
                    onClick={() => setExpandedRunId(isExpanded ? null : run._id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Left: Company & Status */}
                    <div className="flex items-start md:items-center gap-3.5 min-w-0">
                      <div className={`p-2 rounded-lg border ${statusBadge.cls}`}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{companyName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${statusBadge.cls}`}
                          >
                            {run.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-md mt-0.5 font-mono">
                          {careersUrl}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Metrics */}
                    <div className="grid grid-cols-4 gap-4 text-center shrink-0">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Extracted</div>
                        <div className="text-sm font-bold font-mono text-white">
                          {run.counts.extracted}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-emerald-400 uppercase font-medium">Created</div>
                        <div className="text-sm font-bold font-mono text-emerald-400">
                          +{run.counts.created}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-cyan-400 uppercase font-medium">Deduped</div>
                        <div className="text-sm font-bold font-mono text-cyan-400">
                          {run.counts.duplicates}
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Duration</div>
                        <div className="text-sm font-bold font-mono text-slate-300">
                          {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '—'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Timestamp & Chevron */}
                    <div className="flex items-center gap-4 text-right">
                      <div className="text-xs text-slate-400">
                        <div>
                          {new Date(run.startedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {new Date(run.startedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Diagnostics Drawer */}
                  {isExpanded && (
                    <div className="px-6 pb-5 pt-2 bg-slate-950/60 border-t border-slate-800/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block mb-1">Crawl Target & Security</span>
                          <span className="font-mono text-amber-300 break-all">{careersUrl}</span>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Domain allowlist: {run.sourceId?.allowedDomains?.join(', ') || 'N/A'}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block mb-1">Pipeline Breakdown</span>
                          <div className="space-y-0.5 font-mono text-slate-300">
                            <div>Candidate Listings Detected: {run.counts.candidateJobs}</div>
                            <div>Valid Listings Parsed: {run.counts.extracted}</div>
                            <div>Rejected/Schema Failures: {run.counts.rejected}</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block mb-1">Fingerprint & Deduplication</span>
                          <div className="space-y-0.5 font-mono text-slate-300">
                            <div>New Jobs Inserted: {run.counts.created}</div>
                            <div>Existing Re-verified: {run.counts.updated}</div>
                            <div>Deduplicated: {run.counts.duplicates}</div>
                          </div>
                        </div>
                      </div>

                      {/* Errors or Diagnostics */}
                      {run.errors && run.errors.length > 0 ? (
                        <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/50">
                          <div className="text-xs font-bold text-rose-300 mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Execution Diagnostic Errors ({run.errors.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {run.errors.map((err, i) => (
                              <div key={i} className="text-xs font-mono text-rose-200/90 flex gap-2">
                                <span className="text-rose-400 uppercase font-semibold">
                                  [{err.stage}]
                                </span>
                                <span>{err.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-xs flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>No pipeline errors recorded. Clean ingestion pass.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

