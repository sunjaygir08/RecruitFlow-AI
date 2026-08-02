import io
import json
import pytest

def test_upload_resume_success(client):
    data = {
        'resume': (io.BytesIO(b"Alex Morgan\nEmail: alex.morgan@example.com\nSkills: Python, Flask, React"), 'alex_resume.txt')
    }
    response = client.post('/api/v1/resume/upload', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert 'data' in res

def test_parse_resume_success(client):
    payload = {"resume_text": "Alex Morgan. Full Stack Software Engineer with Python and React experience."}
    response = client.post('/api/v1/resume/parse', json=payload)
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert 'name' in res['data'] or 'skills' in res['data']

def test_parse_resume_missing_input(client):
    payload = {}
    response = client.post('/api/v1/resume/parse', json=payload)
    assert response.status_code == 400
    res = response.get_json()
    assert res['status'] == 'error'

def test_score_candidate_success(client):
    payload = {
        "candidate_profile": {
            "name": "Alex Morgan",
            "skills": ["React", "Python"]
        }
    }
    response = client.post('/api/v1/candidates/score', json=payload)
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert 'score' in res['data']

def test_score_candidate_invalid(client):
    payload = {}
    response = client.post('/api/v1/candidates/score', json=payload)
    assert response.status_code == 400

def test_match_job_success(client):
    payload = {
        "candidate_profile": {"name": "Alex Morgan", "skills": ["React", "Python"]},
        "job_description": {"title": "Senior React Developer", "required_skills": ["React"]}
    }
    response = client.post('/api/v1/jobs/match', json=payload)
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert 'match_percentage' in res['data']

def test_match_job_missing_job(client):
    payload = {"candidate_profile": {"name": "Alex Morgan"}}
    response = client.post('/api/v1/jobs/match', json=payload)
    assert response.status_code == 400

def test_get_dashboard(client):
    response = client.get('/api/v1/dashboard')
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert 'metrics' in res['data']
    assert 'pipeline_stages' in res['data']

def test_get_candidates(client):
    response = client.get('/api/v1/candidates')
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert isinstance(res['data'], list)

def test_get_candidate_by_id_success(client):
    response = client.get('/api/v1/candidates/cand-101')
    assert response.status_code == 200
    res = response.get_json()
    assert res['status'] == 'success'
    assert res['data']['id'] == 'cand-101'

def test_get_candidate_by_id_not_found(client):
    response = client.get('/api/v1/candidates/non_existing_999')
    assert response.status_code == 404
    res = response.get_json()
    assert res['status'] == 'error'
