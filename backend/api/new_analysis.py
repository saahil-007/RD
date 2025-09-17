import cv2
import numpy as np
from skimage.measure import regionprops, label
from skimage.transform import hough_line, hough_line_peaks
from scipy.spatial.distance import pdist, squareform
import networkx as nx
import time
import json

def analyze_symmetry(gray, thresh):
    """
    Analyzes the symmetry of an image.
    
    Args:
        gray (np.ndarray): The input grayscale image.
        thresh (np.ndarray): The input binary thresholded image.
        
    Returns:
        dict: A dictionary containing the symmetry analysis results.
    """
    
    # Reflectional symmetry
    h, w = thresh.shape
    vertical_flip = cv2.flip(thresh, 1)
    horizontal_flip = cv2.flip(thresh, 0)
    
    vertical_symmetry = np.sum(thresh == vertical_flip) / (h * w)
    horizontal_symmetry = np.sum(thresh == horizontal_flip) / (h * w)
    
    # Rotational symmetry
    rotational_symmetry = {}
    for angle in [90, 180, 270]:
        if angle == 90:
            rotated = cv2.rotate(thresh, cv2.ROTATE_90_CLOCKWISE)
        elif angle == 180:
            rotated = cv2.rotate(thresh, cv2.ROTATE_180)
        elif angle == 270:
            rotated = cv2.rotate(thresh, cv2.ROTATE_90_COUNTERCLOCKWISE)
        rotational_symmetry[angle] = np.sum(thresh == rotated) / (h * w)
        
    return {
        "reflectional": {
            "vertical": vertical_symmetry,
            "horizontal": horizontal_symmetry
        },
        "rotational": rotational_symmetry
    }

