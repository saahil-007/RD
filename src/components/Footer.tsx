import { Button } from "@/components/ui/button";
import { Flower2, Instagram, Twitter, Youtube, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-heritage text-heritage-foreground py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Flower2 className="w-8 h-8 text-gold animate-lotus-bloom" />
                <div className="absolute inset-0 w-8 h-8 text-gold/30 animate-mandala-rotate">
                  <Flower2 className="w-full h-full" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold">RangDarshan</h3>
                <p className="text-sm text-heritage-foreground/80">Rangoli Studio</p>
              </div>
            </div>
            <p className="text-heritage-foreground/80 mb-6 max-w-md">
              Preserving and celebrating the sacred art of rangoli through AI-powered 
              analysis, interactive tutorials, and cultural heritage exploration.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-gold hover:text-white hover:bg-gold/20">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gold hover:text-white hover:bg-gold/20">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gold hover:text-white hover:bg-gold/20">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gold hover:text-white hover:bg-gold/20">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <a href="#rangdarshan" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  RangDarshan Heritage
                </a>
              </li>
              <li>
                <a href="#studio" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  AI Studio
                </a>
              </li>
              <li>
                <a href="#tutorials" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#patterns" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  Pattern Library
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  Cultural Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  Download Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-heritage-foreground/80 hover:text-gold transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-heritage-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-heritage-foreground/70">
              <span>© 2024 RangDarshan. All rights reserved.</span>
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-heritage-foreground/70">
              <MapPin className="w-4 h-4" />
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;