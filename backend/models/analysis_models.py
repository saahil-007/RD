"""
Data models for the Rangoli Analysis system.
"""
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime

@dataclass
class AnalysisPoint:
    """Represents a point detected in the analysis."""
    x: float
    y: float
    confidence: float
    size: Optional[float] = None
    type: Optional[str] = None

@dataclass
class PatternDetection:
    """Represents a detected pattern in the rangoli."""
    name: str
    confidence: float
    region: str
    description: str
    bbox: Optional[Dict[str, float]] = None

@dataclass
class CulturalElement:
    """Represents a cultural element identified in the rangoli."""
    element: str
    significance: str
    origin: str
    confidence: float
    cultural_context: Optional[str] = None

@dataclass
class SymmetryAnalysis:
    """Results of symmetry analysis."""
    horizontal_symmetry: float
    vertical_symmetry: float
    diagonal_symmetry: float
    radial_symmetry: float
    overall_symmetry: float
    n_fold_symmetry: Optional[int] = None

@dataclass
class ColorAnalysis:
    """Results of color analysis."""
    dominant_colors: List[str]
    harmony_score: float
    contrast_score: float
    saturation_score: float
    cultural_significance: Optional[str] = None

@dataclass
class ComplexityMetrics:
    """Complexity analysis metrics."""
    stroke_count: int
    dot_count: int
    pattern_complexity: float
    geometric_complexity: float
    overall_complexity: float

@dataclass
class AnalysisResult:
    """Complete analysis result for a rangoli image."""
    timestamp: datetime
    image_dimensions: Dict[str, Any]
    dots: List[AnalysisPoint]
    patterns: List[PatternDetection]
    cultural_elements: List[CulturalElement]
    symmetry: SymmetryAnalysis
    colors: ColorAnalysis
    complexity: ComplexityMetrics
    overall_score: float
    recommendations: List[str]
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class AnalysisProgress:
    """Progress update during analysis."""
    progress: int  # 0-100
    description: str
    estimated_remaining_time: int
    current_stage: str
    details: Optional[Dict[str, Any]] = None