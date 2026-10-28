'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Eye, EyeOff, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push('/app');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0B1220] p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Career<span className="text-[#06B6D4]">OS</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-extrabold leading-tight">
            The intelligent operating system for your professional career.
          </h2>
          <p className="text-sm text-slate-400 max-w-md">
            Direct ingestion from verified employers, transparent AI skill-gap diagnostics, and structured preparation roadmaps in one unified workspace.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          OWASP ASVS 5.0 Compliant • Private S3 Storage • DPDP Ready
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1220]">Sign in to CareerOS</h1>
            <p className="mt-1 text-sm text-slate-600">
              New to CareerOS?{' '}
              <Link href="/register" className="font-semibold text-[#2563EB] hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@work.com"
                className="mt-1.5 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#2563EB] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Copy (from Page 4 UI Spec) */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-slate-400" />
            <span>Protected by encrypted HttpOnly sessions and rate limiting</span>
          </div>
        </div>
      </div>
    </div>
  );
}

