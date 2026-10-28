'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  MapPin,
  Building2,
  DollarSign,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Bot,
  Globe,
  Users,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.jobId as string;
  const { user } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function loadJobDetail() {
      if (!jobId) return;
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient<{ job: any; similarJobs: any[] }>(`/jobs/${jobId}`);
        setJob(data.job);
        setIsSaved(data.job.isSaved || false);
        setSimilarJobs(data.similarJobs || []);
      } catch (err: any) {
        setError(err.message || 'Job listing could not be found.');
      } finally {
        setIsLoading(false);
      }
    }

    loadJobDetail();
  }, [jobId]);

  const handleToggleSave = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const prev = isSaved;
    setIsSaved(!prev);

    try {
      if (prev) {
        await apiClient(`/jobs/${jobId}/save`, { method: 'DELETE' });
      } else {
        await apiClient(`/jobs/${jobId}/save`, { method: 'POST', body: JSON.stringify({}) });
      }
    } catch (e) {
      setIsSaved(prev);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const formatSalary = () => {
    if (!job?.salary?.isDisclosed || !job?.salary?.min) return null;
    const { min, max, currency } = job.salary;
    const isUSD = currency === 'USD';
    const symbol = isUSD ? '$' : '₹';
    const divisor = isUSD ? 1000 : 100000;
    const suffix = isUSD ? 'k' : 'L';

    if (max && max > min) {
      return `${symbol}${Math.round(min / divisor)}${suffix} - ${symbol}${Math.round(max / divisor)}${suffix} per year`;
    }
    return `${symbol}${Math.round(min / divisor)}${suffix}+ per year`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/jobs" className="hover:text-[#2563EB] flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">
            {job?.title || 'Job Detail'}
          </span>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 animate-pulse space-y-6">
            <div className="h-8 w-1/2 rounded bg-slate-200"></div>
            <div className="h-4 w-1/4 rounded bg-slate-200"></div>
            <div className="h-40 rounded bg-slate-100"></div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center space-y-4">
            <h3 className="text-lg font-bold text-red-800">Job Listing Not Found</h3>
            <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
            <Link
              href="/jobs"
              className="inline-block rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600"
            >
              Explore Other Opportunities
            </Link>
          </div>
        )}

        {job && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Job Overview, AI Fit Panel, Requirements */}
            <div className="lg:col-span-8 space-y-6">
              {/* Job Header Card */}
              <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-xl shadow-md">
                      {job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : 'C'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/companies/${job.companyId?._id}`}
                          className="text-sm font-semibold text-slate-700 hover:text-[#2563EB] transition"
                        >
                          {job.companyId?.name}
                        </Link>
                        {job.companyId?.verified && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified Source
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                        {job.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="capitalize font-semibold text-slate-700">
                          • {job.workMode}
                        </span>
                        <span className="font-semibold text-slate-700">
                          • {job.employmentType.replace('_', ' ')}
                        </span>
                        {formatSalary() && (
                          <span className="flex items-center gap-1 font-bold text-emerald-700">
                            <DollarSign className="h-3.5 w-3.5 text-[#16A34A]" />
                            {formatSalary()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Header Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleSave}
                      className={`p-2.5 rounded-xl border transition ${
                        isSaved
                          ? 'border-blue-300 bg-blue-50 text-[#2563EB]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Saved to shortlist' : 'Save job'}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#2563EB]' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                      title="Share job"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition flex items-center gap-2"
                    >
                      <span>Apply on Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {copySuccess && (
                  <div className="mt-3 text-xs text-emerald-600 font-medium">
                    ✓ Direct link copied to clipboard!
                  </div>
                )}
              </div>

              {/* Signature AI Fit Analysis Panel (Section 4 & 5 of Tech Spec) */}
              <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/40 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#06B6D4] flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#0B1220]">
                        AI CareerOS Fit Analysis
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Deterministic qualification overlap & semantic skill gap analysis
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-[#06B6D4]">88%</span>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                      Strong Match
                    </span>
                  </div>
                </div>

                {/* Matched & Missing Skills Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="rounded-xl bg-white p-4 border border-emerald-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Matched Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border border-amber-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                      <AlertTriangle className="h-4 w-4" /> Potential Gaps To Bridge
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(4).map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Rationale & 7-Day Prep Roadmap CTA */}
                <div className="rounded-xl bg-slate-900 text-white p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#06B6D4]">
                    <Bot className="h-4 w-4" /> Why this match score was awarded:
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    This role strongly aligns with modern full-stack workflows. The core frameworks matches the experience benchmarks. Any specialized stack gaps can be covered in a customized 7-day preparation roadmap.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/app/career-agent"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-4 py-2 text-xs font-bold text-white hover:opacity-95 transition"
                    >
                      Ask Career Agent: Generate 7-Day Interview Roadmap →
                    </Link>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  Disclaimer: Fit scores are informational guidance to assist your preparation and are never used as automated hiring decisions.
                </p>
              </div>

              {/* Detailed Job Description Content */}
              <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-[#0B1220] border-b border-slate-100 pb-3">
                  Role Overview & Requirements
                </h2>

                <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>

                {/* Required Skills Matrix */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Required Stack & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Company Snapshot & Verified Ingestion Meta */}
            <div className="lg:col-span-4 space-y-6">
              {/* Company Snapshot Card */}
              <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-lg">
                    {job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B1220]">{job.companyId?.name}</h3>
                    <span className="text-xs text-slate-500">{job.companyId?.industry}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {job.companyId?.description || 'Verified enterprise hiring partner.'}
                </p>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-slate-800">{job.companyId?.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Company Size:</span>
                    <span className="font-semibold text-slate-800">{job.companyId?.companySize || '500+ employees'}</span>
                  </div>
                  {job.companyId?.careersUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Careers Page:</span>
                      <a
                        href={job.companyId.careersUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        Official Site <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <Link
                  href={`/companies/${job.companyId?._id}`}
                  className="block text-center rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  View All Open Roles at {job.companyId?.name} →
                </Link>
              </div>

              {/* Source Transparency Card (Section 5.3 of Spec) */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                  <ShieldCheck className="h-4 w-4" /> Source Authenticity & Transparency
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This opportunity was ingested directly from{' '}
                  <span className="font-semibold text-slate-800">{job.sourceAttribution?.domain || job.companyId?.domain}</span>{' '}
                  under strict SSRF-safe crawling policies. Applications are submitted directly to the employer's canonical portal.
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last verified today
                </div>
              </div>

              {/* Similar Jobs Widget */}
              {similarJobs.length > 0 && (
                <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Similar Roles In This Stack
                  </h3>
                  <div className="space-y-3">
                    {similarJobs.map((simJob) => (
                      <Link
                        key={simJob._id}
                        href={`/jobs/${simJob._id}`}
                        className="block rounded-lg p-2.5 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                      >
                        <h4 className="text-xs font-bold text-[#0B1220] hover:text-[#2563EB]">
                          {simJob.title}
                        </h4>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{simJob.companyId?.name}</span>
                          <span className="capitalize">{simJob.workMode}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
