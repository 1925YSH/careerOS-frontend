'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  Bookmark, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Compass, 
  ChevronRight, 
  Clock, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CandidateDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await apiClient.get('/candidate/dashboard');
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load candidate workspace');
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
        <h3 className="text-lg font-bold text-white">Dashboard Error</h3>
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

  const { profile, stats, topMatches = [], recentApplications = [], latestResume } = data || {};
  const completeness = profile?.completenessScore || 20;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Autonomous Career Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good morning, {profile?.name || 'Engineer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Your AI agent evaluated active openings against your profile. You have{' '}
              <span className="text-cyan-400 font-bold">{stats?.recommendedMatches || 0} high-match roles</span>{' '}
              awaiting review.
            </p>
          </div>

          {/* Completeness Meter */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-400">Profile Completeness</span>
              <span className="text-cyan-400 font-bold">{completeness}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            {completeness < 80 && (
              <Link
                href="/app/profile"
                className="mt-2.5 block text-center text-[11px] font-semibold text-cyan-400 hover:underline"
              >
                Complete profile for higher accuracy &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/app/jobs"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-blue-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Top Matches</span>
            <Compass className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.recommendedMatches || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">&gt;70% competency fit</p>
        </Link>

        <Link
          href="/app/saved"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-blue-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Saved Roles</span>
            <Bookmark className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.savedJobs || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Shortlisted opportunities</p>
        </Link>

        <Link
          href="/app/applications"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-blue-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active In Pipeline</span>
            <Briefcase className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.activeApplications || 0}</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Under company review
          </p>
        </Link>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Preparation Tasks</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.tasksDue || 2}</div>
          <p className="text-[11px] text-slate-500 mt-1">7-day interview roadmaps</p>
        </div>
      </div>

      {/* Top AI-Ranked Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              AI-Curated Roles for Your Background
            </h2>
          </div>
          <Link href="/app/jobs" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            View All Personalized Matches <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topMatches.slice(0, 6).map((job: any) => (
            <div
              key={job._id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{job.companyId?.name || 'Verified Company'}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    {job.matchScore}%
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 mb-4">
                  <p>{job.location} • <span className="capitalize">{job.workMode}</span></p>
                  {job.salary?.min ? (
                    <p className="font-medium text-emerald-400">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString() || ''}/yr
                    </p>
                  ) : (
                    <p className="text-slate-500">Competitive Compensation</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(job.matchedSkills || []).slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                  {(job.missingSkills || []).slice(0, 2).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/jobs/${job._id}`}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  View Role Details &rarr;
                </Link>
                <Link
                  href={`/jobs/${job._id}`}
                  className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Active Resume Center Snapshot & Recent Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Resume Center Snapshot */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Active Resume</h2>
            <Link href="/app/resume" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Resume Center <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {latestResume ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white">{latestResume.fileName}</p>
                    <p className="text-[10px] text-slate-500">
                      Version {latestResume.version} • {Math.round(latestResume.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Default Active
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Parsed Key Competencies:</p>
                <div className="flex flex-wrap gap-1">
                  {(latestResume.parsedContent?.skillsDetected || []).slice(0, 6).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/40 text-cyan-300 border border-blue-900/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
              <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No resume uploaded yet.</p>
              <Link
                href="/app/resume"
                className="mt-3 inline-block rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Upload PDF Resume
              </Link>
            </div>
          )}
        </div>

        {/* Application Tracker Snapshot */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Application Pipeline</h2>
            <Link href="/app/applications" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Tracker Board <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-2.5">
              {recentApplications.map((app: any) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-950/40"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-white truncate">{app.jobId?.title || 'Tracked Role'}</p>
                    <p className="text-[11px] text-slate-400">{app.companyId?.name || 'Company'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-950/80 text-cyan-300 border border-blue-800 shrink-0">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg">
              <Briefcase className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No applications tracked yet.</p>
              <Link
                href="/app/jobs"
                className="mt-3 inline-block text-xs font-semibold text-cyan-400 hover:underline"
              >
                Explore matched jobs &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
