/**
 * Core data types for the Rangoli Analysis application.
 * Following defensive TypeScript interface design with optional fields
 * for fields that may be absent due to asynchronous loading.
 */
import { ReactNode } from 'react';

// ============================================================================
// ANALYSIS DATA INTERFACES
// ============================================================================

export interface ImageDimensions {
  height: number;
  width: number;
  aspect_ratio: string;
  total_pixels: number;
}

export interface AnalysisPoint {
  x: number;
  y: number;
  confidence: number;
  size?: number;
  type?: string;
}

export interface PatternData {
  name: string;
  confidence: number;
  region: string;
  description: string;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CulturalElement {
  element: string;
  significance: string;
  origin: string;
  confidence: number;
  cultural_context?: string;
}

export interface ColorAnalysis {
  dominantColors: string[];
  harmony: number;
  contrast: number;
  saturation: number;
  cultural_significance?: string;
}

export interface SymmetryMetrics {
  horizontal_symmetry?: string;
  vertical_symmetry?: string;
  diagonal_symmetry?: string;
  radial_symmetry?: string;
  overall_symmetry: string;
  n_fold_symmetry?: number;
}

export interface ComplexityMetrics {
  stroke_count?: number;
  dot_count?: number;
  pattern_complexity?: number;
  geometric_complexity?: number;
  overall_complexity?: number;
}

export interface AnalysisMetrics {
  symmetry: number;
  complexity: number;
  cultural: number;
  aesthetic: number;
  innovation: number;
  technical: number;
}

export interface AnalysisSummary {
  overall_quality_score: string;
  total_dots_detected: number;
  total_strokes_detected: number;
  symmetry_level: string;
  cultural_authenticity: string;
  predominant_features: string;
  artistic_style: string;
  complexity_rating: string;
}

export interface AnalysisRecommendations {
  improvement_suggestions: string[];
  skill_development?: string;
  cultural_context?: string;
}

export interface PerformanceMetrics {
  analysis_time: string;
  dots_analysis_time?: string;
  symmetry_analysis_time?: string;
  lines_analysis_time?: string;
  spatial_analysis_time?: string;
  pattern_analysis_time?: string;
}

// ============================================================================
// COMPREHENSIVE ANALYSIS DATA
// ============================================================================

export interface AnalysisData {
  imageUrl: string;
  overallScore: number;
  metrics: AnalysisMetrics;
  
  // Optional fields that may be loaded asynchronously
  image_dimensions?: ImageDimensions;
  analysis_summary?: AnalysisSummary;
  patterns?: PatternData[];
  culturalElements?: CulturalElement[];
  colorAnalysis?: ColorAnalysis;
  symmetry_metrics?: SymmetryMetrics;
  complexity_metrics?: ComplexityMetrics;
  recommendations?: string[];
  performance_metrics?: PerformanceMetrics;
  
  // Raw analysis data for advanced users
  exportData?: Record<string, unknown>;
  
  // Metadata
  timestamp?: string;
  analysis_version?: string;
}

// ============================================================================
// UI COMPONENT INTERFACES
// ============================================================================

export interface MetricCardData {
  id: string;
  label: string;
  value: number;
  maxValue?: number;
  icon: ReactNode;
  color: string;
  bgColor: string;
  description?: string;
  trend?: number;
  unit?: string;
}

export interface TabData {
  id: string;
  label: string;
  icon: string;
  content?: ReactNode;
}

// ============================================================================
// CHART DATA INTERFACES
// ============================================================================

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// ============================================================================
// EXPORT & ANALYSIS REPORT INTERFACES
// ============================================================================

export interface ExportSummary {
  timestamp: string;
  analysisResults: AnalysisData;
  summary: {
    overallScore: number;
    topMetrics: Omit<MetricCardData, 'icon'>[];
    recommendations: string[];
  };
}

export interface AnalysisReportProps {
  analysisData: AnalysisData;
  onClose?: () => void;
}

// ============================================================================
// PROGRESS & STATE INTERFACES
// ============================================================================

export interface AnalysisProgress {
  progress: number; // 0-100
  description: string;
  estimated_remaining_time: number;
  current_stage?: string;
  details?: Record<string, unknown>;
}

export interface UIState {
  activeTab: string;
  isLoading: boolean;
  isExporting: boolean;
  error?: string;
  expandedSections?: string[];
}

// ============================================================================
// FILE UPLOAD INTERFACES
// ============================================================================

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview?: string;
  publicUrl?: string;
}

export interface UploadState {
  file?: UploadedFile;
  isUploading: boolean;
  progress: number;
  error?: string;
}

// ============================================================================
// PERFORMANCE & QUALITY TYPES
// ============================================================================

export type PerformanceLevel = 'excellent' | 'good' | 'average' | 'poor';

export interface PerformanceCategory {
  min: number;
  label: string;
  color: string;
  bgColor: string;
}

export type ExportFormat = 'pdf' | 'json' | 'csv' | 'excel' | 'word';

export type TabId = 'overview' | 'metrics' | 'patterns' | 'cultural' | 'details';

export type MetricId = 'symmetry' | 'complexity' | 'cultural' | 'aesthetic' | 'innovation' | 'technical';

// ============================================================================
// VALIDATION & ERROR HANDLING
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
  timestamp: string;
}