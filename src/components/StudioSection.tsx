import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Palette, 
  Grid, 
  Download, 
  BarChart3, 
  Sparkles, 
  Wand2,
  FileImage,
  Layers,
  CircleDot
} from "lucide-react";

const StudioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("ethnic");

  const categories = [
    { id: "ethnic", name: "Ethnic", icon: CircleDot, count: 24 },
    { id: "modern", name: "Modern", icon: Sparkles, count: 18 },
    { id: "simple", name: "Simple", icon: Grid, count: 32 },
    { id: "fusion", name: "Fusion", icon: Palette, count: 16 },
    { id: "festive", name: "Festive", icon: Wand2, count: 28 }
  ];

  const studioFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analysis", 
      description: "Upload your rangoli and get detailed geometry, symmetry, and cultural context analysis",
      features: ["Symmetry Classification", "Geometry Breakdown", "Cultural Meaning", "Complexity Score"]
    },
    {
      icon: Grid,
      title: "Interactive Design Tools",
      description: "Create rangoli with guided dot grids, symmetry tools, and real-time preview",
      features: ["Dot Grid Generator", "Symmetry Controls", "Live Preview", "Pattern Library"]
    },
    {
      icon: Palette,
      title: "Smart Color & Style",
      description: "Intelligent color suggestions based on festivals, regions, and cultural contexts",
      features: ["Festival Palettes", "Regional Colors", "AI Suggestions", "Custom Themes"]
    },
    {
      icon: FileImage,
      title: "Export & Share",
      description: "Export your creations in multiple formats and share with the community",
      features: ["PNG/SVG Export", "PDF Worksheets", "Social Sharing", "Print Ready"]
    }
  ];

  const aiFeatures = [
    {
      title: "Symmetry Detection",
      description: "Identifies radial, bilateral, and rotational symmetries",
      accuracy: "98%"
    },
    {
      title: "Pattern Recognition", 
      description: "Recognizes traditional motifs and their cultural origins",
      accuracy: "94%"
    },
    {
      title: "Stroke Analysis",
      description: "Analyzes continuous paths and optimal drawing sequences", 
      accuracy: "96%"
    },
    {
      title: "Cultural Context",
      description: "Provides historical and spiritual significance insights",
      accuracy: "92%"
    }
  ];

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
            Rangoli Studio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create, analyze, and perfect your rangoli designs with cutting-edge AI technology. 
            From traditional patterns to modern interpretations, our studio empowers your creativity.
          </p>
        </div>

        {/* Studio Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {studioFeatures.map((feature, index) => (
            <Card key={feature.title} className="group hover:shadow-heritage transition-all duration-500 border-border/30">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-playfair">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Analysis Section */}
        <div className="bg-surface rounded-3xl p-8 lg:p-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-4xl font-playfair font-bold text-foreground mb-4">
              Advanced AI Analysis
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI engine provides comprehensive analysis of your rangoli designs, 
              offering insights into geometry, symmetry, and cultural significance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="bg-gradient-heritage rounded-2xl p-6 mb-4 group-hover:shadow-glow transition-all duration-300">
                  <div className="text-3xl font-playfair font-bold text-white mb-2">
                    {feature.accuracy}
                  </div>
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h3 className="text-2xl lg:text-3xl font-playfair font-bold text-center text-foreground mb-8">
            Design Categories
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "studio" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Category Content */}
          <Tabs value={selectedCategory} className="w-full">
            <TabsContent value="ethnic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group hover:shadow-heritage transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gradient-mandala rounded-lg mb-4 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-playfair font-semibold mb-2">Traditional Kolam</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Authentic Tamil Nadu patterns with dot grids
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      Try Pattern
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-heritage transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gradient-sunset rounded-lg mb-4 flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-playfair font-semibold mb-2">Maharashtrian Rangoli</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vibrant peacock and lotus designs
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      Try Pattern
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-heritage transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gradient-heritage rounded-lg mb-4 flex items-center justify-center">
                      <CircleDot className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-playfair font-semibold mb-2">Bengali Alpana</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sacred rice paste ceremonial patterns
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      Try Pattern
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tab contents would be similar */}
            <TabsContent value="modern" className="space-y-6">
              <div className="text-center py-12">
                <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-playfair font-semibold mb-2">Modern Patterns</h4>
                <p className="text-muted-foreground">
                  Contemporary interpretations of traditional designs
                </p>
              </div>
            </TabsContent>

            <TabsContent value="simple" className="space-y-6">
              <div className="text-center py-12">
                <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-playfair font-semibold mb-2">Simple Designs</h4>
                <p className="text-muted-foreground">
                  Easy-to-follow patterns perfect for beginners
                </p>
              </div>
            </TabsContent>

            <TabsContent value="fusion" className="space-y-6">
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-playfair font-semibold mb-2">Fusion Styles</h4>
                <p className="text-muted-foreground">
                  Blend traditional motifs with contemporary aesthetics
                </p>
              </div>
            </TabsContent>

            <TabsContent value="festive" className="space-y-6">
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-playfair font-semibold mb-2">Festival Rangoli</h4>
                <p className="text-muted-foreground">
                  Special designs for Diwali, Pongal, Onam, and other celebrations
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button variant="hero" size="xl" className="mr-4">
            <Wand2 className="w-5 h-5 mr-2" />
            Launch Studio
          </Button>
          <Button variant="outline" size="xl">
            <Download className="w-5 h-5 mr-2" />
            Download App
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
