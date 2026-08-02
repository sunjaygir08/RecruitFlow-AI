from flask import Blueprint, request, jsonify
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service

score_bp = Blueprint('score_bp', __name__)

@score_bp.route('/candidates/score', methods=['POST'])
@score_bp.route('/score-candidate', methods=['POST']) # Maintain backward compatibility
def score_candidate():
    """Evaluate candidate profile and return structured score & category."""
    data = request.get_json() or {}
    candidate_id = data.get('candidate_id')
    candidate_profile = data.get('candidate_profile') or data.get('candidate')

    if candidate_id and not candidate_profile:
        candidate_profile = supabase_service.get_candidate_by_id(candidate_id)

    if not candidate_profile:
        return jsonify({'status': 'error', 'message': 'candidate_profile or valid candidate_id required'}), 400

    try:
        score_data = gemini_service.score_candidate(candidate_profile)
        
        # Update record in database if candidate_id provided
        if candidate_id:
            supabase_service.update_candidate(candidate_id, {
                'score': score_data.get('score', 0),
                'status': 'AI Scored'
            })

        return jsonify({'status': 'success', 'data': score_data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
