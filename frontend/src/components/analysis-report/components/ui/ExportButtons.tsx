import React from 'react';
import { Button } from '../../../ui/button';
import { Download, FileText } from 'lucide-react';

interface ExportButtonsProps {
  onExport: (format: string) => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExport }) => (
  <div className="flex flex-wrap gap-2">
    <Button variant="outline" size="sm" onClick={() => onExport('pdf')} className="flex items-center gap-2">
      <FileText className="w-4 h-4" />
      PDF Report
    </Button>
    <Button variant="outline" size="sm" onClick={() => onExport('csv')} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      CSV Data
    </Button>
    <Button variant="outline" size="sm" onClick={() => onExport('json')} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      JSON Export
    </Button>
  </div>
);