'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Sparkles, User, Briefcase, Shield, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'company') return '/company';
    return '/app';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CBD5E1] bg-[#0B1220]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B1220]/80 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Career<span className="text-[#06B6D4]">OS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/jobs" className="hover:text-white transition-colors">
              Find Jobs
            </Link>
            <Link href="/companies" className="hover:text-white transition-colors">
              Companies
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/for-companies" className="hover:text-white transition-colors">
              For Employers
            </Link>
            <Link href="/resources" className="hover:text-white transition-colors">
              Career Hub
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3.5 py-2 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
              >
                {user.role === 'admin' ? (
                  <Shield className="h-4 w-4 text-[#06B6D4]" />
                ) : user.role === 'company' ? (
                  <Briefcase className="h-4 w-4 text-[#2563EB]" />
                ) : (
                  <User className="h-4 w-4 text-[#06B6D4]" />
                )}
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B1220] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Companies
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="/for-companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            For Employers
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-white"
          >
            Career Hub
          </Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

