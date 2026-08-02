import uuid
from datetime import datetime
from app.config import Config

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None

class SupabaseService:
    def __init__(self):
        self.url = Config.SUPABASE_URL
        self.key = Config.SUPABASE_KEY
        self.client = None
        
        if self.url and self.key and create_client:
            try:
                self.client = create_client(self.url, self.key)
            except Exception as e:
                print(f"Supabase connection notice: {e}. Utilizing in-memory data store.")
                self.client = None

        # Thread-safe in-memory data stores for unit testing / dev demo mode
        self._mock_candidates = {}
        self._mock_jobs = {}
        self._mock_interviews = {}
        self._init_sample_data()

    def _init_sample_data(self):
        sample_c1_id = "cand-101"
        self._mock_candidates[sample_c1_id] = {
            "id": sample_c1_id,
            "name": "Alex Morgan",
            "email": "alex.morgan@example.com",
            "phone": "+1-555-0199",
            "skills": ["Python", "Flask", "React", "Tailwind CSS", "PostgreSQL"],
            "education": [{"degree": "B.S. Computer Science", "institution": "Tech University"}],
            "experience_years": 4.5,
            "companies": ["Tech Solutions Inc", "DataFlow Corp"],
            "certifications": ["AWS Certified Developer"],
            "location": "San Francisco, CA",
            "linkedin": "https://linkedin.com/in/alexmorgan",
            "portfolio": "https://alexmorgan.dev",
            "score": 88,
            "match_percentage": 86,
            "status": "Shortlisted",
            "created_at": datetime.now().isoformat()
        }

        sample_j1_id = "job-201"
        self._mock_jobs[sample_j1_id] = {
            "id": sample_j1_id,
            "title": "Senior Full-Stack AI Engineer",
            "description": "Lead full-stack developer position building Python Flask and React applications.",
            "required_skills": ["Python", "Flask", "React", "Tailwind CSS", "PostgreSQL"],
            "experience_required": "4+ years",
            "education_required": "Bachelor Degree",
            "status": "Active",
            "created_at": datetime.now().isoformat()
        }

    # --- Candidate Methods ---
    def get_all_candidates(self, query=None):
        if self.client:
            try:
                q = self.client.table('candidates').select('*')
                if query:
                    q = q.ilike('name', f'%{query}%')
                res = q.execute()
                return res.data
            except Exception as e:
                print(f"Supabase query error: {e}")
        
        # Fallback in-memory query
        results = list(self._mock_candidates.values())
        if query:
            q_lower = query.lower()
            results = [c for c in results if q_lower in c.get('name', '').lower() or q_lower in c.get('email', '').lower()]
        return results

    def get_candidate_by_id(self, candidate_id):
        if self.client:
            try:
                res = self.client.table('candidates').select('*').eq('id', candidate_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase fetch error: {e}")
                
        return self._mock_candidates.get(str(candidate_id))

    def create_candidate(self, candidate_data):
        c_id = str(candidate_data.get('id') or uuid.uuid4())
        record = {
            "id": c_id,
            "name": candidate_data.get('name') or candidate_data.get('full_name') or 'Candidate',
            "email": candidate_data.get('email', ''),
            "phone": candidate_data.get('phone', ''),
            "resume_url": candidate_data.get('resume_url', ''),
            "skills": candidate_data.get('skills', []),
            "education": candidate_data.get('education', []),
            "experience_years": float(candidate_data.get('experience_years') or 0.0),
            "companies": candidate_data.get('companies') or candidate_data.get('previous_companies') or [],
            "certifications": candidate_data.get('certifications', []),
            "location": candidate_data.get('location', ''),
            "linkedin": candidate_data.get('linkedin', ''),
            "portfolio": candidate_data.get('portfolio', ''),
            "score": int(candidate_data.get('score') or candidate_data.get('ai_score') or 0),
            "match_percentage": int(candidate_data.get('match_percentage') or candidate_data.get('job_match_percentage') or 0),
            "status": candidate_data.get('status') or candidate_data.get('application_status') or 'Applied',
            "created_at": datetime.now().isoformat()
        }

        if self.client:
            try:
                res = self.client.table('candidates').insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase insert error: {e}")

        self._mock_candidates[c_id] = record
        return record

    def update_candidate(self, candidate_id, update_data):
        c_id = str(candidate_id)
        if self.client:
            try:
                res = self.client.table('candidates').update(update_data).eq('id', c_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase update error: {e}")

        cand = self._mock_candidates.get(c_id)
        if cand:
            cand.update(update_data)
            return cand
        return None

    # --- Job Methods ---
    def get_all_jobs(self):
        if self.client:
            try:
                res = self.client.table('jobs').select('*').execute()
                return res.data
            except Exception as e:
                print(f"Supabase jobs error: {e}")

        return list(self._mock_jobs.values())

    def get_job_by_id(self, job_id):
        j_id = str(job_id)
        if self.client:
            try:
                res = self.client.table('jobs').select('*').eq('id', j_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase job fetch error: {e}")

        return self._mock_jobs.get(j_id)

    def create_job(self, job_data):
        j_id = str(job_data.get('id') or uuid.uuid4())
        record = {
            "id": j_id,
            "title": job_data.get('title', 'Job Title'),
            "description": job_data.get('description', ''),
            "required_skills": job_data.get('required_skills', []),
            "experience_required": job_data.get('experience_required', '1+ years'),
            "education_required": job_data.get('education_required', 'Bachelor Degree'),
            "status": job_data.get('status', 'Active'),
            "created_at": datetime.now().isoformat()
        }

        if self.client:
            try:
                res = self.client.table('jobs').insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase job insert error: {e}")

        self._mock_jobs[j_id] = record
        return record

    # --- Interview Methods ---
    def create_interview(self, interview_data):
        i_id = str(uuid.uuid4())
        record = {
            "id": i_id,
            "candidate_id": str(interview_data.get('candidate_id', '')),
            "job_id": str(interview_data.get('job_id', '')),
            "date": interview_data.get('date') or interview_data.get('interview_date') or datetime.now().strftime('%Y-%m-%d'),
            "time": interview_data.get('time') or interview_data.get('interview_time') or '10:00 AM',
            "calendar_link": interview_data.get('calendar_link', ''),
            "email_status": interview_data.get('email_status', 'Sent'),
            "created_at": datetime.now().isoformat()
        }

        if self.client:
            try:
                res = self.client.table('interviews').insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"Supabase interview insert error: {e}")

        self._mock_interviews[i_id] = record
        return record

    def get_all_interviews(self):
        if self.client:
            try:
                res = self.client.table('interviews').select('*').execute()
                return res.data
            except Exception as e:
                print(f"Supabase interviews fetch error: {e}")

        return list(self._mock_interviews.values())

supabase_service = SupabaseService()
