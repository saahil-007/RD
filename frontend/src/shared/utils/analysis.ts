/**
 * Analysis-specific utility functions.
 */
import type { AnalysisData, MetricCardData, PerformanceLevel } from '../types';
import { ANALYSIS_CONFIG, PERFORMANCE_CATEGORIES } from '../constants';

/**
 * Safely extract metric value with fallback
 */
export function getMetricValue(
  data: AnalysisData | undefined,
  metricKey: string,
  defaultValue = 0
): number {
  if (!data?.metrics) {
    return defaultValue;
  }
  
  const value = (data.metrics as any)[metricKey];
  return typeof value === 'number' ? value : defaultValue;
}

/**
 * Determine performance level based on score
 */
export function getPerformanceLevel(score: number): PerformanceLevel {
  if (score >= ANALYSIS_CONFIG.THRESHOLDS.excellent) return 'excellent';
  if (score >= ANALYSIS_CONFIG.THRESHOLDS.good) return 'good';
  if (score >= ANALYSIS_CONFIG.THRESHOLDS.average) return 'average';
  return 'poor';
}

/**
 * Get performance category with styling
 */
export function getPerformanceCategory(score: number) {
  const level = getPerformanceLevel(score);
  
  switch (level) {
    case 'excellent':
      return PERFORMANCE_CATEGORIES.EXCELLENT;
    case 'good':
      return PERFORMANCE_CATEGORIES.GOOD;
    case 'average':
      return PERFORMANCE_CATEGORIES.AVERAGE;
    default:
      return PERFORMANCE_CATEGORIES.NEEDS_IMPROVEMENT;
  }
}

/**
 * Calculate overall score from metrics
 */
export function calculateOverallScore(metrics: Record<string, number>): number {
  const values = Object.values(metrics);
  if (values.length === 0) return 0;
  
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Generate metric cards with defensive data handling
 */
export function generateMetricCards(
  analysisData: AnalysisData | undefined,
  iconMap: Record<string, React.ReactNode>
): MetricCardData[] {
  const defaultMetrics = ANALYSIS_CONFIG.DEFAULTS.metrics;
  
  return Object.entries(defaultMetrics).map(([key, defaultValue]) => {
    const value = getMetricValue(analysisData, key, defaultValue);
    const config = ANALYSIS_CONFIG.CHART_COLORS;
    
    return {
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      icon: iconMap[key] || iconMap.default,
      color: (config as any)[key] || config.primary,
      bgColor: `bg-${key}-50`,
      description: `${key} analysis result`,
      unit: '%',
    };
  });
}

/**
 * Extract recommendations with fallback
 */
export function getRecommendations(data: AnalysisData | undefined): string[] {
  return data?.recommendations ?? [
    'Continue practicing traditional patterns',
    'Focus on symmetry improvement',
    'Explore cultural significance',
  ];
}

/**
 * Check if analysis data is complete
 */
export function isAnalysisComplete(data: AnalysisData | undefined): boolean {
  if (!data) return false;
  
  return !!(
    data.overallScore &&
    data.metrics &&
    Object.keys(data.metrics).length > 0
  );
}

/**
 * Safe data extraction with type checking
 */
export function safeDataExtract<T>(
  data: unknown,
  path: string,
  defaultValue: T
): T {
  if (!data || typeof data !== 'object') {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let current: any = data;
  
  for (const key of keys) {
    if (current?.[key] === undefined) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current ?? defaultValue;
}

/**
 * Prepare analysis data for export
 */
export function prepareAnalysisForExport(data: AnalysisData): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    overall_score: data.overallScore ?? 0,
    metrics: data.metrics ?? ANALYSIS_CONFIG.DEFAULTS.metrics,
    patterns: data.patterns ?? [],
    cultural_elements: data.culturalElements ?? [],
    recommendations: data.recommendations ?? [],
    image_url: data.imageUrl,
  };
}