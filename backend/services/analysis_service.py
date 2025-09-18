"""
Main analysis service orchestrating all rangoli analysis components.
"""
import time
from typing import Generator, Dict, Any
from datetime import datetime

from models import AnalysisResult, AnalysisProgress
from utils import load_and_preprocess_image, safe_convert_types
from config import settings

# Import existing analysis modules
from dots_analysis import analyze_dots
from symmetry_analysis import analyze_symmetry  
from lines_strokes_analysis import analyze_lines_strokes
from spatial_reasoning import analyze_spatial_reasoning
from pattern_recognition import analyze_pattern_recognition

class AnalysisService:
    """Service class for coordinating rangoli image analysis."""
    
    def __init__(self):
        self.analysis_stages = [
            ("Initializing", 5),
            ("Dot Detection", 25), 
            ("Symmetry Analysis", 20),
            ("Line & Stroke Analysis", 20),
            ("Spatial Reasoning", 15),
            ("Pattern Recognition", 15)
        ]
    
    def analyze_image(self, image_path: str) -> Generator[Dict[str, Any], None, None]:
        """
        Orchestrate complete rangoli image analysis with progress updates.
        
        Args:
            image_path: Path to the image file
            
        Yields:
            Progress updates and analysis results
        """
        start_time = time.time()
        
        try:
            # Immediate progress feedback
            yield self._create_progress_update(1, "Starting analysis system...", 20)
            
            # Load and validate image
            image, gray, dimensions = load_and_preprocess_image(image_path)
            if image is None or gray is None:
                yield {"error": "Could not read the image. It might be corrupted or unsupported."}
                return
            
            h, w = dimensions
            yield self._create_progress_update(5, "Image loaded successfully, preprocessing...", 15)
            
            # Initialize results container
            analysis_results = {}
            keypoints = []
            contours = []
            
            # Stage 1: Dot Analysis
            yield self._create_progress_update(10, "Starting dot analysis...", 12)
            try:
                dots_result = analyze_dots(gray, h, w)
                analysis_results['dots'] = dots_result
                keypoints = self._extract_keypoints_from_dots(dots_result)
                yield {"report_part": dots_result}
            except Exception as e:
                print(f"Dot analysis failed: {e}")
                analysis_results['dots'] = {"error": str(e), "dot_grid_analysis": []}
                yield {"report_part": analysis_results['dots']}
            
            # Stage 2: Symmetry Analysis
            yield self._create_progress_update(30, "Analyzing symmetry patterns...", 9)
            try:
                symmetry_result = analyze_symmetry(gray, h, w)
                analysis_results['symmetry'] = symmetry_result
                yield {"report_part": {"symmetry_analysis": symmetry_result}}
            except Exception as e:
                print(f"Symmetry analysis failed: {e}")
                analysis_results['symmetry'] = {"error": str(e), "overall_symmetry": "0.00%"}
                yield {"report_part": {"symmetry_analysis": analysis_results['symmetry']}}
            
            # Stage 3: Lines and Strokes Analysis
            yield self._create_progress_update(50, "Detecting lines and strokes...", 7)
            try:
                lines_result = analyze_lines_strokes(gray, h, w)
                analysis_results['lines'] = lines_result
                contours = self._extract_contours(gray)
                yield {"report_part": {"line_stroke_analysis": lines_result}}
            except Exception as e:
                print(f"Lines analysis failed: {e}")
                analysis_results['lines'] = {"error": str(e), "number_of_strokes": 0}
                yield {"report_part": {"line_stroke_analysis": analysis_results['lines']}}
            
            # Stage 4: Spatial Reasoning
            yield self._create_progress_update(70, "Performing spatial analysis...", 5)
            try:
                spatial_result = analyze_spatial_reasoning(gray, h, w, keypoints, contours)
                analysis_results['spatial'] = spatial_result
                yield {"report_part": {"spatial_reasoning": spatial_result}}
            except Exception as e:
                print(f"Spatial analysis failed: {e}")
                analysis_results['spatial'] = {"error": str(e), "pattern_coverage": "0.00%"}
                yield {"report_part": {"spatial_reasoning": analysis_results['spatial']}}
            
            # Stage 5: Pattern Recognition
            yield self._create_progress_update(85, "Recognizing cultural patterns...", 3)
            try:
                overall_symmetry = analysis_results['symmetry'].get("overall_symmetry", "0.00%")
                pattern_result = analyze_pattern_recognition(gray, h, w, contours, overall_symmetry)
                analysis_results['patterns'] = pattern_result
                yield {"report_part": {"pattern_recognition": pattern_result}}
            except Exception as e:
                print(f"Pattern recognition failed: {e}")
                analysis_results['patterns'] = {"error": str(e), "cultural_authenticity_score": "0.00%"}
                yield {"report_part": {"pattern_recognition": analysis_results['patterns']}}
            
            # Generate final comprehensive report
            yield self._create_progress_update(95, "Generating final report...", 1)
            final_report = self._generate_final_report(analysis_results, dimensions, start_time)
            
            yield self._create_progress_update(100, "Analysis complete!", 0)
            yield {"report": final_report}
            
            total_time = time.time() - start_time
            print(f"=== ANALYSIS COMPLETED IN {total_time:.2f}s ===")
            
        except Exception as e:
            print(f"Critical error in analysis service: {e}")
            yield {"error": f"Analysis failed: {str(e)}"}
    
    def _create_progress_update(self, progress: int, description: str, remaining_time: int) -> Dict[str, Any]:
        """Create standardized progress update."""
        return {
            "progress": progress,
            "description": description,
            "estimated_remaining_time": remaining_time
        }
    
    def _extract_keypoints_from_dots(self, dots_result: Dict[str, Any]) -> list:
        """Extract keypoints from dot analysis results."""
        import cv2
        keypoints = []
        
        if "dot_grid_analysis" in dots_result and dots_result["dot_grid_analysis"]:
            for dot in dots_result["dot_grid_analysis"]:
                kp = cv2.KeyPoint(float(dot["x"]), float(dot["y"]), float(dot["size"]))
                kp.response = float(dot["confidence"])
                keypoints.append(kp)
        
        return keypoints
    
    def _extract_contours(self, gray_image) -> list:
        """Extract contours from grayscale image."""
        import cv2
        
        try:
            edges = cv2.Canny(gray_image, 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            # Filter and limit contours for efficiency
            filtered_contours = [c for c in contours if cv2.contourArea(c) > 50][:200]
            return filtered_contours
        except Exception as e:
            print(f"Error extracting contours: {e}")
            return []
    
    def _generate_final_report(self, analysis_results: Dict[str, Any], dimensions: tuple, start_time: float) -> Dict[str, Any]:
        """Generate comprehensive final analysis report."""
        import numpy as np
        
        h, w = dimensions
        
        # Extract metrics safely
        total_dots = len(analysis_results.get('dots', {}).get("dot_grid_analysis", []))
        total_strokes = analysis_results.get('lines', {}).get("number_of_strokes", 0)
        
        symmetry_str = analysis_results.get('symmetry', {}).get("overall_symmetry", "0.00%")
        overall_symmetry_value = float(symmetry_str.replace('%', '')) if symmetry_str != "N/A" else 0.0
        
        authenticity_str = analysis_results.get('patterns', {}).get("cultural_authenticity_score", "0.00%")
        cultural_authenticity = float(authenticity_str.replace('%', '')) if authenticity_str != "N/A" else 0.0
        
        # Calculate overall quality score
        quality_factors = [
            min(100, total_dots * 2),  # Dot detection quality
            overall_symmetry_value,    # Symmetry quality
            min(100, total_strokes),   # Stroke detection quality  
            cultural_authenticity      # Cultural authenticity
        ]
        overall_quality = float(np.mean([f for f in quality_factors if f > 0])) if any(quality_factors) else 0.0
        
        # Determine predominant features
        feature_scores = {
            "geometric_dots": total_dots,
            "symmetrical_lines": int(overall_symmetry_value / 10),
            "cultural_patterns": int(cultural_authenticity / 10),
            "artistic_strokes": total_strokes
        }
        predominant_feature = max(feature_scores, key=feature_scores.get) if any(feature_scores.values()) else "basic_shapes"
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            overall_symmetry_value, cultural_authenticity, total_dots, total_strokes
        )
        
        return safe_convert_types({
            "image_dimensions": {
                "height": h,
                "width": w,
                "aspect_ratio": f"{w / h:.2f}:1",
                "total_pixels": h * w
            },
            "analysis_summary": {
                "overall_quality_score": f"{overall_quality:.2f}%",
                "total_dots_detected": total_dots,
                "total_strokes_detected": total_strokes,
                "symmetry_level": symmetry_str,
                "cultural_authenticity": authenticity_str,
                "predominant_features": predominant_feature,
                "artistic_style": analysis_results.get('patterns', {}).get("regional_style_suggestion", "Unknown"),
                "complexity_rating": analysis_results.get('patterns', {}).get("pattern_complexity_level", "Unknown")
            },
            "recommendations": {
                "improvement_suggestions": recommendations,
                "skill_development": analysis_results.get('patterns', {}).get("skill_level_required", "Intermediate"),
                "cultural_context": analysis_results.get('patterns', {}).get("spiritual_significance", "Traditional rangoli with cultural significance")
            },
            "performance_metrics": {
                "analysis_time": f"{time.time() - start_time:.2f}s",
                "dots_analysis_time": analysis_results.get('dots', {}).get("analysis_time", "0s"),
                "symmetry_analysis_time": analysis_results.get('symmetry', {}).get("analysis_time", "0s"), 
                "lines_analysis_time": analysis_results.get('lines', {}).get("analysis_time", "0s"),
                "spatial_analysis_time": analysis_results.get('spatial', {}).get("analysis_time", "0s"),
                "pattern_analysis_time": analysis_results.get('patterns', {}).get("analysis_time", "0s")
            },
            "analysis_completeness": "100%"
        })
    
    def _generate_recommendations(self, symmetry: float, authenticity: float, dots: int, strokes: int) -> list:
        """Generate intelligent recommendations based on analysis."""
        recommendations = []
        
        if symmetry < 50:
            recommendations.append(f"Enhance symmetry (current: {symmetry:.1f}%)")
        else:
            recommendations.append("Excellent symmetry maintained")
            
        if authenticity < 60:
            recommendations.append(f"Add more traditional elements (authenticity: {authenticity:.1f}%)")
        else:
            recommendations.append("Strong cultural authenticity")
            
        if dots < 10:
            recommendations.append(f"Increase dot precision (detected: {dots})")
        else:
            recommendations.append("Good dot detection")
            
        if strokes < 5:
            recommendations.append(f"Enhance stroke definition (detected: {strokes})")
        else:
            recommendations.append("Well-defined strokes")
        
        return recommendations[:3]  # Limit to top 3