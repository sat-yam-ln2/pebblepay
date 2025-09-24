import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, X, HelpCircle, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const plans = [
  {
    name: "Starter",
    price: "$29",
    yearlyPrice: "$290",
    period: "/month",
    yearlyPeriod: "/year",
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
    yearlyPrice: "$790",
    period: "/month",
    yearlyPeriod: "/year",
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
    yearlyPrice: "$1,990",
    period: "/month",
    yearlyPeriod: "/year",
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

const featureComparison = {
  categories: [
    {
      name: "Core POS Features",
      features: [
        { name: "Payment Processing", starter: true, professional: true, enterprise: true },
        { name: "Inventory Management", starter: true, professional: true, enterprise: true },
        { name: "Receipt Printing", starter: true, professional: true, enterprise: true },
        { name: "Customer Database", starter: true, professional: true, enterprise: true },
        { name: "Tax Calculation", starter: true, professional: true, enterprise: true },
      ]
    },
    {
      name: "Advanced Features",
      features: [
        { name: "Employee Management", starter: false, professional: true, enterprise: true },
        { name: "Shift Tracking", starter: false, professional: true, enterprise: true },
        { name: "Multi-location Support", starter: false, professional: false, enterprise: true },
        { name: "Custom Reports", starter: false, professional: true, enterprise: true },
        { name: "API Access", starter: false, professional: true, enterprise: true },
      ]
    },
    {
      name: "Customer Engagement",
      features: [
        { name: "Customer Loyalty Program", starter: false, professional: true, enterprise: true },
        { name: "Email Marketing Integration", starter: false, professional: true, enterprise: true },
        { name: "Gift Cards", starter: false, professional: true, enterprise: true },
        { name: "Customer Feedback Collection", starter: false, professional: false, enterprise: true },
        { name: "Custom Promotions", starter: false, professional: false, enterprise: true },
      ]
    },
    {
      name: "Support & Training",
      features: [
        { name: "Email Support", starter: true, professional: true, enterprise: true },
        { name: "Phone Support", starter: false, professional: true, enterprise: true },
        { name: "24/7 Emergency Support", starter: false, professional: false, enterprise: true },
        { name: "Dedicated Account Manager", starter: false, professional: false, enterprise: true },
        { name: "Onsite Training", starter: false, professional: false, enterprise: true },
      ]
    }
  ]
};

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer: "Our 14-day free trial gives you full access to all features of your chosen plan. No credit card is required to start, and you can cancel anytime. At the end of your trial, you can choose to subscribe or your account will automatically downgrade to a limited free version."
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the change takes effect immediately. When downgrading, the change will take effect at the end of your current billing cycle."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for annual plans."
  },
  {
    question: "How many devices can I connect?",
    answer: "The Starter plan includes 1 device, the Professional plan includes 3 devices, and the Enterprise plan offers unlimited devices. Additional devices can be added to any plan for an extra fee."
  },
  {
    question: "Do I need to purchase hardware?",
    answer: "Our software works with a wide range of hardware options. You can use existing compatible hardware or purchase our recommended devices. Contact our sales team for hardware recommendations tailored to your business needs."
  }
];

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business. All plans include our core POS features with no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-12">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod} 
              onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
              className="bg-muted/50 p-1 rounded-full"
            >
              <TabsList className="grid grid-cols-2 w-[300px] bg-transparent">
                <TabsTrigger 
                  value="monthly" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full"
                >
                  Monthly Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="yearly"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full"
                >
                  Annual Billing <span className="ml-1 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Save 17%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Plans Grid */}
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
                    <span className="text-4xl font-bold text-gradient">
                      {billingPeriod === "monthly" ? plan.price : plan.yearlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      {billingPeriod === "monthly" ? plan.period : plan.yearlyPeriod}
                    </span>
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

      {/* Feature Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Compare All <span className="text-gradient">Features</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Starter</th>
                  <th className="text-center py-4 px-4 font-medium">Professional</th>
                  <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.categories.map((category, idx) => (
                  <Fragment key={idx}>
                    <tr className="bg-card/50">
                      <td colSpan={4} className="py-3 px-4 font-semibold text-primary">{category.name}</td>
                    </tr>
                    {category.features.map((feature, featureIdx) => (
                      <tr key={featureIdx} className="border-b border-border hover:bg-muted/20">
                        <td className="py-3 px-4">{feature.name}</td>
                        <td className="text-center py-3 px-4">
                          {feature.starter ? 
                            <Check className="h-5 w-5 text-success mx-auto" /> : 
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />}
                        </td>
                        <td className="text-center py-3 px-4">
                          {feature.professional ? 
                            <Check className="h-5 w-5 text-success mx-auto" /> : 
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />}
                        </td>
                        <td className="text-center py-3 px-4">
                          {feature.enterprise ? 
                            <Check className="h-5 w-5 text-success mx-auto" /> : 
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payment Processing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Transparent <span className="text-gradient">Payment Processing</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                In addition to our software subscription, we offer simple and transparent payment processing rates that scale with your business.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">In-Person Transactions</h3>
                    <p className="text-muted-foreground">2.4% + $0.10 per transaction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Online Payments</h3>
                    <p className="text-muted-foreground">2.8% + $0.30 per transaction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">High-Volume Enterprise</h3>
                    <p className="text-muted-foreground">Custom rates available</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/payment-processing">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Learn More About Payment Processing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-xl hover-glow">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Volume Discounts</h3>
                  <p className="text-muted-foreground">Process more, pay less with our tiered structure</p>
                </div>
                <div className="space-y-6 w-full">
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Up to $50,000/month</span>
                      <span className="font-bold">2.4% + $0.10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/4"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">$50,001 - $100,000/month</span>
                      <span className="font-bold">2.1% + $0.10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/2"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">$100,001+/month</span>
                      <span className="font-bold">1.9% + $0.10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-3/4"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Enterprise Custom</span>
                      <span className="font-bold">Contact Sales</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our pricing, features, and subscription plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg mb-6">Still have questions?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button variant="default" size="lg" className="min-w-[200px]">
                  Contact Sales
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" size="lg" className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Visit Support Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your business?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="min-w-[200px] btn-hero">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;