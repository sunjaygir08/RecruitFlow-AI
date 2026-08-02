'use client';

import { useEffect, useState } from 'react';
import { Server } from 'lucide-react';
import { api } from '../services/api';

function StatusBadge({ ok }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      {ok ? 'Connected' : 'Not configured'}
    </span>
  );
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then((data) => {
      setIntegrations(data.integrations || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="spinner" /></div>;

  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Settings & Integrations</h1>
      <p className="text-sm text-gray-500 mb-6">Status of external integrations used by RecruitFlow AI</p>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Google Gemini</p>
              <p className="text-xs text-gray-400">AI model for parsing, scoring and matching</p>
            </div>
            <StatusBadge ok={integrations?.gemini} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Supabase</p>
              <p className="text-xs text-gray-400">Primary PostgreSQL database</p>
            </div>
            <StatusBadge ok={integrations?.supabase} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Google Calendar</p>
              <p className="text-xs text-gray-400">Interview scheduling integration</p>
            </div>
            <StatusBadge ok={integrations?.google_calendar} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Resend Email</p>
              <p className="text-xs text-gray-400">Transactional email provider</p>
            </div>
            <StatusBadge ok={integrations?.resend} />
          </div>

          <div className="flex items-center justify-between md:col-span-2">
            <div>
              <p className="text-sm font-medium text-slate-700">n8n Workflows (local)</p>
              <p className="text-xs text-gray-400">Repository contains workflow definitions</p>
            </div>
            <StatusBadge ok={integrations?.n8n_workflows_present} />
          </div>
        </div>
      </div>
    </div>
  );
}
