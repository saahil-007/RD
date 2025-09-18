/**
 * Application-wide constants and configuration.
 * Centralized configuration following the enhanced modular structure.
 */
import { PerformanceCategory, ExportFormat, TabId, MetricId } from '../types';

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5002',
  ENDPOINTS: {
    ANALYZE: '/analyze',
    HEALTH: '/health',
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// ============================================================================
// ANALYSIS CONFIGURATION
// ============================================================================

export const ANALYSIS_CONFIG = {
  // Chart configurations
  CHART_COLORS: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    cultural: '#EC4899',
    aesthetic: '#F59E0B',
  },
  
  // Animation settings
  ANIMATION: {
    duration: {
      fast: 0.3,
      normal: 0.5,
      slow: 0.8,
      counter: 1.5,
    },
    ease: {
      easeOut: [0.4, 0.0, 0.2, 1] as const,
      easeIn: [0.4, 0.0, 1, 1] as const,
      easeInOut: [0.4, 0.0, 0.2, 1] as const,
    },
    stagger: 0.1,
  },
  
  // Export settings
  EXPORT: {
    formats: ['pdf', 'csv', 'json', 'excel', 'word'] as const satisfies readonly ExportFormat[],
    fileNamePrefix: 'rangoli-analysis',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  
  // UI Settings
  UI: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    gridCols: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedFormats: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
  },
  
  // Analysis thresholds
  THRESHOLDS: {
    excellent: 90,
    good: 75,
    average: 60,
    poor: 40,
  },
  
  // Default values for missing data
  DEFAULTS: {
    overallScore: 85,
    imageUrl: '/placeholder-rangoli.jpg',
    metrics: {
      symmetry: 85,
      complexity: 78,
      cultural: 92,
      aesthetic: 88,
      innovation: 72,
      technical: 90,
    },
  },
} as const;

// ============================================================================
// PERFORMANCE CATEGORIES
// ============================================================================

export const PERFORMANCE_CATEGORIES: Record<string, PerformanceCategory> = {
  EXCELLENT: { 
    min: 90, 
    label: 'Excellent', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50' 
  },
  GOOD: { 
    min: 75, 
    label: 'Good', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  AVERAGE: { 
    min: 60, 
    label: 'Average', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50' 
  },
  NEEDS_IMPROVEMENT: { 
    min: 0, 
    label: 'Needs Improvement', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
} as const;

// ============================================================================
// TAB CONFIGURATION
// ============================================================================

export const TAB_CONFIG = [
  { id: 'overview' as TabId, label: 'Overview', icon: 'Eye' },
  { id: 'metrics' as TabId, label: 'Metrics', icon: 'BarChart3' },
  { id: 'patterns' as TabId, label: 'Patterns', icon: 'Target' },
  { id: 'cultural' as TabId, label: 'Cultural', icon: 'BookOpen' },
  { id: 'details' as TabId, label: 'Details', icon: 'Activity' },
] as const;

// ============================================================================
// METRIC CARDS CONFIGURATION
// ============================================================================

export const METRIC_CARDS_CONFIG = [
  {
    id: 'symmetry' as MetricId,
    label: 'Symmetry Score',
    icon: 'Compass',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    description: 'Geometric balance and proportion analysis',
    unit: '%',
  },
  {
    id: 'complexity' as MetricId,
    label: 'Design Complexity',
    icon: 'Layers',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    description: 'Intricate pattern and detail assessment',
    unit: '%',
  },
  {
    id: 'cultural' as MetricId,
    label: 'Cultural Authenticity',
    icon: 'Globe',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    description: 'Traditional heritage and cultural significance',
    unit: '%',
  },
  {
    id: 'aesthetic' as MetricId,
    label: 'Aesthetic Appeal',
    icon: 'Palette',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
    description: 'Visual harmony and color composition',
    unit: '%',
  },
  {
    id: 'innovation' as MetricId,
    label: 'Innovation Factor',
    icon: 'Sparkles',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    description: 'Creative originality and modern adaptation',
    unit: '%',
  },
  {
    id: 'technical' as MetricId,
    label: 'Technical Excellence',
    icon: 'Zap',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
    description: 'Execution precision and craftsmanship quality',
    unit: '%',
  },
] as const;

// ============================================================================
// CULTURAL REGIONS DATA
// ============================================================================

export const CULTURAL_REGIONS = {
  'tamil_nadu': {
    name: 'Tamil Nadu',
    patterns: ['kolam', 'mandala', 'lotus'],
    colors: ['white', 'red', 'yellow'],
    significance: 'Prosperity and spiritual protection',
  },
  'maharashtra': {
    name: 'Maharashtra',
    patterns: ['rangoli', 'paisley', 'geometric'],
    colors: ['saffron', 'green', 'red'],
    significance: 'Festival celebrations and good fortune',
  },
  'rajasthan': {
    name: 'Rajasthan',
    patterns: ['mandana', 'tribal', 'geometric'],
    colors: ['red', 'white', 'yellow'],
    significance: 'Traditional desert culture and hospitality',
  },
  'west_bengal': {
    name: 'West Bengal',
    patterns: ['alpana', 'paisley', 'floral'],
    colors: ['white', 'red', 'yellow'],
    significance: 'Prosperity and divine blessings',
  },
  'kerala': {
    name: 'Kerala',
    patterns: ['kolam', 'floral', 'geometric'],
    colors: ['white', 'yellow', 'red'],
    significance: 'Welcome and hospitality',
  },
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  UPLOAD: {
    FILE_TOO_LARGE: 'File size must be less than 5MB',
    INVALID_FORMAT: 'Please upload a valid image file (JPG, PNG, BMP, TIFF)',
    UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  },
  ANALYSIS: {
    FAILED: 'Analysis failed. Please try again.',
    TIMEOUT: 'Analysis took too long. Please try with a smaller image.',
    INVALID_IMAGE: 'Invalid image format or corrupted file.',
  },
  EXPORT: {
    FAILED: 'Export failed. Please try again.',
    NO_DATA: 'No analysis data available to export.',
  },
  NETWORK: {
    OFFLINE: 'You appear to be offline. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  UPLOAD: 'Image uploaded successfully',
  ANALYSIS: 'Analysis completed successfully',
  EXPORT: 'Report exported successfully',
} as const;