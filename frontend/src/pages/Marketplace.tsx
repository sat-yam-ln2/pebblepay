import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Shield, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  CreditCard,
  Calendar,
  Mail,
  Database,
  Truck,
  MessageSquare
} from "lucide-react";

const categories = [
  "All Apps",
  "Analytics", 
  "Marketing",
  "Inventory",
  "Accounting",
  "Customer Service",
  "Shipping",
  "Security"
];

const apps = [
  {
    id: 1,
    name: "QuickBooks Integration",
    developer: "Intuit",
    category: "Accounting",
    rating: 4.8,
    downloads: "50K+",
    price: "Free",
    description: "Seamlessly sync your POS data with QuickBooks for automated bookkeeping and financial reporting.",
    icon: Database,
    featured: true,
    verified: true
  },
  {
    id: 2,
    name: "Advanced Analytics Pro",
    developer: "PebblePay",
    category: "Analytics",
    rating: 4.9,
    downloads: "25K+",
    price: "$29/mo",
    description: "Deep dive into your sales data with advanced analytics, forecasting, and custom reporting tools.",
    icon: BarChart3,
    featured: true,
    verified: true
  },
  {
    id: 3,
    name: "Loyalty Rewards Hub",
    developer: "LoyaltyTech",
    category: "Marketing",
    rating: 4.7,
    downloads: "30K+",
    price: "$19/mo",
    description: "Build customer loyalty with points, rewards, and personalized marketing campaigns.",
    icon: Users,
    featured: false,
    verified: true
  },
  {
    id: 4,
    name: "Smart Inventory Manager",
    developer: "InventoryPro",
    category: "Inventory",
    rating: 4.6,
    downloads: "15K+",
    price: "$39/mo",
    description: "AI-powered inventory management with automatic reordering and demand forecasting.",
    icon: ShoppingCart,
    featured: false,
    verified: true
  },
  {
    id: 5,
    name: "Payment Gateway Plus",
    developer: "PaymentTech",
    category: "Security",
    rating: 4.9,
    downloads: "40K+",
    price: "Free",
    description: "Enhanced payment security with fraud detection and advanced encryption.",
    icon: CreditCard,
    featured: true,
    verified: true
  },
  {
    id: 6,
    name: "Appointment Scheduler",
    developer: "ScheduleApp",
    category: "Customer Service",
    rating: 4.5,
    downloads: "12K+",
    price: "$15/mo",
    description: "Manage appointments and bookings directly from your POS system.",
    icon: Calendar,
    featured: false,
    verified: true
  },
  {
    id: 7,
    name: "Email Marketing Suite",
    developer: "EmailPro",
    category: "Marketing",
    rating: 4.4,
    downloads: "8K+",
    price: "$25/mo",
    description: "Create and send targeted email campaigns based on customer purchase history.",
    icon: Mail,
    featured: false,
    verified: true
  },
  {
    id: 8,
    name: "Shipping Calculator",
    developer: "ShipFast",
    category: "Shipping",
    rating: 4.7,
    downloads: "20K+",
    price: "Free",
    description: "Real-time shipping rates and label printing for all major carriers.",
    icon: Truck,
    featured: false,
    verified: true
  },
  {
    id: 9,
    name: "Customer Support Chat",
    developer: "ChatSupport",
    category: "Customer Service",
    rating: 4.6,
    downloads: "18K+",
    price: "$35/mo",
    description: "Live chat support integration for immediate customer assistance.",
    icon: MessageSquare,
    featured: false,
    verified: true
  }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Apps");
  const [installedApps, setInstalledApps] = useState(new Set());

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Apps" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = filteredApps.filter(app => app.featured);
  const regularApps = filteredApps.filter(app => !app.featured);

  const handleInstall = (appId: number) => {
    const newInstalled = new Set(installedApps);
    if (newInstalled.has(appId)) {
      newInstalled.delete(appId);
    } else {
      newInstalled.add(appId);
    }
    setInstalledApps(newInstalled);
  };

  const AppCard = ({ app }: { app: typeof apps[0] }) => (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <app.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{app.name}</h3>
              {app.verified && (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{app.developer}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {app.category}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {app.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-accent fill-current" />
            <span>{app.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>{app.downloads}</span>
          </div>
        </div>
        <div className="text-sm font-semibold text-primary">
          {app.price}
        </div>
      </div>

      <Button
        onClick={() => handleInstall(app.id)}
        className={`w-full ${
          installedApps.has(app.id) 
            ? 'bg-success text-success-foreground hover:bg-success/90' 
            : 'btn-hero'
        }`}
      >
        {installedApps.has(app.id) ? 'Installed' : 'Install App'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              App <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Extend your POS capabilities with powerful integrations and apps designed for modern businesses.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-hero" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Featured Apps */}
          {featuredApps.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <Star className="h-6 w-6 text-accent mr-2" />
                Featured Apps
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}

          {/* All Apps */}
          {regularApps.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8">
                {selectedCategory === "All Apps" ? "All Apps" : `${selectedCategory} Apps`}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredApps.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No apps found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Marketplace;