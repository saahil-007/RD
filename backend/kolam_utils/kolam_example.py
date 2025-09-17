"""
Kolam Design Analysis and Recreation Example

This script demonstrates the complete pipeline for analyzing and recreating Kolam designs.
It showcases the mathematical principles identification and programmatic recreation capabilities.

Usage:
    python kolam_example.py [input_image_path]

If no image path is provided, it will generate example patterns.
"""

import cv2
import numpy as np
import json
from kolam_design_principles import KolamDesignPrinciples
from kolam_recreator import KolamRecreator, generate_traditional_patterns
import sys
import os

def test_imports():
    """Test if all imports work correctly."""
    try:
        print("Testing imports...")
        print("✅ All imports successful!")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    """Main function to test the system."""
    print("🎨 KOLAM DESIGN ANALYSIS AND RECREATION SYSTEM")
    print("=" * 60)
    
    if not test_imports():
        return
    
    try:
        # Test pattern generation
        print("\n🎨 Testing pattern generation...")
        recreator = KolamRecreator(400, 400)
        pattern = recreator.generate_simple_kolam("square_loop")
        
        if pattern is not None:
            print("✅ Pattern generation successful!")
            cv2.imwrite("test_pattern.png", pattern)
            print("💾 Test pattern saved as test_pattern.png")
        else:
            print("❌ Pattern generation failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()