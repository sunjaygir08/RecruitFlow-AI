import os
import pytest
from app.services.gemini_service import gemini_service
from app.utils.pdf_extractor import extract_text_from_file

def test_gemini_service_parse_text():
    raw_text = "Jane Doe\nEmail: jane.doe@example.com\nSkills: Python, React, Flask"
    result = gemini_service.parse_resume(raw_text)
    assert isinstance(result, dict)
    assert "name" in result or "skills" in result

def test_extract_text_from_txt_file(tmp_path):
    txt_file = tmp_path / "valid_resume.txt"
    txt_file.write_text("Alex Morgan\nEmail: alex@example.com\nSkills: Python, Flask", encoding="utf-8")
    extracted = extract_text_from_file(str(txt_file))
    assert "Alex Morgan" in extracted

def test_json_clean_response():
    raw = "```json\n{\n  \"name\": \"Test User\",\n  \"skills\": [\"Python\", \"Flask\"]\n}\n```"
    cleaned = gemini_service._clean_json_response(raw)
    assert cleaned["name"] == "Test User"
    assert "Python" in cleaned["skills"]
