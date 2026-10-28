'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Sparkles, 
  PieChart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CompanyAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await apiClient.get('/companies/workspace/analytics');
        setData(res.data);
      } catch (err: any) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { workModeBreakdown = [], applicantStageBreakdown = [], topSkills = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Hiring & Talent Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time visibility into role distribution, pipeline conversion, and top technical competencies.
        </p>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Mode Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Work Mode Distribution
            </h2>
            <PieChart className="h-4 w-4 text-cyan-400" />
          </div>

          {workModeBreakdown.length > 0 ? (
            <div className="space-y-3">
              {workModeBreakdown.map((item: any) => (
                <div key={item._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-300 font-medium">{item._id}</span>
                    <span className="text-slate-400">{item.count} roles</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, item.count * 20)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No active roles to analyze.</p>
          )}
        </div>

        {/* Applicant Stage Funnel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Candidate Pipeline Stages
            </h2>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>

          {applicantStageBreakdown.length > 0 ? (
            <div className="space-y-3">
              {applicantStageBreakdown.map((item: any) => (
                <div key={item._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-slate-300 font-medium">{item._id}</span>
                    <span className="text-slate-400">{item.count} candidates</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${Math.min(100, item.count * 25)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No candidates in pipeline yet.</p>
          )}
        </div>
      </div>

      {/* Top Skills Required */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Top Demanded Competencies Across Postings
        </h2>

        {topSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {topSkills.map((s: any) => (
              <div
                key={s.skill}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
              >
                <span className="font-semibold">{s.skill}</span>
                <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-[10px] text-cyan-400 font-mono">
                  {s.count} {s.count === 1 ? 'role' : 'roles'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No skill tags registered yet.</p>
        )}
      </div>
    </div>
  );
}
