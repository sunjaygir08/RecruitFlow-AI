-- ============================================================
-- RecruitFlow AI — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- ============================================================
-- TABLE: candidates
-- Stores parsed candidate profiles from resumes
-- ============================================================
CREATE TABLE IF NOT EXISTS candidates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    skills          JSONB DEFAULT '[]',        -- array of skill strings
    education       JSONB DEFAULT '[]',        -- array of {degree, institution, year}
    experience_years NUMERIC(4,1) DEFAULT 0,
    companies       JSONB DEFAULT '[]',        -- array of company name strings
    certifications  JSONB DEFAULT '[]',        -- array of cert strings
    location        TEXT,
    linkedin        TEXT,
    portfolio       TEXT,
    resume_url      TEXT,
    score           INTEGER DEFAULT 0,         -- AI score 0-100
    match_percentage INTEGER DEFAULT 0,        -- job match percentage 0-100
    status          TEXT DEFAULT 'Applied',    -- Applied | AI Scored | Matched | Shortlisted | Interview Scheduled | Rejected
    summary         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast name/email search
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates (name);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates (email);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates (status);


-- ============================================================
-- TABLE: jobs
-- Stores job postings
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    description         TEXT,
    required_skills     JSONB DEFAULT '[]',   -- array of skill strings
    experience_required TEXT DEFAULT '1+ years',
    education_required  TEXT DEFAULT 'Bachelor Degree',
    status              TEXT DEFAULT 'Active', -- Active | Closed | Draft
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);


-- ============================================================
-- TABLE: interviews
-- Stores scheduled interview records
-- ============================================================
CREATE TABLE IF NOT EXISTS interviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
    date            DATE NOT NULL,
    time            TEXT NOT NULL,             -- e.g. "10:00 AM"
    calendar_link   TEXT,                      -- Google Calendar URL
    email_status    TEXT DEFAULT 'Sent',       -- Sent | sent_mock | failed
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON interviews (candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews (date);


-- ============================================================
-- SAMPLE DATA (optional — for demo purposes)
-- ============================================================

INSERT INTO jobs (title, description, required_skills, experience_required, education_required)
VALUES (
    'Full Stack Developer',
    'We are looking for a talented full stack developer to build and maintain our web applications using Python Flask and React.',
    '["Python", "Flask", "React", "PostgreSQL", "REST APIs"]',
    '2+ years',
    'Bachelor Degree'
);

INSERT INTO jobs (title, description, required_skills, experience_required, education_required)
VALUES (
    'AI/ML Engineer',
    'Join our team to build and deploy machine learning models and AI-powered features into production systems.',
    '["Python", "TensorFlow", "PyTorch", "scikit-learn", "Docker"]',
    '3+ years',
    'Bachelor Degree in CS or related field'
);
