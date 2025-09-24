from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from apps.orders.models import Order, OrderItem
from apps.inventory.models import Product

class SalesMetric(models.Model):
    """
    Model to store daily sales metrics for analytics.
    """
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.PositiveIntegerField(default=0)
    total_customers = models.PositiveIntegerField(default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    top_product = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"Sales Metrics for {self.date}"
    
    @classmethod
    def calculate_for_date(cls, date=None):
        """Calculate and store metrics for a specific date."""
        if date is None:
            date = timezone.now().date()
        
        # Get orders for the date
        orders = Order.objects.filter(created_at__date=date)
        
        # Calculate metrics
        total_sales = orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = orders.count()
        
        # Count unique customers
        user_orders = orders.exclude(user=None).values('user').distinct().count()
        guest_orders = orders.exclude(customer=None).values('customer').distinct().count()
        total_customers = user_orders + guest_orders
        
        # Calculate average order value
        average_order_value = total_sales / total_orders if total_orders > 0 else 0
        
        # Find top product
        top_product_data = OrderItem.objects.filter(
            order__in=orders
        ).values('product_name').annotate(
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity').first()
        
        top_product = top_product_data['product_name'] if top_product_data else None
        
        # Create or update the metrics record
        metrics, created = cls.objects.update_or_create(
            date=date,
            defaults={
                'total_sales': total_sales,
                'total_orders': total_orders,
                'total_customers': total_customers,
                'average_order_value': average_order_value,
                'top_product': top_product,
            }
        )
        
        return metrics
    
    @classmethod
    def calculate_for_period(cls, start_date, end_date=None):
        """Calculate metrics for each day in a date range."""
        if end_date is None:
            end_date = timezone.now().date()
        
        current_date = start_date
        metrics_list = []
        
        while current_date <= end_date:
            metrics = cls.calculate_for_date(current_date)
            metrics_list.append(metrics)
            current_date += timezone.timedelta(days=1)
        
        return metrics_list
    
    class Meta:
        ordering = ['-date']
        verbose_name = "Sales Metric"
        verbose_name_plural = "Sales Metrics"

class DashboardWidget(models.Model):
    """
    Customizable dashboard widgets for users.
    """
    WIDGET_CHOICES = (
        ('sales_summary', 'Sales Summary'),
        ('recent_orders', 'Recent Orders'),
        ('low_stock', 'Low Stock Products'),
        ('top_products', 'Top Selling Products'),
        ('revenue_chart', 'Revenue Chart'),
        ('customer_map', 'Customer Map'),
        ('quick_stats', 'Quick Stats'),
        ('activity_feed', 'Activity Feed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboard_widgets')
    widget_type = models.CharField(max_length=50, choices=WIDGET_CHOICES)
    position = models.PositiveSmallIntegerField(default=0)
    settings = models.JSONField(default=dict, blank=True, null=True, help_text="Widget configuration settings")
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.get_widget_type_display()} for {self.user.username}"
    
    class Meta:
        ordering = ['position']
        unique_together = ('user', 'widget_type')
        verbose_name = "Dashboard Widget"
        verbose_name_plural = "Dashboard Widgets"
