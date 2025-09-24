import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                ✨ Smart POS for Modern Businesses
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-hero">Smart, Simple</span>
                <br />
                Point of Sale
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Streamline your business operations with PebblePay's intuitive POS system. 
                Accept payments, manage inventory, and grow your business with confidence.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "Accept all payment types",
                "Real-time inventory tracking",
                "Comprehensive analytics",
                "24/7 customer support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="btn-hero group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  View Products
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Trusted by 50,000+ businesses worldwide</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-lg font-semibold">Shopify</div>
                <div className="text-lg font-semibold">Square</div>
                <div className="text-lg font-semibold">Stripe</div>
                <div className="text-lg font-semibold">PayPal</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-in-left">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-xl hover-glow">
                <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Today's Sales</h3>
                      <div className="text-2xl font-bold">$12,847</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-sm opacity-90">Transactions</div>
                        <div className="text-xl font-bold">247</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-sm opacity-90">Avg. Sale</div>
                        <div className="text-xl font-bold">$52</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Coffee Blend #1</span>
                    <span className="text-success font-semibold">+$24.99</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Artisan Pastry</span>
                    <span className="text-success font-semibold">+$8.50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Espresso Double</span>
                    <span className="text-success font-semibold">+$4.25</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;