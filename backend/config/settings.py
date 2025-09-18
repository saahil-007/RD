"""
Configuration settings for the Rangoli Analysis backend.
"""
import os
from typing import Dict, Any

class Settings:
    """Application settings and configuration."""
    
    # Server Configuration
    HOST: str = "127.0.0.1"
    PORT: int = 5002
    DEBUG: bool = True
    
    # File Upload Configuration
    UPLOAD_FOLDER: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
    
    # Analysis Configuration
    ANALYSIS_CONFIG: Dict[str, Any] = {
        'max_keypoints_per_method': 2000,
        'max_total_keypoints': 3000,
        'min_contour_area': 50,
        'max_contours': 200,
        'default_confidence_threshold': 0.6
    }
    
    # Cultural Analysis Parameters
    CULTURAL_REGIONS: Dict[str, Dict[str, Any]] = {
        'tamil_nadu': {
            'patterns': ['kolam', 'mandala', 'lotus'],
            'colors': ['white', 'red', 'yellow'],
            'significance': 'Prosperity and spiritual protection'
        },
        'maharashtra': {
            'patterns': ['rangoli', 'paisley', 'geometric'],
            'colors': ['saffron', 'green', 'red'],
            'significance': 'Festival celebrations and good fortune'
        },
        'rajasthan': {
            'patterns': ['mandana', 'tribal', 'geometric'],
            'colors': ['red', 'white', 'yellow'],
            'significance': 'Traditional desert culture and hospitality'
        }
    }
    
    @classmethod
    def create_upload_dir(cls):
        """Create upload directory if it doesn't exist."""
        if not os.path.exists(cls.UPLOAD_FOLDER):
            os.makedirs(cls.UPLOAD_FOLDER)

# Global settings instance
settings = Settings()