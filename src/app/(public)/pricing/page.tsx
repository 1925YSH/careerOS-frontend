'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Compass,
  ArrowRight,
  HelpCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [audience, setAudience] = useState<'candidate' | 'company'>(
    user?.role === 'company' ? 'company' : 'candidate'
  );
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'candidate_free' || planId === 'employer_free') {
      if (!user) {
        router.push('/register');
      } else {
        router.push(user.role === 'company' ? '/company' : '/app');
      }
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    try {
      setIsLoading(planId);
      const res = await apiClient<{
        checkoutUrl: string;
        sessionId: string;
        isSimulated: boolean;
      }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      });

      if (res.checkoutUrl) {
        if (res.isSimulated) {
          // If simulation in local dev, upgrade directly and redirect to settings
          await apiClient('/billing/mock-upgrade', {
            method: 'POST',
            body: JSON.stringify({ planId, billingCycle }),
          });
          alert(`Plan upgraded successfully to ${planId.replace('_', ' ').toUpperCase()}!`);
          router.push(user.role === 'company' ? '/company/settings' : '/app/settings');
        } else {
          window.location.href = res.checkoutUrl;
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to initiate checkout session');
    } finally {
      setIsLoading(null);
    }
  };

  const faqs = [
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly through your billing settings. Downgrades take effect at the conclusion of your current billing period with zero cancellation penalties.',
    },
    {
      q: 'How does the Candidate Pro 7-day interview sprint generator work?',
      a: 'Candidate Pro unlocks unlimited AI Roadmap creations. When you find a target role, Career Agent analyzes the job description against your ATS resume and synthesizes 7 consecutive daily milestones—including technical deep-dives, architectural prep, and STAR behavioral stories.',
    },
    {
      q: 'What is the Verified Employer Shield Badge for companies?',
      a: 'The Verified Employer Shield Badge is awarded to companies on our Starter and Growth tiers. It signals to top candidates that your postings are verified, crawl-monitored, and backed by responsive hiring teams, resulting in up to 3x higher applicant engagement.',
    },
    {
      q: 'How do job posting quotas work for employers?',
      a: 'Community accounts can publish up to 2 active listings simultaneously. Verified Starter allows up to 10 active jobs, while Talent Growth provides unlimited postings. You can freely draft or archive roles without counting toward your active limit.',
    },
    {
      q: 'Are payments secure and compliant?',
      a: 'Yes. All financial transactions are processed securely via Stripe with AES-256 encryption. We never store raw credit card numbers or sensitive financial data on our servers.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Header & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent Commercial Subscriptions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Accelerate Your Career with{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Autonomous Intelligence
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Whether you are a software engineer preparing for competitive interviews or an engineering team hiring verified talent, CareerOS delivers enterprise-grade tooling.
          </p>

          {/* Audience Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setAudience('candidate')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                  audience === 'candidate'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" /> For Job Seekers (Candidates)
              </button>
              <button
                onClick={() => setAudience('company')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                  audience === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="h-4 w-4" /> For Employers (Companies)
              </button>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-medium">
            <span className={billingCycle === 'monthly' ? 'text-white font-bold' : 'text-slate-500'}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition"
            >
              <div
                className={`h-5 w-5 rounded-full bg-cyan-400 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={billingCycle === 'annual' ? 'text-white font-bold' : 'text-slate-500'}>
                Annual Billing
              </span>
              <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Save ~20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards: Candidates */}
        {audience === 'candidate' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Candidate Free Tier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  CareerOS Basic
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-500">/ forever free</span>
                </div>
                <p className="text-xs text-slate-400">
                  Essential tools for active job discovery and standard fit evaluation.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {[
                    'Search & filter verified employer opportunities',
                    '2 AI interview preparation roadmaps per week',
                    'Basic ATS resume format & keyword scoring',
                    'Standard application tracking Kanban board',
                    'Transparent hybrid match percentage previews',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('candidate_free')}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-600 transition"
              >
                {user ? 'Current Base Plan' : 'Get Started Free'}
              </button>
            </div>

            {/* Candidate Pro Tier */}
            <div className="rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-b from-slate-900 via-blue-950/20 to-slate-900 p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-cyan-950/30">
              <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-0.5 text-[11px] font-black uppercase text-white shadow-md">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    CareerOS Pro
                  </span>
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    ${billingCycle === 'annual' ? '149' : '19'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {billingCycle === 'annual' ? '/ year ($12.4/mo)' : '/ month'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Comprehensive autonomous career agent with unlimited roadmap sprints and in-depth ATS diagnostics.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {[
                    'Unlimited 7-day interview milestone sprint roadmaps',
                    'In-depth ATS resume diagnostics & semantic gap analysis',
                    'Real-time high-match email & in-app alerts',
                    'Interactive Explainability Drawer with full audit trail',
                    'Priority Career Agent reasoning & task scheduling',
                    'Unlimited tracked applications with interview notes',
                    'Early access to newly crawled employer listings',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-white">
                      <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('candidate_pro')}
                disabled={isLoading === 'candidate_pro'}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                {isLoading === 'candidate_pro' ? (
                  'Starting Checkout...'
                ) : (
                  <>
                    <span>Upgrade to CareerOS Pro</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards: Companies */}
        {audience === 'company' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Employer Free Tier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Community Employer
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-500">/ forever free</span>
                </div>
                <p className="text-xs text-slate-400">
                  Post initial openings and test inbound candidate applications.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {[
                    'Up to 2 active job listings',
                    'Standard company directory page',
                    'Basic applicant pipeline view',
                    'Secure resume downloads via presigned URLs',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('employer_free')}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:text-white transition"
              >
                {user?.role === 'company' ? 'Current Free Tier' : 'Register Company'}
              </button>
            </div>

            {/* Employer Starter Tier */}
            <div className="rounded-2xl border-2 border-blue-500/60 bg-gradient-to-b from-slate-900 to-blue-950/20 p-6 flex flex-col justify-between space-y-6 relative shadow-xl">
              <div className="absolute -top-3 right-5 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-black uppercase text-white">
                Best for Startups
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Verified Starter
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    ${billingCycle === 'annual' ? '949' : '99'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {billingCycle === 'annual' ? '/ year ($79/mo)' : '/ month'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Verified employer presence with extended posting volume and applicant management.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {[
                    'Up to 10 active job listings',
                    'Official Verified Employer Shield Badge',
                    'Automated career-page ingestion sync priority',
                    'Full applicant pipeline Kanban management',
                    'Hiring analytics & view counter telemetry',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white">
                      <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('employer_starter')}
                disabled={isLoading === 'employer_starter'}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
              >
                {isLoading === 'employer_starter' ? 'Connecting...' : 'Choose Verified Starter'}
              </button>
            </div>

            {/* Employer Growth Tier */}
            <div className="rounded-2xl border-2 border-cyan-500 bg-gradient-to-b from-slate-900 to-cyan-950/30 p-6 flex flex-col justify-between space-y-6 relative shadow-2xl">
              <div className="absolute -top-3 right-5 rounded-full bg-cyan-500 px-3 py-0.5 text-[10px] font-black uppercase text-slate-950">
                Scale Hiring
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Talent Growth
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    ${billingCycle === 'annual' ? '2870' : '299'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {billingCycle === 'annual' ? '/ year ($239/mo)' : '/ month'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Unlimited jobs, talent match discovery, and top-of-feed featured placements.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  {[
                    'Unlimited active job postings',
                    'Featured top-of-feed listing placement',
                    'Official Verified Employer Shield Badge',
                    'Candidate talent match recommendations',
                    'Full CSV applicant & funnel data export',
                    'Dedicated crawler monitoring SLA',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('employer_growth')}
                disabled={isLoading === 'employer_growth'}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
              >
                {isLoading === 'employer_growth' ? 'Connecting...' : 'Choose Talent Growth'}
              </button>
            </div>
          </div>
        )}

        {/* Feature Comparison Matrix */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Detailed Capability Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Feature Dimension</th>
                  <th className="py-3 px-4">Candidate Free</th>
                  <th className="py-3 px-4 text-cyan-400 font-bold">Candidate Pro</th>
                  <th className="py-3 px-4">Employer Starter</th>
                  <th className="py-3 px-4 text-cyan-400 font-bold">Employer Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">7-Day Interview Roadmaps</td>
                  <td className="py-3 px-4">2 per week</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">Unlimited</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">ATS Resume Diagnostics</td>
                  <td className="py-3 px-4">Standard</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">Deep Semantic Analysis</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Active Job Postings</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4">Up to 10</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Verified Employer Badge</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">Included</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Top-of-Feed Placement</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 text-slate-500">—</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">Priority Featured</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Everything you need to know about plans, security, and billing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left text-xs font-bold text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed border-t border-slate-800/80 pt-2.5">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

