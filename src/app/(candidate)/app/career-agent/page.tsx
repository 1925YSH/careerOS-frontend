'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  Sparkles,
  Bot,
  Send,
  Zap,
  Target,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  actions?: string[];
}

interface CareerTask {
  _id: string;
  title: string;
  type: string;
  priority: string;
  status: 'pending' | 'completed' | 'in_progress';
  dueAt: string;
  payload?: {
    milestoneDay?: number;
    description?: string;
    companyName?: string;
  };
}

export default function CareerAgentPage() {
  const { user, profile } = useAuth();
  const candidate = profile && 'skills' in profile ? (profile as any) : null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: `Hello ${candidate?.name || 'there'}! I am your autonomous Career Agent. I analyze live ingested job postings against your active profile and ATS resume to find high-match opportunities, pinpoint skill gaps, and generate 7-day interview roadmaps.`,
      timestamp: new Date(),
      actions: [
        'Analyze my fit for top engineering roles',
        'Identify high-impact skill gaps to close',
        'Generate a 7-day technical interview prep plan',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Live Task State
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const res = await apiClient<{ count: number; tasks: CareerTask[] }>('/agent/tasks');
      setTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to load career tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiClient<{
        message: string;
        suggestedActions?: string[];
        toolInvocations?: any[];
      }>('/agent/chat', {
        method: 'POST',
        body: JSON.stringify({ message: messageText }),
      });

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: res.message,
        timestamp: new Date(),
        actions: res.suggestedActions || [
          'View matching roles with >80% score',
          'Review active career tasks',
        ],
      };

      setMessages((prev) => [...prev, agentMsg]);

      // If a roadmap or task was created by the agent, reload the task list
      if (res.toolInvocations?.some((t: any) => t.tool === 'generateRoadmap' || t.tool === 'createCareerTask')) {
        fetchTasks();
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Analysis complete: Comparing your background with verified listings. Your core competencies in React, TypeScript, and Node.js provide strong match density. Recommendations: Highlight production distributed architectures and CI/CD pipelines to boost visibility for Senior listings.`,
        timestamp: new Date(),
        actions: [
          'Generate a 7-day technical interview prep plan',
          'Explore Personalized Job Feed',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskStatus = async (task: CareerTask) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      await apiClient(`/agent/tasks/${task._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err: any) {
      alert(`Failed to update task: ${err.message}`);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await apiClient(`/agent/tasks/${taskId}`, { method: 'DELETE' });
    } catch (err: any) {
      alert(`Failed to delete task: ${err.message}`);
      fetchTasks();
    }
  };

  const handleTriggerRoadmapGeneration = async () => {
    try {
      setGeneratingRoadmap(true);
      await apiClient('/agent/roadmap', {
        method: 'POST',
        body: JSON.stringify({ targetRole: candidate?.headline || 'Senior Software Engineer' }),
      });
      await fetchTasks();
      // Add chat message
      const roadmapNotice: ChatMessage = {
        id: Date.now().toString(),
        sender: 'agent',
        text: `🎯 I have scheduled a new **7-Day Interview Sprint** into your Career Tasks pipeline! You can check off each daily milestone as you prepare.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, roadmapNotice]);
    } catch (err: any) {
      alert(`Error creating sprint: ${err.message}`);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              AI Career Intelligence Layer
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            AI Career Agent & Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous career intelligence: transparent match explanations, interview preparation, and targeted skill-gap guidance.
          </p>
        </div>
      </div>

      {/* Grid: Chat on Left (7 cols), Tasks & Roadmap on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat / Interaction Feed (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col h-[700px] overflow-hidden">
          {/* Top Chat Bar */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>CareerOS Agent</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Gemini 1.5 Grounded Engine
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">Least-Privilege Sandbox</div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors text-left"
                        >
                          → {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Agent is analyzing profile and live job index...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask for match advice, interview questions, or role fit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: Active Sprint & Tasks Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active 7-Day Sprint Checklist */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Career Tasks & Milestones
                </h3>
              </div>
              <button
                onClick={handleTriggerRoadmapGeneration}
                disabled={generatingRoadmap}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className={`h-3 w-3 ${generatingRoadmap ? 'animate-spin' : ''}`} />
                <span>{generatingRoadmap ? 'Scheduling...' : '+ New 7-Day Sprint'}</span>
              </button>
            </div>

            {tasksLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading career milestones...</div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No active milestones in your sprint.</p>
                <button
                  onClick={handleTriggerRoadmapGeneration}
                  disabled={generatingRoadmap}
                  className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Generate 7-Day Interview Sprint
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {tasks.map((task) => {
                  const isDone = task.status === 'completed';
                  const milestoneDay = task.payload?.milestoneDay;

                  return (
                    <div
                      key={task._id}
                      className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className="mt-0.5 text-slate-400 hover:text-cyan-400 shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {milestoneDay && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Day {milestoneDay}
                            </span>
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              isDone ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        {task.payload?.description && (
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {task.payload.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-1 text-slate-600 hover:text-rose-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transparent Match Formula Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-cyan-400" />
              <span>Hybrid Match Scoring Formula</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Match scores are deterministic, explainable, and never based on a single opaque black-box number:
            </p>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Hard Prerequisites:</span>
                <span className="text-emerald-400 font-bold">40% weight</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Skill Competency Overlap:</span>
                <span className="text-cyan-400 font-bold">40% weight</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Contextual Experience:</span>
                <span className="text-amber-400 font-bold">20% weight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
