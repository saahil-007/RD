import cv2
import numpy as np
import math
import time

def analyze_symmetry(gray, h, w):
    """
    Comprehensive symmetry analysis for rangoli patterns.
    
    Args:
        gray: Grayscale image
        h, w: Image dimensions
        
    Returns:
        Dictionary containing symmetry analysis results
    """
    try:
        print("Starting symmetry analysis...")
        start_time = time.time()
        
        center_x, center_y = w // 2, h // 2
        
        # Horizontal symmetry with multiple methods
        print("Analyzing horizontal symmetry...")
        flipped_horizontally = cv2.flip(gray, 1)
        horizontal_similarity = float(cv2.matchTemplate(gray, flipped_horizontally, cv2.TM_CCOEFF_NORMED)[0][0])
        horizontal_symmetry = max(0.0, horizontal_similarity * 100)
        
        # Detailed horizontal analysis
        left_half = gray[:, :center_x]
        right_half = gray[:, center_x:]
        right_half_flipped = cv2.flip(right_half, 1)
        
        # Resize to match if needed
        if left_half.shape != right_half_flipped.shape:
            min_width = min(left_half.shape[1], right_half_flipped.shape[1])
            left_half = left_half[:, :min_width]
            right_half_flipped = right_half_flipped[:, :min_width]
        
        horizontal_pixel_diff = float(np.mean(np.abs(left_half.astype(float) - right_half_flipped.astype(float))))
        horizontal_structural_similarity = 100 - (horizontal_pixel_diff / 255 * 100)
        
        # Vertical symmetry with detailed analysis
        print("Analyzing vertical symmetry...")
        flipped_vertically = cv2.flip(gray, 0)
        vertical_similarity = float(cv2.matchTemplate(gray, flipped_vertically, cv2.TM_CCOEFF_NORMED)[0][0])
        vertical_symmetry = max(0.0, vertical_similarity * 100)
        
        # Detailed vertical analysis
        top_half = gray[:center_y, :]
        bottom_half = gray[center_y:, :]
        bottom_half_flipped = cv2.flip(bottom_half, 0)
        
        # Resize to match if needed
        if top_half.shape != bottom_half_flipped.shape:
            min_height = min(top_half.shape[0], bottom_half_flipped.shape[0])
            top_half = top_half[:min_height, :]
            bottom_half_flipped = bottom_half_flipped[:min_height, :]
        
        vertical_pixel_diff = float(np.mean(np.abs(top_half.astype(float) - bottom_half_flipped.astype(float))))
        vertical_structural_similarity = 100 - (vertical_pixel_diff / 255 * 100)
        
        # Diagonal symmetry analysis
        print("Analyzing diagonal symmetry...")
        diagonal_main = cv2.flip(cv2.transpose(gray), 1)  # Main diagonal
        diagonal_anti = cv2.flip(cv2.transpose(cv2.flip(gray, 1)), 0)  # Anti-diagonal
        
        diagonal_main_similarity = float(cv2.matchTemplate(gray, diagonal_main, cv2.TM_CCOEFF_NORMED)[0][0]) if gray.shape == diagonal_main.shape else 0.0
        diagonal_anti_similarity = float(cv2.matchTemplate(gray, diagonal_anti, cv2.TM_CCOEFF_NORMED)[0][0]) if gray.shape == diagonal_anti.shape else 0.0
        
        # Radial symmetry detection with multiple angles
        print("Analyzing radial symmetry...")
        angles = [30, 45, 60, 72, 90, 120, 135, 144, 180, 225, 270, 315]
        radial_scores = []
        for angle in angles:
            rotation_matrix = cv2.getRotationMatrix2D((center_x, center_y), angle, 1.0)
            rotated = cv2.warpAffine(gray, rotation_matrix, (w, h))
            similarity = float(cv2.matchTemplate(gray, rotated, cv2.TM_CCOEFF_NORMED)[0][0])
            radial_scores.append(max(0.0, similarity))
        
        radial_symmetry = float(np.mean(radial_scores)) * 100
        best_rotational_angle = angles[np.argmax(radial_scores)] if radial_scores else 0
        
        # N-fold symmetry detection
        print("Analyzing n-fold symmetry...")
        fold_symmetries = {}
        for n in [2, 3, 4, 5, 6, 8, 12]:
            angle = 360 / n
            rotation_matrix = cv2.getRotationMatrix2D((center_x, center_y), angle, 1.0)
            rotated = cv2.warpAffine(gray, rotation_matrix, (w, h))
            similarity = float(cv2.matchTemplate(gray, rotated, cv2.TM_CCOEFF_NORMED)[0][0])
            fold_symmetries[f"{n}-fold"] = max(0.0, similarity * 100)
        
        # Point symmetry (180-degree rotation)
        rotated_180 = cv2.rotate(gray, cv2.ROTATE_180)
        point_symmetry = float(cv2.matchTemplate(gray, rotated_180, cv2.TM_CCOEFF_NORMED)[0][0]) * 100
        
        # Geometric balance assessment
        print("Analyzing geometric balance...")
        moments = cv2.moments(gray)
        if moments["m00"] != 0:
            centroid_x = int(moments["m10"] / moments["m00"])
            centroid_y = int(moments["m01"] / moments["m00"])
            balance_score = float(100 - (abs(centroid_x - center_x) + abs(centroid_y - center_y)) / max(w, h) * 100)
            
            # Calculate moments of inertia for balance analysis
            mu20 = moments['mu20'] / moments['m00']
            mu02 = moments['mu02'] / moments['m00']
            mu11 = moments['mu11'] / moments['m00']
            
            # Principal axes angle
            if mu20 != mu02:
                theta = 0.5 * math.atan2(2 * mu11, mu20 - mu02)
                principal_axis_angle = float(theta * 180 / math.pi)
            else:
                principal_axis_angle = 0.0
        else:
            balance_score = 0.0
            principal_axis_angle = 0.0
            centroid_x = center_x
            centroid_y = center_y
        
        # Symmetry quality assessment
        overall_symmetry = (horizontal_symmetry + vertical_symmetry + radial_symmetry + point_symmetry) / 4
        symmetry_consistency = float(100 - np.std([horizontal_symmetry, vertical_symmetry, radial_symmetry, point_symmetry]))
        
        # Determine symmetry type and cultural significance
        if max(horizontal_symmetry, vertical_symmetry) > 80:
            symmetry_type = "Bilateral (Reflects spiritual duality)"
            cultural_meaning = "Represents balance between opposing forces in Hindu philosophy"
        elif radial_symmetry > 70:
            symmetry_type = "Radial/Mandala (Sacred geometry)"
            cultural_meaning = "Symbolizes cosmic order and spiritual meditation"
        elif point_symmetry > 60:
            symmetry_type = "Point/Central (Unity focused)"
            cultural_meaning = "Represents centered consciousness and inner harmony"
        elif max(fold_symmetries.values()) > 60:
            best_fold = max(fold_symmetries, key=fold_symmetries.get)
            symmetry_type = f"{best_fold} (Ritualistic pattern)"
            cultural_meaning = "Associated with cyclical nature of time and festivals"
        else:
            symmetry_type = "Asymmetric (Artistic freedom)"
            cultural_meaning = "Emphasizes creativity and individual expression"
        
        analysis_time = time.time() - start_time
        print(f"Symmetry analysis completed in {analysis_time:.2f}s")
        
        return {
            "horizontal_symmetry": f"{horizontal_symmetry:.2f}%",
            "horizontal_structural_similarity": f"{horizontal_structural_similarity:.2f}%",
            "vertical_symmetry": f"{vertical_symmetry:.2f}%", 
            "vertical_structural_similarity": f"{vertical_structural_similarity:.2f}%",
            "diagonal_main_symmetry": f"{diagonal_main_similarity * 100:.2f}%",
            "diagonal_anti_symmetry": f"{diagonal_anti_similarity * 100:.2f}%",
            "radial_symmetry": f"{radial_symmetry:.2f}%",
            "point_symmetry": f"{point_symmetry:.2f}%",
            "n_fold_symmetries": fold_symmetries,
            "best_rotational_angle": f"{best_rotational_angle}°",
            "geometric_balance": f"{balance_score:.2f}%",
            "principal_axis_angle": f"{principal_axis_angle:.2f}°",
            "centroid_offset": {
                "x": int(centroid_x - center_x),
                "y": int(centroid_y - center_y)
            },
            "overall_symmetry": f"{overall_symmetry:.2f}%",
            "symmetry_consistency": f"{symmetry_consistency:.2f}%",
            "symmetry_type": symmetry_type,
            "cultural_significance": cultural_meaning,
            "analysis_time": f"{analysis_time:.2f}s"
        }
        
    except Exception as e:
        print(f"Error in symmetry analysis: {str(e)}")
        return {
            "error": f"Symmetry analysis failed: {str(e)}",
            "horizontal_symmetry": "0.00%",
            "vertical_symmetry": "0.00%",
            "overall_symmetry": "0.00%",
            "symmetry_type": "Unknown",
            "cultural_significance": "Analysis failed"
        }