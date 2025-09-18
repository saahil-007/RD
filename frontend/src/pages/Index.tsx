import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HeritageSection from "@/components/HeritageSection";
import EnhancedStudioSection from "@/components/EnhancedStudioSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <HeritageSection />
        <EnhancedStudioSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;