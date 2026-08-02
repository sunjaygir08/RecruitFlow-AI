from flask import Blueprint, request, jsonify
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service

match_bp = Blueprint('match_bp', __name__)

@match_bp.route('/jobs/match', methods=['POST'])
@match_bp.route('/match-job', methods=['POST']) # Maintain backward compatibility
def match_job():
    """Compare candidate profile against job description and return match metrics."""
    data = request.get_json() or {}
    candidate_profile = data.get('candidate_profile') or data.get('candidate')
    job_description = data.get('job_description') or data.get('job')
    candidate_id = data.get('candidate_id')
    job_id = data.get('job_id')

    if candidate_id and not candidate_profile:
        candidate_profile = supabase_service.get_candidate_by_id(candidate_id)

    if job_id and not job_description:
        job_obj = supabase_service.get_job_by_id(job_id)
        if job_obj:
            job_description = job_obj.get('description') or job_obj.get('title')

    if not candidate_profile or not job_description:
        return jsonify({'status': 'error', 'message': 'candidate_profile and job_description required'}), 400

    try:
        match_data = gemini_service.match_job(candidate_profile, job_description)

        if candidate_id:
            supabase_service.update_candidate(candidate_id, {
                'match_percentage': match_data.get('match_percentage', 0),
                'status': 'Matched'
            })

        return jsonify({'status': 'success', 'data': match_data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
