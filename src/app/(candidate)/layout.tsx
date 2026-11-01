'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  Briefcase,
  FileText,
  Bookmark,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  CheckSquare,
} from 'lucide-react';

interface CandidateLayoutProps {
  children: React.ReactNode;
}

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'candidate')) {
      router.push('/login?redirect=/app');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadUnreadCount() {
      if (user && user.role === 'candidate') {
        try {
          const res = await apiClient<{ unreadCount: number }>('/notifications/unread-count');
          setUnreadCount(res.unreadCount || 0);
        } catch {
          // Graceful fallback
        }
      }
    }
    loadUnreadCount();
  }, [user, pathname]);

  const navItems = [
    { label: 'Overview', href: '/app', icon: LayoutDashboard },
    { label: 'AI Career Agent', href: '/app/career-agent', icon: Sparkles },
    { label: 'Career Tasks', href: '/app/tasks', icon: CheckSquare },
    { label: 'Notifications', href: '/app/notifications', icon: Bell, badge: unreadCount },
    { label: 'Jobs for You', href: '/app/jobs', icon: Compass },
    { label: 'Applications', href: '/app/applications', icon: Briefcase },
    { label: 'Resume Center', href: '/app/resume', icon: FileText },
    { label: 'Saved Roles', href: '/app/saved', icon: Bookmark },
    { label: 'Career Profile', href: '/app/profile', icon: User },
    { label: 'Settings', href: '/app/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-800 bg-[#0B1220]/95 backdrop-blur shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/app" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white">CareerOS</span>
              <span className="text-[10px] text-cyan-400 font-mono">CANDIDATE</span>
            </div>
          </Link>
        </div>

        {/* Quick Action */}
        <div className="p-4 border-b border-slate-800/80">
          <Link
            href="/app/resume"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all"
          >
            <FileText className="h-4 w-4" />
            Upload New Resume
          </Link>
        </div>

        {/* Nav Links */}
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
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto rounded-full bg-cyan-500/20 border border-cyan-500/30 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Plan Status Banner */}
        <div className="p-3 mx-3 mb-2 rounded-xl border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              {user?.subscription?.plan === 'pro' ? 'CareerOS Pro' : 'Free Tier'}
            </span>
            <Link
              href="/pricing"
              className="text-[10px] font-bold text-cyan-400 hover:underline"
            >
              {user?.subscription?.plan === 'pro' ? 'Plan' : 'Upgrade'} &rarr;
            </Link>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                {user?.email?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || user?.email?.split('@')[0] || 'Candidate'}
                </p>
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
        {/* Top Header */}
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
                {pathname.split('/')[2] || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/notifications"
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-pulse" />
              )}
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <Link
              href="/jobs"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline"
            >
              Browse Public Board &rarr;
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 px-2.5 py-1 text-[11px] font-semibold text-cyan-400">
              <Sparkles className="h-3 w-3" />
              AI Fit Active
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

