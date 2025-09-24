import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 100 transactions/month",
      "1 POS device",
      "Basic reporting",
      "Email support",
      "Payment processing",
      "Inventory tracking"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 1,000 transactions/month",
      "3 POS devices",
      "Advanced analytics",
      "Priority support",
      "Staff management",
      "Customer insights",
      "Loyalty programs",
      "Integrations"
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For established businesses with high volume",
    features: [
      "Unlimited transactions",
      "Unlimited devices",
      "Custom reporting",
      "24/7 phone support",
      "Multi-location management",
      "Advanced integrations",
      "Custom training",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

const Pricing = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business. All plans include our core POS features with no hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative card-premium rounded-2xl p-8 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              } hover-lift animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="block">
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? 'btn-hero' : ''} ${
                      plan.buttonVariant === 'outline' 
                        ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' 
                        : ''
                    }`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required. 
            <Link to="/contact" className="text-primary hover:underline ml-1">
              Questions? Contact us.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;