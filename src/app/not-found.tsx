import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] mb-4 font-bold text-2xl border border-blue-200">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#0B1220]">
        This page has moved or doesn't exist
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        The link you followed may be outdated, or the job listing might have been filled or archived.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/jobs"
          className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          Explore Jobs
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

