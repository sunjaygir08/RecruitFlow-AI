from flask import Blueprint, request, jsonify
from app.services.supabase_service import supabase_service

job_bp = Blueprint('job_bp', __name__)

@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """List all job requisitions."""
    jobs = supabase_service.get_all_jobs()
    return jsonify({'status': 'success', 'data': jobs}), 200

@job_bp.route('/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    """Fetch job requisition detail."""
    job = supabase_service.get_job_by_id(job_id)
    if not job:
        return jsonify({'status': 'error', 'message': 'Job not found'}), 404
    return jsonify({'status': 'success', 'data': job}), 200

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    """Create new job posting."""
    data = request.get_json() or {}
    job = supabase_service.create_job(data)
    return jsonify({'status': 'success', 'data': job}), 201
