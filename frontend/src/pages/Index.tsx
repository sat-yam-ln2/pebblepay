import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DeviceCarousel from "@/components/DeviceCarousel";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <Hero />
      <DeviceCarousel />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
