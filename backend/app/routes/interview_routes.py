from flask import Blueprint, request, jsonify
from app.services.supabase_service import supabase_service
from app.services.calendar_service import calendar_service
from app.services.email_service import email_service
from app.services.gemini_service import gemini_service

interview_bp = Blueprint('interview_bp', __name__)

@interview_bp.route('/interviews', methods=['GET'])
def get_interviews():
    """List all scheduled interviews."""
    interviews = supabase_service.get_all_interviews()
    return jsonify({'status': 'success', 'data': interviews}), 200

@interview_bp.route('/interviews/schedule', methods=['POST'])
@interview_bp.route('/candidates/<candidate_id>/schedule', methods=['POST']) # Maintain backward compatibility
def schedule_interview(candidate_id=None):
    """Schedule candidate interview, generate Google Calendar link, send Resend email, and record in Supabase."""
    data = request.get_json() or {}
    cand_id = candidate_id or data.get('candidate_id')
    job_id = data.get('job_id') or 'job-201'
    date_str = data.get('date') or data.get('interview_date') or '2026-08-10'
    time_str = data.get('time') or data.get('interview_time') or '10:00 AM'

    if not cand_id:
        return jsonify({'status': 'error', 'message': 'candidate_id is required'}), 400

    candidate = supabase_service.get_candidate_by_id(cand_id)
    if not candidate:
        return jsonify({'status': 'error', 'message': 'Candidate not found'}), 404

    cand_name = candidate.get('name') or candidate.get('full_name') or 'Candidate'
    cand_email = candidate.get('email', 'candidate@example.com')

    # 1. Create Google Calendar invite
    calendar_res = calendar_service.create_event(cand_name, cand_email, date_str, time_str)
    cal_link = calendar_res.get('calendar_link', '')

    # 2. Dispatch email notification via Resend
    email_res = email_service.send_interview_email(cand_email, cand_name, date_str, time_str, cal_link)

    # 3. Save interview record in Supabase
    interview_record = supabase_service.create_interview({
        'candidate_id': cand_id,
        'job_id': job_id,
        'date': date_str,
        'time': time_str,
        'calendar_link': cal_link,
        'email_status': email_res.get('status', 'Sent')
    })

    # 4. Update candidate lifecycle status
    supabase_service.update_candidate(cand_id, {'status': 'Interview Scheduled'})

    return jsonify({
        'status': 'success',
        'message': 'Interview scheduled successfully',
        'data': interview_record
    }), 200

@interview_bp.route('/interview/questions', methods=['POST'])
def generate_questions():
    """AI Interview Copilot - Generate tailored interview questions."""
    data = request.get_json() or {}
    candidate_id = data.get('candidate_id')
    job_id = data.get('job_id')

    candidate = supabase_service.get_candidate_by_id(candidate_id) if candidate_id else {}
    job = supabase_service.get_job_by_id(job_id) if job_id else {}

    questions_data = gemini_service.generate_interview_questions(candidate, job)
    return jsonify({'status': 'success', 'data': questions_data}), 200
