'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Compass,
  Clock,
  Briefcase,
  Shield,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Check,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface NotificationItem {
  _id: string;
  type: 'job_match' | 'task_reminder' | 'application_update' | 'system_alert';
  title: string;
  body: string;
  link?: string;
  readAt?: string | null;
  createdAt: string;
}

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tabFilter, setTabFilter] = useState<'all' | 'unread' | 'job_match' | 'task_reminder' | 'system_alert'>('all');

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{
        notifications: NotificationItem[];
        unreadCount: number;
      }>('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notifId: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === notifId ? { ...n, readAt: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await apiClient(`/notifications/${notifId}/read`, {
        method: 'PATCH',
      });
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      await apiClient('/notifications/read-all', {
        method: 'POST',
      });
    } catch {
      fetchNotifications();
    }
  };

  const handleSeedSamples = async () => {
    try {
      await apiClient('/notifications/test-seed', {
        method: 'POST',
      });
      fetchNotifications();
    } catch (err) {
      console.error('Seed error', err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (tabFilter === 'unread') return !item.readAt;
      if (tabFilter !== 'all') return item.type === tabFilter;
      return true;
    });
  }, [notifications, tabFilter]);

  const getTypeVisuals = (type: NotificationItem['type']) => {
    switch (type) {
      case 'job_match':
        return {
          icon: <Compass className="h-4 w-4 text-cyan-400" />,
          bg: 'bg-cyan-950/60 border-cyan-800/60',
          label: 'Job Match',
        };
      case 'task_reminder':
        return {
          icon: <Clock className="h-4 w-4 text-amber-400" />,
          bg: 'bg-amber-950/60 border-amber-800/60',
          label: 'Sprint Task',
        };
      case 'application_update':
        return {
          icon: <Briefcase className="h-4 w-4 text-emerald-400" />,
          bg: 'bg-emerald-950/60 border-emerald-800/60',
          label: 'Application',
        };
      case 'system_alert':
        return {
          icon: <Shield className="h-4 w-4 text-indigo-400" />,
          bg: 'bg-indigo-950/60 border-indigo-800/60',
          label: 'System Alert',
        };
      default:
        return {
          icon: <Bell className="h-4 w-4 text-slate-400" />,
          bg: 'bg-slate-800 border-slate-700',
          label: 'Notice',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
            <Bell className="h-3.5 w-3.5" />
            Communication Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notifications & Timely Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time match recommendations, 7-day interview milestone reminders, and platform status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 transition"
            >
              <CheckCheck className="h-4 w-4 text-cyan-400" />
              Mark All as Read
            </button>
          )}

          {notifications.length === 0 && !isLoading && (
            <button
              onClick={handleSeedSamples}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              Load Sample Alerts
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Notifications', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'job_match', label: 'Job Matches' },
          { id: 'task_reminder', label: 'Sprint Tasks' },
          { id: 'system_alert', label: 'System Alerts' },
        ].map((tab) => {
          const isActive = tabFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const visual = getTypeVisuals(notif.type);
            const isRead = !!notif.readAt;

            return (
              <div
                key={notif._id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isRead
                    ? 'border-slate-800/80 bg-slate-950/40 text-slate-400'
                    : 'border-slate-700 bg-slate-900/70 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${visual.bg}`}>
                    {visual.icon}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {notif.title}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {visual.label}
                      </span>
                      {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {notif.body}
                    </p>

                    <p className="text-[10px] text-slate-500 pt-0.5">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
                    >
                      Mark Read
                    </button>
                  )}

                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-[11px] font-bold text-cyan-400 hover:bg-blue-600/30 transition"
                    >
                      Open Action &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-4">
          <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Your notifications inbox is clear</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You're all caught up! New job match recommendations, roadmap task deadlines, and application pipeline updates will appear here.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSeedSamples}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Seed Demo Notification Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

