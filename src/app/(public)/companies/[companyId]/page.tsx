'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { JobCard, JobItem } from '@/components/jobs/JobCard';
import { apiClient } from '@/lib/api-client';
import {
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  ArrowLeft,
  Clock,
  Globe,
} from 'lucide-react';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params?.companyId as string;

  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      if (!companyId) return;
      setIsLoading(true);
      try {
        const res = await apiClient<{ company: any; jobs: JobItem[] }>(`/companies/${companyId}`);
        setCompany(res.company);
        setJobs(res.jobs || []);
      } catch (err: any) {
        setError(err.message || 'Company not found.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCompany();
  }, [companyId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Back Link */}
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Company Directory
        </Link>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 animate-pulse space-y-4">
            <div className="h-14 w-14 rounded-xl bg-slate-200"></div>
            <div className="h-6 w-48 rounded bg-slate-200"></div>
            <div className="h-20 rounded bg-slate-100"></div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
            <h3 className="font-bold text-red-800">Company Not Found</h3>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {company && !isLoading && (
          <>
            {/* Company Hero Profile Header */}
            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-2xl shadow-md">
                    {company.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220]">
                        {company.name}
                      </h1>
                      {company.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-[#16A34A] border border-emerald-200">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified Source
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{company.industry}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {company.location}
                      </span>
                      <span>• {company.companySize || '500+ employees'}</span>
                    </div>
                  </div>
                </div>

                {company.careersUrl && (
                  <a
                    href={company.careersUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>Official Careers Portal</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                )}
              </div>

              {/* About Text */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  About {company.name}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                  {company.description}
                </p>
              </div>
            </div>

            {/* Open Roles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0B1220]">
                    Current Openings at {company.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {jobs.length} active positions ingested from official careers feed
                  </p>
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                  No active roles right now. Check back soon or set an alert for {company.name}.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={{ ...job, companyId: company }} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

