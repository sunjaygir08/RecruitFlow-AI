import pytest
from app.services.gemini_service import gemini_service

def test_gemini_score_candidate():
    candidate = {
        "name": "Alex Morgan",
        "skills": ["React", "Python", "Flask", "Tailwind CSS", "PostgreSQL"],
        "experience_years": 8.0,
        "education": [{"degree": "B.S. in Computer Science", "institution": "Stanford"}]
    }
    result = gemini_service.score_candidate(candidate)
    assert isinstance(result, dict)
    assert "score" in result
    assert "category" in result

def test_gemini_match_job():
    candidate = {
        "name": "Alex Morgan",
        "skills": ["React", "Python", "Flask", "Tailwind CSS"],
        "experience_years": 7.0
    }
    job = {
        "title": "Senior React Developer",
        "required_skills": ["React", "Python", "Flask"]
    }
    result = gemini_service.match_job(candidate, job)
    assert isinstance(result, dict)
    assert "match_percentage" in result
    assert "matched_skills" in result
