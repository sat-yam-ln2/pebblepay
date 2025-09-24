import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Smartphone, Monitor, Tablet } from "lucide-react";
import { Link } from "react-router-dom";

const devices = [
  {
    id: 1,
    name: "PebblePay Mini",
    description: "Perfect for small businesses and mobile vendors",
    price: "Starting at $99",
    icon: Smartphone,
    features: ["Compact design", "4-hour battery", "All payment types", "Cloud sync"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "PebblePay Flex",
    description: "Versatile solution for growing businesses",
    price: "Starting at $299",
    icon: Tablet,
    features: ["Touch display", "8-hour battery", "Inventory management", "Real-time reports"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "PebblePay Station",
    description: "Full-featured POS for established businesses",
    price: "Starting at $599",
    icon: Monitor,
    features: ["Large display", "Receipt printer", "Cash drawer", "Advanced analytics"],
    image: "/api/placeholder/300/200"
  }
];

const DeviceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % devices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + devices.length) % devices.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Choose Your Perfect <span className="text-gradient">POS Device</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From compact mobile solutions to full-featured stations, we have the right device for your business needs.
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {devices.map((device, index) => (
                <div key={device.id} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-12 items-center bg-card p-8 lg:p-12">
                    {/* Device Info */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                          <device.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{device.name}</h3>
                          <p className="text-primary font-semibold">{device.price}</p>
                        </div>
                      </div>
                      
                      <p className="text-lg text-muted-foreground">{device.description}</p>
                      
                      <div className="space-y-3">
                        {device.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-4">
                        <Link to={`/products/${device.id}`}>
                          <Button className="btn-hero">
                            Learn More
                          </Button>
                        </Link>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          Request Demo
                        </Button>
                      </div>
                    </div>

                    {/* Device Visual */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-muted to-card rounded-xl p-8 shadow-lg hover-glow">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                          <device.icon className="h-24 w-24 text-primary/60" />
                        </div>
                        <div className="mt-6 space-y-3">
                          <div className="h-3 bg-muted rounded-full w-3/4"></div>
                          <div className="h-3 bg-muted rounded-full w-1/2"></div>
                          <div className="h-3 bg-primary/20 rounded-full w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-muted z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background shadow-lg hover:bg-muted z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {devices.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceCarousel;