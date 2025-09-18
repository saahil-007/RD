import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, Activity } from 'lucide-react';

export const DetailsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Analysis Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Image Processing</span>
                <Badge variant="outline">0.8s</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pattern Recognition</span>
                <Badge variant="outline">2.1s</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cultural Analysis</span>
                <Badge variant="outline">1.3s</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Report Generation</span>
                <Badge variant="outline">0.5s</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Comparison Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Top 15%</div>
                <div className="text-xs text-gray-500">Performance Ranking</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-xs text-gray-500">Better than average</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Model Version:</span>
                <span className="font-mono">v2.1.3</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className="font-bold text-green-600">94.7%</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span>1024x1024</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span>JPEG</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This rangoli demonstrates exceptional mastery of traditional Indian art forms while incorporating
              innovative design elements. The symmetrical composition shows advanced understanding of geometric
              principles, with each quadrant maintaining perfect balance. The color palette reflects deep
              cultural knowledge, utilizing traditional hues that carry spiritual significance.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Technical execution is remarkable, with consistent line weights and precise pattern placement.
              The complexity level indicates intermediate to advanced skill, particularly in the intricate
              mandala-style center piece. Cultural authenticity is high, incorporating elements from South
              Indian rangoli traditions while maintaining artistic originality.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};