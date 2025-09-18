import { AnalysisData } from './types';

// Mock data generator for demo purposes - ensures robustness
export const generateMockData = (baseAnalysis: AnalysisData): AnalysisData => {
  // Ensure we have all required data with safe defaults
  const safeBaseAnalysis = {
    imageUrl: baseAnalysis?.imageUrl || '/placeholder-rangoli.jpg',
    overallScore: baseAnalysis?.overallScore || 85,
    metrics: baseAnalysis?.metrics || {
      symmetry: 85,
      complexity: 78,
      cultural: 92,
      aesthetic: 88,
      innovation: 72,
      technical: 90
    },
    patterns: baseAnalysis?.patterns || [],
    culturalElements: baseAnalysis?.culturalElements || [],
    colorAnalysis: baseAnalysis?.colorAnalysis || null,
    recommendations: baseAnalysis?.recommendations || [],
    exportData: baseAnalysis?.exportData
  };

  return {
    ...safeBaseAnalysis,
    patterns: safeBaseAnalysis.patterns?.length > 0 ? safeBaseAnalysis.patterns : [
      { 
        name: "Lotus Pattern", 
        confidence: 92, 
        region: "Center", 
        description: "Traditional lotus motif representing purity and enlightenment" 
      },
      { 
        name: "Geometric Mandala", 
        confidence: 88, 
        region: "Outer Ring", 
        description: "Complex geometric patterns with spiritual significance" 
      },
      { 
        name: "Paisley Elements", 
        confidence: 75, 
        region: "Border", 
        description: "Decorative paisley motifs adding elegance" 
      },
      { 
        name: "Floral Borders", 
        confidence: 85, 
        region: "Periphery", 
        description: "Intricate floral designs framing the composition" 
      }
    ],
    culturalElements: safeBaseAnalysis.culturalElements?.length > 0 ? safeBaseAnalysis.culturalElements : [
      { 
        element: "Diya Motifs", 
        significance: "Represents light overcoming darkness", 
        origin: "North India", 
        confidence: 90 
      },
      { 
        element: "Kolam Patterns", 
        significance: "Traditional Tamil geometric art", 
        origin: "South India", 
        confidence: 85 
      },
      { 
        element: "Alpana Designs", 
        significance: "Bengali decorative floor art", 
        origin: "West Bengal", 
        confidence: 78 
      },
      { 
        element: "Muggulu Elements", 
        significance: "Telugu traditional patterns", 
        origin: "Andhra Pradesh", 
        confidence: 82 
      }
    ],
    colorAnalysis: safeBaseAnalysis.colorAnalysis || {
      dominantColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
      harmony: 87,
      contrast: 92,
      saturation: 78
    },
    recommendations: safeBaseAnalysis.recommendations?.length > 0 ? safeBaseAnalysis.recommendations : [
      "Consider adding more intricate details in the central motif to enhance visual impact",
      "Experiment with complementary colors to increase contrast and vibrancy",
      "Incorporate more traditional symbols to strengthen cultural authenticity",
      "Balance the composition by adding symmetrical elements in empty spaces"
    ]
  };
};

// Generate metric cards data with proper typing
export const generateMetricCardsData = (metrics: AnalysisData['metrics']) => {
  const icons = {
    symmetry: { name: 'Compass', color: 'text-blue-600', bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
    complexity: { name: 'Layers', color: 'text-purple-600', bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' },
    cultural: { name: 'Globe', color: 'text-green-600', bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
    aesthetic: { name: 'Palette', color: 'text-pink-600', bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20' },
    innovation: { name: 'Sparkles', color: 'text-yellow-600', bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' },
    technical: { name: 'Zap', color: 'text-indigo-600', bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20' }
  };

  return [
    {
      id: 'symmetry',
      label: 'Symmetry Score',
      value: metrics.symmetry,
      iconName: icons.symmetry.name,
      color: icons.symmetry.color,
      bgColor: icons.symmetry.bgColor,
      description: 'Geometric balance and proportion analysis',
      trend: 5,
      unit: '%'
    },
    {
      id: 'complexity',
      label: 'Design Complexity',
      value: metrics.complexity,
      iconName: icons.complexity.name,
      color: icons.complexity.color,
      bgColor: icons.complexity.bgColor,
      description: 'Intricate pattern and detail assessment',
      trend: 8,
      unit: '%'
    },
    {
      id: 'cultural',
      label: 'Cultural Authenticity',
      value: metrics.cultural,
      iconName: icons.cultural.name,
      color: icons.cultural.color,
      bgColor: icons.cultural.bgColor,
      description: 'Traditional heritage and cultural significance',
      trend: 12,
      unit: '%'
    },
    {
      id: 'aesthetic',
      label: 'Aesthetic Appeal',
      value: metrics.aesthetic,
      iconName: icons.aesthetic.name,
      color: icons.aesthetic.color,
      bgColor: icons.aesthetic.bgColor,
      description: 'Visual harmony and color composition',
      trend: 3,
      unit: '%'
    },
    {
      id: 'innovation',
      label: 'Innovation Factor',
      value: metrics.innovation,
      iconName: icons.innovation.name,
      color: icons.innovation.color,
      bgColor: icons.innovation.bgColor,
      description: 'Creative originality and modern adaptation',
      trend: -2,
      unit: '%'
    },
    {
      id: 'technical',
      label: 'Technical Excellence',
      value: metrics.technical,
      iconName: icons.technical.name,
      color: icons.technical.color,
      bgColor: icons.technical.bgColor,
      description: 'Execution precision and craftsmanship quality',
      trend: 7,
      unit: '%'
    }
  ];
};