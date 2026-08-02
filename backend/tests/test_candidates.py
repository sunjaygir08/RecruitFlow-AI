import pytest
from app.services.supabase_service import supabase_service

def test_get_all_candidates(client):
    response = client.get('/api/v1/candidates')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert isinstance(data['data'], list)

def test_create_candidate(client):
    payload = {
        "name": "Sarah Connor",
        "email": "sarah.connor@example.com",
        "phone": "+1-555-9876",
        "skills": ["Python", "Flask", "PostgreSQL"],
        "experience_years": 5.0,
        "score": 90,
        "status": "Applied"
    }
    response = client.post('/api/v1/candidates', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['data']['name'] == "Sarah Connor"

def test_get_candidate_by_id(client):
    # Fetch existing sample candidate
    c_id = "cand-101"
    response = client.get(f'/api/v1/candidates/{c_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['data']['id'] == c_id

def test_update_candidate_status(client):
    c_id = "cand-101"
    payload = {"status": "Shortlisted"}
    response = client.put(f'/api/v1/candidates/{c_id}', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['data']['status'] == "Shortlisted"
