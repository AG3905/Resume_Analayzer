import os
from datetime import timedelta

class Config:
    """Application configuration"""

    # Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # File upload config
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}

    # AI API configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    HUGGINGFACE_TOKEN = os.environ.get('HUGGINGFACE_TOKEN')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

    # Rate limiting
    RATE_LIMIT_PER_MINUTE = 10

    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'

    # CORS settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

    # Cache settings
    CACHE_TIMEOUT = timedelta(minutes=30)

    @staticmethod
    def init_app(app):
        """Initialize app with config"""

        # Create required directories
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs('reports', exist_ok=True)
        os.makedirs('logs', exist_ok=True)

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
