'use client';

/**
 * Dashboard Page — /
 * Shows recruitment overview metrics, pipeline chart, and recent candidates.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, Star, Calendar, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from './components/StatCard';
import ScoreBadge from './components/ScoreBadge';
import { api } from './services/api';

function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  try { return JSON.parse(skills); } catch { return []; }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [dashData, cands] = await Promise.all([
          api.getDashboard(),
          api.getCandidates(),
        ]);
        setMetrics(dashData.metrics);
        setPipeline(dashData.pipeline_stages || []);
        setCandidates(Array.isArray(cands) ? cands.slice(0, 6) : []);
      } catch (err) {
        setError('Could not connect to backend. Make sure Flask is running on port 5000.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recruiter Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered recruitment overview
          </p>
        </div>
        <Link
          href="/candidates/upload"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Upload Resume
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Total Candidates"
          value={metrics?.total_candidates ?? 0}
          color="indigo"
        />
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={metrics?.active_jobs ?? 0}
          color="blue"
        />
        <StatCard
          icon={Star}
          label="Avg AI Score"
          value={metrics?.avg_candidate_score ?? '—'}
          subtitle="Out of 100"
          color="green"
        />
        <StatCard
          icon={Calendar}
          label="Interviews Scheduled"
          value={metrics?.scheduled_interviews ?? 0}
          color="yellow"
        />
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-base font-semibold text-slate-800 mb-6">
          Recruitment Pipeline
        </h2>
        {pipeline.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipeline} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-12">No pipeline data yet</p>
        )}
      </div>

      {/* Recent Candidates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 className="text-base font-semibold text-slate-800">Recent Candidates</h2>
          <Link
            href="/candidates"
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
          >
            View All →
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No candidates yet.</p>
            <Link
              href="/candidates/upload"
              className="mt-3 inline-block text-indigo-600 text-sm font-medium hover:underline"
            >
              Upload your first resume →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Skills</th>
                <th className="px-6 py-3">AI Score</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map((c) => {
                const skills = parseSkills(c.skills);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-indigo-600">
                            {(c.name || 'C').charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {c.name || '—'}
                          </p>
                          <p className="text-xs text-gray-400">{c.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                        {skills.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={c.score} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {c.status || 'Applied'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/candidates/${c.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
