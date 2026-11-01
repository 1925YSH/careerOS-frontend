'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  FileCheck
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CareerSourcePage() {
  const [source, setSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [careersUrl, setCareersUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSource = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/companies/workspace/source');
      if (res.data.source) {
        setSource(res.data.source);
        setCareersUrl(res.data.source.careersUrl || '');
      }
    } catch (err: any) {
      console.error('Error fetching source', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSource();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await apiClient.post('/companies/workspace/source', {
        careersUrl,
      });
      setSource(res.data.source);
      setFeedback({
        type: 'success',
        message: 'Career page source successfully submitted and verified for autonomous crawler synchronization.',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update careers source',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white">Career Source Integration</h1>
          <span className="rounded-full bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
            Autonomous Crawler
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Connect your official company careers page or ATS board (Greenhouse, Lever, Ashby, Workday). Our crawler indexes open positions automatically every 24 hours.
        </p>
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
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Source Configuration Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Career Page URL</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Official Careers or ATS URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://jobs.lever.co/company or https://company.com/careers"
                value={careersUrl}
                onChange={(e) => setCareersUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <Globe className="h-4 w-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Must be a valid, publicly accessible URL. All requests are protected by automated SSRF and DNS rebinding filters.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Verifying & Saving...' : 'Save & Initiate Ingestion'}
            </button>
          </div>
        </form>
      </div>

      {/* Sync Health & Status Grid */}
      {source && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Verification Status</span>
              <FileCheck className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white capitalize">
              {source.permissionStatus || 'Approved'}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Domain whitelisted
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Crawl Interval</span>
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white">
              Every {source.crawlIntervalHours || 24} Hours
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Autonomous scheduled sync</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Engine Mode</span>
              <RefreshCw className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white uppercase font-mono text-xs">
              {source.parserStrategy || 'GENERIC_HTML'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">DOM cleaning + LLM Schema</p>
          </div>
        </div>
      )}

      {/* Responsible Crawling Policy Notice */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5 flex items-start gap-4">
        <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white">Responsible Crawling & Respect for Robots.txt</h4>
          <p className="text-slate-300 leading-relaxed">
            AI CareerOS enforces strict rate limits (maximum 1 request per second per domain), identifies itself with a transparent User-Agent header, and strictly obeys <code className="text-cyan-400">robots.txt</code> directives. Only job descriptions and qualification requirements are parsed; no confidential employee or customer data is ever scraped.
          </p>
        </div>
      </div>
    </div>
  );
}

