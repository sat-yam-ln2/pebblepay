import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign,
  ShoppingCart,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Phone,
  Mail,
  User,
  Tag
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const salesData = [
  { month: 'Jan', sales: 12400, transactions: 234 },
  { month: 'Feb', sales: 15600, transactions: 289 },
  { month: 'Mar', sales: 18200, transactions: 342 },
  { month: 'Apr', sales: 16800, transactions: 318 },
  { month: 'May', sales: 21500, transactions: 398 },
  { month: 'Jun', sales: 25300, transactions: 456 }
];

const categoryData = [
  { name: 'Food & Beverage', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Electronics', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Apparel', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Books', value: 10, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 10, color: 'hsl(var(--chart-5))' }
];

const recentTransactions = [
  { id: '1', customer: 'Sarah Johnson', amount: 45.99, items: 3, time: '2 minutes ago', status: 'completed' },
  { id: '2', customer: 'Mike Chen', amount: 128.50, items: 7, time: '5 minutes ago', status: 'completed' },
  { id: '3', customer: 'Emily Davis', amount: 23.75, items: 2, time: '8 minutes ago', status: 'completed' },
  { id: '4', customer: 'Alex Rodriguez', amount: 89.99, items: 4, time: '12 minutes ago', status: 'completed' },
  { id: '5', customer: 'Lisa Wong', amount: 156.25, items: 9, time: '15 minutes ago', status: 'completed' }
];

const topProducts = [
  { name: 'Premium Coffee Blend', sales: 145, revenue: 2175, trend: 12 },
  { name: 'Wireless Headphones', sales: 89, revenue: 8900, trend: -3 },
  { name: 'Organic Tea Set', sales: 76, revenue: 1520, trend: 8 },
  { name: 'Smartphone Case', sales: 67, revenue: 1340, trend: 15 },
  { name: 'Artisan Chocolate', sales: 54, revenue: 810, trend: -1 }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await authService.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "There was a problem loading your profile information."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [toast]);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    
    const firstInitial = user.email ? user.email[0] : "";
    return firstInitial.toUpperCase();
  };
  
  // Check if this is the demo account
  const isDemo = user?.email === "demo@pebblepay.com";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Dashboard Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={profile?.avatar || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Welcome{user?.email ? `, ${user.email}` : " back"}!
                </h1>
                <p className="text-muted-foreground">
                  {isDemo ? "Demo account - Explore your business metrics below" : "Here's your business overview"}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              {isDemo && (
                <Badge variant="secondary" className="font-medium text-xs">
                  DEMO MODE
                </Badge>
              )}
              <Badge variant="secondary" className="font-metric">
                Live Data
              </Badge>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </div>

          {/* User Profile Card - Only show for demo account */}
          {isDemo && (
            <Card className="card-feature mb-8 border-dashed border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-accent" />
                  Demo Account Information
                </CardTitle>
                <CardDescription>
                  You are currently viewing the application as a demo user with premium features enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email Address</div>
                        <div className="font-medium">demo@pebblepay.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Company</div>
                        <div className="font-medium">{profile?.company_name || "Demo Company"}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{profile?.phone_number || "555-DEMO-123"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Subscription Plan</div>
                        <div className="font-medium">
                          <span className="bg-accent/20 text-accent px-2 py-1 rounded-md font-semibold">
                            {profile?.subscription_plan?.toUpperCase() || "PREMIUM"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Business Type</div>
                        <div className="font-medium capitalize">{profile?.business_type || "Retail"}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Connected Devices</div>
                        <div className="font-medium">3 active devices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-feature">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-metric">$25,347</div>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.3% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="card-feature">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-metric">1,247</div>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="card-feature">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-metric">$52.18</div>
                <div className="flex items-center text-xs text-destructive">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -2.4% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="card-feature">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-metric">892</div>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5.7% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Trend */}
            <Card className="lg:col-span-2 card-feature">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card className="card-feature">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="font-metric">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <Card className="card-feature">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium">{transaction.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.items} items • {transaction.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">${transaction.amount}</div>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="card-feature">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Top Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sales • ${product.revenue}
                        </div>
                      </div>
                      <div className={`flex items-center text-sm ${
                        product.trend >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {product.trend >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(product.trend)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;