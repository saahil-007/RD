import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AnalysisReportErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AnalysisReport Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Analysis Report Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Something went wrong while displaying the analysis report. This might be due to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Missing or invalid analysis data</li>
                  <li>Component rendering issues</li>
                  <li>Chart initialization problems</li>
                </ul>
                {this.state.error && (
                  <details className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs">
                    <summary className="cursor-pointer font-medium">Technical Details</summary>
                    <pre className="mt-2 text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.handleRetry} className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}