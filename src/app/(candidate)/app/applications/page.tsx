'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Calendar, 
  Building2, 
  X,
  Filter
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeStage !== 'all') params.set('status', activeStage);

      const res = await apiClient.get(`/applications?${params.toString()}`);
      setApplications(res.data.applications || []);
    } catch (err: any) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeStage]);

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      setUpdatingId(appId);
      await apiClient.patch(`/applications/${appId}`, {
        status: newStage,
      });
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to update application stage');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Remove this application from tracking?')) return;
    try {
      await apiClient.delete(`/applications/${appId}`);
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to delete application');
    }
  };

  const stages = [
    { id: 'all', label: 'All Tracked' },
    { id: 'saved', label: 'Saved' },
    { id: 'applied', label: 'Applied' },
    { id: 'reviewing', label: 'In Review' },
    { id: 'interview', label: 'Interviewing' },
    { id: 'offer', label: 'Offer' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Application Pipeline Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track interview rounds, follow-up dates, and company feedback across your pipeline.
          </p>
        </div>
        <Link
          href="/app/jobs"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Find & Track New Roles
        </Link>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStage(st.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeStage === st.id
                ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[#2563EB] shrink-0 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {app.jobId?.title || 'Position Applied'}
                    </h3>
                    {app.companyId?.verified && (
                      <span className="text-[10px] text-cyan-400 font-semibold">✓ Verified</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-slate-300 font-medium">
                      {app.companyId?.name || 'Company'}
                    </span>
                    <span>•</span>
                    <span>{app.jobId?.location || 'Remote'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      Updated {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {app.notes && (
                    <p className="text-xs text-slate-300 mt-2 italic bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800/80">
                      "{app.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  disabled={updatingId === app._id}
                  value={app.status}
                  onChange={(e) => handleStageChange(app._id, e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none capitalize"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="reviewing">In Review</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>

                {app.jobId?._id && (
                  <Link
                    href={`/jobs/${app.jobId._id}`}
                    target="_blank"
                    title="View Job"
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}

                <button
                  onClick={() => handleDelete(app._id)}
                  title="Remove from Tracker"
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
          <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No applications in this stage</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Explore personalized jobs and click "Apply" to automatically add them to your tracker.
          </p>
          <Link
            href="/app/jobs"
            className="mt-4 inline-block rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Explore Matched Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
