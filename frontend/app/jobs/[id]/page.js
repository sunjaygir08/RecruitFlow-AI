'use client';

/**
 * Job Detail + Candidate Matching Page — /jobs/[id]
 * Shows job description and lets recruiter match a candidate using Gemini AI.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Target, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { api } from '../../services/api';

function parseSkills(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [matching, setMatching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getJob(id), api.getCandidates()]).then(([j, cands]) => {
      setJob(j);
      setCandidates(Array.isArray(cands) ? cands : []);
      setLoading(false);
    }).catch(() => { setError('Job not found'); setLoading(false); });
  }, [id]);

  const handleMatch = async () => {
    if (!selectedCandidate) return;
    setMatching(true);
    setMatchResult(null);
    setError('');
    try {
      const result = await api.matchJob(selectedCandidate, id);
      setMatchResult(result);
    } catch (err) {
      setError('Matching failed: ' + err.message);
    } finally {
      setMatching(false);
    }
  };

  const skills = job ? parseSkills(job.required_skills) : [];

  const getMatchColor = (pct) => {
    if (pct >= 85) return 'text-green-600';
    if (pct >= 70) return 'text-indigo-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-500';
  };

  const getMatchBg = (pct) => {
    if (pct >= 85) return 'bg-green-500';
    if (pct >= 70) return 'bg-indigo-500';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-red-400';
  };

  if (loading) return <div className="flex justify-center py-16"><div className="spinner" /></div>;
  if (!job) return (
    <div className="p-8">
      <Link href="/jobs" className="text-indigo-600 text-sm hover:underline">← Back to Jobs</Link>
      <p className="mt-8 text-red-600">{error || 'Job not found'}</p>
    </div>
  );

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Jobs
      </Link>

      {/* Job Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Briefcase size={22} className="text-indigo-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                {job.status || 'Active'}
              </span>
            </div>
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              {job.experience_required && <span>📅 {job.experience_required} experience</span>}
              {job.education_required && <span>🎓 {job.education_required}</span>}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Candidate Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
          <Target size={16} className="text-indigo-500" /> Match a Candidate with AI
        </h2>

        <div className="flex gap-3 mb-6">
          <select
            value={selectedCandidate}
            onChange={e => { setSelectedCandidate(e.target.value); setMatchResult(null); }}
            className="flex-1 text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a candidate to match...</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.email ? `(${c.email})` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={handleMatch}
            disabled={!selectedCandidate || matching}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {matching ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Matching...</>
            ) : (
              <><Target size={15} />Match with Gemini</>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{error}</div>
        )}

        {/* Match Result */}
        {matchResult && (
          <div className="animate-fade-in space-y-6">
            {/* Score bar */}
            <div className="p-5 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Match Score</p>
                <p className={`text-3xl font-bold ${getMatchColor(matchResult.match_percentage)}`}>
                  {matchResult.match_percentage}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${getMatchBg(matchResult.match_percentage)}`}
                  style={{ width: `${matchResult.match_percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {matchResult.match_percentage >= 85
                  ? '🟢 Strong match — recommend for interview'
                  : matchResult.match_percentage >= 70
                  ? '🔵 Good match — worth considering'
                  : matchResult.match_percentage >= 50
                  ? '🟡 Partial match — has some gaps'
                  : '🔴 Weak match — significant gaps'}
              </p>
            </div>

            {/* Matched + Missing Skills */}
            <div className="grid grid-cols-2 gap-5">
              {matchResult.matched_skills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle size={15} /> Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matched_skills.map(s => (
                      <span key={s} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {matchResult.missing_skills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                    <XCircle size={15} /> Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missing_skills.map(s => (
                      <span key={s} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendation */}
            {matchResult.recommendation && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-500 font-semibold mb-1">AI Recommendation</p>
                <p className="text-sm text-slate-700 leading-relaxed">{matchResult.recommendation}</p>
              </div>
            )}

            {/* Action */}
            {selectedCandidate && (
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/candidates/${selectedCandidate}`}
                  className="text-sm text-indigo-600 font-medium hover:underline"
                >
                  View Full Candidate Profile →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
