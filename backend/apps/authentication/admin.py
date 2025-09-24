from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_company_name', 'get_subscription', 'is_staff')
    list_filter = BaseUserAdmin.list_filter + ('profile__subscription_plan', 'profile__business_type')
    search_fields = BaseUserAdmin.search_fields + ('profile__company_name', 'profile__phone_number')
    
    def get_company_name(self, obj):
        return obj.profile.company_name if hasattr(obj, 'profile') else ''
    get_company_name.short_description = 'Company'
    
    def get_subscription(self, obj):
        return obj.profile.subscription_plan if hasattr(obj, 'profile') else ''
    get_subscription.short_description = 'Subscription'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
