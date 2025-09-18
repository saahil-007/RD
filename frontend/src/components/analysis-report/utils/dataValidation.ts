import { AnalysisData, AnalysisMetrics, PatternData, CulturalElement, ColorAnalysis } from '../types';
import { ANALYSIS_CONFIG } from '../constants/config';

// Enhanced data validation utilities
export class AnalysisDataValidator {
  /**
   * Validates and sanitizes analysis data
   */
  static validateAnalysisData(data: Partial<AnalysisData>): AnalysisData {
    return {
      imageUrl: this.validateImageUrl(data.imageUrl),
      overallScore: this.validateScore(data.overallScore),
      metrics: this.validateMetrics(data.metrics),
      patterns: this.validatePatterns(data.patterns),
      culturalElements: this.validateCulturalElements(data.culturalElements),
      colorAnalysis: this.validateColorAnalysis(data.colorAnalysis),
      recommendations: this.validateRecommendations(data.recommendations),
      exportData: data.exportData,
    };
  }

  /**
   * Validates image URL with fallback
   */
  private static validateImageUrl(url?: string): string {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return ANALYSIS_CONFIG.DEFAULTS.imageUrl;
    }
    
    // Basic URL validation
    try {
      new URL(url);
      return url;
    } catch {
      // If not a valid URL, assume it's a relative path
      return url.startsWith('/') ? url : `/${url}`;
    }
  }

  /**
   * Validates and clamps score values
   */
  private static validateScore(score?: number): number {
    if (typeof score !== 'number' || isNaN(score)) {
      return ANALYSIS_CONFIG.DEFAULTS.overallScore;
    }
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validates metrics object with defaults
   */
  private static validateMetrics(metrics?: Partial<AnalysisMetrics>): AnalysisMetrics {
    const defaultMetrics = ANALYSIS_CONFIG.DEFAULTS.metrics;
    
    if (!metrics || typeof metrics !== 'object') {
      return defaultMetrics;
    }

    return {
      symmetry: this.validateScore(metrics.symmetry) || defaultMetrics.symmetry,
      complexity: this.validateScore(metrics.complexity) || defaultMetrics.complexity,
      cultural: this.validateScore(metrics.cultural) || defaultMetrics.cultural,
      aesthetic: this.validateScore(metrics.aesthetic) || defaultMetrics.aesthetic,
      innovation: this.validateScore(metrics.innovation) || defaultMetrics.innovation,
      technical: this.validateScore(metrics.technical) || defaultMetrics.technical,
    };
  }

  /**
   * Validates patterns array
   */
  private static validatePatterns(patterns?: PatternData[]): PatternData[] {
    if (!Array.isArray(patterns)) {
      return this.getDefaultPatterns();
    }

    const validPatterns = patterns.filter(pattern => 
      pattern && 
      typeof pattern.name === 'string' && 
      typeof pattern.confidence === 'number' &&
      typeof pattern.region === 'string' &&
      typeof pattern.description === 'string'
    );

    return validPatterns.length > 0 ? validPatterns : this.getDefaultPatterns();
  }

  /**
   * Validates cultural elements array
   */
  private static validateCulturalElements(elements?: CulturalElement[]): CulturalElement[] {
    if (!Array.isArray(elements)) {
      return this.getDefaultCulturalElements();
    }

    const validElements = elements.filter(element => 
      element && 
      typeof element.element === 'string' && 
      typeof element.significance === 'string' &&
      typeof element.origin === 'string' &&
      typeof element.confidence === 'number'
    );

    return validElements.length > 0 ? validElements : this.getDefaultCulturalElements();
  }

  /**
   * Validates color analysis object
   */
  private static validateColorAnalysis(colorAnalysis?: ColorAnalysis): ColorAnalysis {
    if (!colorAnalysis || typeof colorAnalysis !== 'object') {
      return this.getDefaultColorAnalysis();
    }

    return {
      dominantColors: Array.isArray(colorAnalysis.dominantColors) ? 
        colorAnalysis.dominantColors.filter(color => typeof color === 'string') :
        this.getDefaultColorAnalysis().dominantColors,
      harmony: this.validateScore(colorAnalysis.harmony) || 87,
      contrast: this.validateScore(colorAnalysis.contrast) || 92,
      saturation: this.validateScore(colorAnalysis.saturation) || 78,
    };
  }

  /**
   * Validates recommendations array
   */
  private static validateRecommendations(recommendations?: string[]): string[] {
    if (!Array.isArray(recommendations)) {
      return this.getDefaultRecommendations();
    }

    const validRecommendations = recommendations.filter(rec => 
      typeof rec === 'string' && rec.trim().length > 0
    );

    return validRecommendations.length > 0 ? validRecommendations : this.getDefaultRecommendations();
  }

  // Default data generators
  private static getDefaultPatterns(): PatternData[] {
    return [
      {
        name: "Lotus Pattern",
        confidence: 92,
        region: "Center",
        description: "Traditional lotus motif representing purity and enlightenment"
      },
      {
        name: "Geometric Mandala",
        confidence: 88,
        region: "Outer Ring",
        description: "Complex geometric patterns with spiritual significance"
      },
      {
        name: "Paisley Elements",
        confidence: 75,
        region: "Border",
        description: "Decorative paisley motifs adding elegance"
      },
      {
        name: "Floral Borders",
        confidence: 85,
        region: "Periphery",
        description: "Intricate floral designs framing the composition"
      }
    ];
  }

  private static getDefaultCulturalElements(): CulturalElement[] {
    return [
      {
        element: "Diya Motifs",
        significance: "Represents light overcoming darkness",
        origin: "North India",
        confidence: 90
      },
      {
        element: "Kolam Patterns",
        significance: "Traditional Tamil geometric art",
        origin: "South India",
        confidence: 85
      },
      {
        element: "Alpana Designs",
        significance: "Bengali decorative floor art",
        origin: "West Bengal",
        confidence: 78
      },
      {
        element: "Muggulu Elements",
        significance: "Telugu traditional patterns",
        origin: "Andhra Pradesh",
        confidence: 82
      }
    ];
  }

  private static getDefaultColorAnalysis(): ColorAnalysis {
    return {
      dominantColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
      harmony: 87,
      contrast: 92,
      saturation: 78
    };
  }

  private static getDefaultRecommendations(): string[] {
    return [
      "Consider adding more intricate details in the central motif to enhance visual impact",
      "Experiment with complementary colors to increase contrast and vibrancy",
      "Incorporate more traditional symbols to strengthen cultural authenticity",
      "Balance the composition by adding symmetrical elements in empty spaces"
    ];
  }
}

