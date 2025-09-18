import React, { useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Award, TrendingUp, Eye, BarChart3, Target, BookOpen, Activity, X,
  Compass, Layers, Globe, Palette, Sparkles, Zap
} from 'lucide-react';
import CountUp from 'react-countup';

// Import all modular components
import { MetricCard } from './analysis-report/components/ui/MetricCard';
import { ImagePreview } from './analysis-report/components/ui/ImagePreview';
import { ExportButtons } from './analysis-report/components/ui/ExportButtons';
import { OverviewTab } from './analysis-report/components/tabs/OverviewTab';
import { MetricsTab } from './analysis-report/components/tabs/MetricsTab';
import { PatternsTab } from './analysis-report/components/tabs/PatternsTab';
import { CulturalTab } from './analysis-report/components/tabs/CulturalTab';
import { DetailsTab } from './analysis-report/components/tabs/DetailsTab';

// Import utilities
import { 
  generateRadarChartData, 
  generateSymmetryBreakdownData,
  generateColorAnalysisData,
  generateComplexityTrendData
} from './analysis-report/utils/chartUtils';
import { generateMockData } from './analysis-report/utils/mockData';
import { handleExport } from './analysis-report/utils/exportUtils';
import { AnalysisReportProps, MetricCardData } from './analysis-report/types';

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

const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysisData, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Enhance analysis data with mock data if needed
  const enhancedData = useMemo(() => generateMockData(analysisData), [analysisData]);
  
  // Memoized metric cards data with proper icon components
  const metricCards = useMemo((): MetricCardData[] => [
    {
      id: 'symmetry',
      label: 'Symmetry Score',
      value: enhancedData.metrics.symmetry,
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      description: 'Geometric balance and proportion analysis',
      trend: 5,
      unit: '%'
    },
    {
      id: 'complexity',
      label: 'Design Complexity',
      value: enhancedData.metrics.complexity,
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      description: 'Intricate pattern and detail assessment',
      trend: 8,
      unit: '%'
    },
    {
      id: 'cultural',
      label: 'Cultural Authenticity',
      value: enhancedData.metrics.cultural,
      icon: <Globe className="w-6 h-6 text-green-600" />,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      description: 'Traditional heritage and cultural significance',
      trend: 12,
      unit: '%'
    },
    {
      id: 'aesthetic',
      label: 'Aesthetic Appeal',
      value: enhancedData.metrics.aesthetic,
      icon: <Palette className="w-6 h-6 text-pink-600" />,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      description: 'Visual harmony and color composition',
      trend: 3,
      unit: '%'
    },
    {
      id: 'innovation',
      label: 'Innovation Factor',
      value: enhancedData.metrics.innovation,
      icon: <Sparkles className="w-6 h-6 text-yellow-600" />,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      description: 'Creative originality and modern adaptation',
      trend: -2,
      unit: '%'
    },
    {
      id: 'technical',
      label: 'Technical Excellence',
      value: enhancedData.metrics.technical,
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      color: 'text-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      description: 'Execution precision and craftsmanship quality',
      trend: 7,
      unit: '%'
    }
  ], [enhancedData.metrics]);

  // Memoized chart data
  const chartData = useMemo(() => ({
    radar: generateRadarChartData(enhancedData.metrics),
    symmetry: generateSymmetryBreakdownData(),
    colorAnalysis: generateColorAnalysisData(),
    complexityTrend: generateComplexityTrendData()
  }), [enhancedData.metrics]);

  // Export functionality
  const onExport = useCallback((format: string) => {
    handleExport(format, enhancedData, metricCards);
  }, [enhancedData, metricCards]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
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
            <ExportButtons onExport={onExport} />
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Close
              </Button>
            )}
          </div>
        </motion.div>

        {/* Hero Section with Image and Score */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
                  <CountUp end={enhancedData.overallScore} duration={2.5} />%
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
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Best Aspect</span>
                  <Badge variant="default">Cultural Authenticity</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Improvement Area</span>
                  <Badge variant="secondary">Innovation Factor</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Skill Level</span>
                  <Badge variant="outline">Advanced</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {metricCards.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} delay={0.1 * index} />
          ))}
        </motion.div>

        {/* Detailed Analysis Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
              <TabsTrigger value="cultural" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Cultural</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab 
                radarData={chartData.radar}
                symmetryData={chartData.symmetry}
                recommendations={enhancedData.recommendations || []}
              />
            </TabsContent>

            <TabsContent value="metrics">
              <MetricsTab 
                metricCards={metricCards}
                colorAnalysisData={chartData.colorAnalysis}
                complexityTrendData={chartData.complexityTrend}
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
  );
};

export default AnalysisReport;
