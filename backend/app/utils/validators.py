from typing import Tuple, Optional, Dict, Any

def validate_parse_resume_request(data: Optional[Dict[str, Any]]) -> Tuple[bool, Optional[str]]:
    if not data:
        return False, "Request body must be a valid JSON object"
    if not data.get('file_path') and not data.get('resume_text'):
        return False, "Either 'file_path' or 'resume_text' must be provided"
    return True, None

def validate_score_candidate_request(data: Optional[Dict[str, Any]]) -> Tuple[bool, Optional[str]]:
    if not data:
        return False, "Request body must be a valid JSON object"
    if 'candidate' not in data and 'name' not in data and 'skills' not in data:
        return False, "Candidate details or 'candidate' object must be provided"
    return True, None

def validate_match_job_request(data: Optional[Dict[str, Any]]) -> Tuple[bool, Optional[str]]:
    if not data:
        return False, "Request body must be a valid JSON object"
    if not data.get('candidate'):
        return False, "Field 'candidate' is required"
    if not data.get('job'):
        return False, "Field 'job' is required"
    return True, None
