import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Filter, Search, Grid, List } from 'lucide-react';
import kolamImage from '@/assets/kolam-patterns.jpg';
import maharashtraImage from '@/assets/maharashtra-rangoli.jpg';
import bengalImage from '@/assets/bengal-alpana.jpg';
import keralaImage from '@/assets/kerala-pookalam.jpg';

interface PatternTemplate {
  id: string;
  name: string;
  category: 'kolam' | 'rangoli' | 'alpana' | 'pookalam';
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  description: string;
  culturalContext: string;
  downloadFormats: string[];
  tags: string[];
}

const PatternLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const patterns: PatternTemplate[] = [
    {
      id: '1',
      name: 'Traditional Pulli Kolam',
      category: 'kolam',
      difficulty: 'medium',
      image: kolamImage,
      description: 'Classic dot-grid based geometric pattern with intricate line work',
      culturalContext: 'Tamil Nadu traditional morning ritual pattern',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['geometric', 'dots', 'symmetrical', 'traditional']
    },
    {
      id: '2',
      name: 'Peacock Rangoli',
      category: 'rangoli',
      difficulty: 'hard',
      image: maharashtraImage,
      description: 'Vibrant peacock design with feather details and symmetrical beauty',
      culturalContext: 'Maharashtra Diwali celebration centerpiece',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['peacock', 'colorful', 'festival', 'detailed']
    },
    {
      id: '3',
      name: 'Conch Shell Alpana',
      category: 'alpana',
      difficulty: 'easy',
      image: bengalImage,
      description: 'Sacred conch shell motif in traditional white rice paste',
      culturalContext: 'Bengali Durga Puja ritual decoration',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['sacred', 'simple', 'ritual', 'religious']
    },
    {
      id: '4',
      name: 'Onam Pookalam',
      category: 'pookalam',
      difficulty: 'medium',
      image: keralaImage,
      description: 'Concentric flower petal mandala for Onam festival',
      culturalContext: 'Kerala Onam celebration welcoming King Mahabali',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['flowers', 'festival', 'circular', 'natural']
    },
    // Add more patterns for demonstration
    {
      id: '5',
      name: 'Lotus Mandala Kolam',
      category: 'kolam',
      difficulty: 'hard',
      image: kolamImage,
      description: 'Complex lotus-inspired design with multiple symmetrical layers',
      culturalContext: 'Tamil Nadu temple ritual pattern',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['lotus', 'complex', 'mandala', 'spiritual']
    },
    {
      id: '6',
      name: 'Simple Diya Rangoli',
      category: 'rangoli',
      difficulty: 'easy',
      image: maharashtraImage,
      description: 'Easy diya-themed pattern perfect for beginners',
      culturalContext: 'Maharashtra household Diwali decoration',
      downloadFormats: ['PNG', 'SVG', 'PDF'],
      tags: ['diya', 'beginner', 'festival', 'light']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Patterns', count: patterns.length },
    { value: 'kolam', label: 'Tamil Kolam', count: patterns.filter(p => p.category === 'kolam').length },
    { value: 'rangoli', label: 'Maharashtra Rangoli', count: patterns.filter(p => p.category === 'rangoli').length },
    { value: 'alpana', label: 'Bengal Alpana', count: patterns.filter(p => p.category === 'alpana').length },
    { value: 'pookalam', label: 'Kerala Pookalam', count: patterns.filter(p => p.category === 'pookalam').length }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const filteredPatterns = patterns.filter(pattern => {
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || pattern.difficulty === selectedDifficulty;
    const matchesSearch = pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pattern.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const downloadPattern = (pattern: PatternTemplate, format: string) => {
    // Simulate download
    console.log(`Downloading ${pattern.name} in ${format} format`);
    
    // Create a mock download
    const link = document.createElement('a');
    link.href = pattern.image;
    link.download = `${pattern.name.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-accent text-accent-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'hard': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kolam': return 'bg-gradient-sunset';
      case 'rangoli': return 'bg-gradient-heritage';
      case 'alpana': return 'bg-gradient-mandala';
      case 'pookalam': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-playfair font-bold text-foreground">
            Pattern Library
          </h2>
          <p className="text-muted-foreground">
            Download authentic rangoli templates and tutorials
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search patterns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredPatterns.length} of {patterns.length} patterns
        </p>
        <Badge variant="outline">
          <Filter className="w-3 h-3 mr-1" />
          {filteredPatterns.length} Results
        </Badge>
      </div>

      {/* Pattern Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="group hover:shadow-heritage transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={pattern.image}
                  alt={pattern.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getDifficultyColor(pattern.difficulty)}>
                    {pattern.difficulty}
                  </Badge>
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(pattern.category)}`} />
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-playfair font-semibold text-lg text-foreground mb-2">
                  {pattern.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {pattern.description}
                </p>
                
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Cultural Context</p>
                  <p className="text-sm font-medium">{pattern.culturalContext}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {pattern.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <div className="relative group">
                    <Button variant="hero" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px] z-10">
                      {pattern.downloadFormats.map((format) => (
                        <button
                          key={format}
                          onClick={() => downloadPattern(pattern, format)}
                          className="block w-full text-left px-3 py-1 text-sm hover:bg-muted rounded transition-colors"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="group hover:shadow-heritage transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={pattern.image}
                    alt={pattern.name}
                    className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-playfair font-semibold text-xl text-foreground">
                        {pattern.name}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(pattern.difficulty)}>
                          {pattern.difficulty}
                        </Badge>
                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(pattern.category)}`} />
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{pattern.description}</p>
                    <p className="text-sm text-muted-foreground mb-3">{pattern.culturalContext}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pattern.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <div className="relative group">
                        <Button variant="hero" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px] z-10">
                          {pattern.downloadFormats.map((format) => (
                            <button
                              key={format}
                              onClick={() => downloadPattern(pattern, format)}
                              className="block w-full text-left px-3 py-1 text-sm hover:bg-muted rounded transition-colors"
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPatterns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
              No patterns found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatternLibrary;