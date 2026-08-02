# RecruitFlow AI — Database Design

## Database: Supabase (PostgreSQL)

We use **Supabase** as our managed PostgreSQL database.
The schema has 3 tables: `candidates`, `jobs`, and `interviews`.

---

## Tables

### candidates

Stores candidate profiles parsed from uploaded resumes.

| Column            | Type         | Description                                          |
|-------------------|--------------|------------------------------------------------------|
| id                | UUID (PK)    | Auto-generated unique ID                             |
| name              | TEXT         | Full name of the candidate                           |
| email             | TEXT         | Email address                                        |
| phone             | TEXT         | Phone number                                         |
| skills            | JSONB        | Array of skill strings (e.g. ["Python", "React"])    |
| education         | JSONB        | Array of {degree, institution, year} objects         |
| experience_years  | NUMERIC(4,1) | Total years of professional experience               |
| companies         | JSONB        | Array of previous company names                      |
| certifications    | JSONB        | Array of certification strings                       |
| location          | TEXT         | City, Country                                        |
| linkedin          | TEXT         | LinkedIn profile URL                                 |
| portfolio         | TEXT         | Portfolio / GitHub URL                               |
| resume_url        | TEXT         | Uploaded resume file URL                             |
| score             | INTEGER      | AI-generated score 0-100                             |
| match_percentage  | INTEGER      | Best job match percentage 0-100                      |
| status            | TEXT         | Current pipeline stage (see below)                   |
| summary           | TEXT         | AI-extracted professional summary                    |
| created_at        | TIMESTAMPTZ  | When the record was created                          |

**Status values:**
- `Applied` — just uploaded
- `AI Scored` — scored by Gemini
- `Matched` — matched to a job
- `Shortlisted` — manually shortlisted
- `Interview Scheduled` — interview booked
- `Rejected` — not moving forward

---

### jobs

Stores job postings created by recruiters.

| Column             | Type        | Description                                          |
|--------------------|-------------|------------------------------------------------------|
| id                 | UUID (PK)   | Auto-generated unique ID                             |
| title              | TEXT        | Job title (e.g. "Full Stack Developer")              |
| description        | TEXT        | Full job description                                 |
| required_skills    | JSONB       | Array of required skill strings                      |
| experience_required | TEXT       | e.g. "2+ years"                                      |
| education_required | TEXT        | e.g. "Bachelor Degree"                               |
| status             | TEXT        | Active | Closed | Draft                              |
| created_at         | TIMESTAMPTZ | When the job was posted                              |

---

### interviews

Records of scheduled candidate interviews.

| Column        | Type        | Description                                          |
|---------------|-------------|------------------------------------------------------|
| id            | UUID (PK)   | Auto-generated unique ID                             |
| candidate_id  | UUID (FK)   | References candidates.id                             |
| job_id        | UUID (FK)   | References jobs.id (nullable)                        |
| date          | DATE        | Interview date (YYYY-MM-DD)                          |
| time          | TEXT        | Interview time (e.g. "10:00 AM")                     |
| calendar_link | TEXT        | Google Calendar add-event URL                        |
| email_status  | TEXT        | Sent | sent_mock | failed                            |
| created_at    | TIMESTAMPTZ | When the interview was scheduled                     |

---

## Relationships

```
candidates (1) ───────< interviews (N)
jobs       (1) ───────< interviews (N)
```

- One candidate can have multiple interviews
- One job can have multiple interviews scheduled against it

---

## Notes

- **JSONB** is used for arrays (skills, education, companies, certifications)
  because they are variable-length and queried as-is, not joined.
- The backend fallback uses **in-memory Python dictionaries** when
  Supabase credentials are not configured, enabling demo mode without a database.
- All UUIDs are generated server-side using `gen_random_uuid()` (Supabase)
  or Python's `uuid.uuid4()` (fallback).
