import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Layers, TrendingUp } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { ProgressRing } from '../ui/ProgressRing';
import { MetricCardData, ChartData, ColorAnalysis } from '../../types';
import { barChartOptions, lineChartOptions } from '../../utils/chartUtils';

interface MetricsTabProps {
  metricCards: MetricCardData[];
  colorAnalysisData: ChartData;
  complexityTrendData: ChartData;
  colorAnalysis: ColorAnalysis;
}

export const MetricsTab: React.FC<MetricsTabProps> = ({ 
  metricCards, 
  colorAnalysisData, 
  complexityTrendData, 
  colorAnalysis 
}) => {
  const getColorFromClass = (colorClass: string): string => {
    const colorMap: { [key: string]: string } = {
      'text-blue-600': '#3B82F6',
      'text-purple-600': '#8B5CF6',
      'text-green-600': '#10B981',
      'text-pink-600': '#EC4899',
      'text-yellow-600': '#F59E0B',
      'text-indigo-600': '#6366F1'
    };
    return colorMap[colorClass] || '#3B82F6';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={metric.id} className="text-center">
            <CardContent className="p-6">
              <ProgressRing 
                value={metric.value} 
                color={getColorFromClass(metric.color)} 
                label={metric.label}
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.description}
                </p>
                {metric.trend && (
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className={`w-4 h-4 ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.trend > 0 ? '+' : ''}{metric.trend}% vs avg
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <Bar data={colorAnalysisData} options={barChartOptions} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-medium">Harmony</div>
                <div className="text-2xl font-bold text-green-600">
                  {colorAnalysis.harmony}%
                </div>
              </div>
              <div>
                <div className="font-medium">Contrast</div>
                <div className="text-2xl font-bold text-blue-600">
                  {colorAnalysis.contrast}%
                </div>
              </div>
              <div>
                <div className="font-medium">Saturation</div>
                <div className="text-2xl font-bold text-purple-600">
                  {colorAnalysis.saturation}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Complexity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={complexityTrendData} options={lineChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};