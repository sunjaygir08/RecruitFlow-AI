'use client';

/**
 * Candidates List Page — /candidates
 * Shows all candidates with search and filter by status.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Users } from 'lucide-react';
import CandidateCard from '../components/CandidateCard';
import { api } from '../services/api';

const STATUS_FILTERS = [
  'All',
  'Applied',
  'AI Scored',
  'Matched',
  'Shortlisted',
  'Interview Scheduled',
  'Rejected',
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCandidates().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setCandidates(list);
      setFiltered(list);
      setLoading(false);
    });
  }, []);

  // Apply search + status filter whenever they change
  useEffect(() => {
    let result = candidates;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, candidates]);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {candidates.length} total candidates in the system
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

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No candidates found</p>
          <p className="text-sm text-gray-400 mt-1">
            {search || statusFilter !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Upload a resume to get started'}
          </p>
          {!search && statusFilter === 'All' && (
            <Link
              href="/candidates/upload"
              className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
            >
              Upload first resume →
            </Link>
          )}
        </div>
      )}

      {/* Candidate Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
