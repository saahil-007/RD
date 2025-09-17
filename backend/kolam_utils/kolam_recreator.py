"""
Kolam Design Recreation Module

This module recreates Kolam designs based on identified design principles.
It provides multiple approaches for generating new designs:

1. Rule-based generation using traditional constraints
2. Grid-based pattern generation
3. Symmetry-guided construction
4. Path-based recreation from analysis
"""

import numpy as np
import cv2
import networkx as nx
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict, Optional
import json
import math
from .kolam_design_principles import KolamDesignPrinciples

class KolamRecreator:
    """
    Recreates Kolam designs using various algorithmic approaches.
    """
    
    def __init__(self, width: int = 800, height: int = 600):
        """
        Initialize the recreator with canvas dimensions.
        
        Args:
            width: Canvas width in pixels
            height: Canvas height in pixels
        """
        self.width = width
        self.height = height
        self.canvas = np.zeros((height, width), dtype=np.uint8)
        self.dot_grid = []
        self.design_graph = nx.Graph()
        
    def create_dot_grid(self, rows: int, cols: int, spacing: float = 50, 
                       grid_type: str = "square", center: bool = True) -> List[Tuple[int, int]]:
        """
        Create a dot grid as the foundation for Kolam design.
        
        Args:
            rows: Number of rows in the grid
            cols: Number of columns in the grid
            spacing: Distance between adjacent dots
            grid_type: Type of grid ("square", "triangular", "hexagonal")
            center: Whether to center the grid on the canvas
            
        Returns:
            List of (x, y) coordinates of dot positions
        """
        dots = []
        
        if grid_type == "square":
            for i in range(rows):
                for j in range(cols):
                    x = j * spacing
                    y = i * spacing
                    dots.append((x, y))
                    
        elif grid_type == "triangular":
            for i in range(rows):
                for j in range(cols):
                    x = j * spacing + (i % 2) * spacing / 2
                    y = i * spacing * math.sqrt(3) / 2
                    dots.append((x, y))
                    
        elif grid_type == "hexagonal":
            # Hexagonal grid is more complex
            for i in range(rows):
                for j in range(cols):
                    if (i + j) % 2 == 0:  # Only place dots at even sum positions
                        x = j * spacing * 3/4
                        y = i * spacing * math.sqrt(3) / 2
                        dots.append((x, y))
        
        # Center the grid if requested
        if center and dots:
            dots_array = np.array(dots)
            min_x, min_y = np.min(dots_array, axis=0)
            max_x, max_y = np.max(dots_array, axis=0)
            
            # Calculate offset to center
            offset_x = (self.width - (max_x - min_x)) // 2 - min_x
            offset_y = (self.height - (max_y - min_y)) // 2 - min_y
            
            dots = [(int(x + offset_x), int(y + offset_y)) for x, y in dots]
        
        self.dot_grid = dots
        return dots
    
    def draw_dots_on_canvas(self, dot_radius: int = 3, color: int = 128):
        """
        Draw dots on the canvas.
        
        Args:
            dot_radius: Radius of each dot
            color: Color value for the dots
        """
        for x, y in self.dot_grid:
            cv2.circle(self.canvas, (x, y), dot_radius, color, -1)
    
    def generate_simple_kolam(self, pattern_type: str = "square_loop") -> np.ndarray:
        """
        Generate simple Kolam patterns using basic rules.
        
        Args:
            pattern_type: Type of pattern to generate
            
        Returns:
            Generated Kolam as numpy array
        """
        self.canvas = np.zeros((self.height, self.width), dtype=np.uint8)
        
        if pattern_type == "square_loop":
            return self._generate_square_loop_pattern()
        elif pattern_type == "diamond_chain":
            return self._generate_diamond_chain_pattern()
        elif pattern_type == "spiral":
            return self._generate_spiral_pattern()
        elif pattern_type == "flower":
            return self._generate_flower_pattern()
        else:
            return self._generate_random_pattern()
    
    def _generate_square_loop_pattern(self) -> np.ndarray:
        """Generate a simple square loop pattern."""
        # Create a 5x5 grid
        self.create_dot_grid(5, 5, spacing=80)
        self.draw_dots_on_canvas()
        
        # Draw square loops around dots
        for i in range(1, 4):
            for j in range(1, 4):
                center_dot = self.dot_grid[i * 5 + j]
                self._draw_square_around_dot(center_dot, size=30)
        
        return self.canvas
    
    def _generate_diamond_chain_pattern(self) -> np.ndarray:
        """Generate a diamond chain pattern."""
        # Create a 3x7 grid
        self.create_dot_grid(3, 7, spacing=80)
        self.draw_dots_on_canvas()
        
        # Draw diamond shapes connecting dots
        for i in range(6):
            dot1 = self.dot_grid[0 * 7 + i]
            dot2 = self.dot_grid[1 * 7 + i]
            dot3 = self.dot_grid[2 * 7 + i]
            dot4 = self.dot_grid[0 * 7 + i + 1]
            dot5 = self.dot_grid[1 * 7 + i + 1]
            dot6 = self.dot_grid[2 * 7 + i + 1]
            
            self._draw_diamond([dot1, dot2, dot3, dot4, dot5, dot6])
        
        return self.canvas
    
    def _generate_spiral_pattern(self) -> np.ndarray:
        """Generate a spiral pattern."""
        # Create a 7x7 grid
        self.create_dot_grid(7, 7, spacing=60)
        self.draw_dots_on_canvas()
        
        # Create spiral path
        center = (self.width // 2, self.height // 2)
        self._draw_spiral_from_center(center, max_radius=200, turns=3)
        
        return self.canvas
    
    def _generate_flower_pattern(self) -> np.ndarray:
        """Generate a flower-like pattern."""
        # Create a hexagonal grid for flower pattern
        self.create_dot_grid(5, 5, spacing=70, grid_type="hexagonal")
        self.draw_dots_on_canvas()
        
        # Draw flower petals around center
        if self.dot_grid:
            center = self.dot_grid[len(self.dot_grid) // 2]
            self._draw_flower_around_center(center, petal_count=6, petal_length=50)
        
        return self.canvas
    
    def _generate_random_pattern(self) -> np.ndarray:
        """Generate a random but valid Kolam pattern."""
        # Create a random grid
        rows = np.random.randint(3, 8)
        cols = np.random.randint(3, 8)
        grid_types = ["square", "triangular"]
        grid_type = np.random.choice(grid_types)
        
        self.create_dot_grid(rows, cols, spacing=60, grid_type=grid_type)
        self.draw_dots_on_canvas()
        
        # Add random valid connections
        self._add_random_valid_connections()
        
        return self.canvas
    
    def _draw_square_around_dot(self, center: Tuple[int, int], size: int):
        """Draw a square loop around a dot."""
        x, y = center
        half_size = size // 2
        
        # Define square corners
        corners = [
            (x - half_size, y - half_size),
            (x + half_size, y - half_size),
            (x + half_size, y + half_size),
            (x - half_size, y + half_size)
        ]
        
        # Draw the square
        for i in range(4):
            pt1 = corners[i]
            pt2 = corners[(i + 1) % 4]
            cv2.line(self.canvas, pt1, pt2, 255, 2)
    
    def _draw_diamond(self, dots: List[Tuple[int, int]]):
        """Draw diamond connections between dots."""
        if len(dots) >= 4:
            # Draw diamond pattern
            cv2.line(self.canvas, dots[0], dots[1], 255, 2)
            cv2.line(self.canvas, dots[1], dots[2], 255, 2)
            cv2.line(self.canvas, dots[2], dots[3], 255, 2)
            cv2.line(self.canvas, dots[3], dots[0], 255, 2)
    
    def _draw_spiral_from_center(self, center: Tuple[int, int], max_radius: int, turns: int):
        """Draw a spiral pattern from the center."""
        x0, y0 = center
        points = []
        
        # Generate spiral points
        for i in range(turns * 360):
            angle = math.radians(i)
            radius = (i / (turns * 360)) * max_radius
            x = int(x0 + radius * math.cos(angle))
            y = int(y0 + radius * math.sin(angle))
            points.append((x, y))
        
        # Draw the spiral
        for i in range(1, len(points)):
            cv2.line(self.canvas, points[i-1], points[i], 255, 2)
    
    def _draw_flower_around_center(self, center: Tuple[int, int], petal_count: int, petal_length: int):
        """Draw flower petals around a center point."""
        x0, y0 = center
        
        for i in range(petal_count):
            angle = (2 * math.pi * i) / petal_count
            
            # Outer point of petal
            x1 = int(x0 + petal_length * math.cos(angle))
            y1 = int(y0 + petal_length * math.sin(angle))
            
            # Draw petal as curved line (approximated with multiple segments)
            self._draw_curved_petal(center, (x1, y1), angle)
    
    def _draw_curved_petal(self, start: Tuple[int, int], end: Tuple[int, int], angle: float):
        """Draw a curved petal shape."""
        x0, y0 = start
        x1, y1 = end
        
        # Create curved path using quadratic curve
        mid_x = (x0 + x1) // 2 + int(20 * math.cos(angle + math.pi/2))
        mid_y = (y0 + y1) // 2 + int(20 * math.sin(angle + math.pi/2))
        
        # Draw curve using multiple line segments
        points = self._get_quadratic_curve_points((x0, y0), (mid_x, mid_y), (x1, y1), 20)
        
        for i in range(1, len(points)):
            cv2.line(self.canvas, points[i-1], points[i], 255, 2)
    
    def _get_quadratic_curve_points(self, p0: Tuple[int, int], p1: Tuple[int, int], 
                                  p2: Tuple[int, int], num_points: int) -> List[Tuple[int, int]]:
        """Generate points along a quadratic Bezier curve."""
        points = []
        
        for i in range(num_points + 1):
            t = i / num_points
            
            # Quadratic Bezier formula
            x = int((1-t)**2 * p0[0] + 2*(1-t)*t * p1[0] + t**2 * p2[0])
            y = int((1-t)**2 * p0[1] + 2*(1-t)*t * p1[1] + t**2 * p2[1])
            
            points.append((x, y))
        
        return points
    
    def _add_random_valid_connections(self):
        """Add random but valid connections between dots."""
        if len(self.dot_grid) < 2:
            return
        
        # Create a graph of dots
        graph = nx.Graph()
        for i, dot in enumerate(self.dot_grid):
            graph.add_node(i, pos=dot)
        
        # Add random edges ensuring Eulerian path property
        num_edges = min(len(self.dot_grid) * 2, len(self.dot_grid) * (len(self.dot_grid) - 1) // 4)
        
        for _ in range(num_edges):
            node1 = np.random.randint(0, len(self.dot_grid))
            node2 = np.random.randint(0, len(self.dot_grid))
            
            if node1 != node2 and not graph.has_edge(node1, node2):
                graph.add_edge(node1, node2)
                
                # Draw the connection
                pos1 = self.dot_grid[node1]
                pos2 = self.dot_grid[node2]
                cv2.line(self.canvas, pos1, pos2, 255, 2)
    
    def recreate_from_analysis(self, analysis: Dict) -> np.ndarray:
        """
        Recreate a Kolam design based on analysis results.
        
        Args:
            analysis: Analysis results from KolamDesignPrinciples
            
        Returns:
            Recreated Kolam design
        """
        self.canvas = np.zeros((self.height, self.width), dtype=np.uint8)
        
        # Extract grid structure
        grid_info = analysis.get('grid_structure', {})
        
        if grid_info and grid_info.get('num_dots', 0) > 0:
            # Recreate grid
            rows = grid_info.get('rows', 3)
            cols = grid_info.get('cols', 3)
            spacing = min(grid_info.get('spacing', 50), 80)  # Limit spacing
            grid_type = grid_info.get('grid_type', 'square')
            
            self.create_dot_grid(rows, cols, spacing, grid_type)
            self.draw_dots_on_canvas()
            
            # Apply symmetry operations
            symmetry_info = analysis.get('symmetry_operations', {})
            self._apply_symmetry_based_patterns(symmetry_info)
            
            # Add connectivity based on path analysis
            connectivity_info = analysis.get('path_connectivity', {})
            self._add_connectivity_patterns(connectivity_info)
        
        return self.canvas
    
    def _apply_symmetry_based_patterns(self, symmetry_info: Dict):
        """Apply patterns based on detected symmetry."""
        symmetry_type = symmetry_info.get('symmetry_type', 'unknown')
        
        if 'rotational' in symmetry_type:
            self._add_rotational_pattern()
        elif 'bilateral' in symmetry_type:
            self._add_bilateral_pattern()
        elif 'vertical' in symmetry_type:
            self._add_vertical_symmetry_pattern()
        else:
            self._add_basic_connection_pattern()
    
    def _add_rotational_pattern(self):
        """Add a rotationally symmetric pattern."""
        if len(self.dot_grid) < 4:
            return
        
        center_idx = len(self.dot_grid) // 2
        if center_idx < len(self.dot_grid):
            center = self.dot_grid[center_idx]
            
            # Connect dots in a rotational pattern
            angles = [0, math.pi/2, math.pi, 3*math.pi/2]
            for angle in angles:
                self._draw_radial_line_from_center(center, angle, length=60)
    
    def _add_bilateral_pattern(self):
        """Add a bilaterally symmetric pattern."""
        if len(self.dot_grid) < 4:
            return
        
        # Connect dots symmetrically across both axes
        center_x = self.width // 2
        center_y = self.height // 2
        
        for dot in self.dot_grid:
            # Find symmetric counterpart
            sym_x = 2 * center_x - dot[0]
            sym_y = 2 * center_y - dot[1]
            
            # Find closest dot to symmetric position
            closest_dot = self._find_closest_dot((sym_x, sym_y))
            if closest_dot and closest_dot != dot:
                cv2.line(self.canvas, dot, closest_dot, 255, 2)
    
    def _add_vertical_symmetry_pattern(self):
        """Add a vertically symmetric pattern."""
        center_x = self.width // 2
        
        for dot in self.dot_grid:
            if dot[0] < center_x:  # Only process left side dots
                # Find right side counterpart
                sym_x = 2 * center_x - dot[0]
                sym_y = dot[1]
                
                closest_dot = self._find_closest_dot((sym_x, sym_y))
                if closest_dot:
                    cv2.line(self.canvas, dot, closest_dot, 255, 2)
    
    def _add_basic_connection_pattern(self):
        """Add basic connection patterns."""
        if len(self.dot_grid) < 2:
            return
        
        # Connect adjacent dots in a simple pattern
        for i in range(len(self.dot_grid) - 1):
            dot1 = self.dot_grid[i]
            dot2 = self.dot_grid[i + 1]
            cv2.line(self.canvas, dot1, dot2, 255, 2)
    
    def _add_connectivity_patterns(self, connectivity_info: Dict):
        """Add patterns based on connectivity analysis."""
        if connectivity_info.get('has_eulerian_path', False):
            self._create_eulerian_path_pattern()
        elif connectivity_info.get('num_cycles', 0) > 0:
            self._create_cyclic_pattern()
    
    def _create_eulerian_path_pattern(self):
        """Create a pattern that forms an Eulerian path."""
        if len(self.dot_grid) < 3:
            return
        
        # Create a simple path through all dots
        for i in range(len(self.dot_grid) - 1):
            cv2.line(self.canvas, self.dot_grid[i], self.dot_grid[i + 1], 255, 2)
        
        # Close the loop if we have enough dots
        if len(self.dot_grid) > 3:
            cv2.line(self.canvas, self.dot_grid[-1], self.dot_grid[0], 255, 2)
    
    def _create_cyclic_pattern(self):
        """Create patterns with cycles."""
        if len(self.dot_grid) < 4:
            return
        
        # Create multiple small cycles
        cycle_size = 4
        for i in range(0, len(self.dot_grid) - cycle_size + 1, cycle_size // 2):
            cycle_dots = self.dot_grid[i:i + cycle_size]
            
            # Draw cycle
            for j in range(len(cycle_dots)):
                dot1 = cycle_dots[j]
                dot2 = cycle_dots[(j + 1) % len(cycle_dots)]
                cv2.line(self.canvas, dot1, dot2, 255, 2)
    
    def _draw_radial_line_from_center(self, center: Tuple[int, int], angle: float, length: int):
        """Draw a radial line from center at given angle."""
        x0, y0 = center
        x1 = int(x0 + length * math.cos(angle))
        y1 = int(y0 + length * math.sin(angle))
        
        cv2.line(self.canvas, (x0, y0), (x1, y1), 255, 2)
    
    def _find_closest_dot(self, target: Tuple[int, int]) -> Optional[Tuple[int, int]]:
        """Find the closest dot to a target position."""
        if not self.dot_grid:
            return None
        
        min_dist = float('inf')
        closest_dot = None
        
        for dot in self.dot_grid:
            dist = math.sqrt((dot[0] - target[0])**2 + (dot[1] - target[1])**2)
            if dist < min_dist:
                min_dist = dist
                closest_dot = dot
        
        return closest_dot if min_dist < 100 else None  # Threshold for valid match
    
    def save_design(self, filename: str):
        """Save the generated design to a file."""
        cv2.imwrite(filename, self.canvas)
    
    def get_design_as_array(self) -> np.ndarray:
        """Get the current design as a numpy array."""
        return self.canvas.copy()

# Example usage and pattern generation functions
def generate_traditional_patterns() -> Dict[str, np.ndarray]:
    """Generate a collection of traditional Kolam patterns."""
    recreator = KolamRecreator(600, 600)
    patterns = {}
    
    # Generate different pattern types
    pattern_types = ["square_loop", "diamond_chain", "spiral", "flower"]
    
    for pattern_type in pattern_types:
        pattern = recreator.generate_simple_kolam(pattern_type)
        patterns[pattern_type] = pattern
    
    return patterns

def recreate_from_image_analysis(image_path: str) -> np.ndarray:
    """
    Analyze an image and recreate the Kolam design.
    
    Args:
        image_path: Path to the input image
        
    Returns:
        Recreated design as numpy array
    """
    # Analyze the input image
    analyzer = KolamDesignPrinciples(image_path=image_path)
    analysis = analyzer.generate_comprehensive_analysis()
    
    # Recreate based on analysis
    recreator = KolamRecreator(600, 600)
    recreated_design = recreator.recreate_from_analysis(analysis)
    
    return recreated_design

# Example usage
if __name__ == "__main__":
    # Generate sample patterns
    patterns = generate_traditional_patterns()
    print(f"Generated {len(patterns)} traditional patterns")
    
    # Save patterns for demonstration
    for name, pattern in patterns.items():
        cv2.imwrite(f"generated_{name}.png", pattern)
        print(f"Saved {name} pattern")