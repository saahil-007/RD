import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Download, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
  type: string;
  analysisStatus: 'pending' | 'analyzing' | 'complete' | 'error';
  analysis?: any;
  progress: number;
  progressDescription: string;
  estimatedTime: number;
}

interface ImageUploadProps {
  onAnalysis?: (file: UploadedFile, analysis: any) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onAnalysis,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const analyzeFile = (fileId: string) => {
    const fileToAnalyze = files.find(f => f.id === fileId);
    if (!fileToAnalyze || fileToAnalyze.analysisStatus === 'analyzing') return;

    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, analysisStatus: 'analyzing' as const, progress: 0, progressDescription: 'Starting...', estimatedTime: 0 }
        : f
    ));

    const formData = new FormData();
    formData.append('file', fileToAnalyze.file);

    fetch('http://localhost:8000/new_analyze', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Analysis failed');
        }
        
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        const processStream = () => {
            reader.read().then(({ done, value }) => {
                if (done) {
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');

                lines.forEach(line => {
                    if (line.startsWith('data:')) {
                        try {
                            const data = JSON.parse(line.substring(5));
                            if (data.report) {
                                setFiles(prev => prev.map(f => 
                                    f.id === fileId 
                                    ? { ...f, analysisStatus: 'complete' as const, analysis: data.report, progress: 100 }
                                    : f
                                ));
                                if (onAnalysis) {
                                    onAnalysis({ ...fileToAnalyze, analysis: data.report, analysisStatus: 'complete' }, data.report);
                                }
                            } else {
                                setFiles(prev => prev.map(f => 
                                    f.id === fileId 
                                    ? { 
                                        ...f, 
                                        progress: data.progress, 
                                        progressDescription: data.description,
                                        estimatedTime: data.estimated_remaining_time
                                      }
                                    : f
                                ));
                            }
                        } catch (e) {
                            console.error("Failed to parse stream data", e);
                        }
                    }
                });
                processStream();
            });
        };
        processStream();
    })
    .catch(error => {
        console.error('Error analyzing file:', error);
        setFiles(prev => prev.map(f => 
            f.id === fileId 
            ? { ...f, analysisStatus: 'error' as const }
            : f
        ));
    });
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => 
      acceptedTypes.includes(file.type) && files.length < maxFiles
    );

    validFiles.forEach(file => {
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
        return; // Skip duplicates
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          analysisStatus: 'pending',
          progress: 0,
          progressDescription: '',
          estimatedTime: 0
        };

        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const downloadAnalysis = (file: UploadedFile) => {
    if (!file.analysis) return;
    
    const analysisData = {
      fileName: file.name,
      timestamp: new Date().toISOString(),
      analysis: file.analysis
    };
    
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderAnalysis = (analysis: any) => {
    return (
      <div className="space-y-4 text-xs">
        {Object.entries(analysis).map(([tier, data]) => (
          <div key={tier}>
            <h6 className="font-semibold text-sm mb-2 capitalize">{tier.replace('_', ' ')}</h6>
            <Card className="p-2 bg-muted/50">
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed transition-all duration-300 hover:border-primary/50">
        <CardContent className="p-8">
          <div
            className={cn(
              "flex flex-col items-center justify-center space-y-4 text-center transition-all duration-300",
              dragActive && "bg-primary/5 border-primary rounded-lg p-4"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
          >
            <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                Upload Rangoli Images
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your rangoli images here, or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="outline">JPEG</Badge>
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">WEBP</Badge>
                <Badge variant="outline">Max {maxFiles} files</Badge>
              </div>
            </div>

            <Button 
              variant="hero" 
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= maxFiles}
            >
              Choose Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-playfair font-semibold text-foreground">
            Uploaded Images ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden group hover:shadow-heritage transition-all duration-300">
                <div className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  {/* Analysis Status */}
                  <div className="absolute bottom-2 left-2 right-2 space-y-2">
                    {file.analysisStatus === 'pending' && (
                      <Badge className="bg-muted text-muted-foreground">
                        Pending Analysis
                      </Badge>
                    )}
                    {file.analysisStatus === 'analyzing' && (
                      <div className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold animate-pulse">
                            <Sparkles className="w-3 h-3 mr-1 inline-block" />
                            Analyzing...
                          </span>
                          <span>{Math.round(file.progress)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-sunset h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1 text-white/80 truncate">{file.progressDescription}</p>
                        <p className="text-xs text-white/60">Est. time: {Math.round(file.estimatedTime)}s</p>
                      </div>
                    )}
                    {file.analysisStatus === 'complete' && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Analysis Complete
                      </Badge>
                    )}
                    {file.analysisStatus === 'error' && (
                        <Badge variant="destructive">
                            Analysis Failed
                        </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground truncate">{file.name}</h5>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                    </div>
                    {file.analysisStatus === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeFile(file.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                    )}
                  </div>

                  {/* Analysis Results */}
                  {file.analysis && (
                    <div className="space-y-3 pt-3 border-t border-border/30">
                      {renderAnalysis(file.analysis)}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => downloadAnalysis(file)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Analysis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;