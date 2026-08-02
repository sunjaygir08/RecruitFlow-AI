'use client';

/**
 * Analytics Page — /analytics
 * Charts showing score distribution, pipeline stages, and candidate status breakdown.
 */

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Build score distribution buckets from candidates array
function buildScoreDistribution(candidates) {
  const buckets = [
    { range: '90-100', label: 'Highly Recommended', count: 0 },
    { range: '75-89', label: 'Recommended', count: 0 },
    { range: '60-74', label: 'Consider', count: 0 },
    { range: '< 60', label: 'Not Recommended', count: 0 },
    { range: 'Unscored', label: 'Unscored', count: 0 },
  ];
  candidates.forEach(c => {
    const s = c.score;
    if (!s) buckets[4].count++;
    else if (s >= 90) buckets[0].count++;
    else if (s >= 75) buckets[1].count++;
    else if (s >= 60) buckets[2].count++;
    else buckets[3].count++;
  });
  return buckets;
}

// Build status breakdown for pie chart
function buildStatusBreakdown(candidates) {
  const map = {};
  candidates.forEach(c => {
    const s = c.status || 'Applied';
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCandidates(), api.getDashboard()]).then(([cands, dash]) => {
      setCandidates(Array.isArray(cands) ? cands : []);
      setPipeline(dash.pipeline_stages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const scoreData = buildScoreDistribution(candidates);
  const statusData = buildStatusBreakdown(candidates);
  const scoredCandidates = candidates.filter(c => c.score > 0);
  const avgScore = scoredCandidates.length
    ? Math.round(scoredCandidates.reduce((sum, c) => sum + c.score, 0) / scoredCandidates.length)
    : 0;

  if (loading) return <div className="flex justify-center py-16"><div className="spinner" /></div>;

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Visual insights across your recruitment pipeline</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-indigo-600">{candidates.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Candidates</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{scoredCandidates.length}</p>
          <p className="text-sm text-gray-500 mt-1">AI Scored</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-amber-600">{avgScore || '—'}</p>
          <p className="text-sm text-gray-500 mt-1">Average Score</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Score Distribution</h2>
          {scoredCandidates.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              No scored candidates yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val, _, { payload }) => [val, payload?.label]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Breakdown Pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Candidate Status Breakdown</h2>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              No candidate data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(val) => <span style={{ fontSize: '12px', color: '#64748b' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-slate-800 mb-6">Recruitment Pipeline Funnel</h2>
        {pipeline.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
            No pipeline data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipeline} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
