'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldAlert,
  Activity,
  Layers,
  Database,
  CheckSquare,
  Users,
  Building2,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'admin') {
        router.push('/403');
      }
    }
  }, [user, isLoading, router]);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: Activity },
    { label: 'Source Registry', href: '/admin/sources', icon: Database },
    { label: 'Ingestion Pipeline', href: '/admin/ingestion', icon: Layers },
    { label: 'Job Moderation', href: '/admin/jobs', icon: CheckSquare },
    { label: 'Companies', href: '/admin/companies', icon: Building2 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Audit Logs', href: '/admin/audit', icon: FileSpreadsheet },
  ];

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-800 bg-[#0B1220]/95 backdrop-blur shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                AI CareerOS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Governance & Ops
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-amber-400" />}
              </Link>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">
              {user.email.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.email}</div>
              <div className="text-[10px] text-amber-400 font-mono">Platform Admin</div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-slate-800 bg-[#0B1220] flex items-center justify-between px-4 sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm text-white">AI CareerOS Admin</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/80"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-[#0B1220] border-r border-slate-800 p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-sm text-white">Admin Console</span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Body Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

