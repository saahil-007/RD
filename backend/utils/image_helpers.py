"""
Image processing utility functions.
"""
import cv2
import numpy as np
from typing import Tuple, Optional, List
import os

def validate_image_file(file_path: str, allowed_extensions: set) -> bool:
    """Validate if the file is a supported image format."""
    if not os.path.exists(file_path):
        return False
    
    _, ext = os.path.splitext(file_path.lower())
    return ext in allowed_extensions

def load_and_preprocess_image(image_path: str) -> Tuple[Optional[np.ndarray], Optional[np.ndarray], Optional[Tuple[int, int]]]:
    """
    Load and preprocess image for analysis.
    
    Returns:
        Tuple of (original_image, grayscale_image, dimensions)
    """
    try:
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            return None, None, None
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        
        return image, gray, (h, w)
    except Exception as e:
        print(f"Error loading image {image_path}: {e}")
        return None, None, None

def safe_convert_types(data):
    """Safely convert NumPy types to native Python types for JSON serialization."""
    if isinstance(data, dict):
        return {key: safe_convert_types(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [safe_convert_types(item) for item in data]
    elif isinstance(data, np.integer):
        return int(data)
    elif isinstance(data, np.floating):
        return float(data)
    elif isinstance(data, np.ndarray):
        return data.tolist()
    else:
        return data

def create_safe_filename(original_filename: str) -> str:
    """Create a safe filename for uploaded files."""
    import uuid
    import time
    
    # Get file extension
    _, ext = os.path.splitext(original_filename)
    
    # Create unique filename with timestamp
    timestamp = int(time.time())
    unique_id = str(uuid.uuid4())[:8]
    
    return f"rangoli_{timestamp}_{unique_id}{ext}"

def cleanup_temp_file(file_path: str) -> bool:
    """Safely remove temporary file."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Error cleaning up file {file_path}: {e}")
    return False

def resize_image_if_large(image: np.ndarray, max_dimension: int = 2048) -> np.ndarray:
    """Resize image if it's too large to prevent memory issues."""
    h, w = image.shape[:2]
    max_current = max(h, w)
    
    if max_current > max_dimension:
        scale = max_dimension / max_current
        new_h, new_w = int(h * scale), int(w * scale)
        return cv2.resize(image, (new_w, new_h))
    
    return image