import { AnalysisData, MetricCardData, ExportSummary } from '../types';
import { ExportFormat } from '../constants/config';

/**
 * Enhanced export service with multiple format support
 */
export class ExportService {
  private static instance: ExportService;

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * Main export method with format routing
   */
  async exportData(
    format: ExportFormat,
    analysisData: AnalysisData,
    metricCards: MetricCardData[]
  ): Promise<{ success: boolean; message: string; url?: string }> {
    try {
      const exportData = this.prepareExportData(analysisData, metricCards);
      
      switch (format) {
        case 'json':
          return await this.exportAsJSON(exportData);
        case 'csv':
          return await this.exportAsCSV(exportData);
        case 'pdf':
          return await this.exportAsPDF(exportData);
        case 'excel':
          return await this.exportAsExcel(exportData);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error(`Export failed for format ${format}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Prepare standardized export data
   */
  private prepareExportData(analysisData: AnalysisData, metricCards: MetricCardData[]): ExportSummary {
    return {
      timestamp: new Date().toISOString(),
      analysisResults: {
        ...analysisData,
        patterns: analysisData.patterns || [],
        culturalElements: analysisData.culturalElements || [],
        colorAnalysis: analysisData.colorAnalysis || { dominantColors: [], harmony: 0, contrast: 0, saturation: 0 },
        recommendations: analysisData.recommendations || []
      },
      summary: {
        overallScore: analysisData.overallScore,
        topMetrics: metricCards
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(metric => ({
            ...metric,
            icon: null // Remove non-serializable icon
          })),
        recommendations: analysisData.recommendations || []
      }
    };
  }

  /**
   * Export as JSON
   */
  private async exportAsJSON(data: ExportSummary): Promise<{ success: boolean; message: string; url?: string }> {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    this.downloadFile(url, `rangoli-analysis-${Date.now()}.json`);
    
    return {
      success: true,
      message: 'JSON export completed successfully',
      url
    };
  }

  /**
   * Export as CSV
   */
  private async exportAsCSV(data: ExportSummary): Promise<{ success: boolean; message: string; url?: string }> {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    this.downloadFile(url, `rangoli-analysis-${Date.now()}.csv`);
    
    return {
      success: true,
      message: 'CSV export completed successfully',
      url
    };
  }

  /**
   * Export as PDF (using browser print)
   */
  private async exportAsPDF(data: ExportSummary): Promise<{ success: boolean; message: string }> {
    // Create a formatted HTML document for printing
    const htmlContent = this.generatePrintableHTML(data);
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for PDF export.');
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
    return {
      success: true,
      message: 'PDF export initiated. Please use your browser\'s print dialog to save as PDF.'
    };
  }

  /**
   * Export as Excel (CSV with Excel-specific formatting)
   */
  private async exportAsExcel(data: ExportSummary): Promise<{ success: boolean; message: string; url?: string }> {
    const csvContent = this.convertToCSV(data, true);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    this.downloadFile(url, `rangoli-analysis-${Date.now()}.xls`);
    
    return {
      success: true,
      message: 'Excel export completed successfully',
      url
    };
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: ExportSummary, forExcel: boolean = false): string {
    const lines: string[] = [];
    
    // Header
    lines.push('Rangoli Analysis Report');
    lines.push(`Generated: ${new Date(data.timestamp).toLocaleString()}`);
    lines.push('');
    
    // Overall Score
    lines.push('Overall Analysis');
    lines.push(`Overall Score,${data.summary.overallScore}%`);
    lines.push('');
    
    // Metrics
    lines.push('Detailed Metrics');
    lines.push('Metric,Value,Unit');
    Object.entries(data.analysisResults.metrics).forEach(([key, value]) => {
      lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)},${value},%`);
    });
    lines.push('');
    
    // Patterns
    if (data.analysisResults.patterns && data.analysisResults.patterns.length > 0) {
      lines.push('Detected Patterns');
      lines.push('Pattern Name,Confidence,Region,Description');
      data.analysisResults.patterns.forEach(pattern => {
        lines.push(`"${pattern.name}",${pattern.confidence}%,"${pattern.region}","${pattern.description}"`);
      });
      lines.push('');
    }
    
    // Cultural Elements
    if (data.analysisResults.culturalElements && data.analysisResults.culturalElements.length > 0) {
      lines.push('Cultural Elements');
      lines.push('Element,Significance,Origin,Confidence');
      data.analysisResults.culturalElements.forEach(element => {
        lines.push(`"${element.element}","${element.significance}","${element.origin}",${element.confidence}%`);
      });
      lines.push('');
    }
    
    // Recommendations
    if (data.summary.recommendations && data.summary.recommendations.length > 0) {
      lines.push('Recommendations');
      data.summary.recommendations.forEach((rec, index) => {
        lines.push(`${index + 1},"${rec}"`);
      });
    }
    
    return lines.join('\n');
  }

  /**
   * Generate printable HTML for PDF export
   */
  private generatePrintableHTML(data: ExportSummary): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rangoli Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .score { font-size: 2em; font-weight: bold; color: #3B82F6; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rangoli Analysis Report</h1>
          <p>Generated on ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h2>Overall Score</h2>
          <div class="score">${data.summary.overallScore}%</div>
        </div>
        
        <div class="section">
          <h2>Detailed Metrics</h2>
          <div class="metric-grid">
            ${Object.entries(data.analysisResults.metrics).map(([key, value]) => `
              <div class="metric-card">
                <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <div class="score">${value}%</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${data.analysisResults.patterns && data.analysisResults.patterns.length > 0 ? `
          <div class="section">
            <h2>Detected Patterns</h2>
            <table>
              <thead>
                <tr><th>Pattern</th><th>Confidence</th><th>Region</th><th>Description</th></tr>
              </thead>
              <tbody>
                ${data.analysisResults.patterns.map(pattern => `
                  <tr>
                    <td>${pattern.name}</td>
                    <td>${pattern.confidence}%</td>
                    <td>${pattern.region}</td>
                    <td>${pattern.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
        
        ${data.summary.recommendations && data.summary.recommendations.length > 0 ? `
          <div class="section">
            <h2>Recommendations</h2>
            <ol>
              ${data.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ol>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }

  /**
   * Helper method to trigger file download
   */
  private downloadFile(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}