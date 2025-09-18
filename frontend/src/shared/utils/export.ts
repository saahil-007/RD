/**
 * Export utility functions.
 */
import type { AnalysisData, ExportFormat } from '../types';
import { formatTimestamp } from './formatting';

/**
 * Generate CSV content from analysis data
 */
export function generateCSVContent(data: AnalysisData): string {
  const lines: string[] = [];
  
  // Header
  lines.push('Rangoli Analysis Report');
  lines.push(`Generated: ${formatTimestamp(new Date())}`);
  lines.push('');
  
  // Overall Score
  lines.push('Overall Analysis');
  lines.push(`Overall Score,${data.overallScore ?? 0}%`);
  lines.push('');
  
  // Metrics
  lines.push('Detailed Metrics');
  lines.push('Metric,Value,Unit');
  Object.entries(data.metrics ?? {}).forEach(([key, value]) => {
    lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)},${value},%`);
  });
  lines.push('');
  
  // Patterns
  if (data.patterns && data.patterns.length > 0) {
    lines.push('Detected Patterns');
    lines.push('Pattern Name,Confidence,Region,Description');
    data.patterns.forEach(pattern => {
      lines.push(`"${pattern.name}",${pattern.confidence}%,"${pattern.region}","${pattern.description}"`);
    });
    lines.push('');
  }
  
  // Cultural Elements
  if (data.culturalElements && data.culturalElements.length > 0) {
    lines.push('Cultural Elements');
    lines.push('Element,Significance,Origin,Confidence');
    data.culturalElements.forEach(element => {
      lines.push(`"${element.element}","${element.significance}","${element.origin}",${element.confidence}%`);
    });
    lines.push('');
  }
  
  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    lines.push('Recommendations');
    data.recommendations.forEach((rec, index) => {
      lines.push(`${index + 1},"${rec}"`);
    });
  }
  
  return lines.join('\\n');
}

/**
 * Generate HTML content for PDF export
 */
export function generatePDFContent(data: AnalysisData): string {
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
        <p>Generated on ${formatTimestamp(new Date())}</p>
      </div>
      
      <div class="section">
        <h2>Overall Score</h2>
        <div class="score">${data.overallScore ?? 0}%</div>
      </div>
      
      <div class="section">
        <h2>Detailed Metrics</h2>
        <div class="metric-grid">
          ${Object.entries(data.metrics ?? {}).map(([key, value]) => `
            <div class="metric-card">
              <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
              <div class="score">${value}%</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${data.patterns && data.patterns.length > 0 ? `
        <div class="section">
          <h2>Detected Patterns</h2>
          <table>
            <thead>
              <tr><th>Pattern</th><th>Confidence</th><th>Region</th><th>Description</th></tr>
            </thead>
            <tbody>
              ${data.patterns.map(pattern => `
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
      
      ${data.recommendations && data.recommendations.length > 0 ? `
        <div class="section">
          <h2>Recommendations</h2>
          <ol>
            ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ol>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

/**
 * Create and download file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    json: 'application/json',
    csv: 'text/csv',
    excel: 'application/vnd.ms-excel',
    word: 'application/msword',
    pdf: 'text/html',
  };
  
  return mimeTypes[format] || 'text/plain';
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    json: '.json',
    csv: '.csv',
    excel: '.xls',
    word: '.doc',
    pdf: '.html',
  };
  
  return extensions[format] || '.txt';
}