'use client';

import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceTier: string;
  skills: string[];
  minSalary: string;
  sort: string;
}

interface FilterRailProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
}

const POPULAR_SKILLS = [
  'typescript',
  'react',
  'next.js',
  'node.js',
  'python',
  'aws',
  'postgresql',
  'mongodb',
  'docker',
  'distributed systems',
];

export function FilterRail({ filters, onChange, onReset, totalCount }: FilterRailProps) {
  const toggleSkill = (skill: string) => {
    const active = filters.skills.includes(skill);
    const updated = active
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onChange({ skills: updated });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Top Header & Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#2563EB]" />
          <h3 className="font-bold text-sm text-[#0B1220]">Filters</h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* 1. Work Mode Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'All Modes', value: 'all' },
            { label: 'Remote', value: 'remote' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'On-site', value: 'on-site' },
          ].map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange({ workMode: mode.value })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border text-center transition ${
                filters.workMode === mode.value
                  ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Experience Tiers */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Levels', value: 'all' },
            { label: 'Entry Level (0-2 years)', value: 'entry' },
            { label: 'Mid Level (3-5 years)', value: 'mid' },
            { label: 'Senior / Lead (6+ years)', value: 'senior' },
          ].map((tier) => (
            <label
              key={tier.value}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="radio"
                name="experienceTier"
                checked={filters.experienceTier === tier.value}
                onChange={() => onChange({ experienceTier: tier.value })}
                className="h-3.5 w-3.5 text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
              />
              <span>{tier.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Employment Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Employment Type
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Types', value: 'all' },
            { label: 'Full-time', value: 'FULL_TIME' },
            { label: 'Contract', value: 'CONTRACT' },
            { label: 'Internship', value: 'INTERNSHIP' },
          ].map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="radio"
                name="employmentType"
                checked={filters.employmentType === type.value}
                onChange={() => onChange({ employmentType: type.value })}
                className="h-3.5 w-3.5 text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Skills Multi-Select Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Core Technologies
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((skill) => {
            const active = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                  active
                    ? 'border-[#2563EB] bg-[#2563EB] text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {skill}
                {active && <span className="ml-1 text-[10px]">✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Minimum Annual Salary ($) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Minimum Salary (USD)
        </label>
        <select
          value={filters.minSalary}
          onChange={(e) => onChange({ minSalary: e.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#2563EB] focus:outline-none"
        >
          <option value="">Any Compensation</option>
          <option value="100000">$100,000+ / year</option>
          <option value="150000">$150,000+ / year</option>
          <option value="180000">$180,000+ / year</option>
          <option value="220000">$220,000+ / year</option>
        </select>
      </div>
    </aside>
  );
}
