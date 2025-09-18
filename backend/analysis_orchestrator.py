import cv2
import numpy as np
import time
import os

# Import all analysis modules
from dots_analysis import analyze_dots
from symmetry_analysis import analyze_symmetry
from lines_strokes_analysis import analyze_lines_strokes
from spatial_reasoning import analyze_spatial_reasoning
from pattern_recognition import analyze_pattern_recognition

def analyze_image(image_path):
    """
    Main orchestrator for seamless rangoli image analysis using modular approach.
    
    Args:
        image_path: The path to the image file.
        
    Yields:
        Dictionaries containing parts of the analysis report or progress updates.
    """
    try:
        start_time = time.time()
        
        # IMMEDIATE PROGRESS FEEDBACK - First thing to do!
        yield {"progress": 1, "description": "Starting analysis system...", "estimated_remaining_time": 20}
        
        print(f"Starting modular analysis of image: {image_path}")
        
        # Early progress update
        yield {"progress": 3, "description": "Loading image file...", "estimated_remaining_time": 18}
        
        # Load and validate image
        image = cv2.imread(image_path)
        if image is None:
            yield {"error": "Could not read the image. It might be corrupted or in an unsupported format."}
            return

        # Immediate feedback after successful load
        yield {"progress": 7, "description": "Image loaded successfully, preprocessing...", "estimated_remaining_time": 15}

        print(f"Image loaded successfully, shape: {image.shape}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        print(f"Converted to grayscale, dimensions: {h}x{w}")
        
        # Early progress update
        yield {"progress": 10, "description": "Image preprocessed, starting dot analysis...", "estimated_remaining_time": 12}
        
        # MODULE 1: DOT ANALYSIS
        print("=== Starting Dot Analysis Module ===")
        try:
            dots_result = analyze_dots(gray, h, w)
            # Check if dot analysis actually succeeded
            if "error" in dots_result:
                print(f"Dot analysis had error: {dots_result['error']}")
                # Still yield the result but with error info
                yield {"report_part": dots_result}
            else:
                yield {"report_part": dots_result}
                print(f"Dot analysis completed successfully - found {len(dots_result.get('dot_grid_analysis', []))} dots")
        except Exception as e:
            print(f"Dot analysis failed: {e}")
            dots_result = {
                "dot_grid_analysis": [],
                "dot_detection_methods": {},
                "dot_characteristics": {},
                "error": str(e)
            }
            yield {"report_part": dots_result}
        
        # Extract keypoints for spatial analysis
        keypoints = []
        if "dot_grid_analysis" in dots_result and dots_result["dot_grid_analysis"]:
            for dot in dots_result["dot_grid_analysis"]:
                kp = cv2.KeyPoint(float(dot["x"]), float(dot["y"]), float(dot["size"]))
                kp.response = float(dot["confidence"])
                keypoints.append(kp)
        
        yield {"progress": 25, "description": "Dot analysis complete, starting symmetry analysis...", "estimated_remaining_time": 9}
        
        # MODULE 2: SYMMETRY ANALYSIS
        print("=== Starting Symmetry Analysis Module ===")
        try:
            symmetry_result = analyze_symmetry(gray, h, w)
            yield {"report_part": {"symmetry_analysis": symmetry_result}}
            print("Symmetry analysis completed successfully")
        except Exception as e:
            print(f"Symmetry analysis failed: {e}")
            symmetry_result = {
                "horizontal_symmetry": "0.00%",
                "vertical_symmetry": "0.00%",
                "overall_symmetry": "0.00%",
                "error": str(e)
            }
            yield {"report_part": {"symmetry_analysis": symmetry_result}}
        
        yield {"progress": 45, "description": "Symmetry analysis complete, starting line and stroke analysis...", "estimated_remaining_time": 7}
        
        # MODULE 3: LINES AND STROKES ANALYSIS
        print("=== Starting Lines and Strokes Analysis Module ===")
        try:
            lines_strokes_result = analyze_lines_strokes(gray, h, w)
            yield {"report_part": {"line_stroke_analysis": lines_strokes_result}}
            print("Lines and strokes analysis completed successfully")
            
            # Extract contours for spatial analysis (simplified extraction)
            edges = cv2.Canny(gray, 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            # Filter contours
            contours = [c for c in contours if cv2.contourArea(c) > 50][:200]  # Limit for efficiency
            
        except Exception as e:
            print(f"Lines and strokes analysis failed: {e}")
            lines_strokes_result = {
                "number_of_strokes": 0,
                "total_length_of_lines": "0 pixels",
                "error": str(e)
            }
            yield {"report_part": {"line_stroke_analysis": lines_strokes_result}}
            contours = []
        
        yield {"progress": 65, "description": "Line analysis complete, starting spatial reasoning...", "estimated_remaining_time": 5}
        
        # MODULE 4: SPATIAL REASONING ANALYSIS
        print("=== Starting Spatial Reasoning Analysis Module ===")
        try:
            spatial_result = analyze_spatial_reasoning(gray, h, w, keypoints, contours)
            yield {"report_part": {"spatial_reasoning": spatial_result}}
            print("Spatial reasoning analysis completed successfully")
        except Exception as e:
            print(f"Spatial reasoning analysis failed: {e}")
            spatial_result = {
                "pattern_coverage": "0.00%",
                "center_alignment": "0.00%",
                "error": str(e)
            }
            yield {"report_part": {"spatial_reasoning": spatial_result}}
        
        yield {"progress": 80, "description": "Spatial analysis complete, starting pattern recognition...", "estimated_remaining_time": 3}
        
        # MODULE 5: PATTERN RECOGNITION AND CULTURAL ANALYSIS
        print("=== Starting Pattern Recognition Analysis Module ===")
        try:
            overall_symmetry = symmetry_result.get("overall_symmetry", "0.00%")
            pattern_result = analyze_pattern_recognition(gray, h, w, contours, overall_symmetry)
            yield {"report_part": {"pattern_recognition": pattern_result}}
            print("Pattern recognition analysis completed successfully")
        except Exception as e:
            print(f"Pattern recognition analysis failed: {e}")
            pattern_result = {
                "traditional_elements": {},
                "regional_style_suggestion": "Unknown",
                "cultural_authenticity_score": "0.00%",
                "error": str(e)
            }
            yield {"report_part": {"pattern_recognition": pattern_result}}
        
        yield {"progress": 95, "description": "All analyses complete, generating final report...", "estimated_remaining_time": 1}
        
        # FINAL COMPREHENSIVE REPORT
        print("=== Generating Final Comprehensive Report ===")
        
        # Extract key metrics for summary
        total_dots = len(dots_result.get("dot_grid_analysis", []))
        total_strokes = lines_strokes_result.get("number_of_strokes", 0)
        overall_symmetry_value = float(symmetry_result.get("overall_symmetry", "0").replace('%', ''))
        cultural_authenticity = float(pattern_result.get("cultural_authenticity_score", "0").replace('%', ''))
        
        # Calculate overall quality score
        quality_factors = [
            min(100, total_dots * 2),  # Dot detection quality
            overall_symmetry_value,    # Symmetry quality
            min(100, total_strokes),   # Stroke detection quality
            cultural_authenticity      # Cultural authenticity
        ]
        overall_quality = float(np.mean([f for f in quality_factors if f > 0]))
        
        # Determine predominant features
        feature_scores = {
            "geometric_dots": total_dots,
            "symmetrical_lines": int(overall_symmetry_value / 10),
            "cultural_patterns": int(cultural_authenticity / 10),
            "artistic_strokes": total_strokes
        }
        predominant_feature = max(feature_scores, key=feature_scores.get) if any(feature_scores.values()) else "basic_shapes"
        
        final_report = {
            "image_dimensions": {
                "height": int(h),
                "width": int(w),
                "aspect_ratio": f"{float(w / h):.2f}:1",
                "total_pixels": int(h * w)
            },
            "analysis_summary": {
                "overall_quality_score": f"{overall_quality:.2f}%",
                "total_dots_detected": total_dots,
                "total_strokes_detected": total_strokes,
                "symmetry_level": symmetry_result.get("overall_symmetry", "0.00%"),
                "cultural_authenticity": pattern_result.get("cultural_authenticity_score", "0.00%"),
                "predominant_features": predominant_feature,
                "artistic_style": pattern_result.get("regional_style_suggestion", "Unknown"),
                "complexity_rating": pattern_result.get("pattern_complexity_level", "Unknown")
            },
            "recommendations": {
                "improvement_suggestions": [
                    f"Enhance symmetry (current: {symmetry_result.get('overall_symmetry', '0%')})" if overall_symmetry_value < 50 else "Excellent symmetry maintained",
                    f"Add more traditional elements (authenticity: {pattern_result.get('cultural_authenticity_score', '0%')})" if cultural_authenticity < 60 else "Strong cultural authenticity",
                    f"Increase dot precision (detected: {total_dots})" if total_dots < 10 else "Good dot detection",
                    f"Enhance stroke definition (detected: {total_strokes})" if total_strokes < 5 else "Well-defined strokes"
                ][:3],  # Limit to top 3 suggestions
                "skill_development": pattern_result.get("skill_level_required", "Intermediate"),
                "cultural_context": pattern_result.get("spiritual_significance", "Traditional rangoli with cultural significance")
            },
            "modular_analysis_performance": {
                "dots_analysis_time": dots_result.get("analysis_time", "0s"),
                "symmetry_analysis_time": symmetry_result.get("analysis_time", "0s"),
                "lines_analysis_time": lines_strokes_result.get("analysis_time", "0s"),
                "spatial_analysis_time": spatial_result.get("analysis_time", "0s"),
                "pattern_analysis_time": pattern_result.get("analysis_time", "0s"),
                "total_analysis_time": f"{(time.time() - start_time):.2f}s"
            },
            "analysis_completeness": "100%"
        }
        
        yield {"progress": 100, "description": "Analysis complete!", "estimated_remaining_time": 0}
        yield {"report": final_report}
        
        total_time = time.time() - start_time
        print(f"=== MODULAR ANALYSIS COMPLETED IN {total_time:.2f}s ===")
        print(f"Dots: {total_dots}, Strokes: {total_strokes}, Symmetry: {overall_symmetry_value:.1f}%, Authenticity: {cultural_authenticity:.1f}%")
        
    except Exception as e:
        print(f"Critical error in analysis orchestrator: {str(e)}")
        yield {"error": f"Analysis failed: {str(e)}"}