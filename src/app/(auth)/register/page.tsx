'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, User, Building2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<'candidate' | 'company'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: any = {
        email,
        password,
        role,
      };

      if (role === 'candidate') {
        payload.name = name;
      } else {
        payload.companyName = companyName;
        payload.website = website;
        if (website) {
          try {
            const url = new URL(website.startsWith('http') ? website : `https://${website}`);
            payload.domain = url.hostname.replace('www.', '');
          } catch (e) {
            payload.domain = email.split('@')[1];
          }
        }
      }

      await register(payload);
      router.push(role === 'company' ? '/company' : '/app');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check the details provided.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#CBD5E1] shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#0B1220]">
              Career<span className="text-[#06B6D4]">OS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220]">Create your account</h1>
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#2563EB] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Role Choice (Specification: Candidate or Company only) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Select Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-bold transition ${
                role === 'candidate'
                  ? 'border-[#2563EB] bg-blue-50/60 text-[#2563EB] shadow-sm'
                  : 'border-[#CBD5E1] bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Job Seeker / Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('company')}
              className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-bold transition ${
                role === 'company'
                  ? 'border-[#2563EB] bg-blue-50/60 text-[#2563EB] shadow-sm'
                  : 'border-[#CBD5E1] bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Employer / Company</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'candidate' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Technologies"
                  className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Company Careers Website</label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://acme.com/careers"
                  className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              {role === 'company' ? 'Work Email Address' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'company' ? 'recruiting@company.com' : 'jane@example.com'}
              className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters with 1 capital and 1 number"
              className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="pt-2 text-xs text-slate-500">
            By creating an account, you agree to the{' '}
            <Link href="/terms" className="text-[#2563EB] hover:underline">
              Terms of Service
            </Link>{' '}
            and our{' '}
            <Link href="/privacy" className="text-[#2563EB] hover:underline">
              Privacy Notice
            </Link>.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

