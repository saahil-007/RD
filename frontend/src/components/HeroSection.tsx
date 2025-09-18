import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroMandala from "@/assets/hero-mandala.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    rotate: [0, 5, 0, -5, 0]
  };
  
  const floatingTransition = {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

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
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 opacity-20"
          animate={floatingAnimation}
          transition={floatingTransition}
        >
          <div className="w-full h-full rounded-full bg-gradient-mandala animate-mandala-rotate" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 opacity-15"
          animate={floatingAnimation}
          transition={{ ...floatingTransition, delay: 1.5 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-sunset animate-mandala-rotate" />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 left-20 w-28 h-28 opacity-25"
          animate={floatingAnimation}
          transition={{ ...floatingTransition, delay: 3 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-heritage animate-mandala-rotate" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-16 w-20 h-20 opacity-20"
          animate={floatingAnimation}
          transition={{ ...floatingTransition, delay: 4.5 }}
        >
          <div className="w-full h-full rounded-full bg-gradient-mandala animate-mandala-rotate" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-8"
            variants={itemVariants}
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-foreground">
              Where Tradition Meets Design Intelligence
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl lg:text-7xl font-playfair font-bold text-foreground mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              Kolam कला
            </span>
            <br />
            <span className="text-heritage">Digital Canvas</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            variants={itemVariants}
          >
            From ancient patterns to AI-driven analysis, explore the timeless beauty of kolam artistry.
          </motion.p>

          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 font-playfair"
            variants={itemVariants}
          >
            Tradition Meets Design Intelligence
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="hero" size="xl" className="min-w-[200px]">
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore RangDarshan
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="xl" 
                className="min-w-[200px]"
                onClick={() => navigate('/analyze')}
              >
                <Zap className="w-5 h-5 mr-2" />
                AI Analysis Studio
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            variants={containerVariants}
          >
            {[
              {
                title: "Cultural Heritage",
                description: "Explore authentic rangoli traditions from Tamil Nadu, Maharashtra, Bengal, and Kerala",
                gradient: "bg-gradient-sunset"
              },
              {
                title: "AI Analysis", 
                description: "Get detailed reports on symmetry, geometry, and cultural significance of your designs",
                gradient: "bg-gradient-heritage"
              },
              {
                title: "Interactive Tutorials",
                description: "Step-by-step guidance with animated paths and printable worksheets", 
                gradient: "bg-gradient-mandala"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/30 hover:shadow-heritage transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className={`w-12 h-12 ${feature.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 5 }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-gold rounded-full mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;