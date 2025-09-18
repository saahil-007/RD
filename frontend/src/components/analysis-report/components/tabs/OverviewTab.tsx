import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Compass, Heart } from 'lucide-react';
import { Radar, Doughnut } from 'react-chartjs-2';
import { ChartData } from '../../types';
import { radarChartOptions, doughnutChartOptions } from '../../utils/chartUtils';

interface OverviewTabProps {
  radarData: ChartData;
  symmetryData: ChartData;
  recommendations: string[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  radarData, 
  symmetryData, 
  recommendations 
}) => {
  // Ensure we have recommendations to display
  const safeRecommendations = recommendations || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Radar data={radarData} options={radarChartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Symmetry Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={symmetryData} options={doughnutChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Key Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeRecommendations.length > 0 ? safeRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};