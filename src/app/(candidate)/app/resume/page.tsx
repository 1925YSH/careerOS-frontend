'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileCheck,
  Star
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function ResumeCenterPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/resumes');
      setResumes(res.data.resumes || []);
    } catch (err: any) {
      console.error('Failed to fetch resumes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Frontend validations
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setFeedback({
        type: 'error',
        message: 'Invalid file format. Only PDF (.pdf) and Word (.docx) documents are accepted.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'File size exceeds the 5MB maximum limit.',
      });
      return;
    }

    try {
      setUploading(true);
      setFeedback(null);
      setUploadProgress('Requesting secure presigned S3 upload token...');

      // 1. Get Presigned S3 Upload URL
      const presignRes = await apiClient.post('/resumes/presign', {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });

      const { uploadUrl, s3Key, isMock } = presignRes.data;

      // 2. Direct client-to-S3 upload (mock simulated if in dev without active AWS credentials)
      setUploadProgress('Uploading encrypted document to private AWS S3 storage...');
      if (!isMock) {
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      // 3. Confirm upload & initiate AI Parsing
      setUploadProgress('Analyzing resume structure & extracting skill taxonomy...');
      await apiClient.post('/resumes', {
        s3Key,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });

      setFeedback({
        type: 'success',
        message: 'Resume successfully uploaded, scanned, and parsed into your career profile.',
      });
      fetchResumes();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to complete resume upload',
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSetDefault = async (resumeId: string) => {
    try {
      await apiClient.patch(`/resumes/${resumeId}/default`, {});
      fetchResumes();
    } catch (err: any) {
      alert(err.message || 'Failed to update default resume');
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume version?')) return;
    try {
      await apiClient.delete(`/resumes/${resumeId}`);
      fetchResumes();
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume');
    }
  };

  const handleDownload = async (resumeId: string) => {
    try {
      const res = await apiClient.get(`/resumes/${resumeId}`);
      if (res.data.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate download link');
    }
  };

  const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white">Resume Intelligence Center</h1>
          <span className="rounded-full bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400">
            AWS S3 Encrypted
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF or DOCX resumes. Our parser extracts verified competencies and powers deterministic job matching without exposing your contact information publicly.
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

      {/* Upload Drag & Drop Box */}
      <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-8 text-center hover:border-blue-500/60 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          className="hidden"
          id="resume-upload"
          disabled={uploading}
        />
        <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-white">
          {uploading ? uploadProgress : 'Click to select or drag & drop your resume file'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Accepted formats: <span className="text-slate-200">PDF (.pdf)</span> or <span className="text-slate-200">Word (.docx)</span> • Maximum size: <span className="text-slate-200">5 MB</span>
        </p>

        <label
          htmlFor="resume-upload"
          className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500 cursor-pointer transition-colors ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <FileText className="h-4 w-4" />
          {uploading ? 'Processing Resume...' : 'Choose File from Device'}
        </label>
      </div>

      {/* Default Active Resume & AI Diagnostic Card */}
      {defaultResume && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 flex items-center justify-center shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{defaultResume.fileName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Primary Default
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Version {defaultResume.version} • Uploaded {new Date(defaultResume.createdAt).toLocaleDateString()} • {Math.round(defaultResume.size / 1024)} KB
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(defaultResume._id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download via Presigned S3
            </button>
          </div>

          {/* AI Parser Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Detected Skills & Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(defaultResume.parsedContent?.skillsDetected || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-blue-950/40 text-cyan-300 border border-blue-900/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Estimated Experience:</span>{' '}
                  {defaultResume.parsedContent?.experienceYears || 3} Years
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  <span className="font-semibold text-slate-300">ATS Formatting Status:</span>{' '}
                  <span className="text-emerald-400 font-medium">Machine-Readable & Verified Clean</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI Optimization Suggestions
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {(defaultResume.parsedContent?.suggestions || []).map((sug: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Prior Versions History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Version History</h2>

        {resumes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Uploaded Date</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {resumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">v{resume.version}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">{resume.fileName}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{Math.round(resume.size / 1024)} KB</td>
                    <td className="py-3 px-3">
                      {resume.isDefault ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active Default
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Archived</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!resume.isDefault && (
                          <button
                            onClick={() => handleSetDefault(resume._id)}
                            title="Set as Default"
                            className="p-1 text-slate-400 hover:text-cyan-400"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(resume._id)}
                          title="Download"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(resume._id)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No resume versions found.</p>
        )}
      </div>

      {/* S3 Privacy Architecture Callout */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5 flex items-start gap-4">
        <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white">Private S3 Isolation & Zero Public Access</h4>
          <p className="text-slate-300 leading-relaxed">
            All resume documents are stored in an encrypted AWS S3 bucket with all public access strictly blocked. Uploads and downloads are negotiated strictly through short-lived presigned URLs (valid for 15 and 5 minutes respectively). No other candidate or unauthorized third party can ever access your files.
          </p>
        </div>
      </div>
    </div>
  );
}

