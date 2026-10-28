'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Building2,
  Briefcase,
  Globe,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If auth is loaded and user is not company or admin, redirect or show message
  React.useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'company' && user.role !== 'admin'))) {
      router.push('/login?redirect=/company');
    }
  }, [user, isLoading, router]);

  const navItems = [
    { label: 'Overview', href: '/company', icon: LayoutDashboard },
    { label: 'Manage Jobs', href: '/company/jobs', icon: Briefcase },
    { label: 'Career Source', href: '/company/source', icon: Globe },
    { label: 'Applicant Pipeline', href: '/company/applicants', icon: Users },
    { label: 'Company Profile', href: '/company/profile', icon: Building2 },
    { label: 'Hiring Analytics', href: '/company/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/company/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-800 bg-[#0B1220]/95 backdrop-blur shrink-0">
        {/* Workspace Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/company" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white shadow-md">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white">Employer OS</span>
              <span className="text-[10px] text-cyan-400 font-mono">WORKSPACE</span>
            </div>
          </Link>
        </div>

        {/* Action Button */}
        <div className="p-4 border-b border-slate-800/80">
          <Link
            href="/company/jobs?action=new"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-cyan-400 border border-blue-500/20 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                {user?.email?.charAt(0).toUpperCase() || 'E'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Employer Account'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile & Desktop */}
        <header className="h-16 border-b border-slate-800 bg-[#0B1220]/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Portal</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white font-medium capitalize">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              target="_blank"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline"
            >
              View Public Listings &rarr;
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              Employer Session
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-900/95 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    isActive ? 'bg-blue-600/10 text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">{user?.email}</span>
              <button onClick={() => logout()} className="text-rose-400 font-semibold">Sign Out</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
