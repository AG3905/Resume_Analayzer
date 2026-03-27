import os
from datetime import timedelta

def _validate_env_var(var_name):
    """Validate that an environment variable is set and not empty"""
    value = os.environ.get(var_name)
    if not value or value.strip() == '':
        raise ValueError(f"{var_name} environment variable must be set")
    return value

class Config:
    """Application configuration"""

    # Flask config
    SECRET_KEY = _validate_env_var('SECRET_KEY')

    # File upload config
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}

    # AI API configuration
    GEMINI_API_KEY = _validate_env_var('GEMINI_API_KEY')
    
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
