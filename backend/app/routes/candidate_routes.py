from flask import Blueprint, request, jsonify
from app.services.supabase_service import supabase_service

candidate_bp = Blueprint('candidate_bp', __name__)

@candidate_bp.route('/candidates', methods=['GET'])
def get_candidates():
    """List all candidate records with optional search query."""
    query = request.args.get('query') or request.args.get('q') or ''
    candidates = supabase_service.get_all_candidates(query=query)
    return jsonify({'status': 'success', 'data': candidates}), 200

@candidate_bp.route('/candidates/<candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    """Fetch specific candidate detail."""
    candidate = supabase_service.get_candidate_by_id(candidate_id)
    if not candidate:
        return jsonify({'status': 'error', 'message': 'Candidate not found'}), 404
    return jsonify({'status': 'success', 'data': candidate}), 200

@candidate_bp.route('/candidates', methods=['POST'])
def create_candidate():
    """Create new candidate profile."""
    data = request.get_json() or {}
    record = supabase_service.create_candidate(data)
    return jsonify({'status': 'success', 'data': record}), 201

@candidate_bp.route('/candidates/<candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    """Update candidate details / status."""
    data = request.get_json() or {}
    record = supabase_service.update_candidate(candidate_id, data)
    if not record:
        return jsonify({'status': 'error', 'message': 'Candidate not found'}), 404
    return jsonify({'status': 'success', 'data': record}), 200
