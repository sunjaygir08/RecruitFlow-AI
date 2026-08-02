/**
 * RecruitFlow AI — API Service
 * Central file for all Flask backend API calls.
 * Uses the deployed API path by default so production routing is automatic.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/$/, '');

// Generic request helper
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // --- Dashboard ---
  getDashboard: () => request('/dashboard'),

  // --- Candidates ---
  getCandidates: (query = '') =>
    request(`/candidates${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCandidate: (id) => request(`/candidates/${id}`),

  createCandidate: (data) =>
    request('/candidates', { method: 'POST', body: JSON.stringify(data) }),

  updateCandidate: (id, data) =>
    request(`/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // --- Resume Upload (multipart/form-data) ---
  uploadResume: async (file) => {
    const form = new FormData();
    form.append('resume', file);
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    return json;
  },

  // --- AI Scoring ---
  scoreCandidate: (candidateId) =>
    request('/candidates/score', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId }),
    }),

  // --- Jobs ---
  getJobs: () => request('/jobs'),

  getJob: (id) => request(`/jobs/${id}`),

  createJob: (data) =>
    request('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  // --- Job Matching ---
  matchJob: (candidateId, jobId) =>
    request('/jobs/match', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId }),
    }),

  // --- Interviews ---
  getInterviews: () => request('/interviews'),

  scheduleInterview: (data) =>
    request('/interviews/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // --- Interview Questions (AI) ---
  generateInterviewQuestions: (candidateId, jobId) =>
    request('/interview/questions', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId, job_id: jobId }),
    }),
};
