from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for Next.js frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints under /api/v1
    from app.routes.parse_routes import parse_bp
    from app.routes.score_routes import score_bp
    from app.routes.match_routes import match_bp
    from app.routes.candidate_routes import candidate_bp
    from app.routes.job_routes import job_bp
    from app.routes.interview_routes import interview_bp
    from app.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(parse_bp, url_prefix='/api/v1')
    app.register_blueprint(score_bp, url_prefix='/api/v1')
    app.register_blueprint(match_bp, url_prefix='/api/v1')
    app.register_blueprint(candidate_bp, url_prefix='/api/v1')
    app.register_blueprint(job_bp, url_prefix='/api/v1')
    app.register_blueprint(interview_bp, url_prefix='/api/v1')
    app.register_blueprint(dashboard_bp, url_prefix='/api/v1')

    @app.route('/health', methods=['GET'])
    @app.route('/api/v1/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'service': 'RecruitFlow AI Backend API'}, 200

    return app
