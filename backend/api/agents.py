import networkx as nx
import numpy as np
from .analysis import analyze_symmetry, classify_style

class TutorialAgent:
    """Generates human-friendly drawing tutorials from a Kolam graph."""

    def __init__(self, analysis_data):
        self.graph = self.reconstruct_graph(analysis_data['graph'])
        self.dots = analysis_data['dots']
        self.image_size = analysis_data['image_size']

    def reconstruct_graph(self, graph_data):
        G = nx.Graph()
        for node in graph_data['nodes']:
            G.add_node(node['id'], o=np.array(node['attr']['o']))
        for edge in graph_data['edges']:
            G.add_edge(edge['source'], edge['target'], pts=np.array(edge['attr']['pts']))
        return G

    def get_dot_description(self, dot_coords):
        center_x, center_y = self.image_size[0] / 2, self.image_size[1] / 2
        x, y = dot_coords
        y_pos = "middle"
        if y < center_y - self.image_size[1] / 4: y_pos = "top"
        elif y > center_y + self.image_size[1] / 4: y_pos = "bottom"
        x_pos = "center"
        if x < center_x - self.image_size[0] / 4: x_pos = "left"
        elif x > center_x + self.image_size[0] / 4: x_pos = "right"
        if y_pos != "middle" and x_pos != "center": return f"the {y_pos}-{x_pos} area"
        elif y_pos != "middle": return f"the {y_pos} area"
        else: return f"the {x_pos} area"

    def generate_drawing_steps(self):
        if not self.graph.nodes: return ["Start by placing the dots on your paper."] + [f"Place a dot at position ({d[0]}, {d[1]})" for d in self.dots]
        steps = ["1. First, place all the dots on your paper to form the grid."]
        start_node = min(self.graph.nodes, key=lambda n: self.graph.nodes[n]['o'][1])
        path_edges = list(nx.dfs_edges(self.graph, source=start_node))
        if not path_edges: return steps + ["The design consists only of dots."]
        current_pos_desc = self.get_dot_description(self.graph.nodes[start_node]['o'])
        steps.append(f"2. Begin with the dot in {current_pos_desc}.")
        for i, (u, v) in enumerate(path_edges):
            start_desc, end_desc = self.get_dot_description(self.graph.nodes[u]['o']), self.get_dot_description(self.graph.nodes[v]['o'])
            path = self.graph.edges[u, v].get('pts', [])
            instruction = f"{i+3}. From the dot in {start_desc}, draw a curve towards the dot in {end_desc}." if len(path) > 2 else f"{i+3}. Now, draw a straight line to the one in {end_desc}."
            steps.append(instruction)
        steps.append("Congratulations, you have completed the Rangoli!")
        return steps

class CulturalAgent:
    """Analyzes the cultural and artistic properties of a Rangoli."""
    def __init__(self, analysis_data):
        self.analysis_data = analysis_data
        self.graph = TutorialAgent(analysis_data).graph

    def analyze(self):
        num_dots, num_lines, num_curves = len(self.analysis_data['dots']), self.graph.number_of_edges(), sum(1 for _, _, data in self.graph.edges(data=True) if len(data.get('pts', [])) > 2)
        complexity = (num_dots * 0.2) + (num_lines * 0.5) + (num_curves * 0.8)
        complexity_level = "Simple" if complexity <= 20 else ("Moderate" if complexity <= 50 else "Complex")
        report = {
            "metadata": {"dots": num_dots, "lines": num_lines - num_curves, "curves": num_curves, "complexity": f"{complexity:.2f} ({complexity_level})"},
            "cultural_context": {"origin_state": "Unknown", "category": "Unknown", "description": "..."}
        }
        report["artistic_properties"] = {"symmetry": analyze_symmetry(self.analysis_data['dots'], self.graph, self.analysis_data['image_size']), "style": classify_style(report)}
        return report

class SuggestionAgent:
    """Generates creative suggestions based on the Rangoli analysis."""
    def __init__(self, analysis_report):
        self.report = analysis_report

    def generate_suggestions(self):
        suggestions = []
        complexity = float(self.report["metadata"]["complexity"].split(' ')[0])
        style = self.report["artistic_properties"]["style"]

        if complexity < 15:
            suggestions.append("This is a lovely start! Try adding more intricate loops or lines to increase the complexity.")
        if "Geometric" in style:
            suggestions.append("The geometric patterns are very strong. Consider adding some curved elements for a beautiful contrast.")
        if self.report["artistic_properties"]["symmetry"]["vertical"] < 0.8:
            suggestions.append("Explore vertical symmetry to create a more balanced and harmonious design.")
        if self.report["artistic_properties"]["symmetry"]["horizontal"] < 0.8:
            suggestions.append("Explore horizontal symmetry to create a more balanced and harmonious design.")
        if not suggestions:
            suggestions.append("This is a well-balanced and beautiful design! Experiment with different color palettes to make it even more vibrant.")
        return suggestions