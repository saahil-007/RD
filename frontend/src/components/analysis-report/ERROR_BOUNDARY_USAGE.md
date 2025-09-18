# Error Boundary Usage

## Basic Usage

Wrap the AnalysisReport component with the error boundary:

```tsx
import { AnalysisReport, AnalysisReportErrorBoundary } from './components/analysis-report';

const App = () => {
  const analysisData = {
    imageUrl: '/path/to/image.jpg',
    overallScore: 85,
    metrics: {
      symmetry: 92,
      complexity: 78,
      cultural: 88,
      aesthetic: 85,
      innovation: 72,
      technical: 90
    }
    // Note: patterns, culturalElements, etc. are now optional
  };

  return (
    <AnalysisReportErrorBoundary>
      <AnalysisReport 
        analysisData={analysisData} 
        onClose={() => console.log('Closed')} 
      />
    </AnalysisReportErrorBoundary>
  );
};
```

## Custom Error Fallback

You can provide a custom error fallback:

```tsx
const CustomErrorFallback = () => (
  <div className="text-center p-8">
    <h2>Oops! Something went wrong</h2>
    <p>Please try refreshing the page</p>
  </div>
);

<AnalysisReportErrorBoundary fallback={<CustomErrorFallback />}>
  <AnalysisReport analysisData={analysisData} />
</AnalysisReportErrorBoundary>
```

## Error Handling Features

- Graceful error display with user-friendly messages
- Retry functionality to attempt recovery
- Technical error details for debugging
- Page reload option as fallback
- Comprehensive error logging to console

This ensures the application remains stable even when analysis data is incomplete or malformed.