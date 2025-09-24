from django.contrib import admin
from .models import Category, App, AppReview, AppInstallation

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

class AppReviewInline(admin.TabularInline):
    model = AppReview
    extra = 0
    readonly_fields = ('user', 'rating', 'comment', 'created_at')
    can_delete = False
    max_num = 0

class AppInstallationInline(admin.TabularInline):
    model = AppInstallation
    extra = 0
    readonly_fields = ('user', 'installed_at', 'is_active')
    can_delete = False
    max_num = 0

@admin.register(App)
class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'developer', 'version', 'price', 'rating', 'downloads_count', 'is_featured', 'is_active')
    list_filter = ('category', 'is_featured', 'is_active')
    search_fields = ('name', 'description', 'developer')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('downloads_count', 'rating')
    inlines = [AppReviewInline, AppInstallationInline]
    actions = ['make_featured', 'make_unfeatured', 'make_active', 'make_inactive']
    
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
    make_featured.short_description = "Mark selected apps as featured"
    
    def make_unfeatured(self, request, queryset):
        queryset.update(is_featured=False)
    make_unfeatured.short_description = "Unmark selected apps as featured"
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
    make_active.short_description = "Mark selected apps as active"
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
    make_inactive.short_description = "Mark selected apps as inactive"

@admin.register(AppReview)
class AppReviewAdmin(admin.ModelAdmin):
    list_display = ('app', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('app__name', 'user__username', 'comment')
    readonly_fields = ('created_at',)
