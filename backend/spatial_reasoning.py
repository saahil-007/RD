import cv2
import numpy as np
import time
from sklearn.cluster import DBSCAN
from scipy import spatial

def analyze_spatial_reasoning(gray, h, w, keypoints, contours):
    """
    Advanced spatial reasoning and cultural context analysis for rangoli patterns.
    
    Args:
        gray: Grayscale image
        h, w: Image dimensions
        keypoints: Detected keypoints from dot analysis
        contours: Detected contours from line analysis
        
    Returns:
        Dictionary containing spatial reasoning analysis results
    """
    try:
        print("Starting spatial reasoning analysis...")
        start_time = time.time()
        
        center_x, center_y = w // 2, h // 2
        
        # Dot distribution analysis with cultural context
        dot_positions = [(kp.pt[0], kp.pt[1]) for kp in keypoints] if keypoints else []
        print(f"Processing {len(dot_positions)} dot positions and {len(contours)} contours for spatial analysis")
        
        # Advanced spatial analysis
        spatial_insights = {
            "sacred_geometry_presence": False,
            "mandala_structure": False,
            "cardinal_direction_alignment": False,
            "golden_ratio_proportions": False,
            "fibonacci_spiral_pattern": False
        }
        
        if len(dot_positions) > 3:
            # Cluster analysis for pattern detection
            clustering = DBSCAN(eps=50, min_samples=2).fit(dot_positions)
            n_clusters = len(set(clustering.labels_)) - (1 if -1 in clustering.labels_ else 0)
            
            # Calculate spread and distribution
            positions_array = np.array(dot_positions)
            spread_x = float(np.std(positions_array[:, 0])) if len(positions_array) > 1 else 0.0
            spread_y = float(np.std(positions_array[:, 1])) if len(positions_array) > 1 else 0.0
            
            # Center tendency and sacred geometry analysis
            dot_centroid = np.mean(positions_array, axis=0)
            
            # Check for sacred geometry patterns
            if len(dot_positions) >= 5:
                # Check for pentagon/pentagram (sacred in many traditions)
                from scipy.spatial.distance import pdist
                distances = pdist(positions_array)
                if len(set(np.round(distances, 1))) <= 3:  # Few distinct distances suggest sacred geometry
                    spatial_insights["sacred_geometry_presence"] = True
            
            # Mandala structure detection (concentric patterns)
            center_distances = [float(np.sqrt((x - center_x)**2 + (y - center_y)**2)) for x, y in dot_positions]
            avg_distance_from_center = float(np.mean(center_distances))
            distance_std = float(np.std(center_distances))
            
            # Check for concentric ring patterns (mandala characteristic)
            if distance_std < avg_distance_from_center * 0.3 and len(dot_positions) > 8:
                spatial_insights["mandala_structure"] = True
            
            # Golden ratio analysis (1.618...)
            golden_ratio = 1.618
            if w > 0 and h > 0:
                aspect_ratio = max(w, h) / min(w, h)
                if abs(aspect_ratio - golden_ratio) < 0.1:
                    spatial_insights["golden_ratio_proportions"] = True
            
            # Cardinal direction alignment (N-S-E-W)
            if abs(spread_x - spread_y) < min(spread_x, spread_y) * 0.2:
                spatial_insights["cardinal_direction_alignment"] = True
                
        else:
            n_clusters = 0
            spread_x = spread_y = 0.0
            dot_centroid = np.array([0.0, 0.0])
            avg_distance_from_center = 0.0
            distance_std = 0.0
        
        # Enhanced contour spatial analysis
        contour_centroids = []
        contour_areas = []
        contour_spatial_features = {
            "radial_distribution": [],
            "angular_distribution": [],
            "size_distribution": []
        }
        
        for c in contours:
            area = cv2.contourArea(c)
            if area > 10:  # Filter tiny contours
                M = cv2.moments(c)
                if M["m00"] != 0:
                    cX = int(M["m10"] / M["m00"])
                    cY = int(M["m01"] / M["m00"])
                    contour_centroids.append((cX, cY))
                    contour_areas.append(area)
                    
                    # Calculate radial distance from center
                    radial_dist = float(np.sqrt((cX - center_x)**2 + (cY - center_y)**2))
                    contour_spatial_features["radial_distribution"].append(radial_dist)
                    
                    # Calculate angular position
                    angle = float(np.arctan2(cY - center_y, cX - center_x) * 180 / np.pi)
                    contour_spatial_features["angular_distribution"].append(angle)
                    
                    # Size relative to center distance
                    size_ratio = area / max(1, radial_dist)
                    contour_spatial_features["size_distribution"].append(size_ratio)
        
        avg_contour_centroid = np.mean(contour_centroids, axis=0) if contour_centroids else np.array([0.0, 0.0])
        
        # Cultural spatial analysis
        cultural_spatial_patterns = {
            "energy_flow": "Unknown",
            "spiritual_direction": "Unknown",
            "cultural_orientation": "Unknown",
            "symbolic_balance": "Unknown"
        }
        
        if contour_spatial_features["angular_distribution"]:
            # Analyze angular distribution for cultural patterns
            angles = np.array(contour_spatial_features["angular_distribution"])
            
            # Check for cardinal directions (0°, 90°, 180°, 270°)
            cardinal_angles = [0, 90, 180, 270, -90, -180]
            cardinal_alignment = sum(1 for angle in angles if any(abs(angle - card) < 15 for card in cardinal_angles))
            
            if cardinal_alignment > len(angles) * 0.5:
                cultural_spatial_patterns["cultural_orientation"] = "Cardinal (N-S-E-W aligned, traditional)"
                cultural_spatial_patterns["spiritual_direction"] = "Four directions represent cosmic order"
            
            # Check for octagonal symmetry (8-fold, common in Indian art)
            octagon_angles = [0, 45, 90, 135, 180, 225, 270, 315]
            octagon_alignment = sum(1 for angle in angles if any(abs(angle - oct) < 10 for oct in octagon_angles))
            
            if octagon_alignment > len(angles) * 0.4:
                cultural_spatial_patterns["cultural_orientation"] = "Octagonal (Ashtadik, eight-directional)"
                cultural_spatial_patterns["spiritual_direction"] = "Eight directions in Hindu cosmology"
        
        # Energy flow analysis based on stroke patterns
        if contour_spatial_features["radial_distribution"]:
            radial_variance = float(np.var(contour_spatial_features["radial_distribution"]))
            radial_mean = float(np.mean(contour_spatial_features["radial_distribution"]))
            
            if radial_variance < radial_mean * 0.1:
                cultural_spatial_patterns["energy_flow"] = "Concentric (inward-focused meditation)"
            elif max(contour_spatial_features["radial_distribution"]) > radial_mean * 2:
                cultural_spatial_patterns["energy_flow"] = "Radiating (outward expansion of consciousness)"
            else:
                cultural_spatial_patterns["energy_flow"] = "Balanced (harmony between inner and outer)"
        
        # Symbolic balance assessment
        if len(contour_centroids) > 4:
            # Calculate distribution symmetry
            centroid_distances_from_center = [np.sqrt((x - center_x)**2 + (y - center_y)**2) for x, y in contour_centroids]
            quadrant_counts = [0, 0, 0, 0]  # NE, NW, SW, SE
            
            for x, y in contour_centroids:
                if x >= center_x and y >= center_y:
                    quadrant_counts[0] += 1  # NE
                elif x < center_x and y >= center_y:
                    quadrant_counts[1] += 1  # NW
                elif x < center_x and y < center_y:
                    quadrant_counts[2] += 1  # SW
                else:
                    quadrant_counts[3] += 1  # SE
            
            balance_variance = float(np.var(quadrant_counts))
            if balance_variance < 1.0:
                cultural_spatial_patterns["symbolic_balance"] = "Perfect (equal in all directions)"
            elif balance_variance < 4.0:
                cultural_spatial_patterns["symbolic_balance"] = "Good (minor asymmetry for dynamism)"
            else:
                cultural_spatial_patterns["symbolic_balance"] = "Artistic (emphasis on specific directions)"
        
        # Pattern density analysis with cultural meaning
        total_area = float(h * w)
        pattern_coverage = float(sum(contour_areas)) / total_area * 100 if contour_areas else 0.0
        
        # Sacred proportion analysis
        sacred_proportions = {
            "coverage_interpretation": "Unknown",
            "density_meaning": "Unknown",
            "space_utilization": "Unknown"
        }
        
        if pattern_coverage > 70:
            sacred_proportions["coverage_interpretation"] = "Dense (abundance and prosperity)"
            sacred_proportions["density_meaning"] = "Rich detail suggests celebration or important occasion"
        elif pattern_coverage > 40:
            sacred_proportions["coverage_interpretation"] = "Moderate (balanced harmony)"
            sacred_proportions["density_meaning"] = "Balanced approach to decoration and meaning"
        elif pattern_coverage > 15:
            sacred_proportions["coverage_interpretation"] = "Minimal (focused intention)"
            sacred_proportions["density_meaning"] = "Essential elements only, meditation focus"
        else:
            sacred_proportions["coverage_interpretation"] = "Sparse (symbolic representation)"
            sacred_proportions["density_meaning"] = "Abstract or conceptual approach"
        
        if pattern_coverage > 0:
            if total_area > 0:
                space_ratio = (total_area - sum(contour_areas)) / total_area
                if space_ratio > 0.7:
                    sacred_proportions["space_utilization"] = "Negative space emphasized (breathing room for spirit)"
                elif space_ratio > 0.4:
                    sacred_proportions["space_utilization"] = "Balanced positive/negative space"
                else:
                    sacred_proportions["space_utilization"] = "Form-focused (dense symbolic content)"
        
        analysis_time = time.time() - start_time
        print(f"Spatial reasoning analysis completed in {analysis_time:.2f}s")
        
        return {
            "dot_distribution_centroid": {"x": int(dot_centroid[0]), "y": int(dot_centroid[1])},
            "contour_distribution_centroid": {"x": int(avg_contour_centroid[0]), "y": int(avg_contour_centroid[1])},
            "pattern_clusters": int(n_clusters),
            "horizontal_spread": f"{float(spread_x):.2f} pixels",
            "vertical_spread": f"{float(spread_y):.2f} pixels",
            "pattern_coverage": f"{float(pattern_coverage):.2f}%",
            "center_alignment": f"{100 - min(100, float(avg_distance_from_center) / max(w, h) * 200):.2f}%",
            "distribution_uniformity": f"{100 - abs(float(spread_x) - float(spread_y)) / max(float(spread_x), float(spread_y), 1) * 100:.2f}%" if max(spread_x, spread_y) > 0 else "100.00%",
            "sacred_geometry_features": spatial_insights,
            "cultural_spatial_patterns": cultural_spatial_patterns,
            "sacred_proportions": sacred_proportions,
            "radial_harmony": f"{100 - min(100, distance_std / max(1, avg_distance_from_center) * 100):.2f}%" if avg_distance_from_center > 0 else "100.00%",
            "quadrant_distribution": {
                "northeast": len([1 for x, y in contour_centroids if x >= center_x and y <= center_y]),
                "northwest": len([1 for x, y in contour_centroids if x < center_x and y <= center_y]),
                "southwest": len([1 for x, y in contour_centroids if x < center_x and y > center_y]),
                "southeast": len([1 for x, y in contour_centroids if x >= center_x and y > center_y])
            },
            "analysis_time": f"{analysis_time:.2f}s"
        }
        
    except Exception as e:
        print(f"Error in spatial reasoning analysis: {str(e)}")
        return {
            "error": f"Spatial reasoning analysis failed: {str(e)}",
            "pattern_coverage": "0.00%",
            "center_alignment": "0.00%",
            "distribution_uniformity": "0.00%",
            "sacred_geometry_features": {},
            "cultural_spatial_patterns": {},
            "sacred_proportions": {}
        }