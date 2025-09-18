import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import {
  Award, TrendingUp, X
} from 'lucide-react';
import CountUp from 'react-countup';

// Import enhanced components and utilities
import { MetricCard } from './components/ui/MetricCard';
import { ImagePreview } from './components/ui/ImagePreview';
import { ExportButtons } from './components/ui/ExportButtons';
import { AnalysisReportErrorBoundary } from './components/ui/ErrorBoundary';
import { OverviewTab } from './components/tabs/OverviewTab';
import { MetricsTab } from './components/tabs/MetricsTab';
import { PatternsTab } from './components/tabs/PatternsTab';
import { CulturalTab } from './components/tabs/CulturalTab';
import { DetailsTab } from './components/tabs/DetailsTab';

// Import enhanced hooks and services
import { useAnalysisData } from './hooks/useAnalysisData';
import { useTabNavigation, useAnimationSequence } from './hooks/useUIState';
import { ExportService } from './services/ExportService';
import { AnalysisReportProps } from './types';
import { TAB_CONFIG, ANALYSIS_CONFIG } from './constants/config';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Filler
);

const EnhancedAnalysisReport: React.FC<AnalysisReportProps> = ({ analysisData, onClose }) => {
  // Enhanced data processing
  const { data: enhancedData, chartData, metricCards, insights } = useAnalysisData(analysisData);
  
  // UI state management
  const { activeTab, navigateToTab, hasVisitedTab } = useTabNavigation();
  const { startAnimation, isAnimating } = useAnimationSequence();
  
  // Enhanced export functionality
  const handleExport = async (format: string) => {
    const exportService = ExportService.getInstance();
    const result = await exportService.exportData(
      format as 'json' | 'csv' | 'pdf' | 'excel', 
      enhancedData, 
      metricCards
    );
    
    if (!result.success) {
      console.error('Export failed:', result.message);
      // Could show toast notification here
    } else {
      console.log('Export successful:', result.message);
    }
  };

  // Start animations on mount
  React.useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return (
    <AnalysisReportErrorBoundary>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANALYSIS_CONFIG.ANIMATION.duration.normal }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: ANALYSIS_CONFIG.ANIMATION.duration.normal,
              ease: ANALYSIS_CONFIG.ANIMATION.ease.easeOut
            }}
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Rangoli Analysis Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                Comprehensive AI-powered analysis with cultural insights
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <ExportButtons onExport={handleExport} />
              {onClose && (
                <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Close
                </Button>
              )}
            </div>
          </motion.div>

          {/* Enhanced Hero Section */}
          <motion.div 
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: ANALYSIS_CONFIG.ANIMATION.duration.normal, 
              delay: ANALYSIS_CONFIG.ANIMATION.stagger 
            }}
          >
            <div className="xl:col-span-2">
              <ImagePreview imageUrl={enhancedData.imageUrl} score={enhancedData.overallScore} />
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <CardContent className="p-8 text-center">
                  <Award className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-2xl font-bold mb-2">Overall Excellence</h3>
                  <div className="text-5xl font-bold mb-2">
                    <CountUp 
                      end={enhancedData.overallScore} 
                      duration={ANALYSIS_CONFIG.ANIMATION.duration.counter} 
                    />%
                  </div>
                  <p className="text-indigo-100">
                    Your rangoli demonstrates exceptional artistry and cultural authenticity
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best Aspect</span>
                    <Badge variant="default">{insights.bestAspect}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Improvement Area</span>
                    <Badge variant="secondary">{insights.improvementArea}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skill Level</span>
                    <Badge variant="outline">{insights.skillLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                    <Badge variant="outline">{insights.averageScore}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Enhanced Metrics Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: ANALYSIS_CONFIG.ANIMATION.duration.normal, 
              delay: ANALYSIS_CONFIG.ANIMATION.stagger * 2 
            }}
          >
            {metricCards.map((metric, index) => (
              <MetricCard 
                key={metric.id} 
                metric={metric} 
                delay={ANALYSIS_CONFIG.ANIMATION.stagger * index} 
              />
            ))}
          </motion.div>

          {/* Enhanced Tabbed Analysis */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: ANALYSIS_CONFIG.ANIMATION.duration.normal, 
              delay: ANALYSIS_CONFIG.ANIMATION.stagger * 3 
            }}
          >
            <Tabs value={activeTab} onValueChange={navigateToTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className={`flex items-center gap-2 ${hasVisitedTab(tab.id) ? 'visited' : ''}`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab 
                  radarData={chartData.radar}
                  symmetryData={chartData.doughnut}
                  recommendations={enhancedData.recommendations || []}
                />
              </TabsContent>

              <TabsContent value="metrics">
                <MetricsTab 
                  metricCards={metricCards}
                  colorAnalysisData={chartData.bar}
                  complexityTrendData={chartData.line}
                  colorAnalysis={enhancedData.colorAnalysis || { dominantColors: [], harmony: 0, contrast: 0, saturation: 0 }}
                />
              </TabsContent>

              <TabsContent value="patterns">
                <PatternsTab patterns={enhancedData.patterns || []} />
              </TabsContent>

              <TabsContent value="cultural">
                <CulturalTab culturalElements={enhancedData.culturalElements || []} />
              </TabsContent>

              <TabsContent value="details">
                <DetailsTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </AnalysisReportErrorBoundary>
  );
};

export default EnhancedAnalysisReport;