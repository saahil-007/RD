import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import CountUp from 'react-countup';
import { MetricCardData } from '../../types';

interface MetricCardProps {
  metric: MetricCardData;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ metric, delay = 0 }) => {
  const percentage = ((metric.value / (metric.maxValue || 100)) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="h-full"
    >
      <Card className={`relative overflow-hidden ${metric.bgColor} hover:shadow-xl transition-all duration-300 group border-2 h-full`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${metric.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
              {metric.icon}
            </div>
            {metric.trend && (
              <Badge variant={metric.trend > 0 ? "default" : "secondary"} className="text-xs">
                {metric.trend > 0 ? '+' : ''}{metric.trend}%
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                {metric.label}
              </h3>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={metric.value} duration={1.5} delay={delay} />
                {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
              </span>
            </div>
            
            <Progress value={percentage} className="h-2" />
            
            {metric.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {metric.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';