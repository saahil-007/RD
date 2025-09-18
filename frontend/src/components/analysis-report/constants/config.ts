// Analysis Report Configuration Constants
export const ANALYSIS_CONFIG = {
  // Chart configurations
  CHART_COLORS: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
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
      easeOut: [0.4, 0.0, 0.2, 1],
      easeIn: [0.4, 0.0, 1, 1],
      easeInOut: [0.4, 0.0, 0.2, 1],
    },
    stagger: 0.1,
  },
  
  // Export settings
  EXPORT: {
    formats: ['pdf', 'csv', 'json', 'excel'] as const,
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

// Performance categories
export const PERFORMANCE_CATEGORIES = {
  EXCELLENT: { min: 90, label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' },
  GOOD: { min: 75, label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  AVERAGE: { min: 60, label: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  NEEDS_IMPROVEMENT: { min: 0, label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' },
} as const;

// Tab configuration
export const TAB_CONFIG = [
  { id: 'overview', label: 'Overview', icon: 'Eye' },
  { id: 'metrics', label: 'Metrics', icon: 'BarChart3' },
  { id: 'patterns', label: 'Patterns', icon: 'Target' },
  { id: 'cultural', label: 'Cultural', icon: 'BookOpen' },
  { id: 'details', label: 'Details', icon: 'Activity' },
] as const;

// Metric card configuration
export const METRIC_CARDS_CONFIG = [
  {
    id: 'symmetry',
    label: 'Symmetry Score',
    icon: 'Compass',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    description: 'Geometric balance and proportion analysis',
    unit: '%',
  },
  {
    id: 'complexity',
    label: 'Design Complexity',
    icon: 'Layers',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    description: 'Intricate pattern and detail assessment',
    unit: '%',
  },
  {
    id: 'cultural',
    label: 'Cultural Authenticity',
    icon: 'Globe',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    description: 'Traditional heritage and cultural significance',
    unit: '%',
  },
  {
    id: 'aesthetic',
    label: 'Aesthetic Appeal',
    icon: 'Palette',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
    description: 'Visual harmony and color composition',
    unit: '%',
  },
  {
    id: 'innovation',
    label: 'Innovation Factor',
    icon: 'Sparkles',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    description: 'Creative originality and modern adaptation',
    unit: '%',
  },
  {
    id: 'technical',
    label: 'Technical Excellence',
    icon: 'Zap',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
    description: 'Execution precision and craftsmanship quality',
    unit: '%',
  },
] as const;

export type TabId = typeof TAB_CONFIG[number]['id'];
export type MetricId = typeof METRIC_CARDS_CONFIG[number]['id'];
export type ExportFormat = typeof ANALYSIS_CONFIG.EXPORT.formats[number];