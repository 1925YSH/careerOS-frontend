'use client';

import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 font-bold text-2xl">
        !
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#0B1220]">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        We encountered an unexpected issue while loading this view. Technical details have been logged.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

