import cv2
import numpy as np
from sklearn.cluster import DBSCAN, KMeans
from scipy import spatial
from skimage import measure, morphology
# from skimage.feature import peak_local_maxima  # Not used in current implementation
import time
import math

def analyze_dots(gray, h, w):
    """
    Comprehensive dot detection and analysis for rangoli patterns.
    
    Args:
        gray: Grayscale image
        h, w: Image dimensions
        
    Returns:
        Dictionary containing dot analysis results
    """
    try:
        print("Starting dot analysis...")
        start_time = time.time()
        
        # Preprocessing for optimal detection
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        enhanced = cv2.equalizeHist(gray)
        
        # Method 1: Optimized Blob Detection
        print("Performing blob detection...")
        params = cv2.SimpleBlobDetector_Params()
        params.filterByArea = True
        params.minArea = 5
        params.maxArea = 1000
        params.filterByCircularity = True
        params.minCircularity = 0.6
        params.filterByConvexity = True
        params.minConvexity = 0.7
        params.filterByInertia = True
        params.minInertiaRatio = 0.3
        
        detector = cv2.SimpleBlobDetector_create(params)
        blob_keypoints = detector.detect(gray)
        print(f"Blob detection found {len(blob_keypoints)} keypoints")
        
        # Method 2: Hough Circle Detection
        print("Performing Hough circle detection...")
        circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, 20,
                                  param1=50, param2=30, minRadius=3, maxRadius=30)
        
        hough_keypoints = []
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            for (x, y, r) in circles[:300]:  # Limit for efficiency
                if 0 <= x < w and 0 <= y < h:
                    keypoint = cv2.KeyPoint(float(x), float(y), float(r*2))
                    keypoint.response = float(r / 30.0)
                    hough_keypoints.append(keypoint)
        print(f"Hough detection found {len(hough_keypoints)} circle keypoints")
        
        # Method 3: Template Matching for Perfect Circles
        print("Performing template matching...")
        template_keypoints = []
        max_radius = min(15, min(h, w) // 6)
        for radius in range(3, max_radius, 2):
            template = np.zeros((radius*2+1, radius*2+1), dtype=np.uint8)
            cv2.circle(template, (radius, radius), radius, 255, 1)
            
            if template.shape[0] <= gray.shape[0] and template.shape[1] <= gray.shape[1]:
                try:
                    result = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
                    locations = np.where(result >= 0.65)
                    
                    # Properly handle template matching coordinates
                    if len(locations) >= 2 and len(locations[0]) > 0 and len(locations[1]) > 0:
                        y_coords, x_coords = locations[0], locations[1]  # np.where returns (y, x)
                        for y, x in zip(y_coords, x_coords):
                            if len(template_keypoints) >= 50:  # Limit matches per radius
                                break
                            keypoint = cv2.KeyPoint(float(x + radius), float(y + radius), float(radius*2))
                            keypoint.response = float(result[y, x])
                            template_keypoints.append(keypoint)
                except Exception as e:
                    continue
        print(f"Template matching found {len(template_keypoints)} keypoints")
        
        # Combine and filter keypoints efficiently - ensure all are lists
        try:
            all_keypoints = list(blob_keypoints) + list(hough_keypoints) + list(template_keypoints)
            print(f"Combined keypoints: blob={len(blob_keypoints)}, hough={len(hough_keypoints)}, template={len(template_keypoints)}, total={len(all_keypoints)}")
        except Exception as e:
            print(f"Error combining keypoints: {e}")
            print(f"Types: blob={type(blob_keypoints)}, hough={type(hough_keypoints)}, template={type(template_keypoints)}")
            # Fallback: create empty list if combination fails
            all_keypoints = []
            for kp_list in [blob_keypoints, hough_keypoints, template_keypoints]:
                if kp_list:
                    try:
                        all_keypoints.extend(list(kp_list))
                    except Exception as e2:
                        print(f"Error extending from list: {e2}")
        
        # Smart filtering instead of complex clustering
        if len(all_keypoints) > 500:
            print(f"Filtering {len(all_keypoints)} keypoints for efficiency...")
            all_keypoints.sort(key=lambda kp: getattr(kp, 'response', kp.size), reverse=True)
            all_keypoints = all_keypoints[:500]
        
        # Simple duplicate removal based on proximity
        filtered_keypoints = []
        for kp in all_keypoints:
            is_duplicate = False
            for existing_kp in filtered_keypoints:
                distance = np.sqrt((kp.pt[0] - existing_kp.pt[0])**2 + (kp.pt[1] - existing_kp.pt[1])**2)
                if distance < 8:  # 8 pixel threshold
                    is_duplicate = True
                    break
            if not is_duplicate:
                filtered_keypoints.append(kp)
        
        keypoints = filtered_keypoints[:300]  # Final limit for performance
        print(f"Final dot count: {len(keypoints)}")
        
        # Generate detailed dot grid with enhanced attributes
        dot_grid = []
        for i, kp in enumerate(keypoints):
            dot_info = {
                "id": i + 1,
                "x": int(kp.pt[0]),
                "y": int(kp.pt[1]),
                "size": float(kp.size),
                "confidence": float(getattr(kp, 'response', 0.7)),
                "estimated_radius": float(kp.size / 2),
                "relative_position": {
                    "x_percent": float(kp.pt[0] / w * 100),
                    "y_percent": float(kp.pt[1] / h * 100)
                }
            }
            dot_grid.append(dot_info)
        
        # Enhanced dot characteristics analysis with advanced metrics
        dot_characteristics = {
            "size_distribution": {},
            "confidence_distribution": {},
            "spatial_density": 0.0,
            "uniformity_score": 0.0,
            "detection_consensus": 0.0,
            "geometric_patterns": {},
            "symmetry_indices": {},
            "color_intensity_mapping": {},
            "fractal_dimension": 0.0,
            "pattern_regularity": 0.0
        }
        
        if keypoints:
            sizes = [kp.size for kp in keypoints]
            responses = [getattr(kp, 'response', 0.7) for kp in keypoints]
            
            # Size distribution analysis
            size_bins = ['tiny (2-10px)', 'small (10-20px)', 'medium (20-40px)', 'large (40px+)']
            size_counts = [0, 0, 0, 0]
            for size in sizes:
                if size < 10:
                    size_counts[0] += 1
                elif size < 20:
                    size_counts[1] += 1
                elif size < 40:
                    size_counts[2] += 1
                else:
                    size_counts[3] += 1
            
            dot_characteristics["size_distribution"] = dict(zip(size_bins, size_counts))
            
            # Confidence distribution
            high_conf = sum(1 for r in responses if r > 0.7)
            med_conf = sum(1 for r in responses if 0.4 <= r <= 0.7)
            low_conf = sum(1 for r in responses if r < 0.4)
            
            dot_characteristics["confidence_distribution"] = {
                "high_confidence": high_conf,
                "medium_confidence": med_conf,
                "low_confidence": low_conf
            }
            
            # Spatial density
            total_area = h * w
            # Advanced geometric pattern analysis
            positions = np.array([[kp.pt[0], kp.pt[1]] for kp in keypoints])
            
            # Detect geometric patterns using clustering
            if len(positions) > 3:
                # K-means clustering for pattern detection
                n_clusters = min(8, len(positions) // 3)
                if n_clusters > 1:
                    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
                    cluster_labels = kmeans.fit_predict(positions)
                    cluster_centers = kmeans.cluster_centers_
                    
                    # Analyze cluster patterns
                    cluster_sizes = [int(np.sum(cluster_labels == i)) for i in range(n_clusters)]
                    dot_characteristics["geometric_patterns"] = {
                        "cluster_count": int(n_clusters),
                        "cluster_sizes": cluster_sizes,
                        "cluster_regularity": float(1.0 - np.std(cluster_sizes) / max(np.mean(cluster_sizes), 1)),
                        "centroid_symmetry": _calculate_centroid_symmetry(cluster_centers, w, h)
                    }
            
            # Calculate fractal dimension (box-counting method)
            if len(positions) > 10:
                dot_characteristics["fractal_dimension"] = _calculate_fractal_dimension(positions, w, h)
        
            # Pattern regularity using nearest neighbor analysis  
            if len(positions) > 2:
                distances = spatial.distance.pdist(positions)
                if len(distances) > 0:
                    mean_dist = float(np.mean(distances))
                    std_dist = float(np.std(distances))
                    dot_characteristics["pattern_regularity"] = float(1.0 - min(1.0, std_dist / max(mean_dist, 1)))
        
            # Symmetry indices calculation
            if len(positions) > 4:
                dot_characteristics["symmetry_indices"] = _calculate_symmetry_indices(positions, w, h)
            
            # Uniformity score based on size variance
            if len(sizes) > 1:
                size_cv = float(np.std(sizes) / np.mean(sizes))
                dot_characteristics["uniformity_score"] = float(max(0, 100 - size_cv * 100))
            else:
                dot_characteristics["uniformity_score"] = 100.0
        
        # Dot grid spacing analysis
        grid_spacing_report = {"message": "Not enough dots to analyze grid spacing."}
        if len(dot_grid) > 1:
            distances = []
            for i in range(len(dot_grid)):
                for j in range(i + 1, len(dot_grid)):
                    dist = float(np.sqrt((dot_grid[i]['x'] - dot_grid[j]['x'])**2 + 
                                       (dot_grid[i]['y'] - dot_grid[j]['y'])**2))
                    distances.append(dist)
            
            if distances:
                grid_spacing_report = {
                    "mean_spacing": f"{float(np.mean(distances)):.2f} pixels",
                    "std_dev_spacing": f"{float(np.std(distances)):.2f} pixels",
                    "consistency_score": f"{float(1 / (1 + np.std(distances) / np.mean(distances))):.2f}"
                }
        
        detection_methods = {
            "blob_detection": len(blob_keypoints),
            "hough_circles": len(hough_keypoints),
            "template_matching": len(template_keypoints),
            "total_before_filtering": len(all_keypoints),
            "final_unique_dots": len(keypoints)
        }
        
        # Ensure all numeric values are JSON serializable
        def ensure_json_serializable(value):
            if isinstance(value, (np.integer, np.int64)):
                return int(value)
            elif isinstance(value, (np.floating, np.float64)):
                return float(value)
            elif isinstance(value, np.ndarray):
                return value.tolist()
            return value
        
        # Convert cluster_sizes to ensure JSON serialization
        if "geometric_patterns" in dot_characteristics and "cluster_sizes" in dot_characteristics["geometric_patterns"]:
            dot_characteristics["geometric_patterns"]["cluster_sizes"] = [
                ensure_json_serializable(size) for size in dot_characteristics["geometric_patterns"]["cluster_sizes"]
            ]
        
        analysis_time = time.time() - start_time
        print(f"Dot analysis completed in {analysis_time:.2f}s")
        
        return {
            "dot_grid_analysis": dot_grid,
            "dot_detection_methods": detection_methods,
            "dot_characteristics": dot_characteristics,
            "dot_grid_optimization": grid_spacing_report,
            "advanced_metrics": {
                "detection_confidence_avg": float(np.mean([getattr(kp, 'response', 0.7) for kp in keypoints])) if keypoints else 0.0,
                "size_consistency_index": float(1.0 - np.std(sizes) / max(np.mean(sizes), 1)) if len(sizes) > 1 else 1.0,
                "spatial_entropy": _calculate_spatial_entropy(keypoints, w, h) if keypoints else 0.0
            },
            "analysis_time": f"{analysis_time:.2f}s"
        }
        
    except Exception as e:
        print(f"Error in dot analysis: {str(e)}")
        return {
            "error": f"Dot analysis failed: {str(e)}",
            "dot_grid_analysis": [],
            "dot_detection_methods": {},
            "dot_characteristics": {},
            "dot_grid_optimization": {"message": "Analysis failed"},
            "advanced_metrics": {},
            "analysis_time": "0s"
        }
        
def _calculate_centroid_symmetry(centroids, w, h):
    """Calculate symmetry of cluster centroids"""
    if len(centroids) < 2:
        return 1.0
        
    center_x, center_y = w // 2, h // 2
    symmetry_scores = []
    
    for centroid in centroids:
        # Calculate distance from image center
        dist_from_center = np.sqrt((centroid[0] - center_x)**2 + (centroid[1] - center_y)**2)
        symmetry_scores.append(dist_from_center)
        
    return float(1.0 - np.std(symmetry_scores) / max(np.mean(symmetry_scores), 1))
    
def _calculate_fractal_dimension(positions, w, h):
    """Calculate fractal dimension using box-counting method"""
    try:
        # Simplified box-counting for point patterns
        scales = [2, 4, 8, 16, 32]
        counts = []
        
        for scale in scales:
            boxes_x = w // scale
            boxes_y = h // scale
            occupied_boxes = set()
            
            for pos in positions:
                box_x = min(int(pos[0] // scale), boxes_x - 1)
                box_y = min(int(pos[1] // scale), boxes_y - 1)
                occupied_boxes.add((box_x, box_y))
            
            counts.append(len(occupied_boxes))
        
        # Calculate fractal dimension
        if len(counts) > 1 and all(c > 0 for c in counts):
            log_scales = np.log(scales)
            log_counts = np.log(counts)
            slope, _ = np.polyfit(log_scales, log_counts, 1)
            return float(-slope)  # Negative because we're looking at box size vs count
        
    except Exception:
        pass
    
    return 1.5  # Default fractal dimension for random points
    
def _calculate_symmetry_indices(positions, w, h):
    """Calculate various symmetry indices"""
    center_x, center_y = w // 2, h // 2
    
    # Reflection symmetries
    horizontal_sym = _calculate_reflection_symmetry(positions, 'horizontal', center_x, center_y, w, h)
    vertical_sym = _calculate_reflection_symmetry(positions, 'vertical', center_x, center_y, w, h)
    
    # Rotational symmetry (check for common angles)
    rotational_syms = {}
    for angle in [60, 90, 120, 180]:
        rotational_syms[f"{angle}_degree"] = _calculate_rotational_symmetry(positions, angle, center_x, center_y, w, h)
    
    return {
        "horizontal_reflection": horizontal_sym,
        "vertical_reflection": vertical_sym,
        "rotational_symmetries": rotational_syms
    }
    
def _calculate_reflection_symmetry(positions, axis, center_x, center_y, w, h):
    """Calculate reflection symmetry score"""
    if len(positions) < 2:
        return 1.0
        
    reflected_positions = []
    for pos in positions:
        if axis == 'horizontal':
            reflected = (pos[0], 2 * center_y - pos[1])
        else:  # vertical
            reflected = (2 * center_x - pos[0], pos[1])
        reflected_positions.append(reflected)
    
    # Find closest matches
    matches = 0
    threshold = min(w, h) * 0.05  # 5% tolerance
    
    for ref_pos in reflected_positions:
        min_dist = min([np.sqrt((pos[0] - ref_pos[0])**2 + (pos[1] - ref_pos[1])**2) for pos in positions])
        if min_dist < threshold:
            matches += 1
    
    return float(matches / len(positions))
    
def _calculate_rotational_symmetry(positions, angle, center_x, center_y, w, h):
    """Calculate rotational symmetry score"""
    if len(positions) < 2:
        return 1.0
        
    angle_rad = np.radians(angle)
    cos_a, sin_a = np.cos(angle_rad), np.sin(angle_rad)
    
    rotated_positions = []
    for pos in positions:
        # Translate to origin, rotate, translate back
        x_centered = pos[0] - center_x
        y_centered = pos[1] - center_y
        
        x_rotated = x_centered * cos_a - y_centered * sin_a + center_x
        y_rotated = x_centered * sin_a + y_centered * cos_a + center_y
        
        rotated_positions.append((x_rotated, y_rotated))
    
    # Find closest matches
    matches = 0
    threshold = min(w, h) * 0.05
    
    for rot_pos in rotated_positions:
        min_dist = min([np.sqrt((pos[0] - rot_pos[0])**2 + (pos[1] - rot_pos[1])**2) for pos in positions])
        if min_dist < threshold:
            matches += 1
    
    return float(matches / len(positions))
    
def _calculate_spatial_entropy(keypoints, w, h):
    """Calculate spatial entropy of dot distribution"""
    if len(keypoints) < 2:
        return 0.0
        
    # Divide image into grid and count dots in each cell
    grid_size = 8
    cell_w, cell_h = w // grid_size, h // grid_size
    grid = np.zeros((grid_size, grid_size))
    
    for kp in keypoints:
        grid_x = min(int(kp.pt[0] // cell_w), grid_size - 1)
        grid_y = min(int(kp.pt[1] // cell_h), grid_size - 1)
        grid[grid_y, grid_x] += 1
    
    # Calculate entropy
    total_dots = len(keypoints)
    probabilities = grid.flatten() / total_dots
    probabilities = probabilities[probabilities > 0]  # Remove zeros
    
    if len(probabilities) > 1:
        entropy = -np.sum(probabilities * np.log2(probabilities))
        return float(entropy / np.log2(grid_size * grid_size))  # Normalize
    
    return 0.0