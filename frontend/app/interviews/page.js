'use client';

/**
 * Interviews Page — /interviews
 * Lists all scheduled interviews with calendar links and email status.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, Clock, User } from 'lucide-react';
import { api } from '../services/api';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getInterviews()
      .then(data => {
        setInterviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load interviews.');
        setLoading(false);
      });
  }, []);

  const emailStatusColor = {
    sent:       'bg-green-100 text-green-700',
    sent_mock:  'bg-amber-100 text-amber-700',
    Sent:       'bg-green-100 text-green-700',
    failed:     'bg-red-100 text-red-600',
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Interviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          {interviews.length} scheduled interview{interviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading && <div className="flex justify-center py-16"><div className="spinner" /></div>}

      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && interviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No interviews scheduled yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Schedule interviews from a candidate profile page
          </p>
          <Link
            href="/candidates"
            className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
          >
            Go to Candidates →
          </Link>
        </div>
      )}

      {!loading && interviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Email Status</th>
                <th className="px-6 py-4">Calendar</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {interviews.map((interview) => {
                const emailColor = emailStatusColor[interview.email_status] || 'bg-gray-100 text-gray-500';
                return (
                  <tr key={interview.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <User size={14} className="text-indigo-500" />
                        </div>
                        <div>
                          <Link
                            href={`/candidates/${interview.candidate_id}`}
                            className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                          >
                            Candidate #{interview.candidate_id?.slice(-6) || 'N/A'}
                          </Link>
                          {interview.job_id && (
                            <p className="text-xs text-gray-400">Job #{interview.job_id?.slice(-6)}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar size={14} className="text-indigo-400" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <Clock size={12} />
                        <span>{interview.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${emailColor}`}>
                        {interview.email_status || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {interview.calendar_link ? (
                        <a
                          href={interview.calendar_link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <ExternalLink size={13} />
                          Open Calendar
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">No link</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/candidates/${interview.candidate_id}`}
                        className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        View Candidate →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
