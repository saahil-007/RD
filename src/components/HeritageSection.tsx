import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sparkles, BookOpen, Download } from "lucide-react";
import kolamImage from "@/assets/kolam-patterns.jpg";
import maharashtraImage from "@/assets/maharashtra-rangoli.jpg";
import bengalImage from "@/assets/bengal-alpana.jpg";
import keralaImage from "@/assets/kerala-pookalam.jpg";

const HeritageSection = () => {
  const [selectedState, setSelectedState] = useState("tamil-nadu");

  const stateData = {
    "tamil-nadu": {
      name: "Tamil Nadu",
      artForm: "Kolam",
      description: "Dot-grid based geometric patterns drawn with rice flour",
      significance: "Daily prosperity ritual, feeding ants and birds",
      image: kolamImage,
      patterns: [
        {
          name: "Pulli Kolam",
          description: "Dot-grid based, geometric precision",
          significance: "Daily prosperity, feeding ants/birds"
        },
        {
          name: "Sikku Kolam", 
          description: "Intertwining line patterns over dots",
          significance: "Infinity & cosmic energy"
        },
        {
          name: "Chikku Kolam",
          description: "Smooth curved strokes with minimal dots", 
          significance: "Simplicity, balance, elegance"
        },
        {
          name: "Festival Kolam",
          description: "Bright colored powders during Pongal",
          significance: "Goddess prosperity & harvest blessings"
        }
      ]
    },
    "maharashtra": {
      name: "Maharashtra", 
      artForm: "Rangoli",
      description: "Vibrant powder designs with intricate motifs",
      significance: "Festival centerpieces and prosperity symbols",
      image: maharashtraImage,
      patterns: [
        {
          name: "Peacock Rangoli",
          description: "Vibrant feathers, symmetrical design",
          significance: "Diwali centerpiece, symbol of beauty"
        },
        {
          name: "Lotus Rangoli",
          description: "Radial floral mandala patterns", 
          significance: "Lakshmi puja, symbol of purity"
        },
        {
          name: "Geometric Rangoli",
          description: "Triangles, squares, circles in harmony",
          significance: "Warding off evil, grounding energies"
        },
        {
          name: "Shubh-Labh Rangoli",
          description: "Sacred text combined with motifs",
          significance: "Festival entrances for prosperity"
        }
      ]
    },
    "bengal": {
      name: "Bengal",
      artForm: "Alpana", 
      description: "Rice paste designs with sacred symbols",
      significance: "Goddess worship and life celebration",
      image: bengalImage,
      patterns: [
        {
          name: "Circular Alpana",
          description: "Radial dots & flowing curves",
          significance: "Navratri & Durga Puja floor art"
        },
        {
          name: "Conch Shell Alpana",
          description: "Sacred Shankha motifs",
          significance: "Sacred sound, spiritual purity"
        },
        {
          name: "Fish Alpana", 
          description: "Bengali fertility & life symbolism",
          significance: "Drawn during wedding ceremonies"
        },
        {
          name: "Durga Feet Alpana",
          description: "Goddess footprints entering home",
          significance: "Navratri, Shakti invocation"
        }
      ]
    },
    "kerala": {
      name: "Kerala",
      artForm: "Pookalam",
      description: "Flower petal mandalas for Onam festival", 
      significance: "Welcoming King Mahabali's return",
      image: keralaImage,
      patterns: [
        {
          name: "Athapookalam",
          description: "Grand concentric floral circles",
          significance: "Onam, welcoming King Mahabali"
        },
        {
          name: "Chirath Pookalam",
          description: "Lamps embedded in floral design",
          significance: "Light & life unity celebration"
        },
        {
          name: "Multi-layer Pookalam",
          description: "10 concentric rings for 10 Onam days",
          significance: "Growth & prosperity journey"
        },
        {
          name: "Temple Pookalam",
          description: "Sacred symbols with temple flowers", 
          significance: "Devotion & ritual purity"
        }
      ]
    }
  };

  const currentState = stateData[selectedState as keyof typeof stateData];

  return (
    <section id="heritage" className="py-20 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Regional Heritage
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-playfair font-bold text-foreground mb-6">
            Four Sacred Traditions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the unique rangoli traditions from across India, each with its own 
            cultural significance, artistic techniques, and spiritual meaning.
          </p>
        </div>

        {/* State Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(stateData).map(([key, state]) => (
            <Button
              key={key}
              variant={selectedState === key ? "hero" : "outline"}
              onClick={() => setSelectedState(key)}
              className="transition-all duration-300"
            >
              {state.name} - {state.artForm}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-heritage group">
              <img
                src={currentState.image}
                alt={`${currentState.name} ${currentState.artForm}`}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-playfair font-bold mb-2">
                  {currentState.name} {currentState.artForm}
                </h3>
                <p className="text-sm opacity-90">{currentState.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">
              {currentState.artForm} Tradition
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              {currentState.description}
            </p>
            <div className="bg-card rounded-xl p-6 border border-border/30 mb-8">
              <h4 className="font-semibold text-foreground mb-2">Cultural Significance</h4>
              <p className="text-muted-foreground">{currentState.significance}</p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="heritage" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Tutorials
              </Button>
              <Button variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentState.patterns.map((pattern, index) => (
            <Card key={pattern.name} className="group hover:shadow-heritage transition-all duration-300 border-border/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-playfair">{pattern.name}</CardTitle>
                  <div className="w-8 h-8 bg-gradient-mandala rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
                <div className="bg-muted/30 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-foreground mb-1">Significance</h5>
                  <p className="text-xs text-muted-foreground">{pattern.significance}</p>
                </div>
                <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn Pattern
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;