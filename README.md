# RecruitFlow AI 🚀

![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.0.3-000000)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-4285F4)
![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71)

> **BranDive Media Solutions — Weekly AI Development Sprint — Project 2**
> AI Recruitment & Candidate Screening Automation System

---

## 📑 Table of Contents

- [Project Description](#-project-description)
- [Project Highlights](#-project-highlights)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Screenshots](#screenshots)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📌 Project Description

**RecruitFlow AI** is an AI-powered Recruitment & Candidate Screening Automation System developed for the **BranDive Media Solutions — TalentBridge Recruitment** case study.

TalentBridge Recruitment is a staffing agency in Australia that receives **1,000+ applications per month**. Manual shortlisting is slow, inconsistent, and expensive. RecruitFlow AI removes that bottleneck: a recruiter uploads a resume, Google Gemini extracts a structured candidate profile, the candidate is scored and matched against open roles, and interviews are scheduled with a calendar link and an email notification — all from a single dashboard.

The system is a three-tier application: a **Next.js 16 App Router** dashboard, a **Flask 3.0 REST API**, and a **Supabase (PostgreSQL)** database, with **n8n** workflow templates for hands-off automation.

---

## ✨ Project Highlights

The complete AI workflow, end to end:

```
Resume Upload
      ↓
Gemini Parsing
      ↓
Candidate Scoring
      ↓
Job Matching
      ↓
Supabase
      ↓
Interview Scheduling
      ↓
Google Calendar
      ↓
Resend Email
      ↓
n8n Automation
```

- **One AI service, four jobs** — `gemini_service.py` handles resume parsing, candidate scoring, job matching, and interview-question generation using prompt templates in `app/prompts/`.
- **Runs with zero API keys** — when Gemini, Supabase, or Resend keys are absent, the backend falls back to an in-memory store and demo responses, so the whole app is demonstrable offline.
- **Consistent API contract** — every endpoint returns `{ "status": "success" | "error", "data" | "message": ... }`.
- **Status-driven pipeline** — candidates move through `Applied → AI Scored → Matched → Shortlisted → Interview Scheduled`.

---

## 🎯 Key Features

| Feature | What it does |
|---|---|
| 🤖 **AI Resume Parsing** | Extracts text from PDF/DOCX/TXT and converts it into a structured profile (skills, education, experience, companies, certifications, links) via Google Gemini. |
| 📊 **Candidate Scoring** | Gemini returns a 0–100 score with strengths, weaknesses, and a recommendation; the candidate record is updated to `AI Scored`. |
| 🎯 **Job Matching** | Compares a candidate profile against a job description and returns a match percentage with matched/missing skills. |
| 👥 **Candidate Management** | List, search, view, create, and update candidates from the dashboard or API. |
| 💼 **Job Management** | Create and browse job openings with required skills, experience, and education. |
| 📈 **Recruiter Dashboard** | Aggregated metrics, a Recharts pipeline chart, and a recent-candidates table. |
| 📅 **Interview Scheduling** | One call creates the calendar event, sends the email, stores the interview, and flips the candidate to `Interview Scheduled`. |
| 🗓️ **Google Calendar Integration** | Generates a pre-filled Google Calendar event link for the interview slot. |
| 📧 **Resend Email Notifications** | Sends the interview invitation email through Resend (mock send in local dev). |
| ⚙️ **n8n Automation** | Six ready-to-import workflow templates for ingestion, scoring, matching, alerts, scheduling, and reminders. |
| 📉 **Analytics Dashboard** | Dedicated analytics page built on the same aggregated metrics endpoint. |
| 🗄️ **Supabase Database** | PostgreSQL tables for candidates, jobs, and interviews with indexes and constraints. |
| 🧠 **AI Interview Copilot** | Generates tailored interview questions from a candidate profile and job description. |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Next.js 16 Dashboard  (App Router · Tailwind · Recharts) │
│  Dashboard · Candidates · Jobs · Interviews · Analytics   │
└───────────────────────────┬──────────────────────────────┘
                            │  fetch → NEXT_PUBLIC_API_URL
┌───────────────────────────▼──────────────────────────────┐
│  Flask 3.0 REST API  (/api/v1, 7 Blueprints, CORS)        │
│  parse · score · match · candidate · job · interview · dash│
└───┬───────────────┬───────────────┬──────────────────┬────┘
    │               │               │                  │
┌───▼────┐   ┌──────▼──────┐  ┌─────▼──────┐   ┌───────▼─────┐
│ Gemini │   │  Supabase   │  │  Resend    │   │   Google    │
│ 1.5    │   │ PostgreSQL  │  │  Email     │   │  Calendar   │
└────────┘   └─────────────┘  └────────────┘   └─────────────┘
                            ▲
                     ┌──────┴──────┐
                     │ n8n workflows│
                     └─────────────┘
```

**Processing flow:** Resume Upload → Resume Text Extraction (`pdf_extractor.py`) → Gemini AI Parsing → Candidate Storage (Supabase) → AI Candidate Scoring → Job Matching → Recruiter Dashboard → Interview Scheduling → Google Calendar → Resend Email → n8n Workflow.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16.2.12 (App Router), React 19.2.4, Tailwind CSS v4, Recharts 3.10, lucide-react |
| **Backend** | Python 3.10+, Flask 3.0.3, Flask-CORS 4.0.1, python-dotenv 1.0.1 |
| **Database** | Supabase (PostgreSQL) via `supabase` 2.31.0 |
| **AI** | Google Gemini 1.5 Flash via `google-generativeai` 0.7.2 |
| **File Parsing** | pypdf 4.2.0 (PDF), python-docx 1.1.2 (DOCX) |
| **Automation** | n8n workflow templates (JSON, import-ready) |
| **Integrations** | Resend 2.35.0 (email), Google Calendar (`google-api-python-client` 2.172.0, `google-auth-oauthlib` 1.4.0) |
| **Testing** | pytest 8.2.2 |
| **Tooling** | concurrently 8.2.2 (runs frontend + backend together), ESLint 9 |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
RecruitFlow-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py             # Flask app factory + blueprint registration
│   │   ├── config.py               # Env-driven configuration
│   │   ├── prompts/                # Gemini prompt templates
│   │   ├── routes/                 # parse, score, match, candidate, job, interview, dashboard
│   │   ├── services/               # gemini, supabase, email, calendar
│   │   └── utils/                  # pdf_extractor, validators, responses, file utils
│   ├── sample_data/                # Sample resumes & job descriptions
│   ├── tests/                      # pytest suite
│   ├── uploads/                    # Uploaded resumes (gitignored)
│   ├── requirements.txt
│   └── run.py                      # Dev entry point (port 5000)
├── frontend/
│   ├── app/
│   │   ├── components/             # Sidebar, StatCard, ScoreBadge, CandidateCard
│   │   ├── services/api.js         # Centralized API client
│   │   ├── candidates/             # list, [id], upload
│   │   ├── jobs/                   # list, [id]
│   │   ├── interviews/             # scheduling page
│   │   ├── analytics/              # analytics page
│   │   ├── settings/               # settings page
│   │   ├── layout.js               # Root layout + sidebar
│   │   └── page.js                 # Recruiter dashboard
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── database-design.md
│   ├── database-schema.sql         # Supabase schema
│   └── ai-prompts.md
├── n8n/workflows/                  # 6 automation workflow templates
└── package.json                    # Root scripts (concurrently)
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/v1`
Every response uses the envelope `{ "status": "success" | "error", "data" | "message": ... }`.

### Resume & AI

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/resume/upload` | Upload a PDF/DOCX/TXT resume, extract text, parse with Gemini, and save the candidate. Form field: `resume`. |
| `POST` | `/resume/parse` | Parse raw resume text without saving. Body: `resume_text`. |
| `POST` | `/candidates/score` | AI-score a candidate. Body: `candidate_id` and/or `candidate_profile`. Sets status to `AI Scored`. |
| `POST` | `/jobs/match` | Match a candidate against a job. Body: `candidate_id`/`candidate_profile` + `job_id`/`job_description`. Sets status to `Matched`. |
| `POST` | `/interview/questions` | Generate tailored interview questions from a candidate + job. |

### Candidates

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/candidates` | List candidates. Optional search via `?query=` (or `?q=`). |
| `GET` | `/candidates/<id>` | Fetch one candidate (`404` if not found). |
| `POST` | `/candidates` | Create a candidate (`201`). |
| `PUT` | `/candidates/<id>` | Update a candidate. |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/jobs` | List all jobs. |
| `GET` | `/jobs/<id>` | Fetch one job (`404` if not found). |
| `POST` | `/jobs` | Create a job (`201`). |

### Interviews & Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/interviews` | List scheduled interviews. |
| `POST` | `/interviews/schedule` | Create the Google Calendar link, send the Resend email, store the interview, and set the candidate to `Interview Scheduled`. |
| `GET` | `/dashboard` | Aggregated metrics, pipeline stages, and integration status flags. |
| `GET` | `/health` | Health check (also available at `/api/v1/health`). |

> Legacy aliases are kept for backward compatibility: `/upload-resume`, `/parse-resume`, `/score-candidate`, `/match-job`, and `POST /candidates/<id>/schedule`.

---

## 🗄️ Database Schema

Full DDL lives in [docs/database-schema.sql](docs/database-schema.sql) — run it in the Supabase SQL editor.

### `candidates`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, `gen_random_uuid()` |
| `name` | TEXT | Required |
| `email` / `phone` | TEXT | Contact details |
| `skills` / `education` / `companies` / `certifications` | JSONB | Default `[]` |
| `experience_years` | NUMERIC(4,1) | Default `0` |
| `location` / `linkedin` / `portfolio` / `resume_url` | TEXT | Optional |
| `score` | INTEGER | AI score, `0–100` |
| `match_percentage` | INTEGER | Job match, `0–100` |
| `status` | TEXT | `Applied` \| `AI Scored` \| `Matched` \| `Shortlisted` \| `Interview Scheduled` \| `Rejected` |
| `summary` | TEXT | AI-generated summary |
| `created_at` | TIMESTAMPTZ | Default `NOW()` |

### `jobs`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | TEXT | Required |
| `description` | TEXT | Job description used for matching |
| `required_skills` | JSONB | Default `[]` |
| `experience_required` | TEXT | Default `1+ years` |
| `education_required` | TEXT | Default `Bachelor Degree` |
| `status` | TEXT | `Active` \| `Closed` \| `Draft` |
| `created_at` | TIMESTAMPTZ | Default `NOW()` |

### `interviews`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `candidate_id` | UUID | → `candidates(id)` `ON DELETE CASCADE` |
| `job_id` | UUID | → `jobs(id)` `ON DELETE SET NULL` |
| `date` / `time` | DATE / TEXT | Required |
| `calendar_link` | TEXT | Google Calendar event link |
| `email_status` | TEXT | `Sent` \| `sent_mock` \| `failed` |
| `created_at` | TIMESTAMPTZ | Default `NOW()` |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Supabase project (optional — the backend runs on an in-memory store without one)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/RecruitFlow-AI.git
```

### 2. Backend setup

```bash
cd backend && python -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt
```

On macOS/Linux use `source .venv/bin/activate` instead.

### 3. Frontend setup

```bash
npm run install:all
```

### 4. Configure environment files

Create `backend/.env` and `frontend/.env.local` using the keys listed in [Environment Variables](#-environment-variables). Every key is optional — the app starts without them and uses mock data.

### 5. Create the database tables

Open the Supabase SQL editor and run [docs/database-schema.sql](docs/database-schema.sql).

### 6. Run both services

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Next.js) | `http://localhost:3000` |
| Backend (Flask) | `http://localhost:5000` |
| Health check | `http://localhost:5000/api/v1/health` |

To run them separately, use `npm run dev:backend` and `npm run dev:frontend`.

---

## 🔐 Environment Variables

Variable **names** only — never commit real values. All integration keys are optional; when one is missing the backend falls back to mock behaviour.

### `backend/.env`

| Variable | Purpose | Required |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Optional (in-memory store if unset) |
| `SUPABASE_KEY` | Supabase API key | Optional |
| `GEMINI_API_KEY` | Google Gemini API key | Optional (stub AI responses if unset) |
| `GEMINI_MODEL_NAME` | Gemini model to use — defaults to `gemini-1.5-flash` | Optional |
| `RESEND_API_KEY` | Resend API key for interview emails | Optional (mock send if unset) |
| `GOOGLE_CALENDAR_CREDENTIALS` | Google Calendar credentials path/JSON | Optional |
| `SECRET_KEY` | Flask secret key | Optional (dev default applied) |
| `PORT` | Flask port — defaults to `5000` | Optional |
| `FLASK_DEBUG` | `1` enables debug mode | Optional |

### `frontend/.env.local`

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Flask API, e.g. `http://localhost:5000/api/v1` | Recommended |

---

## Screenshots

| View | Preview |
|---|---|
| **Dashboard** — metrics, pipeline chart, recent candidates | `![Dashboard](docs/screenshots/dashboard.png)` |
| **Resume Upload** — drag-and-drop upload + AI parse result | `![Resume Upload](docs/screenshots/resume-upload.png)` |
| **Candidates** — searchable candidate list with scores | `![Candidates](docs/screenshots/candidates.png)` |
| **Jobs** — job openings and required skills | `![Jobs](docs/screenshots/jobs.png)` |
| **Analytics** — score distribution and stage breakdown | `![Analytics](docs/screenshots/analytics.png)` |
| **Interview Scheduling** — slot picker, calendar link, email status | `![Interviews](docs/screenshots/interviews.png)` |

> Add the images to `docs/screenshots/` and replace each cell above with the rendered Markdown image.

---

## 🧪 Testing

The backend ships a `pytest` suite under `backend/tests/`.

```bash
npm run test:backend
```

Or run pytest directly:

```bash
pytest backend/tests
```

Tests cover the API routes and the utility helpers. Because the backend degrades gracefully without API keys, the suite runs offline with no Supabase or Gemini credentials.

---

## 🚀 Future Improvements

- **Bulk resume upload** — process a folder of resumes in one request instead of one at a time.
- **Full Google Calendar OAuth** — create real calendar events instead of generating pre-filled event links.
- **Frontend test suite** — no test runner is configured in `frontend/` yet.
- **Pagination & filters** — server-side paging on `/candidates` plus filters for score range, skills, and status.
- **Resume duplicate detection** — flag re-applications by email before creating a new candidate record.
- **Recruiter accounts** — sign-in so multiple recruiters can work from the same dashboard.
- **Export reports** — download shortlists and score summaries as CSV or PDF.
- **Broader AI matching** — rank a single candidate against every open job in one call.

---

## 👤 Author

**Developed by Sunjay Gir**
AI Chatbot Intern At Bandive Media Solution

---

<div align="center">

**BranDive Media Solutions — Weekly AI Development Sprint — Project 1**
RecruitFlow AI™ · Built for the TalentBridge Recruitment case study

</div>

