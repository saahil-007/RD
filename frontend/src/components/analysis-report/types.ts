import { ReactNode } from 'react';

// Core data interfaces following TypeScript-first development
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

export interface PatternData {
  name: string;
  confidence: number;
  region: string;
  description: string;
}

export interface CulturalElement {
  element: string;
  significance: string;
  origin: string;
  confidence: number;
}

export interface ColorAnalysis {
  dominantColors: string[];
  harmony: number;
  contrast: number;
  saturation: number;
}

export interface AnalysisMetrics {
  symmetry: number;
  complexity: number;
  cultural: number;
  aesthetic: number;
  innovation: number;
  technical: number;
}

export interface AnalysisData {
  imageUrl: string;
  overallScore: number;
  metrics: AnalysisMetrics;
  patterns?: PatternData[];
  culturalElements?: CulturalElement[];
  colorAnalysis?: ColorAnalysis;
  recommendations?: string[];
  exportData?: Record<string, unknown>;
}

export interface AnalysisReportProps {
  analysisData: AnalysisData;
  onClose?: () => void;
}

// Chart data interfaces for type safety
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

// Export data interface
export interface ExportSummary {
  timestamp: string;
  analysisResults: AnalysisData;
  summary: {
    overallScore: number;
    topMetrics: MetricCardData[];
    recommendations: string[];
  };
}