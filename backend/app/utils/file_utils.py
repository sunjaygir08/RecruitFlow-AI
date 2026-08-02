import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder: str) -> str:
    if not allowed_file(file.filename):
        raise ValueError(f"File extension not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    filename = secure_filename(file.filename)
    os.makedirs(upload_folder, exist_ok=True)
    destination = os.path.join(upload_folder, filename)
    file.save(destination)
    return destination
