'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Database,
  Plus,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Building2,
  Layers,
  X,
} from 'lucide-react';

interface JobSourceItem {
  _id: string;
  companyId?: {
    _id: string;
    name: string;
    domain: string;
    logo?: string;
    verified: boolean;
  };
  careersUrl: string;
  allowedDomains: string[];
  parserStrategy: 'generic_html' | 'json_ld' | 'ats_specific' | 'browser';
  crawlIntervalHours: number;
  permissionStatus: string;
  active: boolean;
  lastRunAt?: string;
  lastSuccessAt?: string;
  nextRunAt?: string;
  consecutiveFailures: number;
  lastError?: string;
  createdAt: string;
}

interface CompanyOption {
  _id: string;
  name: string;
  domain: string;
}

export default function SourceRegistryPage() {
  const [sources, setSources] = useState<JobSourceItem[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [runningId, setRunningId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyId, setNewCompanyId] = useState('');
  const [newCareersUrl, setNewCareersUrl] = useState('');
  const [newAllowedDomains, setNewAllowedDomains] = useState('');
  const [newStrategy, setNewStrategy] = useState<'generic_html' | 'json_ld' | 'ats_specific'>('generic_html');
  const [newInterval, setNewInterval] = useState(24);
  const [submitting, setSubmitting] = useState(false);

  const fetchSources = async () => {
    try {
      const res = await apiClient<{ sources: JobSourceItem[] }>('/admin/sources');
      setSources(res.sources || []);
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await apiClient<{ companies: CompanyOption[] }>('/admin/companies');
      setCompanies(res.companies || []);
      if (res.companies && res.companies.length > 0) {
        setNewCompanyId(res.companies[0]._id);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  useEffect(() => {
    fetchSources();
    fetchCompanies();
  }, []);

  const handleRunNow = async (sourceId: string) => {
    setRunningId(sourceId);
    setActionMessage(null);
    try {
      const res = await apiClient<{ run: any }>(`/admin/sources/${sourceId}/run`, {
        method: 'POST',
      });
      const run = res.run;
      setActionMessage({
        type: 'success',
        text: `Crawl completed! Status: ${run.status}. Jobs extracted: ${run.counts?.extracted || 0} (${run.counts?.created || 0} created, ${run.counts?.updated || 0} updated).`,
      });
      fetchSources();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to trigger ingestion crawl.',
      });
    } finally {
      setRunningId(null);
    }
  };

  const handleToggleActive = async (source: JobSourceItem) => {
    try {
      await apiClient(`/admin/sources/${source._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !source.active }),
      });
      fetchSources();
    } catch (err: any) {
      alert(`Error toggling source: ${err.message}`);
    }
  };

  const handleDelete = async (sourceId: string) => {
    if (!confirm('Are you sure you want to delete this crawl source?')) return;
    try {
      await apiClient(`/admin/sources/${sourceId}`, { method: 'DELETE' });
      fetchSources();
    } catch (err: any) {
      alert(`Error deleting source: ${err.message}`);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    const domains = newAllowedDomains
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    if (domains.length === 0) {
      alert('At least one allowed domain is required for SSRF security defense.');
      setSubmitting(false);
      return;
    }

    try {
      await apiClient('/admin/sources', {
        method: 'POST',
        body: JSON.stringify({
          companyId: newCompanyId,
          careersUrl: newCareersUrl,
          allowedDomains: domains,
          parserStrategy: newStrategy,
          crawlIntervalHours: newInterval,
        }),
      });

      setShowAddModal(false);
      setNewCareersUrl('');
      setNewAllowedDomains('');
      setActionMessage({
        type: 'success',
        text: 'New crawl source registered and SSRF-validated successfully.',
      });
      fetchSources();
    } catch (err: any) {
      alert(`Failed to register source: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    const term = search.toLowerCase();
    const compName = s.companyId?.name?.toLowerCase() || '';
    const url = s.careersUrl.toLowerCase();
    return compName.includes(term) || url.includes(term);
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Source Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Crawl Source Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Approved career portals, SSRF domain policies, and crawling schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Source</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by company or careers URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{filteredSources.length} Sources Configured</span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading registered sources...</div>
        ) : filteredSources.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No sources match your criteria. Click &quot;Register New Source&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Company & Domain</th>
                  <th className="px-6 py-3">Careers URL</th>
                  <th className="px-6 py-3">Strategy</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Interval</th>
                  <th className="px-6 py-3">Last Success</th>
                  <th className="px-6 py-3">Next Crawl</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredSources.map((source) => {
                  const isRunning = runningId === source._id;
                  return (
                    <tr key={source._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {source.companyId?.name || 'Unknown Company'}
                          {source.companyId?.verified && (
                            <span title="Verified Employer">
                              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {source.companyId?.domain || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <a
                          href={source.careersUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 truncate max-w-xs"
                        >
                          <span className="truncate">{source.careersUrl}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          SSRF allowlist: {source.allowedDomains.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {source.parserStrategy}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <button
                          onClick={() => handleToggleActive(source)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                            source.active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {source.active ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                              <span>Paused</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-400">
                        {source.crawlIntervalHours}h
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {source.lastSuccessAt
                          ? new Date(source.lastSuccessAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {source.nextRunAt
                          ? new Date(source.nextRunAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleRunNow(source._id)}
                          disabled={isRunning}
                          title="Run Ingestion Now"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-[11px] transition-all disabled:opacity-50"
                        >
                          <Play className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
                          <span>{isRunning ? 'Crawling...' : 'Run'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(source._id)}
                          title="Delete Source"
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B1220] border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Register Verified Crawl Source</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4">
              {/* Company Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Associated Company
                </label>
                <select
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.domain})
                    </option>
                  ))}
                </select>
              </div>

              {/* Careers URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Canonical Careers Page URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.com/careers"
                  value={newCareersUrl}
                  onChange={(e) => {
                    setNewCareersUrl(e.target.value);
                    try {
                      const host = new URL(e.target.value).hostname;
                      if (!newAllowedDomains) {
                        setNewAllowedDomains(host);
                      }
                    } catch {}
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be public HTTPS URL. Internal/localhost network targets are blocked by SSRF defense.
                </p>
              </div>

              {/* Allowed Domains */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  SSRF Allowed Domains (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="company.com, jobs.company.com"
                  value={newAllowedDomains}
                  onChange={(e) => setNewAllowedDomains(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Crawler will refuse any redirects outside these exact hostnames.
                </p>
              </div>

              {/* Strategy & Interval */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Parser Strategy
                  </label>
                  <select
                    value={newStrategy}
                    onChange={(e) => setNewStrategy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="generic_html">Generic HTML (JSON-LD + Fallback)</option>
                    <option value="json_ld">JSON-LD Schema.org Strict</option>
                    <option value="ats_specific">ATS Specific Pattern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Crawl Interval (Hours)
                  </label>
                  <select
                    value={newInterval}
                    onChange={(e) => setNewInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={6}>Every 6 Hours</option>
                    <option value={12}>Every 12 Hours</option>
                    <option value={24}>Every 24 Hours (Standard)</option>
                    <option value={48}>Every 48 Hours</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Validating & Saving...' : 'Register Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

