'use client';

/**
 * Candidate Detail Page — /candidates/[id]
 * Shows full candidate profile, AI scoring, and interview scheduling.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Mail, Phone,
  Globe, Building2, GraduationCap, Briefcase, Calendar,
  CheckCircle, AlertCircle, Minus
} from 'lucide-react';
import ScoreBadge from '../../components/ScoreBadge';
import { api } from '../../services/api';

function parseJSON(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [candidate, setCandidate] = useState(null);
  const [aiScore, setAiScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ job_id: '', date: '', time: '' });
  const [jobs, setJobs] = useState([]);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getCandidate(id), api.getJobs()]).then(([cand, jobList]) => {
      setCandidate(cand);
      setJobs(Array.isArray(jobList) ? jobList : []);
      setLoading(false);
    }).catch(() => { setError('Candidate not found'); setLoading(false); });
  }, [id]);

  const handleScore = async () => {
    setScoring(true);
    try {
      const data = await api.scoreCandidate(id);
      setAiScore(data);
      setCandidate(prev => ({ ...prev, score: data.score, status: 'AI Scored' }));
    } catch (err) {
      setError('Scoring failed: ' + err.message);
    } finally {
      setScoring(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForm.date || !scheduleForm.time) {
      setError('Please select a date and time.');
      return;
    }
    setScheduling(true);
    setError('');
    try {
      const result = await api.scheduleInterview({
        candidate_id: id,
        job_id: scheduleForm.job_id || null,
        date: scheduleForm.date,
        time: scheduleForm.time,
      });
      setScheduleResult(result);
    } catch (err) {
      setError('Scheduling failed: ' + err.message);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="spinner" /></div>;
  if (!candidate && error) return (
    <div className="p-8">
      <Link href="/candidates" className="text-indigo-600 text-sm hover:underline">← Back</Link>
      <p className="mt-8 text-red-600">{error}</p>
    </div>
  );

  const skills = parseJSON(candidate.skills);
  const education = parseJSON(candidate.education);
  const companies = parseJSON(candidate.companies);
  const certifications = parseJSON(candidate.certifications);

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      {/* Back */}
      <Link href="/candidates" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Candidates
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-indigo-600">
                {(candidate.name || 'C').charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{candidate.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {candidate.email && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail size={13} /> {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone size={13} /> {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={13} /> {candidate.location}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                    <Globe size={12} /> LinkedIn
                  </a>
                )}
                {candidate.portfolio && (
                  <a href={candidate.portfolio} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                    <Globe size={12} /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ScoreBadge score={candidate.score} />
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
              {candidate.status || 'Applied'}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{candidate.experience_years || 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{skills.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Skills</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{companies.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Companies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-500" /> Education
              </h2>
              <div className="space-y-3">
                {education.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{e.degree || e}</p>
                      {e.institution && <p className="text-xs text-gray-400">{e.institution}</p>}
                      {e.year && <p className="text-xs text-gray-400">{e.year}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 size={16} className="text-indigo-500" /> Previous Companies
              </h2>
              <div className="space-y-2">
                {companies.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase size={14} className="text-gray-300" /> {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Certifications</h2>
              <div className="space-y-2">
                {certifications.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle size={14} className="text-green-400" /> {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI Scoring Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Star size={16} className="text-amber-500" /> AI Evaluation
            </h2>

            {!aiScore && !candidate.score && (
              <p className="text-xs text-gray-400 mb-4">
                Run Gemini AI scoring to get a detailed candidate evaluation.
              </p>
            )}

            <button
              onClick={handleScore}
              disabled={scoring}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors mb-4"
            >
              {scoring ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Scoring...</>
              ) : (
                <><Star size={15} />Score with Gemini AI</>
              )}
            </button>

            {/* Score results */}
            {aiScore && (
              <div className="space-y-4 mt-2 animate-fade-in">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <p className="text-4xl font-bold text-indigo-600">{aiScore.score}</p>
                  <p className="text-sm text-indigo-500 mt-1">{aiScore.category}</p>
                </div>
                {aiScore.reasoning && (
                  <p className="text-xs text-gray-500 leading-relaxed">{aiScore.reasoning}</p>
                )}
                {aiScore.strengths?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">✅ Strengths</p>
                    <ul className="space-y-1">
                      {aiScore.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiScore.weaknesses?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1">⚠️ Weaknesses</p>
                    <ul className="space-y-1">
                      {aiScore.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-gray-600">• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiScore.skill_gaps?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 mb-1">📌 Skill Gaps</p>
                    <div className="flex flex-wrap gap-1">
                      {aiScore.skill_gaps.map((g, i) => (
                        <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Interview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" /> Schedule Interview
            </h2>

            {scheduleResult ? (
              <div className="text-center py-4 animate-fade-in">
                <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">Interview Scheduled!</p>
                {scheduleResult.calendar_link && (
                  <a href={scheduleResult.calendar_link} target="_blank" rel="noreferrer"
                    className="mt-2 inline-block text-xs text-indigo-600 hover:underline">
                    Add to Google Calendar →
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSchedule} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Job (optional)</label>
                  <select
                    value={scheduleForm.job_id}
                    onChange={e => setScheduleForm(f => ({ ...f, job_id: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a job...</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  {scheduling ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Scheduling...</>
                  ) : (
                    <><Calendar size={15} />Schedule & Send Email</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
