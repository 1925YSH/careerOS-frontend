'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Download,
  Cpu,
  Sparkles,
  CheckCircle2,
  Fingerprint,
  Target,
  ArrowRight,
  ShieldCheck,
  FileText,
  Compass,
  CheckCircle
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

export default function HowItWorksPage() {
  const ingestionPipeline = [
    {
      step: '01',
      title: 'Approved Source Ingestion',
      icon: Globe,
      desc: 'Our crawler regularly monitors verified company career portals and ATS integrations (Greenhouse, Lever, Ashby, Workday).',
    },
    {
      step: '02',
      title: 'DOM Purification & Cleaning',
      icon: Download,
      desc: 'Noise, cookie banners, navigation links, and scripts are stripped deterministically to leave pure semantic job content.',
    },
    {
      step: '03',
      title: 'Schema-Enforced AI Extraction',
      icon: Cpu,
      desc: 'Gemini 1.5 extracts normalized salary ranges, experience bands, tech stacks, and hard requirements into strict JSON schemas.',
    },
    {
      step: '04',
      title: 'Validation & Deduplication',
      icon: Fingerprint,
      desc: 'SHA-256 cryptographic fingerprints prevent duplicate postings and eliminate expired ghost positions automatically.',
    },
    {
      step: '05',
      title: 'Deterministic & Semantic Matching',
      icon: Target,
      desc: 'Candidate resumes are scored using a hybrid formula: hard qualification verification + embedding skill-gap analysis.',
    },
    {
      step: '06',
      title: 'Candidate Action & Roadmap',
      icon: CheckCircle2,
      desc: 'Generate customized 7-day interview roadmaps, prepare role-specific answers, and track your application pipeline.',
    },
  ];

  const candidateSteps = [
    {
      title: 'Upload Your Resume',
      desc: 'Upload your PDF or DOCX securely to our isolated AWS S3 storage. Our parser extracts verified skills and career timelines.',
      icon: FileText,
    },
    {
      title: 'Define Work Preferences',
      desc: 'Set your target titles, expected compensation, preferred remote modalities, and target locations.',
      icon: Compass,
    },
    {
      title: 'Review Explainable Fit Scores',
      desc: 'Understand exactly why you scored 85% or 62%. See which skills matched, which are missing, and how to close the gap.',
      icon: Sparkles,
    },
    {
      title: 'Autonomous Daily Prep',
      desc: 'Our AI Career Agent produces structured preparation tasks and tracks interview stages directly on your Kanban board.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-[#06B6D4] backdrop-blur mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent Architecture & AI Pipelines
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto">
            From Company Career Portals to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Personalized Feed</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
            Unlike traditional job boards that rely on stale aggregators and third-party scraping, AI CareerOS ingests directly from approved company sources with cryptographic deduplication and explainable AI matching.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Explore Verified Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Ingestion Engine Flow */}
      <section className="py-24 bg-[#0B1220]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#06B6D4]">Engine Architecture</h2>
            <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              The 6-Step Autonomous Ingestion Engine
            </h3>
            <p className="mt-4 text-slate-400">
              Deterministic DOM parsing and schema-validated LLM extraction guarantee that every listing reflects current, active hiring criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingestionPipeline.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-[#06B6D4] transition-colors">
                      STAGE {item.step}
                    </span>
                    <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[#2563EB] group-hover:text-[#06B6D4] group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Candidate Journey Section */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#16A34A]">Candidate Journey</h2>
            <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              How Candidates Go From Profile to Offer
            </h3>
            <p className="mt-4 text-slate-400">
              No endless spreadsheet tracking or vague rejection emails. Your CareerOS operates as your 24/7 autonomous career strategist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {candidateSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-6 relative">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explainability Trust Statement */}
      <section className="py-20 bg-[#0B1220]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-900 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-[#06B6D4]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Our AI Explainability Commitment</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                AI CareerOS never acts as an opaque black box. We never declare automated hiring rejections or guarantees. Every match score is broken down into verifiable requirements: exact skill overlap, years of experience, and missing credentials. You remain in complete control of where and when you apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