/**
 * Performance category utilities
 */
export class PerformanceUtils {
  /**
   * Get performance category based on score
   */
  static getPerformanceCategory(score: number) {
    if (score >= ANALYSIS_CONFIG.THRESHOLDS.excellent) return 'EXCELLENT';
    if (score >= ANALYSIS_CONFIG.THRESHOLDS.good) return 'GOOD';
    if (score >= ANALYSIS_CONFIG.THRESHOLDS.average) return 'AVERAGE';
    return 'NEEDS_IMPROVEMENT';
  }

  /**
   * Generate trend value based on score and category
   */
  static generateTrend(score: number): number {
    const category = this.getPerformanceCategory(score);
    switch (category) {
      case 'EXCELLENT': return Math.floor(Math.random() * 10) + 5; // 5-15%
      case 'GOOD': return Math.floor(Math.random() * 8) + 2; // 2-10%
      case 'AVERAGE': return Math.floor(Math.random() * 6) - 2; // -2 to 4%
      default: return Math.floor(Math.random() * 5) - 5; // -5 to 0%
    }
  }
}

/**
 * Data transformation utilities
 */
export class DataTransformUtils {
  /**
   * Transform analysis data for specific chart types
   */
  static prepareChartData(data: AnalysisData) {
    return {
      radar: this.prepareRadarData(data.metrics),
      doughnut: this.prepareDoughnutData(data),
      bar: this.prepareBarData(data.colorAnalysis),
      line: this.prepareLineData(data.metrics),
    };
  }

  private static prepareRadarData(metrics: AnalysisMetrics) {
    return {
      labels: ['Symmetry', 'Complexity', 'Cultural', 'Aesthetic', 'Innovation', 'Technical'],
      datasets: [{
        label: 'Analysis Results',
        data: Object.values(metrics),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      }]
    };
  }

  private static prepareDoughnutData(data: AnalysisData) {
    return {
      labels: ['Radial', 'Bilateral', 'Translational', 'Rotational'],
      datasets: [{
        data: [30, 25, 20, 25],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
      }]
    };
  }

  private static prepareBarData(colorAnalysis: ColorAnalysis) {
    return {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'],
      datasets: [{
        label: 'Color Distribution',
        data: [25, 15, 20, 10, 18, 12],
        backgroundColor: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'],
      }]
    };
  }

  private static prepareLineData(metrics: AnalysisMetrics) {
    return {
      labels: ['Basic', 'Intermediate', 'Advanced', 'Master'],
      datasets: [{
        label: 'Complexity Levels',
        data: [85, 72, 68, 45],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    };
  }
}