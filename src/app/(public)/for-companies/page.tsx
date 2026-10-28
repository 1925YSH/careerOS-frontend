'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Zap, 
  Lock,
  SearchCheck,
  Check
} from 'lucide-react';

export default function ForCompaniesPage() {
  const benefits = [
    {
      title: 'Direct Talent Discovery',
      desc: 'Pre-vetted candidates discover your openings through hybrid AI match scores, ensuring applications closely align with required competencies.',
      icon: SearchCheck,
    },
    {
      title: 'Automated Feed Ingestion',
      desc: 'No manual ATS double-posting. We connect directly to your public career portal or ATS URL, keeping roles perpetually synchronized.',
      icon: RefreshCw,
    },
    {
      title: 'Verified Employer Badge',
      desc: 'Signal authentic, scam-free legitimacy with our cryptographic domain-verified trust seal on all your listings.',
      icon: ShieldCheck,
    },
    {
      title: 'Rich Hiring Analytics',
      desc: 'Understand candidate interest, match density, and competitive skill availability across geographic regions.',
      icon: TrendingUp,
    },
  ];

  const sourceWorkflow = [
    {
      step: '1',
      title: 'Register Career URL',
      desc: 'Submit your official careers page (e.g. greenhouse.io/acme or acme.com/careers).',
    },
    {
      step: '2',
      title: 'Domain Ownership Verification',
      desc: 'We verify domain authority using DNS records, official company email domain, or manual compliance review.',
    },
    {
      step: '3',
      title: 'Autonomous Ingestion & Sync',
      desc: 'Our engine periodically indexes your live openings, extracts structured skills, and updates listings automatically.',
    },
    {
      step: '4',
      title: 'Live Workspace Management',
      desc: 'Manage listings, review candidate pipelines, or post direct priority roles through your dedicated Company Workspace.',
    },
  ];

  const faqs = [
    {
      q: 'Does CareerOS replace our Applicant Tracking System (ATS)?',
      a: 'No. CareerOS acts as a high-conversion discovery intelligence channel. When candidates click Apply, they are directed straight into your canonical ATS application flow or your company intake portal.',
    },
    {
      q: 'How does domain verification work?',
      a: 'To prevent impersonation and fraudulent listings, company accounts must authenticate with an official corporate work email matching the company domain, or verify DNS ownership.',
    },
    {
      q: 'Can we edit or remove listings extracted by CareerOS?',
      a: 'Yes. Verified employers have full control in the Company Workspace to archive roles, adjust requirements, or opt out of automated ingestion entirely.',
    },
    {
      q: 'What is the pricing model for employers?',
      a: 'Basic ingestion and verified employer status are free. We offer premium tiers for featured job placement, candidate talent pool matching, and dedicated ATS webhook sync.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur mb-6">
            <Building2 className="h-3.5 w-3.5" />
            AI CareerOS for Verified Employers
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto">
            Turn Your Hiring Presence Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Structured, Discoverable Feed</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
            Connect your existing careers portal or post directly. Receive pre-evaluated candidate matches, eliminate ghost listings, and maintain 100% verified employer credibility.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register?role=company"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
            >
              Request Company Access <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Sign In to Company Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-[#0B1220]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#06B6D4]">Why Hire on CareerOS</h2>
            <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              Built for Modern High-Growth Engineering & Product Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 hover:border-blue-500/40 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[#2563EB] mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{b.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Source Ingestion Workflow */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#16A34A]">Effortless Integration</h2>
            <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              How Automated Source Sync Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sourceWorkflow.map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="h-8 w-8 rounded-full bg-blue-600/20 text-[#2563EB] font-mono font-bold flex items-center justify-center mb-4 text-sm">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section className="py-24 bg-[#0B1220]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#06B6D4]">Employer Plans</h2>
            <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              Predictable, Performance-Driven Recruitment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Ingestion */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">Verified Ingestion</h4>
                <p className="text-sm text-slate-400 mt-1">Automatic sync for your career page</p>
                <div className="mt-6 text-3xl font-black text-white">$0 <span className="text-sm font-normal text-slate-400">/ forever</span></div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Automated careers page sync</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Verified employer badge</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Direct link to your ATS</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Basic company profile</li>
                </ul>
              </div>
              <Link
                href="/register?role=company"
                className="mt-8 block text-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Direct Posting & Featured */}
            <div className="rounded-2xl border-2 border-blue-500 bg-slate-900/90 p-8 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Featured Jobs</h4>
                <p className="text-sm text-slate-400 mt-1">Maximum visibility for priority roles</p>
                <div className="mt-6 text-3xl font-black text-white">$49 <span className="text-sm font-normal text-slate-400">/ job listing</span></div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Priority placement in job search</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> AI match recommendations to candidates</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Highlighted in weekly match digest</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Direct applicant tracking board</li>
                </ul>
              </div>
              <Link
                href="/register?role=company"
                className="mt-8 block text-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Post Priority Roles
              </Link>
            </div>

            {/* Talent Pipeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">Talent Pipeline</h4>
                <p className="text-sm text-slate-400 mt-1">Direct outreach to high-match candidates</p>
                <div className="mt-6 text-3xl font-black text-white">$149 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Unlimited active job posts</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Anonymized high-match candidate search</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Direct interview invite messaging</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Priority ingestion sync (every 6 hrs)</li>
                </ul>
              </div>
              <Link
                href="/register?role=company"
                className="mt-8 block text-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Request Enterprise Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
                <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
