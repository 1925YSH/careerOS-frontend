'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  MapPin,
  Building2,
  DollarSign,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export interface JobItem {
  _id: string;
  title: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'on-site';
  employmentType: string;
  experienceMin?: number;
  experienceMax?: number;
  skills: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    isDisclosed?: boolean;
  };
  sourceType: 'company_posted' | 'ingested';
  postedAt: string;
  isSaved?: boolean;
  companyId: {
    _id: string;
    name: string;
    domain: string;
    logoUrl?: string;
    verified?: boolean;
  };
}

interface JobCardProps {
  job: JobItem;
}

export function JobCard({ job }: JobCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const previousState = isSaved;
    setIsSaved(!previousState); // Optimistic UI
    setIsSaving(true);

    try {
      if (previousState) {
        await apiClient(`/jobs/${job._id}/save`, { method: 'DELETE' });
      } else {
        await apiClient(`/jobs/${job._id}/save`, { method: 'POST', body: JSON.stringify({}) });
      }
    } catch (err) {
      setIsSaved(previousState); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const formatSalary = () => {
    if (!job.salary?.isDisclosed || !job.salary?.min) return null;
    const { min, max, currency } = job.salary;
    const isUSD = currency === 'USD';
    const symbol = isUSD ? '$' : '₹';
    const divisor = isUSD ? 1000 : 100000;
    const suffix = isUSD ? 'k' : 'L';

    if (max && max > min) {
      return `${symbol}${Math.round(min / divisor)}${suffix} - ${symbol}${Math.round(max / divisor)}${suffix}/yr`;
    }
    return `${symbol}${Math.round(min / divisor)}${suffix}+/yr`;
  };

  const getWorkModeBadge = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'hybrid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatPostedTime = (dateStr: string) => {
    const diffHours = Math.round((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours || 1}h ago`;
    const days = Math.round(diffHours / 24);
    return `${days}d ago`;
  };

  const company = job.companyId || { name: 'Unknown Company' };

  return (
    <div className="group relative rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm hover:border-[#2563EB]/60 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Company Avatar & Role Header */}
        <div className="flex items-start gap-3.5">
          <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:scale-105 transition-transform">
            {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                {company.name}
              </span>
              {company.verified && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#16A34A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>

            <Link href={`/jobs/${job._id}`} className="block mt-0.5">
              <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#2563EB] transition-colors leading-snug">
                {job.title}
              </h3>
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location}
              </span>

              {formatSalary() && (
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <DollarSign className="h-3.5 w-3.5 text-[#16A34A]" />
                  {formatSalary()}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {formatPostedTime(job.postedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Work Mode Badge & Bookmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${getWorkModeBadge(
              job.workMode
            )}`}
          >
            {job.workMode}
          </span>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isSaving}
            aria-label="Save Job"
            className={`rounded-lg p-1.5 border transition ${
              isSaved
                ? 'border-blue-300 bg-blue-50 text-[#2563EB]'
                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#2563EB]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Skills Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {job.skills.slice(0, 5).map((skill, idx) => (
          <span
            key={idx}
            className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200/80"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 5 && (
          <span className="text-[11px] text-slate-500 font-medium pl-1">
            +{job.skills.length - 5} more
          </span>
        )}
      </div>

      {/* Footer Strip with AI Match & View Details CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-[#06B6D4]" />
          <span>AI Fit Analysis Available</span>
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:text-blue-800 transition"
        >
          View Role Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

