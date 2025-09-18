/**
 * Validation utilities for the Rangoli Analysis application.
 */
import { ANALYSIS_CONFIG, ERROR_MESSAGES } from '../constants';
import type { UploadedFile, ValidationError } from '../types';

/**
 * Validate uploaded image file
 */
export function validateImageFile(file: File): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check file size
  if (file.size > ANALYSIS_CONFIG.UI.maxImageSize) {
    errors.push({
      field: 'file',
      message: ERROR_MESSAGES.UPLOAD.FILE_TOO_LARGE,
      code: 'FILE_TOO_LARGE'
    });
  }

  // Check file format
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ANALYSIS_CONFIG.UI.supportedFormats.includes(fileExtension as any)) {
    errors.push({
      field: 'file',
      message: ERROR_MESSAGES.UPLOAD.INVALID_FORMAT,
      code: 'INVALID_FORMAT'
    });
  }

  return errors;
}

/**
 * Validate analysis data completeness
 */
export function validateAnalysisData(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const analysisData = data as Record<string, unknown>;
  
  // Check for required fields
  const requiredFields = ['overallScore', 'metrics'];
  return requiredFields.every(field => field in analysisData);
}

/**
 * Validate metric values are within expected ranges
 */
export function validateMetricValues(metrics: Record<string, number>): boolean {
  return Object.values(metrics).every(value => 
    typeof value === 'number' && value >= 0 && value <= 100
  );
}

/**
 * Check if a value is a valid percentage string
 */
export function isValidPercentage(value: string): boolean {
  const num = parseFloat(value.replace('%', ''));
  return !isNaN(num) && num >= 0 && num <= 100;
}

/**
 * Validate export format
 */
export function isValidExportFormat(format: string): boolean {
  return ANALYSIS_CONFIG.EXPORT.formats.includes(format as any);
}