from django.contrib import admin
from .models import SalesMetric, DashboardWidget
from django.utils import timezone

@admin.register(SalesMetric)
class SalesMetricAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sales', 'total_orders', 'total_customers', 'average_order_value', 'top_product')
    list_filter = ('date',)
    search_fields = ('date', 'top_product')
    readonly_fields = ('date', 'total_sales', 'total_orders', 'total_customers', 'average_order_value', 'top_product')
    date_hierarchy = 'date'
    actions = ['recalculate_metrics', 'calculate_today_metrics']
    
    def has_add_permission(self, request):
        return False  # Prevent manual creation
    
    def recalculate_metrics(self, request, queryset):
        for metric in queryset:
            SalesMetric.calculate_for_date(metric.date)
        self.message_user(request, f"Recalculated metrics for {queryset.count()} dates")
    recalculate_metrics.short_description = "Recalculate selected metrics"
    
    def calculate_today_metrics(self, request, queryset):
        today = timezone.now().date()
        SalesMetric.calculate_for_date(today)
        self.message_user(request, "Calculated metrics for today")
    calculate_today_metrics.short_description = "Calculate today's metrics"

@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    list_display = ('widget_type', 'user', 'position', 'is_visible', 'created_at')
    list_filter = ('widget_type', 'is_visible', 'user')
    search_fields = ('user__username', 'widget_type')
    actions = ['make_visible', 'make_invisible']
    
    def make_visible(self, request, queryset):
        queryset.update(is_visible=True)
    make_visible.short_description = "Make selected widgets visible"
    
    def make_invisible(self, request, queryset):
        queryset.update(is_visible=False)
    make_invisible.short_description = "Make selected widgets invisible"
