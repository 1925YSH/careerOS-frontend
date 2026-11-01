'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';

interface CompanyItem {
  _id: string;
  name: string;
  domain: string;
  website?: string;
  verified: boolean;
  status: string;
  ownerUserId?: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

export default function CompaniesManagementPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    try {
      const res = await apiClient<{ companies: CompanyItem[] }>('/admin/companies');
      setCompanies(res.companies || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleVerified = async (company: CompanyItem) => {
    try {
      await apiClient(`/admin/companies/${company._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ verified: !company.verified }),
      });
      fetchCompanies();
    } catch (err: any) {
      alert(`Error toggling verification: ${err.message}`);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const term = search.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.domain.toLowerCase().includes(term);
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
              Employer Governance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Company Verification & Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Validate employer credentials, company domains, and crawler ownership attribution.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by company name or domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading company registry...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No companies found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Company Name</th>
                  <th className="px-6 py-3">Canonical Domain</th>
                  <th className="px-6 py-3">Owner Account</th>
                  <th className="px-6 py-3">Verification Badge</th>
                  <th className="px-6 py-3">Registered</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {company.name}
                        {company.verified && (
                          <span title="Verified Employer">
                            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      {company.domain}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {company.ownerUserId?.email || 'System Verified'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          company.verified
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {company.verified ? 'Verified Employer' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {new Date(company.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleVerified(company)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          company.verified
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-sm'
                        }`}
                      >
                        {company.verified ? 'Revoke Badge' : 'Grant Verified Badge'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

