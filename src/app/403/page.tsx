import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-[#D97706] mb-4 font-bold text-2xl border border-amber-200">
        403
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#0B1220]">
        You don't have permission to view this page
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        This area requires specific permissions or role credentials that your current account does not have.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Link
          href="/app"
          className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Switch Account
        </Link>
      </div>
    </div>
  );
}

