import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HeritageSection from "@/components/HeritageSection";
import StudioSection from "@/components/StudioSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <HeritageSection />
        <StudioSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
