'use client';

/**
 * Jobs List Page — /jobs
 * Shows all job postings. Allows creating a new job via a modal form.
 */

import { useEffect, useState } from 'react';
import { Briefcase, Plus, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '../services/api';

function parseSkills(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
}

const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-500',
  Draft:  'bg-amber-100 text-amber-700',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    required_skills: '',
    experience_required: '',
    education_required: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getJobs().then(data => {
      setJobs(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const newJob = await api.createJob({
        ...form,
        required_skills: form.required_skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      });
      setJobs(prev => [newJob, ...prev]);
      setSuccess(`Job "${newJob.title}" created!`);
      setForm({ title: '', description: '', required_skills: '', experience_required: '', education_required: '' });
      setTimeout(() => { setShowModal(false); setSuccess(''); }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Postings</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} active positions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Job
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="flex justify-center py-16"><div className="spinner" /></div>}

      {/* Empty */}
      {!loading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No jobs posted yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-indigo-600 text-sm font-medium hover:underline">
            Create your first job →
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map(job => {
            const skills = parseSkills(job.required_skills);
            const statusClass = STATUS_COLORS[job.status] || STATUS_COLORS.Active;
            return (
              <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <Briefcase size={18} className="text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{job.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {job.experience_required && `${job.experience_required} experience`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusClass}`}>
                    {job.status || 'Active'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {job.description || 'No description provided.'}
                </p>

                {/* Required skills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skills.slice(0, 4).map(s => (
                      <span key={s} className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">{s}</span>
                    ))}
                    {skills.length > 4 && <span className="text-xs text-gray-400">+{skills.length - 4}</span>}
                  </div>
                )}

                {/* Education required */}
                {job.education_required && (
                  <p className="text-xs text-gray-400 mb-4">📚 {job.education_required}</p>
                )}

                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}
                  </p>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  >
                    Match Candidates →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-slate-800">Create Job Posting</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  <CheckCircle size={16} /> {success}
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Required Skills <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="Python, React, PostgreSQL, AWS..."
                  value={form.required_skills}
                  onChange={e => setForm(f => ({ ...f, required_skills: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ years"
                    value={form.experience_required}
                    onChange={e => setForm(f => ({ ...f, experience_required: e.target.value }))}
                    className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education Required</label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor Degree"
                    value={form.education_required}
                    onChange={e => setForm(f => ({ ...f, education_required: e.target.value }))}
                    className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  {saving ? 'Creating...' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 border border-gray-200 text-slate-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
