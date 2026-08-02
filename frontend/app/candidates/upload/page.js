'use client';

/**
 * Resume Upload Page — /candidates/upload
 * Drag-and-drop or click to upload PDF/DOCX resume.
 * Sends to Flask backend → Gemini parses → shows candidate profile.
 */

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import ScoreBadge from '../../components/ScoreBadge';
import { api } from '../../services/api';

function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  try { return JSON.parse(skills); } catch { return []; }
}

export default function UploadResumePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null); // parsed candidate data
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ext = f.name.split('.').pop().toLowerCase();
    if (!allowed.includes(f.type) && !['pdf', 'docx'].includes(ext)) {
      setError('Only PDF and DOCX files are supported.');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await api.uploadResume(file);
      if (res.status === 'success') {
        setResult(res.data);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Make sure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const skills = result ? parseSkills(result.skills) : [];

  return (
    <div className="p-8 animate-fade-in max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/candidates"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Candidates
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">Upload Resume</h1>
      <p className="text-sm text-gray-500 mb-8">
        Upload a PDF or DOCX resume. Gemini AI will parse and extract the candidate
        profile automatically.
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <Upload
          size={36}
          className={`mx-auto mb-3 ${dragOver ? 'text-indigo-500' : 'text-gray-300'}`}
        />
        <p className="text-sm font-medium text-slate-600">
          Drag & drop a resume here, or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF or DOCX · Max 16 MB</p>
      </div>

      {/* Selected file */}
      {file && !result && (
        <div className="mt-4 flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Parsing with AI...
              </>
            ) : (
              'Parse with Gemini AI'
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <XCircle size={16} />
          {error}
        </div>
      )}

      {/* Parsed Result */}
      {result && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={20} className="text-green-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Candidate Profile Extracted!
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Name + Score */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {(result.name || 'C').charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{result.name}</h3>
                  <p className="text-sm text-gray-500">{result.email}</p>
                </div>
              </div>
              {result.score && <ScoreBadge score={result.score} />}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {result.phone && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Phone</span>
                  <p className="text-slate-700 mt-0.5">{result.phone}</p>
                </div>
              )}
              {result.location && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Location</span>
                  <p className="text-slate-700 mt-0.5">{result.location}</p>
                </div>
              )}
              {result.experience_years > 0 && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Experience</span>
                  <p className="text-slate-700 mt-0.5">{result.experience_years} years</p>
                </div>
              )}
              {result.linkedin && (
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">LinkedIn</span>
                  <a href={result.linkedin} target="_blank" rel="noreferrer"
                    className="text-indigo-600 text-sm hover:underline mt-0.5 block truncate">
                    {result.linkedin}
                  </a>
                </div>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {result.companies?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Previous Companies</p>
                <div className="flex flex-wrap gap-2">
                  {result.companies.map((c) => (
                    <span key={c} className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {result.summary && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Summary</p>
                <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-50">
              <Link
                href={`/candidates/${result.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                View Full Profile
              </Link>
              <button
                onClick={() => { setFile(null); setResult(null); }}
                className="border border-gray-200 text-slate-600 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
