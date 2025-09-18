import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from './ImageUpload';
import PatternLibrary from './PatternLibrary';
import { 
  Brain, 
  Palette, 
  Grid, 
  Download, 
  Upload,
  Wand2,
  BookOpen,
  Sparkles,
  BarChart3,
  Image as ImageIcon
} from 'lucide-react';

const EnhancedStudioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <section id="studio" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Studio
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-playfair font-bold text-foreground mb-6">
            Kolam Studio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create, analyze, and perfect your kolam designs with cutting-edge AI technology. 
            Upload your own patterns for analysis or explore our comprehensive pattern library.
          </p>
        </div>

        {/* Studio Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-8 mt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">
                Interactive Design Canvas
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create beautiful rangoli patterns with our AI-assisted design tools. 
                Choose from traditional templates or start from scratch.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Start Templates */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="hero" className="w-full">
                    <Palette className="w-4 h-4 mr-2" />
                    New Kolam Design
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Rangoli Template
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Grid className="w-4 h-4 mr-2" />
                    Alpana Pattern
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Pookalam Design
                  </Button>
                </CardContent>
              </Card>

              {/* Canvas Preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Design Canvas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-surface rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <div className="text-center">
                      <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-playfair font-semibold text-lg text-foreground mb-2">
                        Interactive Canvas
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Choose a template above to start designing
                      </p>
                      <Button variant="hero">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Launch Canvas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Design Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Grid className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">Dot Grid Generator</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect geometric grids for traditional kolam patterns
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-heritage rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">Color Palette</h4>
                  <p className="text-sm text-muted-foreground">
                    Traditional and modern color schemes for your designs
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">AI Assistance</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart suggestions and symmetry guidance
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-8 mt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">
                AI Pattern Analysis
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload your rangoli images to get detailed AI analysis including symmetry detection, 
                cultural context, and geometric insights.
              </p>
            </div>

            <ImageUpload 
              maxFiles={5}
              onAnalysis={(file, analysis) => {
                console.log('Analysis complete:', file.name, analysis);
              }}
            />

            {/* Analysis Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="text-center hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">Symmetry Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Detect radial, bilateral, and rotational symmetries
                  </p>
                  <Badge className="mt-2 bg-accent text-accent-foreground">98% Accuracy</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">Stroke Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze drawing paths and optimal sequences
                  </p>
                  <Badge className="mt-2 bg-accent text-accent-foreground">96% Accuracy</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-heritage transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-heritage rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-playfair font-semibold mb-2">Cultural Context</h4>
                  <p className="text-sm text-muted-foreground">
                    Historical and spiritual significance insights
                  </p>
                  <Badge className="mt-2 bg-accent text-accent-foreground">92% Accuracy</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="mt-8">
            <PatternLibrary />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-8 mt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">
                Professional Tools
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Advanced tools for designers, artists, and cultural researchers working with rangoli patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Batch Export
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Export multiple patterns in various formats simultaneously
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics and insights for your pattern collection
                  </p>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-heritage transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    API Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Integrate our AI analysis into your own applications
                  </p>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Professional Features */}
            <Card className="bg-surface">
              <CardHeader>
                <CardTitle className="text-center">Professional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-sunset rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">Bulk Upload</h4>
                    <p className="text-sm text-muted-foreground">Upload up to 100 images at once</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-heritage rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">Advanced AI</h4>
                    <p className="text-sm text-muted-foreground">Enhanced analysis with detailed reports</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-sunset rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">Custom Export</h4>
                    <p className="text-sm text-muted-foreground">Multiple formats and resolutions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-heritage rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">Dedicated assistance and resources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EnhancedStudioSection;