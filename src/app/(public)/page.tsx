import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Bot,
  Building2,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1220] py-20 lg:py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#06B6D4]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Your AI-Powered Career Operating System</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Stop searching. <br />
                <span className="bg-gradient-to-r from-blue-400 via-[#06B6D4] to-indigo-300 bg-clip-text text-transparent">
                  Start building your career.
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                Automatically ingest open jobs directly from verified company portals, discover your exact skill fit with explainable AI, and convert complex requirements into structured 7-day interview roadmaps.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/jobs"
                  className="rounded-lg bg-[#2563EB] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Explore Jobs
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-base font-semibold text-slate-200 hover:bg-slate-800 transition flex items-center gap-2"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4 text-[#06B6D4]" />
                </Link>
              </div>
            </div>

            {/* Right: Signature AI Match Demo Card (Section 6 from Spec) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400">Live AI Fit Analysis</span>
                    <h3 className="text-lg font-bold text-white">Senior Full-Stack Engineer</h3>
                    <p className="text-xs text-slate-400">Stripe • Remote • Posted 4h ago</p>
                  </div>
                  {/* Signature Match Badge */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-[#06B6D4]/40 px-3.5 py-2">
                    <span className="text-2xl font-black text-[#06B6D4]">87%</span>
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Fit Score</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Matched Competencies:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> TypeScript
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Next.js
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Node / Express
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400">Identified Skill Gap:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 rounded bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <XCircle className="h-3 w-3" /> AWS DynamoDB
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <Bot className="h-3.5 w-3.5 text-[#06B6D4]" /> Why this match:
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Matches 5/6 core stack requirements and meets the 4+ years full-stack benchmark. DynamoDB gap can be resolved with our 7-day crash curriculum.
                    </p>
                  </div>

                  <button className="w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#06B6D4] py-2.5 text-xs font-bold text-white hover:opacity-90 transition">
                    Ask AI: Generate 7-Day Prep Roadmap →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust & Source Integrity Strip */}
      <section className="border-y border-[#CBD5E1] bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            100% Verified Canonical Sources (Zero Fake Postings)
          </span>
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#2563EB]" />
            Privacy-First Architecture (Private S3 & DPDP Compliant)
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#06B6D4]" />
            Continuous Automated Crawler Ingestion
          </span>
        </div>
      </section>

      {/* 4. Problem -> Solution Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">The Problem & Solution</h2>
          <p className="mt-2 text-3xl font-extrabold text-[#0B1220]">Traditional job searching is broken</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <div className="text-red-500 font-bold text-lg mb-2">Endless Searching</div>
              <p className="text-sm text-slate-600">
                Job boards are cluttered with duplicate listings, expired roles, and recruiter spam that waste hundreds of hours.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 font-medium text-xs text-[#2563EB]">
                → CareerOS Solution: Ingests directly from approved company portals with automated deduplication.
              </div>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <div className="text-red-500 font-bold text-lg mb-2">Generic Recommendations</div>
              <p className="text-sm text-slate-600">
                Keyword search misses domain fit and awards opaque scores without actionable reasoning.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 font-medium text-xs text-[#2563EB]">
                → CareerOS Solution: Hybrid deterministic + semantic AI analysis with explicit matched and missing skills.
              </div>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <div className="text-red-500 font-bold text-lg mb-2">Spreadsheet Chaos</div>
              <p className="text-sm text-slate-600">
                Tracking dates, notes, rounds, and preparation across tabs leads to dropped opportunities and missed deadlines.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 font-medium text-xs text-[#2563EB]">
                → CareerOS Solution: Integrated Kanban tracker with autonomous preparation tasks linked directly to roles.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ingestion Pipeline Workflow */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">The Autonomous Pipeline</span>
          <h2 className="mt-2 text-3xl font-extrabold text-white">From Official Career Portals to Your Daily Action Plan</h2>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Building2 className="h-6 w-6 text-[#06B6D4] mx-auto mb-2" />
              1. Verified Sources
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <ShieldCheck className="h-6 w-6 text-[#2563EB] mx-auto mb-2" />
              2. SSRF Guard
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Zap className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              3. HTML Clean
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              4. AI Structured Extraction
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Target className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              5. SHA-256 Dedupe
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <Bot className="h-6 w-6 text-[#06B6D4] mx-auto mb-2" />
              6. Hybrid Match
            </div>
          </div>
        </div>
      </section>

      {/* 7. Feature Bento Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Core Capabilities</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0B1220]">Engineered as a Complete Career OS</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <Zap className="h-8 w-8 text-[#2563EB] mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">Smart Job Discovery</h3>
              <p className="mt-2 text-sm text-slate-600">
                Filter by verified work mode, stack overlap, experience tiers, and real compensation bounds.
              </p>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <Sparkles className="h-8 w-8 text-[#06B6D4] mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">AI Job Matching</h3>
              <p className="mt-2 text-sm text-slate-600">
                Transparent match scores backed by evidence, highlighting both competencies and addressable skill gaps.
              </p>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <FileText className="h-8 w-8 text-[#16A34A] mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">Resume Intelligence</h3>
              <p className="mt-2 text-sm text-slate-600">
                Private AWS S3 document versions evaluated by ATS diagnostic parsers to identify missing keywords.
              </p>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <Target className="h-8 w-8 text-[#D97706] mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">Skill Gap Analysis</h3>
              <p className="mt-2 text-sm text-slate-600">
                Know exactly what the company wants before applying, with curated learning tracks to bridge requirements.
              </p>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <Compass className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">Application Tracker</h3>
              <p className="mt-2 text-sm text-slate-600">
                Move roles seamlessly through Saved, Applied, Interview, and Offer stages with automatic follow-up tasks.
              </p>
            </div>

            <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-sm hover:shadow-md transition">
              <Bot className="h-8 w-8 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg text-[#0B1220]">AI Career Agent</h3>
              <p className="mt-2 text-sm text-slate-600">
                Ask questions, generate 7-day interview roadmaps, and receive proactive alerts for high-affinity roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Final CTA Band */}
      <section className="bg-[#0B1220] py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Your next role should not require a spreadsheet.</h2>
          <p className="mt-3 text-slate-300">
            Join thousands of ambitious engineers using AI CareerOS to navigate their career with clarity.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-blue-600 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              Explore Ingested Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

