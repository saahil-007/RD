import numpy as np

def analyze_symmetry(dots, graph, image_size):
    """Analyzes the symmetry of the Rangoli design."""
    if not dots:
        return {"horizontal": 0, "vertical": 0}

    center_x, center_y = image_size[0] / 2, image_size[1] / 2
    dot_array = np.array(dots)

    # Vertical Symmetry (reflection across y-axis)
    reflected_dots_x = 2 * center_x - dot_array[:, 0]
    v_matches = 0
    for i, dot in enumerate(dot_array):
        reflected_dot_x = 2 * center_x - dot[0]
        # Find the closest dot in the original set to the reflected position
        distances = np.sqrt((reflected_dot_x - dot_array[:, 0])**2 + (dot[1] - dot_array[:, 1])**2)
        if np.min(distances) < 10:  # Allow a 10-pixel tolerance
            v_matches += 1
    vertical_symmetry_score = v_matches / len(dots)

    # Horizontal Symmetry (reflection across x-axis)
    reflected_dots_y = 2 * center_y - dot_array[:, 1]
    h_matches = 0
    for i, dot in enumerate(dot_array):
        reflected_dot_y = 2 * center_y - dot[1]
        distances = np.sqrt((dot[0] - dot_array[:, 0])**2 + (reflected_dot_y - dot_array[:, 1])**2)
        if np.min(distances) < 10: # Allow a 10-pixel tolerance
            h_matches += 1
    horizontal_symmetry_score = h_matches / len(dots)

    return {
        "horizontal": round(horizontal_symmetry_score, 2),
        "vertical": round(vertical_symmetry_score, 2)
    }

def classify_style(analysis_report):
    """Simulates a style classification model based on design features."""
    metadata = analysis_report['metadata']
    complexity = float(metadata['complexity'].split(' ')[0])
    lines = metadata['lines']
    curves = metadata['curves']

    if curves > lines * 1.5 and complexity > 30:
        return "Floral / Organic"
    if lines > curves * 1.5 and complexity > 15:
        return "Geometric"
    if complexity < 10:
        return "Simple / Minimalist"
    
    return "Complex Fusion"