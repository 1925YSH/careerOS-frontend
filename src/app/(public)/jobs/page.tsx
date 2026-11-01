'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { JobCard, JobItem } from '@/components/jobs/JobCard';
import { FilterRail, FilterState } from '@/components/jobs/FilterRail';
import { JobSkeleton } from '@/components/jobs/JobSkeleton';
import { apiClient } from '@/lib/api-client';
import { Search, MapPin, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';

const initialFilters: FilterState = {
  search: '',
  location: '',
  workMode: 'all',
  employmentType: 'all',
  experienceTier: 'all',
  skills: [],
  minSalary: '',
  sort: 'newest',
};

export default function JobsPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Temporary inputs before hitting Search button or Enter
  const [keywordInput, setKeywordInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.location) params.set('location', filters.location);
      if (filters.workMode && filters.workMode !== 'all') params.set('workMode', filters.workMode);
      if (filters.employmentType && filters.employmentType !== 'all')
        params.set('employmentType', filters.employmentType);

      if (filters.experienceTier === 'entry') {
        params.set('experienceMin', '0');
        params.set('experienceMax', '2');
      } else if (filters.experienceTier === 'mid') {
        params.set('experienceMin', '3');
        params.set('experienceMax', '5');
      } else if (filters.experienceTier === 'senior') {
        params.set('experienceMin', '6');
      }

      if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
      if (filters.minSalary) params.set('minSalary', filters.minSalary);
      if (filters.sort) params.set('sort', filters.sort);

      const res = await apiClient<{ jobs: JobItem[]; pagination: { total: number } }>(
        `/jobs?${params.toString()}`
      );

      setJobs(res.jobs);
      setTotalCount(res.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Could not load job listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: keywordInput,
      location: locationInput,
    }));
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setKeywordInput('');
    setLocationInput('');
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Search Header Banner */}
      <section className="bg-[#0B1220] py-10 px-4 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">
              Verified Opportunity Feed
            </span>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-white">
              Discover engineering roles directly from source
            </h1>
            <p className="text-sm text-slate-400">
              Clean, deduplicated job postings with verified source attribution and transparent AI match breakdowns.
            </p>
          </div>

          {/* Search Inputs Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-2 rounded-xl bg-slate-900/90 p-2 border border-slate-700 shadow-xl"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-800">
              <Search className="h-4 w-4 text-[#06B6D4] shrink-0" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Job title, skills (e.g. Next.js, Node), or company"
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="City, country, or 'Remote'"
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition shrink-0"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <span className="text-xs font-bold text-slate-700">
            {isLoading ? 'Searching...' : `${totalCount} verified roles`}
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {filters.skills.length > 0 && `(${filters.skills.length})`}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Filter Rail (Desktop) */}
          <div className="hidden lg:block">
            <FilterRail
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalCount={totalCount}
            />
          </div>

          {/* Mobile Drawer (When Open) */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex justify-end">
              <div className="w-full max-w-sm bg-white rounded-2xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <h3 className="font-bold text-base text-[#0B1220]">Refine Jobs</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                <FilterRail
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                  totalCount={totalCount}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="mt-6 w-full rounded-lg bg-[#2563EB] py-2.5 text-xs font-bold text-white"
                >
                  Show {totalCount} Roles
                </button>
              </div>
            </div>
          )}

          {/* Right Column: Results Feed */}
          <div className="flex-1 space-y-4">
            {/* Header Result Summary & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600">
                Showing{' '}
                <span className="font-bold text-slate-900">
                  {isLoading ? '...' : totalCount}
                </span>{' '}
                active verified opportunities
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="newest">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                  <option value="experience">Experience Level</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-3">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                <h4 className="font-bold text-sm text-red-800">Failed to load job listings</h4>
                <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry Request
                </button>
              </div>
            )}

            {/* Loading State: Skeletons */}
            {isLoading && !error && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && jobs.length === 0 && (
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-12 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto text-xl font-bold">
                  🔍
                </div>
                <h3 className="text-base font-bold text-[#0B1220]">No jobs matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your keywords, selecting different technologies, or clearing your filters to see more roles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Job Cards List */}
            {!isLoading && !error && jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

