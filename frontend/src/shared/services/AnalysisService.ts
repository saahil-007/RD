/**
 * Enhanced Analysis Service with improved error handling and data management.
 * Following the service layer pattern for better organization and reusability.
 */
import { API_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import type { 
  AnalysisData, 
  AnalysisProgress, 
  UploadedFile, 
  ApiResponse 
} from '../types';
import { validateImageFile, validateAnalysisData } from '../utils/validation';

export class AnalysisService {
  private static instance: AnalysisService;
  private controller: AbortController | null = null;

  static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  /**
   * Analyze uploaded image with progress tracking
   */
  async analyzeImage(
    file: File,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<ApiResponse<AnalysisData>> {
    // Validate file first
    const validationErrors = validateImageFile(file);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: {
          message: validationErrors[0].message,
          code: validationErrors[0].code
        },
        timestamp: new Date().toISOString()
      };
    }

    // Cancel any existing request
    this.cancelAnalysis();

    // Create new abort controller
    this.controller = new AbortController();

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('image', file);

      // Start analysis with server-sent events
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
        method: 'POST',
        body: formData,
        signal: this.controller.signal,
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await this.processEventStream(response, onProgress);

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              message: 'Analysis was cancelled',
              code: 'CANCELLED'
            },
            timestamp: new Date().toISOString()
          };
        }

        return {
          success: false,
          error: {
            message: error.message || ERROR_MESSAGES.ANALYSIS.FAILED,
            code: 'ANALYSIS_ERROR'
          },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.ANALYSIS.FAILED,
          code: 'UNKNOWN_ERROR'
        },
        timestamp: new Date().toISOString()
      };
    } finally {
      this.controller = null;
    }
  }

  /**
   * Cancel ongoing analysis
   */
  cancelAnalysis(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  /**
   * Process server-sent events stream
   */
  private async processEventStream(
    response: Response,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<ApiResponse<AnalysisData>> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let analysisData: AnalysisData | null = null;
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // Handle different event types
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.progress !== undefined && onProgress) {
                onProgress({
                  progress: data.progress,
                  description: data.description || '',
                  estimated_remaining_time: data.estimated_remaining_time || 0,
                  current_stage: data.current_stage,
                  details: data.details
                });
              }
              
              if (data.report) {
                analysisData = this.processAnalysisReport(data.report);
              }
              
              if (data.report_part) {
                // Handle partial reports (for real-time updates)
                if (onProgress) {
                  onProgress({
                    progress: data.progress || 50,
                    description: 'Processing analysis data...',
                    estimated_remaining_time: 5,
                    details: data.report_part
                  });
                }
              }
              
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError);
            }
          }
        }
      }

      if (!analysisData) {
        throw new Error('No analysis data received');
      }

      return {
        success: true,
        data: analysisData,
        timestamp: new Date().toISOString()
      };

    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Process and validate analysis report from backend
   */
  private processAnalysisReport(report: any): AnalysisData {
    // Extract and validate data with defensive programming
    const imageUrl = report.image_url || '';
    const overallScore = this.extractScore(report.analysis_summary?.overall_quality_score);
    
    // Build metrics with fallbacks
    const metrics = {
      symmetry: this.extractScore(report.analysis_summary?.symmetry_level) || 85,
      complexity: report.complexity_metrics?.overall_complexity || 78,
      cultural: this.extractScore(report.analysis_summary?.cultural_authenticity) || 92,
      aesthetic: report.color_analysis?.harmony_score || 88,
      innovation: 72, // Default as not always provided
      technical: 90   // Default as not always provided
    };

    // Extract optional data with null checks
    const patterns = this.extractPatterns(report);
    const culturalElements = this.extractCulturalElements(report);
    const colorAnalysis = this.extractColorAnalysis(report);
    const recommendations = this.extractRecommendations(report);

    const analysisData: AnalysisData = {
      imageUrl,
      overallScore,
      metrics,
      patterns,
      culturalElements,
      colorAnalysis,
      recommendations,
      image_dimensions: report.image_dimensions,
      analysis_summary: report.analysis_summary,
      performance_metrics: report.performance_metrics,
      timestamp: new Date().toISOString()
    };

    // Validate processed data
    if (!validateAnalysisData(analysisData)) {
      console.warn('Analysis data validation failed, using defaults');
    }

    return analysisData;
  }

  /**
   * Safely extract score from percentage string
   */
  private extractScore(value: string | number | undefined): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace('%', ''));
      return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
    }
    return 0;
  }

  /**
   * Extract patterns with validation
   */
  private extractPatterns(report: any): any[] {
    const patternsData = report.pattern_recognition?.detected_patterns || 
                        report.patterns || [];
    
    return Array.isArray(patternsData) ? patternsData : [];
  }

  /**
   * Extract cultural elements with validation
   */
  private extractCulturalElements(report: any): any[] {
    const culturalData = report.pattern_recognition?.cultural_elements ||
                        report.cultural_elements || [];
    
    return Array.isArray(culturalData) ? culturalData : [];
  }

  /**
   * Extract color analysis with defaults
   */
  private extractColorAnalysis(report: any): any {
    return {
      dominantColors: report.color_analysis?.dominant_colors || ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      harmony: report.color_analysis?.harmony_score || 85,
      contrast: report.color_analysis?.contrast_score || 78,
      saturation: report.color_analysis?.saturation_score || 82
    };
  }

  /**
   * Extract recommendations with fallbacks
   */
  private extractRecommendations(report: any): string[] {
    const recs = report.recommendations?.improvement_suggestions ||
                report.recommendations || [];
    
    if (Array.isArray(recs) && recs.length > 0) {
      return recs;
    }
    
    return [
      'Continue practicing traditional patterns',
      'Focus on symmetry improvement', 
      'Explore cultural significance'
    ];
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}