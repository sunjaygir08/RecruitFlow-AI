# RecruitFlow AI — Gemini AI Prompts

All 4 Gemini prompts are stored as Python constants in `backend/app/prompts/`.
They are imported by `GeminiService` and used in `model.generate_content(prompt)`.

---

## 1. Resume Parser Prompt

**File:** `backend/app/prompts/resume_parser_prompt.py`
**Used in:** `gemini_service.parse_resume(resume_text)`

**Purpose:** Extract structured candidate profile from raw resume text.

**Input:** Raw text extracted from PDF or DOCX file.

**Output JSON schema:**
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "phone": "+1-555-0199",
  "skills": ["Python", "Flask", "React"],
  "education": [
    { "degree": "B.S. Computer Science", "institution": "Tech University", "year": "2023" }
  ],
  "experience_years": 4.5,
  "companies": ["Tech Solutions Inc", "DataFlow Corp"],
  "certifications": ["AWS Certified Developer"],
  "location": "San Francisco, CA",
  "linkedin": "https://linkedin.com/in/alexmorgan",
  "portfolio": "https://alexmorgan.dev",
  "summary": "Experienced full stack engineer..."
}
```

---

## 2. Candidate Scoring Prompt

**File:** `backend/app/prompts/candidate_scoring_prompt.py`
**Used in:** `gemini_service.score_candidate(candidate_data)`

**Purpose:** Evaluate a candidate profile and assign an objective AI score.

**Input:** Full candidate profile JSON.

**Score categories:**
| Score Range | Category             |
|-------------|----------------------|
| 90-100      | Highly Recommended   |
| 75-89       | Recommended          |
| 60-74       | Consider             |
| Below 60    | Not Recommended      |

**Output JSON schema:**
```json
{
  "score": 88,
  "category": "Recommended",
  "reasoning": "Strong full-stack background with proven Python and React experience.",
  "strengths": [
    "Solid REST API development experience",
    "Modern frontend development skills"
  ],
  "weaknesses": [
    "Limited DevOps exposure"
  ],
  "skill_gaps": ["Docker", "Kubernetes"]
}
```

---

## 3. Job Matching Prompt

**File:** `backend/app/prompts/job_matching_prompt.py`
**Used in:** `gemini_service.match_job(candidate_data, job_data)`

**Purpose:** Compare a candidate's profile against a job description and return a match analysis.

**Input:** Candidate profile JSON + Job description text.

**Output JSON schema:**
```json
{
  "match_percentage": 86,
  "matched_skills": ["Python", "React", "Tailwind CSS"],
  "missing_skills": ["Docker", "Kubernetes"],
  "recommendation": "This candidate is highly suitable for the role. Strong Python and React skills align well with the requirements. Missing container experience could be addressed with on-the-job training."
}
```

**Match percentage interpretation:**
| Percentage | Interpretation              |
|------------|-----------------------------|
| 85%+       | Strong match → recommend    |
| 70-84%     | Good match → worth interview|
| 50-69%     | Partial match → gaps exist  |
| Below 50%  | Weak match → not suitable   |

---

## 4. Interview Questions Prompt

**File:** `backend/app/prompts/interview_question_prompt.py`
**Used in:** `gemini_service.generate_interview_questions(candidate_data, job_data)`

**Purpose:** Generate tailored technical and behavioral interview questions
based on the candidate's background and the job requirements.

**Input:** Candidate profile JSON + Job data JSON.

**Output JSON schema:**
```json
{
  "questions": [
    {
      "category": "Technical — Architecture",
      "question": "How do you structure Flask blueprints for a scalable REST API?",
      "expected_answer_points": [
        "Application factory pattern",
        "Modular blueprint registration",
        "Separation of concerns"
      ]
    },
    {
      "category": "Behavioral",
      "question": "Describe a time you had to debug a complex production issue under time pressure.",
      "expected_answer_points": [
        "Systematic debugging approach",
        "Communication with team",
        "Root cause analysis"
      ]
    }
  ]
}
```

---

## Design Principles for Prompts

1. **Always specify JSON output** — All prompts explicitly say "Return ONLY a valid JSON object"
2. **Include the full schema** — The expected output structure is shown as an example
3. **Clean JSON** — The `_clean_json_response()` method strips markdown code blocks from responses
4. **Fallback stubs** — When `GEMINI_API_KEY` is not set, each method returns realistic hardcoded demo data
