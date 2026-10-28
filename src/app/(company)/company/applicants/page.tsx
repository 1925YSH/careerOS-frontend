'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  Mail, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CompanyApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeStage !== 'all') params.set('status', activeStage);

      const res = await apiClient.get(`/companies/workspace/applicants?${params.toString()}`);
      setApplicants(res.data.applicants || []);
    } catch (err: any) {
      console.error('Failed to fetch applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [activeStage]);

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      setUpdatingId(appId);
      await apiClient.patch(`/companies/workspace/applicants/${appId}/status`, {
        status: newStage,
        note: `Applicant stage updated to ${newStage}`,
      });
      fetchApplicants();
    } catch (err: any) {
      alert(err.message || 'Failed to update applicant stage');
    } finally {
      setUpdatingId(null);
    }
  };

  const stages = [
    { id: 'all', label: 'All Candidates' },
    { id: 'applied', label: 'New Applied' },
    { id: 'reviewing', label: 'In Review' },
    { id: 'interview', label: 'Interviewing' },
    { id: 'offer', label: 'Offer Extended' },
    { id: 'rejected', label: 'Archived / Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Applicant Pipeline</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review candidate submissions, update interview stages, and manage your talent pipeline.
        </p>
      </div>

      {/* Stage Filter Tabs */}
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

      {/* Applicant Cards / Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      ) : applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 shrink-0">
                  {app.candidateId?.email?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {app.candidateId?.name || app.candidateId?.email || 'Candidate'}
                    </h3>
                    <span className="text-[11px] text-slate-400">({app.candidateId?.email})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                      {app.jobId?.title || 'Open Role'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="flex items-center gap-3 shrink-0">
                <label className="text-[11px] text-slate-400 font-medium">Stage:</label>
                <select
                  disabled={updatingId === app._id}
                  value={app.status}
                  onChange={(e) => handleStageChange(app._id, e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none capitalize"
                >
                  <option value="applied">New Applied</option>
                  <option value="reviewing">In Review</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800">
          <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No applicants found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeStage !== 'all'
              ? `There are currently no candidates in the "${activeStage}" stage.`
              : 'As candidates submit applications for your published or synced roles, they will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
}
