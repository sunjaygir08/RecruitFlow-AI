from flask import jsonify
from typing import Any, Optional

def success_response(data: Any = None, message: str = "Success", status_code: int = 200):
    return jsonify({
        "status": "success",
        "message": message,
        "data": data
    }), status_code

def error_response(message: str = "An error occurred", status_code: int = 400, errors: Optional[Any] = None):
    return jsonify({
        "status": "error",
        "message": message,
        "errors": errors
    }), status_code
