'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react';

interface UserItem {
  _id: string;
  email: string;
  role: 'candidate' | 'company' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await apiClient<{ users: UserItem[] }>('/admin/users');
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserItem) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await apiClient(`/admin/users/${user._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchUsers();
    } catch (err: any) {
      alert(`Error updating user status: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    return u.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Identity & Access Management
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            User Accounts & Security
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage authenticated platform users, enforce role privileges, and handle account suspensions.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading user registry...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Account Email</th>
                  <th className="px-6 py-3">Role Privilege</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((user) => {
                  const roleBadges = {
                    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    company: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    candidate: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                  };

                  return (
                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-white">{user.email}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold border ${
                            roleBadges[user.role]
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                              user.status === 'active'
                                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60'
                                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend Access' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

