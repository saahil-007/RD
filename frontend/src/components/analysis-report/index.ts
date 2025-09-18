// Enhanced modular AnalysisReport exports with improved structure

// Main components - Use EnhancedAnalysisReport as default
export { default as EnhancedAnalysisReport } from './EnhancedAnalysisReport';
export { default as AnalysisReport } from './EnhancedAnalysisReport'; // Alias for backward compatibility

// UI Components
export { MetricCard } from './components/ui/MetricCard';
export { ProgressRing } from './components/ui/ProgressRing';
export { ExportButtons } from './components/ui/ExportButtons';
export { ImagePreview } from './components/ui/ImagePreview';
export { AnalysisReportErrorBoundary } from './components/ui/ErrorBoundary';

// Tab Components
export { OverviewTab } from './components/tabs/OverviewTab';
export { MetricsTab } from './components/tabs/MetricsTab';
export { PatternsTab } from './components/tabs/PatternsTab';
export { CulturalTab } from './components/tabs/CulturalTab';
export { DetailsTab } from './components/tabs/DetailsTab';

// Enhanced Hooks
export { useAnalysisData } from './hooks/useAnalysisData';
export { useTabNavigation, useAnimationSequence, useResponsive, useImageLoader, useScrollAnimation } from './hooks/useUIState';

// Services
export { ExportService } from './services/ExportService';

// Constants and Configuration
export * from './constants/config';

// Utilities
export { AnalysisDataValidator, PerformanceUtils, DataTransformUtils } from './utils/dataValidation';
export * from './utils/chartUtils';
export * from './utils/exportUtils';
export * from './utils/mockData';

// Types
export * from './types';

// Re-export legacy utilities for backward compatibility
export * from './utils/chartUtils';
export * from './utils/exportUtils';
export { generateMockData } from './utils/mockData';