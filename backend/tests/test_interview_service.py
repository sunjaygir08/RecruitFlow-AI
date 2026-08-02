import pytest
from app.services.supabase_service import supabase_service
from app.services.calendar_service import calendar_service
from app.services.email_service import email_service

def test_schedule_interview_api(client):
    payload = {
        "candidate_id": "cand-101",
        "job_id": "job-201",
        "date": "2026-08-15",
        "time": "11:00 AM"
    }
    response = client.post('/api/v1/interviews/schedule', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['data']['date'] == '2026-08-15'
    assert 'calendar_link' in data['data']

def test_calendar_service_event_creation():
    res = calendar_service.create_event("Alex Morgan", "alex@example.com", "2026-08-15", "11:00 AM")
    assert res['status'] == 'success'
    assert 'calendar.google.com' in res['calendar_link']

def test_email_service_dispatch():
    res = email_service.send_interview_email("alex@example.com", "Alex Morgan", "2026-08-15", "11:00 AM", "https://calendar.google.com")
    assert 'status' in res

def test_generate_interview_questions_api(client):
    payload = {
        "candidate_id": "cand-101",
        "job_id": "job-201"
    }
    response = client.post('/api/v1/interview/questions', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'questions' in data['data']
