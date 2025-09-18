import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, MapPin } from 'lucide-react';
import { PatternData } from '../../types';

interface PatternsTabProps {
  patterns: PatternData[];
}

export const PatternsTab: React.FC<PatternsTabProps> = ({ patterns }) => {
  // Ensure we have patterns to display
  const safePatterns = patterns || [];
  
  if (safePatterns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No pattern data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {safePatterns.map((pattern, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {pattern.name}
                  </span>
                  <Badge variant="outline">{pattern.confidence}% confidence</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Region: {pattern.region}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{pattern.description}</p>
                  <Progress value={pattern.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};