'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { apiClient } from '@/lib/api-client';
import { Search, Building2, MapPin, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';

interface CompanyItem {
  _id: string;
  name: string;
  domain: string;
  industry: string;
  location: string;
  companySize?: string;
  verified: boolean;
  openJobCount: number;
  description?: string;
}

export default function CompaniesDirectoryPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industry) params.set('industry', industry);

      const res = await apiClient<{ companies: CompanyItem[] }>(`/companies?${params.toString()}`);
      setCompanies(res.companies || []);
    } catch (e) {
      console.error('Failed to load companies:', e);
    } finally {
      setIsLoading(false);
    }
  }, [search, industry]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Directory Banner */}
      <section className="bg-[#0B1220] py-10 px-4 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">
              Verified Hiring Partners
            </span>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-white">
              Company Directory & Career Portals
            </h1>
            <p className="text-sm text-slate-400">
              Browse top technology companies whose career portals are monitored, normalized, and indexed by AI CareerOS.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 shadow-md">
              <Search className="h-4 w-4 text-[#06B6D4]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company by name..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Industries</option>
              <option value="Fintech">Financial Technology</option>
              <option value="Developer Tools">Developer Tools & Cloud</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse space-y-4"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
                <div className="h-5 w-32 rounded bg-slate-200"></div>
                <div className="h-4 w-48 rounded bg-slate-100"></div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-[#0B1220]">No companies found</h3>
            <p className="text-xs text-slate-500">Try changing your search terms or clearing the industry filter.</p>
            <button
              onClick={() => {
                setSearch('');
                setIndustry('');
              }}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company._id}`}
                className="group rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#2563EB]/60 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition-transform">
                      {company.name.charAt(0).toUpperCase()}
                    </div>

                    {company.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#16A34A] border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#0B1220] group-hover:text-[#2563EB] transition-colors">
                    {company.name}
                  </h3>
                  <span className="text-xs text-slate-500 block">{company.industry}</span>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {company.description || 'Verified technology employer.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Briefcase className="h-3.5 w-3.5 text-[#2563EB]" />
                    {company.openJobCount} {company.openJobCount === 1 ? 'Open Role' : 'Open Roles'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[#2563EB] font-semibold group-hover:translate-x-0.5 transition-transform">
                    View Jobs <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
