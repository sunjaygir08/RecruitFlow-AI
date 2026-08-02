/**
 * RecruitFlow AI — API Service
 * Uses the public API path by default. If no backend is configured for the
 * frontend-only Vercel deployment, the UI falls back to safe empty states.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/$/, '');
const API_DISABLED =
  process.env.NEXT_PUBLIC_API_DISABLED === 'true' ||
  (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL);

function fallbackPayload(path) {
  const normalizedPath = String(path || '').toLowerCase();

  if (normalizedPath.includes('/dashboard')) {
    return {
      metrics: {
        total_candidates: 0,
        active_jobs: 0,
        avg_candidate_score: '—',
        scheduled_interviews: 0,
      },
      pipeline_stages: [],
    };
  }

  if (normalizedPath.includes('/candidates')) {
    return [];
  }

  if (normalizedPath.includes('/jobs')) {
    return [];
  }

  if (normalizedPath.includes('/interviews')) {
    return [];
  }

  if (normalizedPath.includes('/resume/upload')) {
    return { status: 'disabled', message: 'Resume upload requires a connected backend.' };
  }

  return { status: 'disabled', message: 'Backend is not configured for this frontend-only deployment.' };
}

async function request(path, options = {}) {
  if (API_DISABLED) {
    return fallbackPayload(path);
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    return fallbackPayload(path);
  }
}

export const api = {
  getDashboard: () => request('/dashboard'),

  getCandidates: (query = '') =>
    request(`/candidates${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCandidate: (id) => request(`/candidates/${id}`),

  createCandidate: async (data) => {
    const result = await request('/candidates', { method: 'POST', body: JSON.stringify(data) });
    if (Array.isArray(result)) return result;
    return result && typeof result === 'object' ? result : { id: `local-${Date.now()}`, ...data };
  },

  updateCandidate: async (id, data) => {
    const result = await request(`/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (Array.isArray(result)) return result;
    return result && typeof result === 'object' ? result : { id, ...data };
  },

  uploadResume: async (file) => {
    if (API_DISABLED) {
      return { status: 'disabled', message: 'Resume upload is unavailable until a backend is connected.' };
    }

    const form = new FormData();
    form.append('resume', file);
    try {
      const res = await fetch(`${API_BASE}/resume/upload`, { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      return json;
    } catch (error) {
      return { status: 'disabled', message: 'Resume upload is unavailable until a backend is connected.' };
    }
  },

  scoreCandidate: (candidateId) =>
    request('/candidates/score', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId }),
    }),

  getJobs: () => request('/jobs'),

  getJob: (id) => request(`/jobs/${id}`),

  createJob: async (data) => {
    const result = await request('/jobs', { method: 'POST', body: JSON.stringify(data) });
    if (Array.isArray(result)) {
      return { id: `local-${Date.now()}`, ...data, title: data.title || 'Draft job', status: 'Draft' };
    }
    return result && typeof result === 'object' ? result : { id: `local-${Date.now()}`, ...data };
  },

  matchJob: (candidateId, jobId) =>
    request('/jobs/match', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId }),
    }),

  getInterviews: () => request('/interviews'),

  scheduleInterview: (data) =>
    request('/interviews/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateInterviewQuestions: (candidateId, jobId) =>
    request('/interview/questions', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId }),
    }),
};
