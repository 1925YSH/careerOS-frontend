'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  X, 
  Briefcase, 
  MapPin, 
  DollarSign 
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [targetRolesInput, setTargetRolesInput] = useState('');
  const [skills, setSkills] = useState<{ name: string; proficiency: string; yearsOfExperience: number }[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('intermediate');
  const [minSalary, setMinSalary] = useState<number>(120000);
  const [preferredMode, setPreferredMode] = useState<string>('remote');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/candidate/profile');
      if (res.data.profile) {
        const p = res.data.profile;
        setProfile(p);
        setName(p.name || '');
        setHeadline(p.headline || '');
        setLocation(p.location || '');
        setTargetRolesInput((p.targetRoles || []).join(', '));
        setSkills(p.skills || []);
        if (p.preferences?.minSalary) setMinSalary(p.preferences.minSalary);
        if (p.preferences?.workMode?.[0]) setPreferredMode(p.preferences.workMode[0]);
      }
    } catch (err: any) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }

    setSkills([
      ...skills,
      {
        name: newSkillName.trim().toLowerCase(),
        proficiency: newSkillProf,
        yearsOfExperience: 3,
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    setSkills(skills.filter((s) => s.name !== skillNameToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const targetRolesArray = targetRolesInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await apiClient.put('/candidate/profile', {
        name,
        headline,
        location,
        targetRoles: targetRolesArray,
        skills,
        preferences: {
          minSalary: Number(minSalary),
          workMode: [preferredMode],
        },
      });

      setProfile(res.data.profile);
      setFeedback({
        type: 'success',
        message: 'Career profile updated successfully. Your AI match feed has been refreshed.',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const completeness = profile?.completenessScore || 20;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white">Career Profile & Competencies</h1>
          <span className="rounded-full bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400">
            {completeness}% Complete
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Control the technical signals, compensation thresholds, and work preferences used by our matching engine.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Identity & Target Roles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA or Remote"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Distributed Systems & Cloud Infrastructure Engineer"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Roles (Comma-separated)</label>
            <input
              type="text"
              value={targetRolesInput}
              onChange={(e) => setTargetRolesInput(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, Staff Platform Architect, Lead DevOps"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Technical Skills Manager */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Verified Technical Skills ({skills.length})
            </h2>
            <span className="text-[11px] text-cyan-400 font-medium">Used for AI fit scoring</span>
          </div>

          {/* Add Skill Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add skill (e.g. Go, Kubernetes, Kafka)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={newSkillProf}
              onChange={(e) => setNewSkillProf(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none capitalize"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-1 rounded-lg bg-blue-600/20 border border-blue-500/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-blue-600/30"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Skill Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <span className="font-semibold capitalize">{skill.name}</span>
                <span className="text-[10px] text-cyan-400 capitalize font-mono">({skill.proficiency})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.name)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Work Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Minimum Annual Compensation ($ USD)
              </label>
              <input
                type="number"
                step="5000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Modality</label>
              <select
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none capitalize"
              >
                <option value="remote">Remote First</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

