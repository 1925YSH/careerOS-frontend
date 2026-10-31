'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Square,
  Plus,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  Zap,
  Sparkles,
  Trash2,
  CheckCircle2,
  X,
  Search,
  ChevronRight,
  Briefcase,
  BookOpen,
  FileText,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Task {
  _id: string;
  title: string;
  type: 'interview_prep' | 'resume_update' | 'skill_learning' | 'application_followup' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueAt?: string;
  createdByAgent: boolean;
  payload?: {
    description?: string;
    jobId?: string;
    targetRole?: string;
  };
  createdAt: string;
}

export default function CandidateTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Task['type']>('general');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{ count: number; tasks: Task[] }>('/agent/tasks');
      setTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
    );

    try {
      await apiClient(`/agent/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: currentStatus as any } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to remove this task?')) return;

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await apiClient(`/agent/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch {
      fetchTasks();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await apiClient<{ task: Task }>('/agent/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          priority: newPriority,
          dueAt: newDueDate ? new Date(newDueDate).toISOString() : undefined,
          description: newDescription.trim() || undefined,
        }),
      });

      if (res.task) {
        setTasks((prev) => [res.task, ...prev]);
      }
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setNewType('general');
      setNewPriority('medium');
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // KPIs
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status === 'pending').length;

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'pending' && task.status === 'completed') return false;
      if (statusFilter === 'completed' && task.status !== 'completed') return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Type filter
      if (typeFilter !== 'all' && task.type !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.payload?.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, typeFilter, searchQuery]);

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'interview_prep':
        return <Zap className="h-3.5 w-3.5 text-cyan-400" />;
      case 'skill_learning':
        return <BookOpen className="h-3.5 w-3.5 text-emerald-400" />;
      case 'resume_update':
        return <FileText className="h-3.5 w-3.5 text-blue-400" />;
      case 'application_followup':
        return <Briefcase className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <CheckSquare className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      case 'high':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'medium':
        return 'bg-blue-950/80 text-cyan-400 border-blue-800/80';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
            <Zap className="h-3.5 w-3.5" />
            Candidate Action Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Career Tasks & Sprint Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn autonomous AI interview roadmaps and skill gap recommendations into scheduled actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/career-agent"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:text-white transition"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Generate 7-Day Sprint in Agent
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-black text-white mt-1">{totalTasks}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">In backlog queue</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-black text-amber-300 mt-1">{pendingTasks}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting completion</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Urgent Milestones</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{urgentTasks}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Immediate priority</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">{completedTasks}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Milestones achieved</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/60 border border-slate-800 w-fit">
          {(['all', 'pending', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st} {st === 'pending' ? `(${pendingTasks})` : st === 'completed' ? `(${completedTasks})` : `(${totalTasks})`}
            </button>
          ))}
        </div>

        {/* Dropdowns & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="interview_prep">Interview Prep</option>
            <option value="skill_learning">Skill Upskilling</option>
            <option value="resume_update">Resume Update</option>
            <option value="application_followup">Application Follow-up</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isUrgent = task.priority === 'urgent';
            return (
              <div
                key={task._id}
                className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-900/30 bg-emerald-950/10 text-slate-500'
                    : isUrgent
                    ? 'border-rose-900/50 bg-rose-950/20 text-slate-200'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleTask(task._id, task.status)}
                    className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition"
                    title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-500 hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold tracking-tight ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {getTypeIcon(task.type)}
                        <span className="capitalize">{task.type.replace('_', ' ')}</span>
                      </span>

                      {task.createdByAgent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                          <Sparkles className="h-2.5 w-2.5" /> AI Sprint
                        </span>
                      )}
                    </div>

                    {task.payload?.description && (
                      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                        {task.payload.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      {task.dueAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(task.dueAt).toLocaleDateString()}
                        </span>
                      )}
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    title="Remove Task"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-4">
          <Zap className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No tasks match your current filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Generate an automated 7-day interview milestone roadmap for any role in the Career Agent, or add manual prep tasks.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/app/career-agent"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
            >
              <Sparkles className="h-4 w-4" /> Open AI Career Agent
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Add Manual Task
            </button>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add Career Action Task</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master distributed cache invalidation strategies"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="interview_prep">Interview Prep</option>
                    <option value="skill_learning">Skill Upskilling</option>
                    <option value="resume_update">Resume Update</option>
                    <option value="application_followup">Application Follow-up</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Reference links, architectural topics, or specific deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

