import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import heroMandala from "@/assets/hero-mandala.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroMandala})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        {/* Floating Mandala Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-20 mandala-float">
          <div className="w-full h-full rounded-full bg-gradient-mandala animate-mandala-rotate" />
        </div>
        <div className="absolute top-40 right-20 w-24 h-24 opacity-15 mandala-float" style={{ animationDelay: "5s" }}>
          <div className="w-full h-full rounded-full bg-gradient-sunset animate-mandala-rotate" />
        </div>
        <div className="absolute bottom-32 left-20 w-28 h-28 opacity-25 mandala-float" style={{ animationDelay: "10s" }}>
          <div className="w-full h-full rounded-full bg-gradient-heritage animate-mandala-rotate" />
        </div>
        <div className="absolute bottom-20 right-16 w-20 h-20 opacity-20 mandala-float" style={{ animationDelay: "15s" }}>
          <div className="w-full h-full rounded-full bg-gradient-mandala animate-mandala-rotate" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-foreground">
              Where Tradition Meets Design Intelligence
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-7xl font-playfair font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              RangDarshan
            </span>
            <br />
            <span className="text-heritage">Rangoli Studio</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
            Discover the sacred geometry of Indian rangoli art through AI-powered analysis, 
            interactive tutorials, and cultural heritage exploration. Create, learn, and preserve 
            traditions with modern technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <ArrowRight className="w-5 h-5 mr-2" />
              Explore RangDarshan
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              <Play className="w-5 h-5 mr-2" />
              Start Creating in Studio
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:shadow-heritage transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-sunset rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                Cultural Heritage
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore authentic rangoli traditions from Tamil Nadu, Maharashtra, Bengal, and Kerala
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:shadow-heritage transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-heritage rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                AI Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Get detailed reports on symmetry, geometry, and cultural significance of your designs
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:shadow-heritage transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-mandala rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                Interactive Tutorials
              </h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step guidance with animated paths and printable worksheets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;