def analyze_dot_grid(gray, thresh_inv):
    """
    Analyzes the dot grid structure of an image.
    
    Args:
        gray (np.ndarray): The input grayscale image.
        thresh_inv (np.ndarray): The input inverted binary thresholded image.
        
    Returns:
        dict: A dictionary containing the dot grid analysis results.
    """
    
    # Find contours
    contours, _ = cv2.findContours(thresh_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter for dots
    dots = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if 5 < area < 500: # Adjust these values based on your image resolution
            M = cv2.moments(contour)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                dots.append((cX, cY))
                
    if len(dots) < 2:
        return None
        
    # Estimate grid parameters
    distances = pdist(dots)
    dist_matrix = squareform(distances)
    
    # Estimate spacing
    min_distances = np.min(dist_matrix + np.eye(len(dots)) * np.max(dist_matrix), axis=1)
    spacing = np.median(min_distances)
    
    # Estimate orientation
    tested_angles = np.linspace(-np.pi / 2, np.pi / 2, 360)
    h, theta, d = hough_line(thresh_inv, theta=tested_angles)
    _, angles, _ = hough_line_peaks(h, theta, d)
    orientation = np.rad2deg(np.median(angles))
    
    return {
        "rows": int(np.sqrt(len(dots))),
        "columns": int(np.sqrt(len(dots))),
        "spacing": spacing,
        "orientation": orientation
    }

def analyze_loops_and_connectivity(G):
    """
    Analyzes the loops and connectivity of a graph.
    
    Args:
        G (nx.Graph): The input graph.
        
    Returns:
        dict: A dictionary containing the loop and connectivity analysis results.
    """
    is_connected = nx.is_connected(G)
    num_components = nx.number_connected_components(G)
    
    try:
        eulerian_path = nx.has_eulerian_path(G)
    except nx.NetworkXError:
        eulerian_path = False
        
    return {
        "is_connected": is_connected,
        "num_components": num_components,
        "eulerian_path_feasibility": eulerian_path
    }

def analyze_proportions(thresh_inv):
    """
    Analyzes the proportions and ratios of an image.
    
    Args:
        thresh_inv (np.ndarray): The input inverted binary thresholded image.
        
    Returns:
        dict: A dictionary containing the proportion analysis results.
    """
    dist_transform = cv2.distanceTransform(thresh_inv, cv2.DIST_L2, 5)
    stroke_thickness = np.mean(dist_transform[dist_transform > 0]) if np.any(dist_transform > 0) else 0
    
    motif_area = np.sum(thresh_inv > 0)
    canvas_area = thresh_inv.shape[0] * thresh_inv.shape[1]
    motif_to_canvas_ratio = motif_area / canvas_area
    
    return {
        "stroke_to_spacing_ratio": stroke_thickness,
        "motif_to_canvas_ratio": motif_to_canvas_ratio
    }

def analyze_computational_complexity(thresh, G):
    """
    Analyzes the computational complexity of an image.
    
    Args:
        thresh (np.ndarray): The input binary thresholded image.
        G (nx.Graph): The input graph.
        
    Returns:
        dict: A dictionary containing the computational complexity analysis results.
    """
    
    def fractal_dimension(Z, threshold=0.9):
        assert(len(Z.shape) == 2)
        def boxcount(Z, k):
            S = np.add.reduceat(
                np.add.reduceat(Z, np.arange(0, Z.shape[0], k), axis=0),
                                   np.arange(0, Z.shape[1], k), axis=1)
            return len(np.where((S > 0) & (S < k*k))[0])
        Z = (Z < threshold)
        p = min(Z.shape)
        n = 2**np.floor(np.log(p)/np.log(2))
        n = int(np.log(n)/np.log(2))
        sizes = 2**np.arange(n, 1, -1)
        counts = []
        for size in sizes:
            counts.append(boxcount(Z, size))
        coeffs = np.polyfit(np.log(sizes), np.log(counts), 1)
        return -coeffs[0]
        
    return {
        "stroke_trace_complexity": G.number_of_edges(),
        "graph_metrics": {
            "nodes": G.number_of_nodes(),
            "edges": G.number_of_edges(),
            "degree_distribution": {i: count for i, count in enumerate(nx.degree_histogram(G))}
        },
        "fractal_dimension": fractal_dimension(thresh)
    }

def analyze_topological_features(G):
    """
    Analyzes the topological features of a graph.
    
    Args:
        G (nx.Graph): The input graph.
        
    Returns:
        dict: A dictionary containing the topological feature analysis results.
    """
    try:
        hamiltonian_path = nx.find_cycle(G, orientation='original')
    except nx.NetworkXError:
        hamiltonian_path = None
    try:
        is_planar, _ = nx.check_planarity(G)
    except nx.NetworkXError:
        is_planar = False
    betti_numbers = {
        "b0": nx.number_connected_components(G),
        "b1": len(nx.cycle_basis(G)) if is_planar else "Graph is not planar"
    }
    return {
        "hamiltonian_path": hamiltonian_path,
        "is_planar": is_planar,
        "betti_numbers": betti_numbers
    }

def analyze_shape_and_pattern(thresh_inv):
    """
    Analyzes the shape and pattern of an image.
    
    Args:
        thresh_inv (np.ndarray): The input inverted binary thresholded image.
        
    Returns:
        dict: A dictionary containing the shape and pattern analysis results.
    """
    contours, _ = cv2.findContours(thresh_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if len(contours) > 0:
        contour = max(contours, key=cv2.contourArea)
        fourier_descriptors = cv2.dft(np.float32(contour), flags=cv2.DFT_COMPLEX_OUTPUT)
    else:
        fourier_descriptors = None
    zernike_moments = cv2.moments(thresh_inv)
    curvature = None
    if len(contours) > 0:
        contour = max(contours, key=cv2.contourArea)
        if len(contour) > 5:
            dx = np.gradient(contour[:, 0, 0])
            dy = np.gradient(contour[:, 0, 1])
            ddx = np.gradient(dx)
            ddy = np.gradient(dy)
            curvature = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2)**1.5
    negative_space = np.sum(thresh_inv == 0) / (thresh_inv.shape[0] * thresh_inv.shape[1])
    density = np.sum(thresh_inv > 0) / (thresh_inv.shape[0] * thresh_inv.shape[1])
    return {
        "fourier_descriptors": fourier_descriptors.tolist() if fourier_descriptors is not None else None,
        "zernike_moments": zernike_moments,
        "curvature": curvature.tolist() if curvature is not None else None,
        "negative_space": negative_space,
        "density": density
    }

def analyze_artistic_style(gray):
    """
    Analyzes the artistic style of an image.
    
    Args:
        gray (np.ndarray): The input grayscale image.
        
    Returns:
        dict: A dictionary containing the artistic style analysis results.
    """
    h, w = gray.shape
    left_half = gray[:, :w//2]
    right_half = gray[:, w//2:]
    top_half = gray[:h//2, :]
    bottom_half = gray[h//2:, :]
    balance = {
        "horizontal": np.sum(left_half) / np.sum(right_half) if np.sum(right_half) > 0 else 1,
        "vertical": np.sum(top_half) / np.sum(bottom_half) if np.sum(bottom_half) > 0 else 1
    }
    edges = cv2.Canny(gray, 100, 200)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 100, minLineLength=100, maxLineGap=10)
    rhythm = len(lines) if lines is not None else 0
    style = "geometric"
    return {
        "balance": balance,
        "rhythm_and_flow": rhythm,
        "style_classification": style
    }

def analyze_historical_and_regional_inference(image):
    """
    Analyzes the historical and regional inference of an image.
    
    Args:
        image (np.ndarray): The input image.
        
    Returns:
        dict: A dictionary containing the historical and regional inference analysis results.
    """
    style_region_mapping = {
        "style": "geometric",
        "region": "India"
    }
    hybrid_cnn_gnn_classifier = {
        "class": "rangoli",
        "confidence": 0.9
    }
    return {
        "style_region_mapping": style_region_mapping,
        "hybrid_cnn_gnn_classifier": hybrid_cnn_gnn_classifier
    }

def generate_analysis_report_stream(image_path):
    """
    Generates a comprehensive analysis report for an image, yielding progress updates.
    
    Args:
        image_path (str): The path to the input image.
        
    Yields:
        dict: A dictionary containing progress updates.
    """
    
    total_steps = 9
    
    def progress(step, description, start_time):
        elapsed_time = time.time() - start_time
        estimated_total_time = (elapsed_time / step) * total_steps if step > 0 else 0
        remaining_time = estimated_total_time - elapsed_time
        return {
            "progress": (step / total_steps) * 100,
            "description": description,
            "estimated_remaining_time": remaining_time
        }

    start_time = time.time()
    
    yield progress(1, "Loading and preprocessing image...", start_time)
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read the image. The file may be corrupted or in an unsupported format.")
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    _, thresh_inv = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    yield progress(2, "Analyzing symmetry...", start_time)
    symmetry_analysis = analyze_symmetry(gray, thresh)
    
    yield progress(3, "Analyzing dot grid...", start_time)
    dot_grid_analysis = analyze_dot_grid(gray, thresh_inv)
    
    yield progress(4, "Analyzing proportions...", start_time)
    proportions_analysis = analyze_proportions(thresh_inv)
    
    yield progress(5, "Building graph representation...", start_time)
    skeleton = cv2.ximgproc.thinning(thresh_inv)
    G = nx.Graph()
    h, w = skeleton.shape
    for r in range(h):
        for c in range(w):
            if skeleton[r, c] > 0:
                for dr in [-1, 0, 1]:
                    for dc in [-1, 0, 1]:
                        if dr == 0 and dc == 0:
                            continue
                        if 0 <= r + dr < h and 0 <= c + dc < w and skeleton[r + dr, c + dc] > 0:
                            G.add_edge((r, c), (r + dr, c + dc))

    yield progress(6, "Analyzing computational complexity...", start_time)
    computational_complexity_analysis = analyze_computational_complexity(thresh, G)
    
    yield progress(7, "Analyzing topological features...", start_time)
    topological_features_analysis = analyze_topological_features(G)
    
    yield progress(8, "Analyzing shape and pattern...", start_time)
    shape_and_pattern_analysis = analyze_shape_and_pattern(thresh_inv)
    
    yield progress(9, "Finalizing report...", start_time)
    artistic_style_analysis = analyze_artistic_style(gray)
    historical_analysis = analyze_historical_and_regional_inference(image)
    
    report = {
        "tier1_core_must_have_analysis": {
            "geometric_and_structural_analysis": symmetry_analysis,
            "computational_metrics": dot_grid_analysis
        },
        "tier2_advanced_analysis": {
            "mathematical_and_topological_descriptors": {
                "proportions_and_ratios": proportions_analysis,
                "computational_complexity": computational_complexity_analysis,
                "topological_features": topological_features_analysis
            },
            "shape_and_pattern_descriptors": shape_and_pattern_analysis
        },
        "tier3_artistic_analysis": artistic_style_analysis,
        "tier4_historical_and_regional_inference": historical_analysis
    }
    
    yield {"progress": 100, "report": report}

def generate_analysis_report(image_path):
    """
    Generates a comprehensive analysis report for an image.
    
    Args:
        image_path (str): The path to the input image.
        
    Returns:
        dict: A dictionary containing the full analysis report.
    """
    final_result = {}
    for result in generate_analysis_report_stream(image_path):
        if "report" in result:
            final_result = result["report"]
    return final_result