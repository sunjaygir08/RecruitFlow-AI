# RecruitFlow AI — System Architecture

## Overview

RecruitFlow AI is an internship-level MVP recruitment intelligence platform.
It uses Google Gemini AI to parse resumes, score candidates, and match them to job descriptions.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js (App Router) + Tailwind CSS |
| Backend     | Python Flask + Flask Blueprints     |
| AI Engine   | Google Gemini API (gemini-1.5-flash)|
| Database    | Supabase (PostgreSQL)               |
| Email       | Resend API                          |
| Calendar    | Google Calendar (quick-link)        |
| Automation  | n8n workflows                       |

---

## Project Folder Structure

```
RecruitFlow-AI/
│
├── frontend/                    # Next.js frontend
│   └── app/
│       ├── page.js              # Dashboard (/)
│       ├── layout.js            # Root layout with Sidebar
│       ├── globals.css          # Global styles + design tokens
│       ├── components/
│       │   ├── Sidebar.js       # Left navigation bar
│       │   ├── StatCard.js      # Metric card component
│       │   ├── ScoreBadge.js    # Color-coded AI score badge
│       │   └── CandidateCard.js # Candidate summary card
│       ├── services/
│       │   └── api.js           # All Flask API calls
│       ├── candidates/
│       │   ├── page.js          # Candidate list (/candidates)
│       │   ├── upload/page.js   # Resume upload (/candidates/upload)
│       │   └── [id]/page.js     # Candidate detail (/candidates/:id)
│       ├── jobs/
│       │   ├── page.js          # Job list (/jobs)
│       │   └── [id]/page.js     # Job detail + matching (/jobs/:id)
│       ├── analytics/
│       │   └── page.js          # Charts (/analytics)
│       └── interviews/
│           └── page.js          # Interview list (/interviews)
│
├── backend/                     # Python Flask backend
│   ├── run.py                   # Flask entry point
│   └── app/
│       ├── __init__.py          # App factory + blueprint registration
│       ├── config.py            # Environment variables
│       ├── routes/
│       │   ├── parse_routes.py      # POST /resume/upload, /resume/parse
│       │   ├── candidate_routes.py  # GET/POST /candidates
│       │   ├── score_routes.py      # POST /candidates/score
│       │   ├── job_routes.py        # GET/POST /jobs
│       │   ├── match_routes.py      # POST /jobs/match
│       │   ├── interview_routes.py  # GET/POST /interviews
│       │   └── dashboard_routes.py  # GET /dashboard
│       ├── services/
│       │   ├── gemini_service.py    # Gemini AI integration
│       │   ├── supabase_service.py  # Supabase DB operations
│       │   ├── email_service.py     # Resend email
│       │   └── calendar_service.py  # Google Calendar link gen
│       ├── prompts/
│       │   ├── resume_parser_prompt.py      # Gemini resume parse prompt
│       │   ├── candidate_scoring_prompt.py  # Gemini scoring prompt
│       │   ├── job_matching_prompt.py       # Gemini job match prompt
│       │   └── interview_question_prompt.py # Gemini questions prompt
│       └── utils/
│           └── pdf_extractor.py   # PDF + DOCX text extraction
│
├── n8n/
│   └── workflows/               # n8n automation workflow JSONs
│
├── docs/                        # Documentation
│   ├── architecture.md          # This file
│   ├── database-design.md       # Database schema description
│   ├── ai-prompts.md            # All Gemini AI prompts
│   └── database-schema.sql      # SQL CREATE TABLE statements
│
├── .env.example                 # Environment variable template
├── package.json                 # Root scripts (concurrently)
└── README.md
```

---

## Data Flow

```
User uploads resume (PDF/DOCX)
        ↓
Next.js Frontend → POST /api/v1/resume/upload
        ↓
Flask Backend receives file
        ↓
pdf_extractor.py extracts raw text
        ↓
GeminiService.parse_resume() sends to Gemini API
        ↓
Gemini returns structured JSON (name, email, skills, etc.)
        ↓
SupabaseService.create_candidate() saves to PostgreSQL
        ↓
Frontend displays parsed candidate profile
        ↓
Recruiter clicks "Score with AI"
        ↓
POST /api/v1/candidates/score → Gemini scores candidate 0-100
        ↓
Score saved back to Supabase candidate record
        ↓
Recruiter matches candidate to a job
        ↓
POST /api/v1/jobs/match → Gemini returns match % + skills
        ↓
Recruiter schedules interview
        ↓
POST /api/v1/interviews/schedule
  → Google Calendar link generated
  → Resend email sent to candidate
  → Interview record saved in Supabase
```

---

## API Endpoints

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | /api/v1/health              | Health check                         |
| GET    | /api/v1/dashboard           | Dashboard metrics + pipeline         |
| GET    | /api/v1/candidates          | List all candidates (search support) |
| POST   | /api/v1/candidates          | Create candidate manually            |
| GET    | /api/v1/candidates/:id      | Get candidate by ID                  |
| PUT    | /api/v1/candidates/:id      | Update candidate                     |
| POST   | /api/v1/resume/upload       | Upload + parse resume file           |
| POST   | /api/v1/resume/parse        | Parse raw resume text                |
| POST   | /api/v1/candidates/score    | AI score candidate                   |
| GET    | /api/v1/jobs                | List all jobs                        |
| POST   | /api/v1/jobs                | Create job posting                   |
| GET    | /api/v1/jobs/:id            | Get job by ID                        |
| POST   | /api/v1/jobs/match          | AI match candidate to job            |
| GET    | /api/v1/interviews          | List all interviews                  |
| POST   | /api/v1/interviews/schedule | Schedule interview + send email      |
| POST   | /api/v1/interview/questions | Generate AI interview questions      |

---

## Running Locally

```bash
# 1. Install dependencies
npm install
npm --prefix frontend install

# 2. Python environment
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r backend/requirements.txt

# 3. Configure environment
cp .env.example .env
# Fill in GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY

# 4. Start both servers
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```
