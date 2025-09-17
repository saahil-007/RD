"""
Kolam Design Principles Analysis and Recreation Module

This module identifies the mathematical and geometric principles behind Kolam designs
and provides tools to recreate them programmatically.

Key Design Principles Analyzed:
1. Dot Grid Structure (coordinate system)
2. Symmetry Operations (rotational, reflectional, translational)
3. Path Connectivity (Eulerian paths, loops)
4. Topological Properties (genus, connectivity)
5. Geometric Patterns (spirals, waves, angular)
6. Cultural Rules and Constraints
"""

import numpy as np
import cv2
import networkx as nx
from scipy.spatial.distance import pdist, squareform
from scipy.ndimage import rotate
from skimage.measure import regionprops, label
from skimage.morphology import skeletonize, thin
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict, Optional
import json

class KolamDesignPrinciples:
    """
    Analyzes and identifies the core design principles of Kolam patterns.
    """
    
    def __init__(self, image_path: str = None, image_array: np.ndarray = None):
        """
        Initialize with either image path or numpy array.
        
        Args:
            image_path: Path to the Kolam image
            image_array: Numpy array of the image
        """
        if image_path:
            self.image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        elif image_array is not None:
            if len(image_array.shape) == 3:
                self.image = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
            else:
                self.image = image_array
        else:
            raise ValueError("Either image_path or image_array must be provided")
            
        self.binary_image = None
        self.skeleton = None
        self.dots = []
        self.grid_structure = {}
        self.design_graph = nx.Graph()
        self.design_principles = {}
        
    def preprocess_image(self) -> np.ndarray:
        """
        Preprocess the image for analysis.
        
        Returns:
            Binary image ready for analysis
        """
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(self.image, (5, 5), 0)
        
        # Adaptive thresholding for better results
        binary = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
        
        self.binary_image = binary
        return binary
    
    def detect_dot_grid(self) -> Dict:
        """
        Detect and analyze the underlying dot grid structure.
        
        Returns:
            Dictionary containing grid properties
        """
        if self.binary_image is None:
            self.preprocess_image()
            
        # Find contours to identify dots
        contours, _ = cv2.findContours(
            self.binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        
        # Filter contours to find dots
        dots = []
        for contour in contours:
            area = cv2.contourArea(contour)
            
            # Filter by area and circularity
            if 10 < area < 1000:
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    
                    if circularity > 0.3:  # Reasonably circular
                        M = cv2.moments(contour)
                        if M["m00"] != 0:
                            cx = int(M["m10"] / M["m00"])
                            cy = int(M["m01"] / M["m00"])
                            dots.append((cx, cy))
        
        if len(dots) < 4:
            return {"error": "Insufficient dots detected for grid analysis"}
        
        self.dots = dots
        
        # Analyze grid structure
        return self._analyze_grid_structure(dots)
    
    def _analyze_grid_structure(self, dots: List[Tuple[int, int]]) -> Dict:
        """
        Analyze the structure of the dot grid.
        
        Args:
            dots: List of (x, y) coordinates of detected dots
            
        Returns:
            Grid structure analysis
        """
        dots_array = np.array(dots)
        
        # Calculate pairwise distances
        distances = pdist(dots_array)
        distance_matrix = squareform(distances)
        
        # Find grid spacing (most common minimum distance)
        min_distances = []
        for i in range(len(dots)):
            row_distances = distance_matrix[i]
            row_distances[i] = np.inf  # Exclude self
            min_distances.append(np.min(row_distances))
        
        spacing = np.median(min_distances)
        
        # Estimate grid dimensions
        x_coords = sorted(set(round(x / spacing) * spacing for x, y in dots))
        y_coords = sorted(set(round(y / spacing) * spacing for x, y in dots))
        
        cols = len(x_coords)
        rows = len(y_coords)
        
        # Analyze grid regularity
        regularity_score = self._calculate_grid_regularity(dots_array, spacing)
        
        # Detect grid type (square, triangular, hexagonal)
        grid_type = self._detect_grid_type(dots_array, spacing)
        
        self.grid_structure = {
            "num_dots": len(dots),
            "spacing": spacing,
            "rows": rows,
            "cols": cols,
            "grid_type": grid_type,
            "regularity_score": regularity_score,
            "bounding_box": {
                "width": max(x for x, y in dots) - min(x for x, y in dots),
                "height": max(y for x, y in dots) - min(y for x, y in dots)
            }
        }
        
        return self.grid_structure
    
    def _calculate_grid_regularity(self, dots: np.ndarray, expected_spacing: float) -> float:
        """Calculate how regular the grid structure is."""
        if len(dots) < 2:
            return 0.0
            
        distance_matrix = squareform(pdist(dots))
        
        # Count how many distances are close to expected spacing or its multiples
        tolerance = expected_spacing * 0.2
        regular_distances = 0
        total_distances = 0
        
        for i in range(len(dots)):
            for j in range(i + 1, len(dots)):
                dist = distance_matrix[i, j]
                total_distances += 1
                
                # Check if distance is close to spacing multiples
                multiple = round(dist / expected_spacing)
                expected_dist = multiple * expected_spacing
                
                if abs(dist - expected_dist) < tolerance:
                    regular_distances += 1
        
        return regular_distances / total_distances if total_distances > 0 else 0.0
    
    def _detect_grid_type(self, dots: np.ndarray, spacing: float) -> str:
        """Detect the type of grid (square, triangular, hexagonal)."""
        if len(dots) < 6:
            return "insufficient_data"
        
        # Analyze angles between nearest neighbors
        angles = []
        
        for i, dot in enumerate(dots):
            # Find nearest neighbors
            distances = np.sqrt(np.sum((dots - dot) ** 2, axis=1))
            neighbor_indices = np.argsort(distances)[1:7]  # Exclude self, get 6 nearest
            
            neighbors = dots[neighbor_indices]
            
            # Calculate angles to neighbors
            for neighbor in neighbors:
                if np.allclose(neighbor, dot):
                    continue
                    
                vector = neighbor - dot
                angle = np.arctan2(vector[1], vector[0])
                angles.append(angle % (2 * np.pi))
        
        if not angles:
            return "unknown"
        
        # Analyze angle distribution
        angles = np.array(angles)
        angle_hist, _ = np.histogram(angles, bins=12, range=(0, 2 * np.pi))
        
        # Detect patterns in angle distribution
        if np.sum(angle_hist > 0) <= 4:
            return "square"
        elif np.sum(angle_hist > 0) <= 6:
            return "triangular"
        else:
            return "hexagonal"
    
    def extract_path_structure(self) -> nx.Graph:
        """
        Extract the path structure of the Kolam design.
        
        Returns:
            NetworkX graph representing the design paths
        """
        if self.binary_image is None:
            self.preprocess_image()
        
        # Create skeleton
        self.skeleton = skeletonize(self.binary_image)
        
        # Build graph from skeleton
        graph = nx.Graph()
        h, w = self.skeleton.shape
        
        # Add nodes for skeleton pixels
        skeleton_points = np.where(self.skeleton > 0)
        for i in range(len(skeleton_points[0])):
            y, x = skeleton_points[0][i], skeleton_points[1][i]
            graph.add_node((x, y))
        
        # Add edges between neighboring skeleton pixels
        for i in range(len(skeleton_points[0])):
            y, x = skeleton_points[0][i], skeleton_points[1][i]
            
            # Check 8-connectivity
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    if dx == 0 and dy == 0:
                        continue
                    
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and self.skeleton[ny, nx] > 0:
                        graph.add_edge((x, y), (nx, ny))
        
        self.design_graph = graph
        return graph
    
    def analyze_symmetry_operations(self) -> Dict:
        """
        Analyze symmetry operations in the Kolam design.
        
        Returns:
            Dictionary containing symmetry analysis
        """
        if self.binary_image is None:
            self.preprocess_image()
        
        image = self.binary_image.astype(np.float32)
        h, w = image.shape
        
        symmetries = {}
        
        # Vertical reflection symmetry
        flipped_v = cv2.flip(image, 1)
        v_symmetry = np.mean(np.abs(image - flipped_v)) / 255.0
        symmetries['vertical_reflection'] = 1.0 - v_symmetry
        
        # Horizontal reflection symmetry
        flipped_h = cv2.flip(image, 0)
        h_symmetry = np.mean(np.abs(image - flipped_h)) / 255.0
        symmetries['horizontal_reflection'] = 1.0 - h_symmetry
        
        # Rotational symmetries
        rotational_symmetries = {}
        for angle in [45, 90, 120, 135, 180, 240, 270]:
            rotated = rotate(image, angle, reshape=False, mode='constant', cval=0)
            rot_symmetry = np.mean(np.abs(image - rotated)) / 255.0
            rotational_symmetries[f'{angle}_degrees'] = 1.0 - rot_symmetry
        
        symmetries['rotational'] = rotational_symmetries
        
        # Find the highest symmetry
        all_symmetries = [symmetries['vertical_reflection'], symmetries['horizontal_reflection']]
        all_symmetries.extend(rotational_symmetries.values())
        
        symmetries['max_symmetry'] = max(all_symmetries)
        symmetries['symmetry_type'] = self._classify_symmetry_type(symmetries)
        
        return symmetries
    
    def _classify_symmetry_type(self, symmetries: Dict) -> str:
        """Classify the primary symmetry type of the design."""
        threshold = 0.8
        
        if symmetries['rotational']['180_degrees'] > threshold:
            if symmetries['vertical_reflection'] > threshold and symmetries['horizontal_reflection'] > threshold:
                return "4-fold_rotational_with_reflections"
            else:
                return "2-fold_rotational"
        
        if symmetries['vertical_reflection'] > threshold and symmetries['horizontal_reflection'] > threshold:
            return "bilateral_symmetry"
        
        if symmetries['vertical_reflection'] > threshold:
            return "vertical_symmetry"
        
        if symmetries['horizontal_reflection'] > threshold:
            return "horizontal_symmetry"
        
        # Check for other rotational symmetries
        for angle, score in symmetries['rotational'].items():
            if score > threshold:
                return f"rotational_{angle}"
        
        return "asymmetric"
    
    def analyze_path_connectivity(self) -> Dict:
        """
        Analyze the connectivity properties of the path structure.
        
        Returns:
            Dictionary containing connectivity analysis
        """
        if not self.design_graph.nodes():
            self.extract_path_structure()
        
        graph = self.design_graph
        
        connectivity = {
            "num_nodes": graph.number_of_nodes(),
            "num_edges": graph.number_of_edges(),
            "is_connected": nx.is_connected(graph),
            "num_components": nx.number_connected_components(graph),
            "has_eulerian_path": nx.is_eulerian(graph),
            "has_eulerian_circuit": nx.has_eulerian_path(graph),
        }
        
        if graph.number_of_nodes() > 0:
            # Analyze degree distribution
            degrees = [d for n, d in graph.degree()]
            connectivity["degree_stats"] = {
                "mean": np.mean(degrees),
                "std": np.std(degrees),
                "min": min(degrees),
                "max": max(degrees)
            }
            
            # Count vertices by degree
            degree_counts = {}
            for degree in degrees:
                degree_counts[degree] = degree_counts.get(degree, 0) + 1
            connectivity["degree_distribution"] = degree_counts
            
            # Find cycles
            try:
                cycles = list(nx.simple_cycles(graph.to_directed()))
                connectivity["num_cycles"] = len(cycles)
                connectivity["cycle_lengths"] = [len(cycle) for cycle in cycles[:10]]  # First 10 cycles
            except:
                connectivity["num_cycles"] = 0
                connectivity["cycle_lengths"] = []
        
        return connectivity
    
    def identify_geometric_patterns(self) -> Dict:
        """
        Identify common geometric patterns in the design.
        
        Returns:
            Dictionary containing pattern analysis
        """
        if self.binary_image is None:
            self.preprocess_image()
        
        patterns = {}
        
        # Detect curves and lines
        edges = cv2.Canny(self.binary_image, 50, 150)
        
        # Hough Line Transform for straight lines
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=50, minLineLength=30, maxLineGap=10)
        patterns['num_straight_lines'] = len(lines) if lines is not None else 0
        
        # Detect circles/arcs using Hough Circle Transform
        circles = cv2.HoughCircles(
            self.binary_image, cv2.HOUGH_GRADIENT, 1, 20,
            param1=50, param2=30, minRadius=10, maxRadius=100
        )
        patterns['num_circles'] = len(circles[0]) if circles is not None else 0
        
        # Analyze contour properties for pattern detection
        contours, _ = cv2.findContours(self.binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        pattern_types = []
        for contour in contours:
            if cv2.contourArea(contour) > 100:  # Filter small contours
                # Analyze contour properties
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                
                if len(approx) <= 4:
                    pattern_types.append("angular")
                elif len(approx) <= 8:
                    pattern_types.append("polygonal")
                else:
                    pattern_types.append("curved")
        
        patterns['pattern_types'] = list(set(pattern_types))
        patterns['pattern_complexity'] = len(set(pattern_types))
        
        return patterns
    
    def analyze_cultural_constraints(self) -> Dict:
        """
        Analyze adherence to traditional Kolam cultural constraints.
        
        Returns:
            Dictionary containing cultural analysis
        """
        constraints = {}
        
        # Rule 1: Closed loops (traditional Kolams should form closed patterns)
        if self.design_graph.nodes():
            euler_check = nx.is_eulerian(self.design_graph)
            constraints['forms_closed_loops'] = euler_check
        else:
            constraints['forms_closed_loops'] = False
        
        # Rule 2: Single continuous path (can be drawn without lifting the finger)
        if self.design_graph.nodes():
            has_euler_path = nx.has_eulerian_path(self.design_graph)
            constraints['single_continuous_path'] = has_euler_path
        else:
            constraints['single_continuous_path'] = False
        
        # Rule 3: Grid-based structure
        constraints['grid_based'] = bool(self.grid_structure and self.grid_structure.get('regularity_score', 0) > 0.7)
        
        # Rule 4: Symmetrical design
        symmetry_analysis = self.analyze_symmetry_operations()
        constraints['has_symmetry'] = symmetry_analysis.get('max_symmetry', 0) > 0.6
        
        # Rule 5: No isolated components (traditional rule)
        if self.design_graph.nodes():
            constraints['no_isolated_components'] = nx.is_connected(self.design_graph)
        else:
            constraints['no_isolated_components'] = False
        
        # Overall cultural authenticity score
        authenticity_score = sum([
            constraints['forms_closed_loops'],
            constraints['single_continuous_path'],
            constraints['grid_based'],
            constraints['has_symmetry'],
            constraints['no_isolated_components']
        ]) / 5.0
        
        constraints['cultural_authenticity_score'] = authenticity_score
        
        return constraints
    
    def generate_comprehensive_analysis(self) -> Dict:
        """
        Generate a comprehensive analysis of the Kolam design principles.
        
        Returns:
            Dictionary containing all analysis results
        """
        analysis = {}
        
        # Basic preprocessing
        self.preprocess_image()
        
        # Analyze all aspects
        analysis['grid_structure'] = self.detect_dot_grid()
        analysis['path_connectivity'] = self.analyze_path_connectivity()
        analysis['symmetry_operations'] = self.analyze_symmetry_operations()
        analysis['geometric_patterns'] = self.identify_geometric_patterns()
        analysis['cultural_constraints'] = self.analyze_cultural_constraints()
        
        # Generate summary
        analysis['summary'] = self._generate_summary(analysis)
        
        self.design_principles = analysis
        return analysis
    
    def _generate_summary(self, analysis: Dict) -> Dict:
        """Generate a summary of the design principles."""
        summary = {
            "complexity_level": "unknown",
            "primary_symmetry": "unknown",
            "cultural_authenticity": "unknown",
            "recommended_recreation_approach": "unknown"
        }
        
        # Determine complexity level
        if 'grid_structure' in analysis and analysis['grid_structure'].get('num_dots', 0) > 0:
            num_dots = analysis['grid_structure']['num_dots']
            if num_dots < 16:
                summary['complexity_level'] = "simple"
            elif num_dots < 64:
                summary['complexity_level'] = "moderate"
            else:
                summary['complexity_level'] = "complex"
        
        # Primary symmetry
        if 'symmetry_operations' in analysis:
            summary['primary_symmetry'] = analysis['symmetry_operations'].get('symmetry_type', 'unknown')
        
        # Cultural authenticity
        if 'cultural_constraints' in analysis:
            score = analysis['cultural_constraints'].get('cultural_authenticity_score', 0)
            if score > 0.8:
                summary['cultural_authenticity'] = "high"
            elif score > 0.5:
                summary['cultural_authenticity'] = "medium"
            else:
                summary['cultural_authenticity'] = "low"
        
        # Recreation approach
        if summary['complexity_level'] == "simple":
            summary['recommended_recreation_approach'] = "direct_geometric_construction"
        elif summary['cultural_authenticity'] == "high":
            summary['recommended_recreation_approach'] = "traditional_rule_based"
        else:
            summary['recommended_recreation_approach'] = "hybrid_ai_assisted"
        
        return summary

# Example usage and testing
if __name__ == "__main__":
    # This would be used for testing the module
    print("Kolam Design Principles Analysis Module")
    print("Ready for integration with the main application")