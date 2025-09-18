import cv2
import numpy as np
import time
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from scipy import spatial, ndimage
from skimage import measure, morphology
import math
from collections import Counter

def analyze_pattern_recognition(gray, h, w, contours, overall_symmetry):
    """
    Advanced pattern recognition and cultural analysis for rangoli patterns.
    
    Args:
        gray: Grayscale image
        h, w: Image dimensions
        contours: Detected contours from line analysis
        overall_symmetry: Overall symmetry score from symmetry analysis
        
    Returns:
        Dictionary containing pattern recognition analysis results
    """
    try:
        print("Starting pattern recognition and cultural analysis...")
        start_time = time.time()
        
        # Color analysis (convert to HSV for better color detection)
        # Note: This function receives grayscale, so we'll work with intensity patterns
        
        # Dominant intensity levels detection (simulating color analysis in grayscale)
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        dominant_intensities = []
        
        # Find peaks in histogram
        for i in range(1, 255):
            if hist[i] > hist[i-1] and hist[i] > hist[i+1] and hist[i] > np.max(hist) * 0.1:
                dominant_intensities.append(int(i))
        
        # Traditional rangoli patterns detection
        traditional_elements = {
            "lotus_patterns": 0,
            "geometric_mandalas": 0,
            "floral_motifs": 0,
            "peacock_patterns": 0,
            "paisley_designs": 0,
            "spiral_patterns": 0,
            "grid_patterns": 0,
            "star_patterns": 0
        }
        
        # Pattern analysis based on shape characteristics
        for contour in contours:
            if cv2.contourArea(contour) > 100:
                # Analyze contour for traditional patterns
                hull = cv2.convexHull(contour)
                hull_area = cv2.contourArea(hull)
                contour_area = cv2.contourArea(contour)
                
                if hull_area > 0:
                    solidity = contour_area / hull_area
                    
                    # Get contour properties
                    perimeter = cv2.arcLength(contour, True)
                    if perimeter > 0:
                        circularity = 4 * np.pi * contour_area / (perimeter * perimeter)
                    else:
                        circularity = 0
                    
                    # Bounding rectangle for aspect ratio
                    x, y, w_rect, h_rect = cv2.boundingRect(contour)
                    if h_rect > 0:
                        aspect_ratio = w_rect / h_rect
                    else:
                        aspect_ratio = 1
                    
                    # Pattern classification heuristics
                    if circularity > 0.7 and solidity > 0.8:  # Circular and solid
                        if contour_area > 1000:
                            traditional_elements["geometric_mandalas"] += 1
                        else:
                            traditional_elements["lotus_patterns"] += 1
                    elif 0.5 < solidity < 0.8:  # Medium solidity suggests organic shapes
                        if aspect_ratio > 2:  # Elongated
                            traditional_elements["paisley_designs"] += 1
                        else:
                            traditional_elements["floral_motifs"] += 1
                    elif solidity < 0.5:  # Low solidity suggests complex patterns
                        if circularity > 0.3:
                            traditional_elements["spiral_patterns"] += 1
                        else:
                            traditional_elements["peacock_patterns"] += 1
                    elif solidity > 0.9 and circularity < 0.3:  # Very solid but not circular
                        # Check for star patterns (many vertices with low circularity)
                        epsilon = 0.02 * cv2.arcLength(contour, True)
                        approx = cv2.approxPolyDP(contour, epsilon, True)
                        vertices = len(approx)
                        if vertices > 6:
                            traditional_elements["star_patterns"] += 1
                        else:
                            traditional_elements["grid_patterns"] += 1
        
        # Regional style classification with enhanced logic
        regional_style = "Unknown"
        style_confidence = 0.0
        
        # South Indian Kolam style indicators
        south_indian_score = 0
        if traditional_elements["geometric_mandalas"] > 3:
            south_indian_score += 3
        if traditional_elements["grid_patterns"] > 2:
            south_indian_score += 2
        if len(contours) > 20:  # High detail density
            south_indian_score += 2
        
        # North Indian Rangoli style indicators
        north_indian_score = 0
        if traditional_elements["floral_motifs"] > 3:
            north_indian_score += 3
        if traditional_elements["paisley_designs"] > 2:
            north_indian_score += 2
        if traditional_elements["peacock_patterns"] > 1:
            north_indian_score += 3
        
        # Bengali Alpona style indicators
        bengali_score = 0
        if traditional_elements["lotus_patterns"] > 2:
            bengali_score += 3
        if traditional_elements["floral_motifs"] > 2:
            bengali_score += 2
        if traditional_elements["spiral_patterns"] > 1:
            bengali_score += 2
        
        # Gujarati/Rajasthani style indicators
        western_score = 0
        if traditional_elements["star_patterns"] > 2:
            western_score += 3
        if traditional_elements["geometric_mandalas"] > 2:
            western_score += 2
        
        # Determine regional style
        scores = {
            "South Indian (Kolam)": south_indian_score,
            "North Indian (Rangoli)": north_indian_score,
            "Bengali (Alpona)": bengali_score,
            "Gujarati/Rajasthani": western_score
        }
        
        if max(scores.values()) > 0:
            regional_style = max(scores, key=scores.get)
            style_confidence = float(max(scores.values()) / 10.0 * 100)  # Convert to percentage
        else:
            regional_style = "Contemporary/Fusion"
            style_confidence = 50.0
        
        # Cultural authenticity score calculation
        authenticity_factors = []
        
        # Factor 1: Traditional pattern density
        total_traditional = sum(traditional_elements.values())
        pattern_density_score = min(100, total_traditional * 10)
        authenticity_factors.append(pattern_density_score)
        
        # Factor 2: Symmetry (traditional rangolis are highly symmetrical)
        symmetry_value = float(overall_symmetry.replace('%', '')) if isinstance(overall_symmetry, str) else float(overall_symmetry)
        authenticity_factors.append(min(100, symmetry_value))
        
        # Factor 3: Complexity appropriate to tradition
        complexity_score = min(100, len(contours) * 2)
        authenticity_factors.append(complexity_score)
        
        # Factor 4: Sacred geometry presence
        sacred_geometry_score = 0
        if traditional_elements["geometric_mandalas"] > 0:
            sacred_geometry_score += 30
        if traditional_elements["lotus_patterns"] > 0:
            sacred_geometry_score += 25
        if traditional_elements["star_patterns"] > 0:
            sacred_geometry_score += 20
        authenticity_factors.append(min(100, sacred_geometry_score))
        
        cultural_authenticity = float(np.mean(authenticity_factors))
        
        # Pattern complexity level determination
        total_elements = sum(traditional_elements.values())
        if total_elements > 20:
            complexity_level = "Expert"
        elif total_elements > 10:
            complexity_level = "High"
        elif total_elements > 5:
            complexity_level = "Medium"
        else:
            complexity_level = "Simple"
        
        # Spiritual significance assessment
        spiritual_indicators = []
        if traditional_elements["lotus_patterns"] > 0:
            spiritual_indicators.append("Lotus symbolism represents purity and enlightenment")
        if traditional_elements["geometric_mandalas"] > 0:
            spiritual_indicators.append("Mandala patterns facilitate meditation and cosmic connection")
        if symmetry_value > 60:
            spiritual_indicators.append("High symmetry indicates spiritual balance and harmony")
        if traditional_elements["star_patterns"] > 0:
            spiritual_indicators.append("Star patterns represent divine light and guidance")
        
        if spiritual_indicators:
            spiritual_significance = "High spiritual content with " + "; ".join(spiritual_indicators[:2])
        elif symmetry_value > 40:
            spiritual_significance = "Moderate spiritual qualities through geometric harmony"
        else:
            spiritual_significance = "Primarily decorative with artistic focus"
        
        # Skill level assessment
        skill_factors = []
        skill_factors.append(min(100, total_elements * 5))  # Pattern variety
        skill_factors.append(symmetry_value)  # Execution precision
        skill_factors.append(min(100, len(contours)))  # Detail level
        
        avg_skill = float(np.mean(skill_factors))
        if avg_skill > 75:
            skill_level = "Expert"
        elif avg_skill > 50:
            skill_level = "Intermediate"
        elif avg_skill > 25:
            skill_level = "Beginner-Intermediate"
        else:
            skill_level = "Beginner"
        
        # Color interpretation (based on intensity patterns in grayscale)
        color_symbolism = []
        if len(dominant_intensities) > 0:
            avg_intensity = np.mean(dominant_intensities)
            if avg_intensity > 200:
                color_symbolism.append("Bright tones suggest celebration and joy")
            elif avg_intensity > 128:
                color_symbolism.append("Balanced tones indicate harmony and peace")
            else:
                color_symbolism.append("Deep tones suggest contemplation and depth")
        
        # Festival and occasion analysis
        occasion_analysis = "Unknown"
        if traditional_elements["lotus_patterns"] > 3 and traditional_elements["geometric_mandalas"] > 2:
            occasion_analysis = "Likely for Diwali or major religious festival"
        elif traditional_elements["floral_motifs"] > 3:
            occasion_analysis = "Possibly for spring festivals or welcoming ceremonies"
        elif complexity_level == "Expert":
            occasion_analysis = "Elaborate design suitable for major celebrations or competitions"
        elif complexity_level == "Simple":
            occasion_analysis = "Daily practice or casual decoration"
        
        analysis_time = time.time() - start_time
        print(f"Pattern recognition analysis completed in {analysis_time:.2f}s")
        
        return {
            "traditional_elements": traditional_elements,
            "regional_style_suggestion": regional_style,
            "regional_style_confidence": f"{style_confidence:.1f}%",
            "cultural_authenticity_score": f"{cultural_authenticity:.2f}%",
            "dominant_intensity_levels": dominant_intensities,
            "pattern_complexity_level": complexity_level,
            "spiritual_significance": spiritual_significance,
            "skill_level_required": skill_level,
            "color_symbolism": color_symbolism,
            "occasion_analysis": occasion_analysis,
            "pattern_density": f"{total_elements} traditional elements detected",
            "cultural_elements_breakdown": {
                "sacred_geometry": traditional_elements["geometric_mandalas"] + traditional_elements["star_patterns"],
                "nature_motifs": traditional_elements["lotus_patterns"] + traditional_elements["floral_motifs"],
                "cultural_symbols": traditional_elements["peacock_patterns"] + traditional_elements["paisley_designs"],
                "structural_patterns": traditional_elements["grid_patterns"] + traditional_elements["spiral_patterns"]
            },
            "authenticity_factors": {
                "pattern_density": f"{pattern_density_score:.1f}%",
                "symmetry_quality": f"{symmetry_value:.1f}%",
                "complexity_appropriateness": f"{complexity_score:.1f}%",
                "sacred_geometry_presence": f"{sacred_geometry_score:.1f}%"
            },
            "analysis_time": f"{analysis_time:.2f}s"
        }
        
    except Exception as e:
        print(f"Error in pattern recognition analysis: {str(e)}")
        return {
            "error": f"Pattern recognition analysis failed: {str(e)}",
            "traditional_elements": {},
            "regional_style_suggestion": "Unknown",
            "cultural_authenticity_score": "0.00%",
            "pattern_complexity_level": "Unknown",
            "spiritual_significance": "Analysis failed",
            "skill_level_required": "Unknown"
        }