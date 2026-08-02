import json
import re
from app.config import Config

# Import google.generativeai lazily and tolerate import failures (protobuf
# builds can be incompatible in some environments, e.g. CI or Python 3.14).
try:
    import google.generativeai as genai
except Exception:
    genai = None
from app.prompts.resume_parser_prompt import RESUME_PARSER_PROMPT
from app.prompts.candidate_scoring_prompt import CANDIDATE_SCORING_PROMPT
from app.prompts.job_matching_prompt import JOB_MATCHING_PROMPT
from app.prompts.interview_question_prompt import INTERVIEW_QUESTION_PROMPT

class GeminiService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.genai = genai
        # Only configure the client when the package is importable and an API key
        # is provided. When `genai` is None we fall back to the local dev stub
        # behavior implemented below.
        if self.api_key and self.genai:
            try:
                self.genai.configure(api_key=self.api_key)
            except Exception:
                # If configuration fails, ensure the client is treated as unavailable
                self.genai = None
        self.model_name = Config.GEMINI_MODEL_NAME

    def _clean_json_response(self, text):
        """Strip markdown codeblocks and return parsed dict."""
        cleaned = re.sub(r'```(?:json)?\s*([\s\S]*?)\s*```', r'\1', text).strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback regex search for { ... }
            match = re.search(r'\{[\s\S]*\}', text)
            if match:
                return json.loads(match.group(0))
            raise ValueError("Failed to parse valid JSON from Gemini AI response")

    def parse_resume(self, resume_text):
        """Send resume text to Gemini and return structured candidate profile."""
        # If there's no configured API key or the client library failed to
        # import, return the demo stub response.
        if not self.api_key or not self.genai:
            # Fallback stub for demo/dev when API key is unset
            return {
                "name": "Alex Morgan",
                "email": "alex.morgan@example.com",
                "phone": "+1-555-0199",
                "skills": ["Python", "Flask", "React", "Tailwind CSS", "PostgreSQL"],
                "education": [{"degree": "B.S. Computer Science", "institution": "Tech University", "year": "2023"}],
                "experience_years": 4.5,
                "companies": ["Tech Solutions Inc", "DataFlow Corp"],
                "certifications": ["AWS Certified Developer"],
                "location": "San Francisco, CA",
                "linkedin": "https://linkedin.com/in/alexmorgan",
                "portfolio": "https://alexmorgan.dev",
                "summary": "Experienced Full Stack Engineer specializing in Python REST APIs and React applications."
            }

        prompt = RESUME_PARSER_PROMPT.format(resume_text=resume_text)
        model = self.genai.GenerativeModel(self.model_name)
        response = model.generate_content(prompt)
        return self._clean_json_response(response.text)

    def score_candidate(self, candidate_data):
        """Evaluate candidate profile and return score & category breakdown."""
        if not self.api_key or not self.genai:
            return {
                "score": 88,
                "category": "Recommended",
                "reasoning": "Strong full-stack experience with modern Python and React frameworks.",
                "strengths": ["Solid REST API experience", "Clean frontend component development"],
                "weaknesses": ["Limited DevOps / Cloud infrastructure exposure"],
                "skill_gaps": ["Docker", "Kubernetes"]
            }

        prompt = CANDIDATE_SCORING_PROMPT.format(candidate_data=json.dumps(candidate_data, indent=2))
        model = self.genai.GenerativeModel(self.model_name)
        response = model.generate_content(prompt)
        return self._clean_json_response(response.text)

    def match_job(self, candidate_data, job_data):
        """Compare candidate profile against job description."""
        if not self.api_key or not self.genai:
            return {
                "match_percentage": 86,
                "matched_skills": ["Python", "React", "Tailwind CSS"],
                "missing_skills": ["Docker"],
                "recommendation": "Highly suitable candidate for senior developer role."
            }

        prompt = JOB_MATCHING_PROMPT.format(
            candidate_data=json.dumps(candidate_data, indent=2),
            job_data=json.dumps(job_data, indent=2)
        )
        model = self.genai.GenerativeModel(self.model_name)
        response = model.generate_content(prompt)
        return self._clean_json_response(response.text)

    def generate_interview_questions(self, candidate_data, job_data):
        """Generate tailored interview questions."""
        if not self.api_key or not self.genai:
            return {
                "questions": [
                    {
                        "category": "Architecture",
                        "question": "How do you structure Flask blueprints for scalability?",
                        "expected_answer_points": ["Application factory pattern", "Modular routing"]
                    }
                ]
            }

        prompt = INTERVIEW_QUESTION_PROMPT.format(
            candidate_data=json.dumps(candidate_data, indent=2),
            job_data=json.dumps(job_data, indent=2)
        )
        model = self.genai.GenerativeModel(self.model_name)
        response = model.generate_content(prompt)
        return self._clean_json_response(response.text)

gemini_service = GeminiService()
