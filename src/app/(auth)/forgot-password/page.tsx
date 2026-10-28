'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Neutral security response: always show the same message regardless of whether the email exists
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl border border-[#CBD5E1] shadow-xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#0B1220]">
              Career<span className="text-[#06B6D4]">OS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1220]">Reset your password</h1>
          <p className="text-xs text-slate-600">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-[#2563EB] mx-auto" />
            <h3 className="font-bold text-sm text-[#0B1220]">Check your inbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account exists for <span className="font-semibold text-slate-800">{email}</span>, you will receive a secure password reset link within a few minutes. The link expires in 15 minutes.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0B1220] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              Send Reset Instructions
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

