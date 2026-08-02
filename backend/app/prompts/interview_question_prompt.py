INTERVIEW_QUESTION_PROMPT = """
You are an Executive Technical Interview Copilot.

Based on the Candidate Profile and Job Description below, generate 5 tailored, high-value technical and behavioral interview questions.

Return ONLY a valid JSON object matching this schema:

{
  "questions": [
    {
      "category": "Technical Depth",
      "question": "Tailored question text...",
      "expected_answer_points": ["Point 1", "Point 2"]
    }
  ]
}

Candidate Profile:
\"\"\"
{candidate_data}
\"\"\"

Job Description:
\"\"\"
{job_data}
\"\"\"
"""
