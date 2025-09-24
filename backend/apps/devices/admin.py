from django.contrib import admin
from .models import Device, Feature, DeviceImage

class DeviceImageInline(admin.TabularInline):
    model = DeviceImage
    extra = 3
    fields = ('image', 'alt_text', 'display_order')

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name', 'description')

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_type', 'price', 'is_available', 'created_at')
    list_filter = ('model_type', 'is_available', 'features')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [DeviceImageInline]
    filter_horizontal = ('features',)
    actions = ['make_available', 'make_unavailable']
    
    def make_available(self, request, queryset):
        queryset.update(is_available=True)
    make_available.short_description = "Mark selected devices as available"
    
    def make_unavailable(self, request, queryset):
        queryset.update(is_available=False)
    make_unavailable.short_description = "Mark selected devices as unavailable"
