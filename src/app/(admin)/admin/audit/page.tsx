'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Shield,
  Activity,
  User,
  Clock,
  Terminal,
} from 'lucide-react';

interface AuditLogItem {
  _id: string;
  actorId?: {
    email: string;
    role: string;
  };
  actorRole: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append('action', actionFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);

      const res = await apiClient<{ logs: AuditLogItem[] }>(`/admin/audit-logs?${params.toString()}`);
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, targetTypeFilter]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Security & Compliance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Audit Trail & Event Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable log of administrative operations, security policy changes, and crawler events.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Actions</option>
            <option value="source_create">Source Created</option>
            <option value="source_update">Source Updated</option>
            <option value="source_delete">Source Deleted</option>
            <option value="job_moderate_status">Job Moderated</option>
            <option value="user_status_change">User Status Changed</option>
            <option value="company_status_change">Company Status Changed</option>
          </select>

          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Target Types</option>
            <option value="jobSource">Job Source</option>
            <option value="job">Job Listing</option>
            <option value="user">User Account</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>{logs.length} Audit Events Recorded</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading audit events...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No audit logs recorded for this criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Metadata</th>
                  <th className="px-6 py-3">IP Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-white">{log.actorId?.email || 'System'}</div>
                      <div className="text-[10px] text-amber-400 font-mono uppercase">{log.actorRole}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-amber-400 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-mono text-cyan-400">{log.targetType}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                        {log.targetId || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

