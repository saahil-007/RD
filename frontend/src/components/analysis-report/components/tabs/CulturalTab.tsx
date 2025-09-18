import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Globe } from 'lucide-react';
import { CulturalElement } from '../../types';

interface CulturalTabProps {
  culturalElements: CulturalElement[];
}

export const CulturalTab: React.FC<CulturalTabProps> = ({ culturalElements }) => {
  // Ensure we have cultural elements to display
  const safeCulturalElements = culturalElements || [];
  
  if (safeCulturalElements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No cultural element data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {safeCulturalElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {element.element}
                  </span>
                  <Badge variant="secondary">{element.confidence}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Cultural Significance
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{element.significance}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Origin
                    </h4>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{element.origin}</span>
                    </div>
                  </div>
                  <Progress value={element.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};