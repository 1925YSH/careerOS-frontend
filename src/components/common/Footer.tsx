import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#CBD5E1] bg-white text-[#0B1220] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#0B1220]">
                Career<span className="text-[#06B6D4]">OS</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-600 max-w-sm">
              The autonomous AI career operating system. Discover opportunities automatically, understand your exact fit, and turn job descriptions into actionable 7-day preparation workflows.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              Ingestion engine active & monitoring
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/jobs" className="hover:text-[#2563EB] transition-colors">
                  Job Discovery
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#2563EB] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#ai-matching" className="hover:text-[#2563EB] transition-colors">
                  AI Fit Scoring
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#ingestion" className="hover:text-[#2563EB] transition-colors">
                  Source Ingestion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Candidates */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Candidates</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/app/jobs" className="hover:text-[#2563EB] transition-colors">
                  Personalized Feed
                </Link>
              </li>
              <li>
                <Link href="/app/resume" className="hover:text-[#2563EB] transition-colors">
                  Resume Intelligence
                </Link>
              </li>
              <li>
                <Link href="/app/career-agent" className="hover:text-[#2563EB] transition-colors">
                  Career Agent
                </Link>
              </li>
              <li>
                <Link href="/app/applications" className="hover:text-[#2563EB] transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Companies & Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Companies</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/for-companies" className="hover:text-[#2563EB] transition-colors">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-[#2563EB] transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#2563EB] transition-colors">
                  Hiring Insights
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#2563EB] transition-colors">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI CareerOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-800 transition">
              Privacy Notice
            </Link>
            <Link href="/terms" className="hover:text-slate-800 transition">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-slate-800 transition">
              Security Architecture
            </Link>
            <Link href="/contact" className="hover:text-slate-800 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

