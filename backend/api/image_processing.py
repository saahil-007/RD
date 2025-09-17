from fastapi import UploadFile, File
import numpy as np
import cv2
from skimage.morphology import skeletonize
import torch
from torchvision.transforms import functional as F
from .models import DotGridDetector, StrokeSegmenter
import sknw

# Load models
dot_detector = DotGridDetector()
stroke_segmenter = StrokeSegmenter()
dot_detector.eval()
stroke_segmenter.eval()

def process_image(img: np.ndarray):
    """Processes an image to extract dot grid and stroke graph."""
    # Convert to tensor
    input_tensor = F.to_tensor(img).unsqueeze(0)

    # Perform inference
    with torch.no_grad():
        dot_grid_pred = dot_detector(input_tensor)
        stroke_seg_pred = stroke_segmenter(input_tensor)

    # Post-process predictions
    dot_grid_mask = (dot_grid_pred.squeeze().numpy() > 0.5).astype(np.uint8)
    stroke_mask = (torch.sigmoid(stroke_seg_pred).squeeze().numpy() > 0.5).astype(np.uint8)

    # Find dot coordinates
    contours, _ = cv2.findContours(dot_grid_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    dots = []
    for cnt in contours:
        M = cv2.moments(cnt)
        if M["m00"] != 0:
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
            dots.append([cX, cY])

    # Build graph from skeleton
    graph = build_graph_from_skeleton(stroke_mask)

    # Convert graph to a serializable format
    serializable_graph = nx_to_serializable(graph)

    return {
        "dots": dots,
        "graph": serializable_graph,
        "image_size": [img.shape[1], img.shape[0]]  # [width, height]
    }

def build_graph_from_skeleton(stroke_mask):
    skeleton = skeletonize(stroke_mask // 255)
    graph = sknw.build_sknw(skeleton)
    return graph

def nx_to_serializable(graph):
    serializable_graph = {"nodes": [], "edges": []}
    for node, data in graph.nodes(data=True):
        serializable_graph["nodes"].append({"id": node, "attr": data})
    for u, v, data in graph.edges(data=True):
        serializable_graph["edges"].append({"source": u, "target": v, "attr": data})
    return serializable_graph