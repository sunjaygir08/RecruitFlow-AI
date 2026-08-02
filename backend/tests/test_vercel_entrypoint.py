from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from api.index import app as vercel_app


def test_vercel_entrypoint_serves_health():
    client = vercel_app.test_client()
    response = client.get('/api/v1/health')

    assert response.status_code == 200
    payload = response.get_json()
    assert payload['status'] == 'healthy'
