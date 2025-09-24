from django.contrib import admin
from .models import Department, Employee

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_manager_name', 'get_employee_count')
    search_fields = ('name', 'description')
    
    def get_manager_name(self, obj):
        if hasattr(obj, 'manager') and obj.manager:
            return f"{obj.manager.user.first_name} {obj.manager.user.last_name}"
        return "No manager assigned"
    get_manager_name.short_description = 'Manager'
    
    def get_employee_count(self, obj):
        return obj.employees.count()
    get_employee_count.short_description = 'Employee Count'

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'get_full_name', 'position', 'department', 'hire_date', 'years_of_service', 'is_active')
    list_filter = ('is_active', 'department', 'hire_date')
    search_fields = ('user__first_name', 'user__last_name', 'employee_id', 'position')
    readonly_fields = ('years_of_service',)
    actions = ['activate_employees', 'deactivate_employees']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_full_name.short_description = 'Name'
    
    def years_of_service(self, obj):
        return obj.years_of_service()
    years_of_service.short_description = 'Years of Service'
    
    def activate_employees(self, request, queryset):
        queryset.update(is_active=True)
    activate_employees.short_description = "Mark selected employees as active"
    
    def deactivate_employees(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_employees.short_description = "Mark selected employees as inactive"
