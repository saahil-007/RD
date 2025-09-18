import { useMemo, useCallback, useRef, useEffect } from 'react';
import { AnalysisData, MetricCardData } from '../types';
import { AnalysisDataValidator, PerformanceUtils, DataTransformUtils } from '../utils/dataValidation';
import { METRIC_CARDS_CONFIG } from '../constants/config';

/**
 * Enhanced hook for analysis data management with validation and transformation
 */
export const useAnalysisData = (rawData: Partial<AnalysisData>) => {
  // Validate and sanitize data
  const validatedData = useMemo(() => {
    return AnalysisDataValidator.validateAnalysisData(rawData);
  }, [rawData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return DataTransformUtils.prepareChartData(validatedData);
  }, [validatedData]);

  // Generate metric cards with enhanced data
  const metricCards = useMemo((): MetricCardData[] => {
    return METRIC_CARDS_CONFIG.map((config) => {
      const value = validatedData.metrics[config.id as keyof typeof validatedData.metrics];
      const trend = PerformanceUtils.generateTrend(value);
      
      return {
        id: config.id,
        label: config.label,
        value,
        icon: null, // Will be populated by component
        color: config.color,
        bgColor: config.bgColor,
        description: config.description,
        trend,
        unit: config.unit,
      };
    });
  }, [validatedData.metrics]);

  // Calculate insights
  const insights = useMemo(() => {
    const scores = Object.values(validatedData.metrics);
    const bestMetric = METRIC_CARDS_CONFIG[
      scores.indexOf(Math.max(...scores))
    ];
    const worstMetric = METRIC_CARDS_CONFIG[
      scores.indexOf(Math.min(...scores))
    ];
    
    return {
      bestAspect: bestMetric.label,
      improvementArea: worstMetric.label,
      skillLevel: PerformanceUtils.getPerformanceCategory(validatedData.overallScore),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    };
  }, [validatedData]);

  return {
    data: validatedData,
    chartData,
    metricCards,
    insights,
  };
};