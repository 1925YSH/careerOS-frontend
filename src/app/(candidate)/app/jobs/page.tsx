'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  Filter, 
  Search, 
  Bookmark, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2,
  X,
  Info
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CandidateJobsFeedPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minMatch, setMinMatch] = useState<number>(60);
  const [workMode, setWorkMode] = useState<string>('all');
  const [explainJob, setExplainJob] = useState<any | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/candidate/dashboard');
      const allTopMatches = res.data.topMatches || [];
      setJobs(allTopMatches);
    } catch (err: any) {
      console.error('Failed to load personalized jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleTrackApplication = async (jobId: string) => {
    try {
      await apiClient.post('/applications', {
        jobId,
        status: 'applied',
        notes: 'Tracked from Personalized AI Feed',
      });
      alert('Application tracked in your pipeline!');
    } catch (err: any) {
      alert(err.message || 'Already tracked');
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await apiClient.post(`/jobs/${jobId}/save`, {});
      alert('Job added to your saved shortlist!');
    } catch (err: any) {
      alert(err.message || 'Failed to save job');
    }
  };

  // Filter based on candidate preferences
  const filteredJobs = jobs.filter((job) => {
    if (job.matchScore < minMatch) return false;
    if (workMode !== 'all' && job.workMode !== workMode) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Jobs For You</h1>
            <span className="rounded-full bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Hybrid Match Score
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every match is computed using deterministic skill verification and semantic qualification scoring against your active resume.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Min Fit:</span>
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value={60}>60% +</option>
              <option value={70}>70% + (Strong)</option>
              <option value={80}>80% + (Exceptional)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Modality:</span>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="all">All Modes</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Feed Grid */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    {job.companyId?.verified && (
                      <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Verified Employer
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    {job.companyId?.name || 'Company'} • {job.location} •{' '}
                    <span className="capitalize">{job.workMode}</span>
                  </p>

                  <div className="text-xs text-slate-400">
                    {job.salary?.min ? (
                      <span className="text-emerald-400 font-semibold">
                        ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString() || ''}/yr
                      </span>
                    ) : (
                      <span>Competitive compensation</span>
                    )}
                  </div>

                  {/* Competency Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(job.matchedSkills || []).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                    {(job.missingSkills || []).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExplainJob(job)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
                      title="Explain Fit Score"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold font-mono text-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      {job.matchScore}% Fit
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveJob(job._id)}
                      title="Save Job"
                      className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={`/jobs/${job._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                      Apply <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800">
          <Compass className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No jobs match your current threshold</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try lowering your minimum fit filter or adding more technical skills to your profile.
          </p>
        </div>
      )}

      {/* Explainability Drawer */}
      {explainJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="relative h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Explainable Fit Analysis</h3>
                </div>
                <button
                  onClick={() => setExplainJob(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{explainJob.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{explainJob.companyId?.name || 'Company'}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold font-mono text-sm">
                  {explainJob.matchScore}% Overall Compatibility
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-bold text-emerald-400 mb-2">Verified Competency Overlap:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(explainJob.matchedSkills || []).map((s: string) => (
                      <span key={s} className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-amber-400 mb-2">Identified Skill Gaps:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(explainJob.missingSkills || []).map((s: string) => (
                      <span key={s} className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 text-slate-300 leading-relaxed text-[11px]">
                  <strong>AI Rationale:</strong> Your profile exhibits strong core competencies required for this role. Adding projects demonstrating familiarity with the identified skill gaps will maximize interview conversion.
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setExplainJob(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleTrackApplication(explainJob._id);
                  setExplainJob(null);
                }}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Add to Pipeline Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
