import React from 'react';

export function JobSkeleton() {
  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-5 w-48 rounded bg-slate-200"></div>
            <div className="h-3.5 w-32 rounded bg-slate-200"></div>
          </div>
        </div>
        <div className="h-7 w-20 rounded-full bg-slate-200"></div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-16 rounded bg-slate-200"></div>
        <div className="h-6 w-20 rounded bg-slate-200"></div>
        <div className="h-6 w-14 rounded bg-slate-200"></div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-4 w-28 rounded bg-slate-200"></div>
        <div className="h-4 w-20 rounded bg-slate-200"></div>
      </div>
    </div>
  );
}
