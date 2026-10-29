'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Compass, 
  Calendar 
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CandidateSavedJobsPage() {
  const [savedApplications, setSavedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/applications?status=saved');
      setSavedApplications(res.data.applications || []);
    } catch (err: any) {
      console.error('Failed to fetch saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (appId: string) => {
    try {
      await apiClient.delete(`/applications/${appId}`);
      fetchSaved();
    } catch (err: any) {
      alert(err.message || 'Failed to remove saved job');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white">Saved Job Shortlist</h1>
          <span className="rounded-full bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400">
            {savedApplications.length} Saved
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Review saved positions before submitting applications. Roles remain here until you apply or remove them.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      ) : savedApplications.length > 0 ? (
        <div className="space-y-3">
          {savedApplications.map((app) => (
            <div
              key={app._id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[#2563EB] shrink-0 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {app.jobId?.title || 'Saved Position'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-slate-300 font-medium">
                      {app.companyId?.name || 'Company'}
                    </span>
                    <span>•</span>
                    <span>{app.jobId?.location || 'Remote'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      Saved on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.jobId?._id && (
                  <Link
                    href={`/jobs/${app.jobId._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                  >
                    View & Apply <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => handleRemove(app._id)}
                  title="Remove from saved"
                  className="p-1.5 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800">
          <Bookmark className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No saved jobs yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Browse verified jobs and bookmark the ones you find interesting to save them for later.
          </p>
          <Link
            href="/jobs"
            className="mt-4 inline-block rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Explore Public Job Board
          </Link>
        </div>
      )}
    </div>
  );
}
