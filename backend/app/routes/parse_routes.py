import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify
from app.config import Config
from app.utils.pdf_extractor import extract_text_from_file
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service

parse_bp = Blueprint('parse_bp', __name__)

@parse_bp.route('/resume/upload', methods=['POST'])
@parse_bp.route('/upload-resume', methods=['POST']) # Maintain backward compatibility
def upload_resume():
    """Upload PDF/DOCX resume, extract text, parse via Gemini, and save to Supabase."""
    if 'resume' not in request.files and 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400

    file = request.files.get('resume') or request.files.get('file')
    if not file or file.filename == '':
        return jsonify({'status': 'error', 'message': 'Empty file provided'}), 400

    filename = secure_filename(file.filename)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        raw_text = extract_text_from_file(file_path)
        if not raw_text:
            return jsonify({'status': 'error', 'message': 'Could not extract text from document'}), 400

        parsed_profile = gemini_service.parse_resume(raw_text)
        candidate_record = supabase_service.create_candidate(parsed_profile)

        return jsonify({
            'status': 'success',
            'message': 'Resume processed successfully',
            'data': candidate_record
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@parse_bp.route('/resume/parse', methods=['POST'])
@parse_bp.route('/parse-resume', methods=['POST']) # Maintain backward compatibility
def parse_resume_text():
    """Parse raw resume text directly using Gemini AI."""
    data = request.get_json() or {}
    text = data.get('resume_text') or data.get('text') or ''
    if not text:
        return jsonify({'status': 'error', 'message': 'resume_text is required'}), 400

    try:
        parsed_profile = gemini_service.parse_resume(text)
        return jsonify({'status': 'success', 'data': parsed_profile}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
