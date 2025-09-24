import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Tablet, ArrowRight, Star } from "lucide-react";

const devices = [
  {
    id: 1,
    name: "PebblePay Mini",
    tagline: "Perfect for on-the-go sales",
    price: "$99",
    originalPrice: "$129",
    rating: 4.8,
    reviews: 342,
    icon: Smartphone,
    features: [
      "Compact 4.3\" touch display",
      "4-hour battery life",
      "All payment types accepted",
      "Cloud sync & offline mode",
      "Built-in receipt printer",
      "Weighs only 0.8 lbs"
    ],
    specs: {
      dimensions: "7.2 x 3.1 x 1.4 inches",
      weight: "0.8 lbs",
      battery: "4 hours continuous use",
      connectivity: "Wi-Fi, 4G LTE, Bluetooth"
    },
    image: "/api/placeholder/400/300"
  },
  {
    id: 2,
    name: "PebblePay Flex",
    tagline: "Versatile solution for any business",
    price: "$299",
    originalPrice: "$399",
    rating: 4.9,
    reviews: 567,
    icon: Tablet,
    features: [
      "8\" HD touchscreen display",
      "8-hour battery life",
      "Advanced inventory management",
      "Real-time reporting dashboard",
      "Staff management tools",
      "Customer loyalty integration"
    ],
    specs: {
      dimensions: "9.5 x 6.2 x 1.8 inches",
      weight: "1.4 lbs",
      battery: "8 hours continuous use",
      connectivity: "Wi-Fi, 4G LTE, Bluetooth, Ethernet"
    },
    image: "/api/placeholder/400/300",
    popular: true
  },
  {
    id: 3,
    name: "PebblePay Station",
    tagline: "Full-featured POS for high-volume businesses",
    price: "$599",
    originalPrice: "$799",
    rating: 4.7,
    reviews: 234,
    icon: Monitor,
    features: [
      "15.6\" full HD display",
      "All-day battery backup",
      "Integrated cash drawer",
      "Thermal receipt printer",
      "Advanced analytics suite",
      "Multi-location management"
    ],
    specs: {
      dimensions: "14.2 x 9.8 x 7.1 inches",
      weight: "5.2 lbs",
      battery: "12 hours with backup",
      connectivity: "Wi-Fi, Ethernet, USB-C, Bluetooth"
    },
    image: "/api/placeholder/400/300"
  }
];

const Products = () => {
  const [selectedDevice, setSelectedDevice] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Choose Your <span className="text-gradient">Perfect POS Device</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From compact mobile solutions to full-featured stations, find the device that fits your business perfectly.
          </p>
        </div>
      </section>

      {/* Device Selection */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Device Tabs */}
          <div className="flex flex-col sm:flex-row justify-center mb-12 space-y-4 sm:space-y-0 sm:space-x-4">
            {devices.map((device, index) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(index)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  selectedDevice === index
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
              >
                <device.icon className="h-5 w-5" />
                <span className="font-semibold">{device.name}</span>
                {device.popular && selectedDevice !== index && (
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected Device Details */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Device Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-xl hover-glow">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                  {React.createElement(devices[selectedDevice].icon, { 
                    className: "h-32 w-32 text-primary/60" 
                  })}
                </div>
              </div>
              
              {devices[selectedDevice].popular && (
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              )}
            </div>

            {/* Device Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{devices[selectedDevice].name}</h2>
                <p className="text-lg text-muted-foreground mb-4">{devices[selectedDevice].tagline}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(devices[selectedDevice].rating)
                              ? 'text-accent fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {devices[selectedDevice].rating} ({devices[selectedDevice].reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-gradient">{devices[selectedDevice].price}</span>
                  <span className="text-lg text-muted-foreground line-through">{devices[selectedDevice].originalPrice}</span>
                  <span className="bg-success text-success-foreground text-sm px-2 py-1 rounded-full">
                    Save ${parseInt(devices[selectedDevice].originalPrice.slice(1)) - parseInt(devices[selectedDevice].price.slice(1))}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <div className="grid gap-3">
                  {devices[selectedDevice].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/products/${devices[selectedDevice].id}`} className="flex-1">
                  <Button size="lg" className="w-full btn-hero group">
                    View Details
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Request Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16 bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(devices[selectedDevice].specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-muted-foreground capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="text-foreground font-medium">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Products;