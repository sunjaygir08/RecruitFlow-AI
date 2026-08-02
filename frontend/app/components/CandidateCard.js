/**
 * CandidateCard — Summary card for candidate list page.
 * Shows name, email, skills tags, score, and status.
 */

import Link from 'next/link';
import ScoreBadge from './ScoreBadge';

// Parse skills that might come as array or JSON string
function parseSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  try { return JSON.parse(skills); } catch { return []; }
}

// Status → color mapping
const statusColor = {
  'Applied':             'bg-gray-100 text-gray-600',
  'AI Scored':           'bg-indigo-100 text-indigo-600',
  'Matched':             'bg-blue-100 text-blue-600',
  'Shortlisted':         'bg-purple-100 text-purple-600',
  'Interview Scheduled': 'bg-green-100 text-green-600',
  'Rejected':            'bg-red-100 text-red-600',
};

export default function CandidateCard({ candidate }) {
  const skills = parseSkills(candidate.skills);
  const visibleSkills = skills.slice(0, 3);
  const extraCount = skills.length - visibleSkills.length;
  const statusClass = statusColor[candidate.status] || 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-indigo-600">
              {(candidate.name || 'C').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">
              {candidate.name || 'Unnamed Candidate'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{candidate.email || '—'}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass}`}>
          {candidate.status || 'Applied'}
        </span>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        {candidate.experience_years > 0 && (
          <span>{candidate.experience_years} yrs exp</span>
        )}
        {candidate.location && <span>· {candidate.location}</span>}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
            >
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs text-gray-400">+{extraCount} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <ScoreBadge score={candidate.score} />
        <Link
          href={`/candidates/${candidate.id}`}
          className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
