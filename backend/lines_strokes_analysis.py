import cv2
import numpy as np
import math
import time
from skimage.morphology import skeletonize

def analyze_lines_strokes(gray, h, w):
    """
    Comprehensive line and stroke analysis for rangoli patterns.
    
    Args:
        gray: Grayscale image
        h, w: Image dimensions
        
    Returns:
        Dictionary containing line and stroke analysis results
    """
    try:
        print("Starting lines and strokes analysis...")
        start_time = time.time()
        
        # Multi-threshold Canny Edge Detection
        print("Performing edge detection...")
        edges_ultra_low = cv2.Canny(gray, 20, 80)
        edges_low = cv2.Canny(gray, 30, 100)
        edges_med = cv2.Canny(gray, 50, 150)
        edges_high = cv2.Canny(gray, 100, 200)
        edges_ultra_high = cv2.Canny(gray, 150, 250)
        
        # Advanced Hough Line Detection with multiple parameter sets
        print("Starting Hough line detection...")
        lines_hough_standard = cv2.HoughLines(edges_med, 1, np.pi/180, threshold=50)
        lines_hough_sensitive = cv2.HoughLines(edges_low, 1, np.pi/180, threshold=30)
        lines_houghP_long = cv2.HoughLinesP(edges_med, 1, np.pi/180, threshold=50, minLineLength=50, maxLineGap=10)
        lines_houghP_short = cv2.HoughLinesP(edges_high, 1, np.pi/180, threshold=30, minLineLength=20, maxLineGap=5)
        lines_houghP_gaps = cv2.HoughLinesP(edges_low, 1, np.pi/180, threshold=40, minLineLength=30, maxLineGap=20)
        print(f"Hough detection completed: standard={len(lines_hough_standard) if lines_hough_standard is not None else 0}, sensitive={len(lines_hough_sensitive) if lines_hough_sensitive is not None else 0}")
        
        # Morphological Line Extraction (multiple orientations)
        kernel_horizontal = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
        kernel_vertical = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 25))
        kernel_diagonal1 = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
        kernel_diagonal2 = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 10))
        
        horizontal_lines = cv2.morphologyEx(edges_med, cv2.MORPH_OPEN, kernel_horizontal)
        vertical_lines = cv2.morphologyEx(edges_med, cv2.MORPH_OPEN, kernel_vertical)
        diagonal_lines1 = cv2.morphologyEx(edges_med, cv2.MORPH_OPEN, kernel_diagonal1)
        diagonal_lines2 = cv2.morphologyEx(edges_high, cv2.MORPH_OPEN, kernel_diagonal2)
        
        # Multi-threshold Contour Detection with filtering
        contours_ultra_low, _ = cv2.findContours(edges_ultra_low, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours_low, hierarchy_low = cv2.findContours(edges_low, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours_med, hierarchy_med = cv2.findContours(edges_med, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours_high, _ = cv2.findContours(edges_high, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours_ultra_high, _ = cv2.findContours(edges_ultra_high, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Skeletonization for stroke centerlines
        binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        skeleton = skeletonize(binary // 255).astype(np.uint8) * 255
        skeleton_contours, _ = cv2.findContours(skeleton, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Line Segment Detector (LSD)
        lsd_lines = []
        try:
            lsd = cv2.createLineSegmentDetector()
            detected_lines = lsd.detect(gray)
            if detected_lines is not None and len(detected_lines) > 0:
                lsd_lines = detected_lines[0] if detected_lines[0] is not None else []
            else:
                lsd_lines = []
        except Exception as e:
            print(f"LSD detection failed: {e}")
            lsd_lines = []
        
        # Contour approximation for geometric stroke analysis
        approximated_contours = []
        for contour in contours_med:
            if cv2.contourArea(contour) > 50:
                epsilon = 0.01 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                approximated_contours.append(approx)
        
        # Combine and intelligently filter all contours
        all_contours = contours_ultra_low + contours_low + contours_med + contours_high + contours_ultra_high + skeleton_contours
        
        # Advanced contour filtering with multiple criteria
        filtered_contours = []
        seen_areas = set()
        
        for contour in all_contours:
            area = cv2.contourArea(contour)
            perimeter = cv2.arcLength(contour, True)
            
            # Multi-criteria filtering
            if (area > 20 and                           # Minimum area
                perimeter > 10 and                      # Minimum perimeter
                area < h * w * 0.8 and                  # Not too large (not whole image)
                area not in seen_areas):                # Avoid duplicates
                
                # Check if this contour is too similar to existing ones
                is_duplicate = False
                for existing in filtered_contours:
                    try:
                        similarity = cv2.matchShapes(contour, existing, cv2.CONTOURS_MATCH_I1, 0.0)
                        if similarity < 0.1:  # Very similar shapes
                            is_duplicate = True
                            break
                    except:
                        continue
                
                if not is_duplicate:
                    filtered_contours.append(contour)
                    seen_areas.add(area)
        
        contours = filtered_contours
        hierarchy = hierarchy_med  # Use medium threshold hierarchy as primary
        
        # Advanced line analysis
        line_detection_stats = {
            "canny_low_edges": int(np.sum(edges_low > 0)),
            "canny_med_edges": int(np.sum(edges_med > 0)),
            "canny_high_edges": int(np.sum(edges_high > 0)),
            "hough_lines_standard": len(lines_hough_standard) if lines_hough_standard is not None else 0,
            "hough_lines_sensitive": len(lines_hough_sensitive) if lines_hough_sensitive is not None else 0,
            "houghP_long_lines": len(lines_houghP_long) if lines_houghP_long is not None else 0,
            "houghP_short_lines": len(lines_houghP_short) if lines_houghP_short is not None else 0,
            "houghP_gap_lines": len(lines_houghP_gaps) if lines_houghP_gaps is not None else 0,
            "lsd_lines": len(lsd_lines) if lsd_lines is not None else 0,
            "horizontal_line_pixels": int(np.sum(horizontal_lines > 0)),
            "vertical_line_pixels": int(np.sum(vertical_lines > 0)),
            "total_contours_found": len(contours),
            "contours_after_filtering": len(filtered_contours)
        }
        
        # Basic metrics
        total_length = float(sum(cv2.arcLength(c, True) for c in contours))
        
        # Detailed stroke analysis
        stroke_analysis = {
            "continuous_strokes": 0,
            "broken_strokes": 0,
            "curved_lines": 0,
            "straight_lines": 0,
            "thick_strokes": 0,
            "thin_strokes": 0,
            "decorative_elements": 0
        }
        
        # Shape classification with cultural context
        shapes_detected = {
            "circles": 0,           # Represents completeness, cosmos
            "triangles": 0,        # Divine trinity, fire element
            "rectangles": 0,       # Earth element, stability
            "polygons": 0,         # Sacred geometry
            "complex_shapes": 0,   # Artistic elaboration
            "lotus_petals": 0,     # Purity, spiritual awakening
            "paisley_forms": 0,    # Life force, fertility
            "mandala_rings": 0     # Cosmic cycles
        }
        
        # Detailed stroke characteristics
        stroke_characteristics = []
        shape_complexities = []
        cultural_elements = []
        
        for i, contour in enumerate(contours):
            if cv2.contourArea(contour) > 50:  # Filter small noise
                # Basic shape analysis
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                vertices = len(approx)
                area = cv2.contourArea(contour)
                perimeter = cv2.arcLength(contour, True)
                
                # Stroke continuity analysis
                if hierarchy is not None and i < len(hierarchy[0]):
                    parent = hierarchy[0][i][3]
                    if parent == -1:  # Outer contour
                        stroke_analysis["continuous_strokes"] += 1
                    else:
                        stroke_analysis["broken_strokes"] += 1
                
                # Curvature analysis
                if perimeter > 0:
                    circularity = 4 * math.pi * area / (perimeter * perimeter)
                    if circularity > 0.7:
                        stroke_analysis["curved_lines"] += 1
                        shapes_detected["circles"] += 1
                        cultural_elements.append("Circle: Symbol of completeness and cosmic unity")
                    elif vertices <= 4:
                        stroke_analysis["straight_lines"] += 1
                
                # Cultural shape classification
                if vertices == 3:
                    shapes_detected["triangles"] += 1
                    cultural_elements.append("Triangle: Represents divine trinity (Brahma, Vishnu, Shiva)")
                elif vertices == 4:
                    shapes_detected["rectangles"] += 1
                    cultural_elements.append("Rectangle: Earth element, stability and foundation")
                elif 5 <= vertices <= 8:
                    shapes_detected["polygons"] += 1
                    cultural_elements.append(f"{vertices}-sided polygon: Sacred geometric form in Vedic tradition")
                elif vertices > 8:
                    if circularity > 0.5:
                        shapes_detected["mandala_rings"] += 1
                        cultural_elements.append("Mandala ring: Cosmic cycle and spiritual journey")
                    else:
                        shapes_detected["complex_shapes"] += 1
                
                # Advanced pattern recognition for cultural elements
                try:
                    hull = cv2.convexHull(contour)
                    hull_area = cv2.contourArea(hull)
                    if hull_area > 0:
                        solidity = area / hull_area
                        bbox = cv2.boundingRect(contour)
                        if bbox[3] > 0:  # Check height > 0
                            aspect_ratio = float(bbox[2] / bbox[3])
                            
                            # Lotus petal detection (elongated, moderate solidity)
                            if 0.3 < solidity < 0.8 and 1.5 < aspect_ratio < 4.0:
                                shapes_detected["lotus_petals"] += 1
                                cultural_elements.append("Lotus petal: Symbol of purity and spiritual awakening")
                            
                            # Paisley detection (curved, low solidity)
                            elif solidity < 0.6 and 0.8 < aspect_ratio < 2.5:
                                shapes_detected["paisley_forms"] += 1
                                cultural_elements.append("Paisley: Life force and fertility symbol")
                except Exception as e:
                    print(f"Pattern recognition failed for contour: {e}")
                    continue
                
                # Stroke thickness analysis (approximated)
                if area > 0 and perimeter > 0:
                    stroke_width = area / perimeter
                    if stroke_width > 3:
                        stroke_analysis["thick_strokes"] += 1
                    else:
                        stroke_analysis["thin_strokes"] += 1
                
                # Decorative element detection
                if area < 500 and vertices > 6:  # Small complex shapes are likely decorative
                    stroke_analysis["decorative_elements"] += 1
                
                # Calculate shape complexity with cultural weight
                complexity = float(vertices + (cv2.arcLength(contour, True) / 100))
                
                # Add cultural complexity bonus
                if vertices == 3:  # Sacred triangle
                    complexity += 2
                elif circularity > 0.8:  # Perfect circle
                    complexity += 3
                elif vertices == 8:  # Ashtakona (8-pointed star)
                    complexity += 4
                
                shape_complexities.append(complexity)
        
        # Stroke rhythm and flow analysis
        contour_lengths = []
        for c in contours:
            try:
                if cv2.contourArea(c) > 50:
                    length = cv2.arcLength(c, True)
                    if length > 0:
                        contour_lengths.append(length)
            except:
                continue
                
        if contour_lengths and len(contour_lengths) > 0:
            mean_length = float(np.mean(contour_lengths))
            std_length = float(np.std(contour_lengths))
            var_length = float(np.var(contour_lengths))
            
            # Avoid division by zero
            rhythm_consistency = 100.0
            if mean_length > 0:
                rhythm_consistency = 100 - min(100, std_length / mean_length * 50)
            
            stroke_rhythm = {
                "average_stroke_length": f"{mean_length:.2f} pixels",
                "stroke_length_variance": f"{var_length:.2f}",
                "rhythm_consistency": f"{rhythm_consistency:.2f}%"
            }
        else:
            stroke_rhythm = {
                "average_stroke_length": "0 pixels",
                "stroke_length_variance": "0",
                "rhythm_consistency": "0%"
            }
        
        # Artistic technique assessment
        total_strokes = len([c for c in contours if cv2.contourArea(c) > 50])
        if total_strokes > 0:
            continuous_ratio = stroke_analysis["continuous_strokes"] / total_strokes
            classical_shapes = shapes_detected["circles"] + shapes_detected["triangles"]
            traditional_elements = shapes_detected["lotus_petals"] + shapes_detected["mandala_rings"]
            
            # Extract rhythm consistency value safely
            rhythm_consistency_str = stroke_rhythm["rhythm_consistency"].replace('%', '')
            try:
                rhythm_consistency_val = float(rhythm_consistency_str)
            except:
                rhythm_consistency_val = 0.0
            
            technique_assessment = {
                "precision_level": "High" if continuous_ratio > 0.7 else "Medium" if continuous_ratio > 0.4 else "Free-form",
                "artistic_style": "Classical" if classical_shapes > total_strokes * 0.5 else "Contemporary",
                "cultural_authenticity": "Traditional" if traditional_elements > 0 else "Modern interpretation",
                "skill_indication": "Expert" if stroke_analysis["decorative_elements"] > 5 and rhythm_consistency_val > 70 else "Intermediate"
            }
        else:
            technique_assessment = {
                "precision_level": "Unknown",
                "artistic_style": "Unknown", 
                "cultural_authenticity": "Unknown",
                "skill_indication": "Beginner"
            }
        
        # Geometric complexity metrics
        avg_complexity = float(np.mean(shape_complexities)) if shape_complexities else 0.0
        complexity_variance = float(np.var(shape_complexities)) if shape_complexities else 0.0
        
        # Ensure all numeric values are JSON serializable
        def ensure_json_serializable(value):
            if isinstance(value, (np.integer, np.int64)):
                return int(value)
            elif isinstance(value, (np.floating, np.float64)):
                return float(value)
            elif isinstance(value, np.ndarray):
                return value.tolist()
            return value
        
        # Cultural pattern density
        cultural_pattern_count = (shapes_detected["lotus_petals"] + shapes_detected["paisley_forms"] + 
                                shapes_detected["mandala_rings"])
        cultural_density = (cultural_pattern_count / max(1, total_strokes)) * 100
        
        analysis_time = time.time() - start_time
        print(f"Lines and strokes analysis completed in {analysis_time:.2f}s")
        
        return {
            "number_of_strokes": ensure_json_serializable(total_strokes),
            "total_length_of_lines": f"{ensure_json_serializable(total_length):.2f} pixels",
            "line_detection_methods": {k: ensure_json_serializable(v) for k, v in line_detection_stats.items()},
            "stroke_analysis": {k: ensure_json_serializable(v) for k, v in stroke_analysis.items()},
            "shapes_detected": {k: ensure_json_serializable(v) for k, v in shapes_detected.items()},
            "stroke_rhythm": stroke_rhythm,
            "technique_assessment": technique_assessment,
            "cultural_elements_found": cultural_elements[:10],  # Limit to prevent overflow
            "geometric_complexity": f"{ensure_json_serializable(avg_complexity):.2f}",
            "pattern_uniformity": f"{ensure_json_serializable(100 - min(100, complexity_variance * 10)):.2f}%",
            "detail_density": f"{ensure_json_serializable(float(total_strokes) / (h * w) * 10000):.2f} details/area",
            "cultural_pattern_density": f"{ensure_json_serializable(cultural_density):.2f}%",
            "artistic_flow": "Harmonious" if rhythm_consistency_val > 60 else "Varied" if rhythm_consistency_val > 30 else "Irregular",
            "analysis_time": f"{analysis_time:.2f}s"
        }
        
    except Exception as e:
        print(f"Error in lines and strokes analysis: {str(e)}")
        return {
            "error": f"Lines and strokes analysis failed: {str(e)}",
            "number_of_strokes": 0,
            "total_length_of_lines": "0 pixels",
            "line_detection_methods": {},
            "stroke_analysis": {},
            "shapes_detected": {},
            "stroke_rhythm": {}
        }