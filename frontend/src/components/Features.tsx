import { 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap, 
  Users, 
  Cloud,
  CreditCard,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Universal Payments",
    description: "Accept all payment types including chip, tap, and mobile wallets with industry-leading security."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get instant insights into your sales performance with beautiful dashboards and detailed reports."
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access your data anywhere with automatic cloud synchronization and secure backup."
  },
  {
    icon: Shield,
    title: "Bank-level Security",
    description: "End-to-end encryption and PCI compliance ensure your customers' data is always protected."
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Take payments anywhere with our mobile apps and portable hardware solutions."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process transactions in seconds with our optimized hardware and software stack."
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage staff access, track performance, and streamline operations across multiple locations."
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Scale your business with inventory management, customer insights, and marketing tools."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Everything You Need to <span className="text-gradient">Grow Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            PebblePay combines powerful hardware with intelligent software to give you a complete point-of-sale solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card-feature rounded-2xl p-6 hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of businesses that trust PebblePay for their payment processing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Start Your Free Trial
              </button>
              <button className="btn-premium px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;