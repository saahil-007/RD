import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, Image, Printer, Share2, FileSpreadsheet, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import AnalysisReport from '@/components/AnalysisReport';

interface AnalysisData {
  fileName: string;
  analysis: Record<string, unknown>;
  imageUrl: string;
}

const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalysisComplete = (file: any, analysis: any) => {
    setAnalysisData({
      fileName: file.name,
      analysis: analysis,
      imageUrl: file.publicUrl || file.preview
    });
  };

  const exportToPDF = async () => {
    if (!analysisData) return;
    
    setIsExporting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const reportElement = document.getElementById('analysis-report');
        if (reportElement) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Rangoli Analysis Report - ${analysisData.fileName}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .report-header { text-align: center; margin-bottom: 30px; }
                  .report-content { max-width: 800px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="report-header">
                  <h1>🎨 Rangoli Analysis Report</h1>
                  <h2>${analysisData.fileName}</h2>
                  <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="report-content">
                  ${reportElement.innerHTML}
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!analysisData) return;
    
    const dataStr = JSON.stringify({
      fileName: analysisData.fileName,
      timestamp: new Date().toISOString(),
      analysis: analysisData.analysis
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysisData.fileName}_analysis.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!analysisData) return;
    
    const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      const flattened: Record<string, unknown> = {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = prefix ? `${prefix}_${key}` : key;
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(flattened, flattenObject(obj[key] as Record<string, unknown>, newKey));
          } else {
            flattened[newKey] = obj[key];
          }
        }
      }
      
      return flattened;
    };
    
    const flatData = flattenObject(analysisData.analysis);
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'Field,Value\\n'
      + Object.entries(flatData).map(([key, value]) => `"${key}","${value}"`).join('\\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${analysisData.fileName}_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!analysisData) return;
    
    const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      const flattened: Record<string, unknown> = {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = prefix ? `${prefix}_${key}` : key;
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(flattened, flattenObject(obj[key] as Record<string, unknown>, newKey));
          } else if (Array.isArray(obj[key])) {
            (obj[key] as unknown[]).forEach((item: unknown, index: number) => {
              if (typeof item === 'object') {
                Object.assign(flattened, flattenObject(item as Record<string, unknown>, `${newKey}_${index}`));
              } else {
                flattened[`${newKey}_${index}`] = item;
              }
            });
          } else {
            flattened[newKey] = obj[key];
          }
        }
      }
      
      return flattened;
    };
    
    const flatData = flattenObject(analysisData.analysis);
    
    const csvContent = 'data:text/csv;charset=utf-8,'
      + 'Field,Value,Type,Category\\n'
      + Object.entries(flatData).map(([key, value]) => {
          const category = key.split('_')[0];
          const type = typeof value;
          return `"${key}","${value}","${type}","${category}"`;
        }).join('\\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${analysisData.fileName}_detailed_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    if (!analysisData) return;
    
    const wordContent = `
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Rangoli Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #e97540; border-bottom: 2px solid #e97540; }
          h2 { color: #d97540; margin-top: 30px; }
          .metric { background-color: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 4px solid #e97540; }
          .summary { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>🎨 Rangoli Analysis Report</h1>
        <div class='summary'>
          <strong>File:</strong> ${analysisData.fileName}<br>
          <strong>Generated:</strong> ${new Date().toLocaleDateString()}<br>
          <strong>Analysis Type:</strong> AI-Powered Cultural Pattern Recognition
        </div>
        
        <h2>Analysis Summary</h2>
        <div class='metric'>
          <strong>Dots Detected:</strong> ${(analysisData.analysis as any)?.dot_grid_analysis?.length || 0}
        </div>
        <div class='metric'>
          <strong>Symmetry Score:</strong> ${(analysisData.analysis as any)?.symmetry_analysis?.overall_symmetry || 'N/A'}
        </div>
        
        <h2>Detailed Findings</h2>
        <pre>${JSON.stringify(analysisData.analysis, null, 2)}</pre>
      </body>
      </html>
    `;
    
    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysisData.fileName}_analysis_report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (!analysisData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rangoli Analysis: ${analysisData.fileName}`,
          text: 'Check out this AI-powered rangoli analysis report!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div className="h-6 w-px bg-orange-200" />
              <h1 className="text-2xl font-playfair font-bold text-orange-800">
                🎨 Rangoli Analysis Studio
              </h1>
            </div>
            
            {analysisData && (
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Analysis Complete
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!analysisData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-playfair text-orange-800 mb-4">
                  AI-Powered Rangoli Analysis
                </CardTitle>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload your rangoli image to get comprehensive analysis including symmetry detection,
                  cultural pattern recognition, stroke analysis, and detailed insights into traditional
                  Indian art forms.
                </p>
              </CardHeader>
              <CardContent>
                <ImageUpload onAnalysis={handleAnalysisComplete} />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Detailed Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive analysis with cultural insights and technical metrics
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Export your analysis in PDF, JSON, CSV, Excel, or Word formats
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visual Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive charts, graphs, and visual representations of your data
                </p>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    <span>Export Analysis Report</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={shareReport}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isExporting ? 'Preparing...' : 'PDF Report'}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={exportToJSON}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>JSON Data</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={exportToCSV}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>CSV Data</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={exportToExcel}
                    className="flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={exportToWord}
                    className="flex items-center space-x-2"
                  >
                    <FileX className="w-4 h-4" />
                    <span>Word Doc</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div ref={reportRef} id="analysis-report">
              <AnalysisReport 
                analysis={analysisData.analysis}
                fileName={analysisData.fileName}
                imageUrl={analysisData.imageUrl}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;