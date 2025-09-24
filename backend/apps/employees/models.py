from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone

class Department(models.Model):
    """
    Department model for organizing employees.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # The manager field will be added after Employee model is defined
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Employee(models.Model):
    """
    Employee model extending User with additional work-related information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    permissions = models.JSONField(default=dict, help_text="Role-based access control permissions")
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.position}"
    
    def years_of_service(self):
        """Calculate years of service based on hire date."""
        if not self.hire_date:
            return 0
        today = timezone.now().date()
        delta = today - self.hire_date
        return round(delta.days / 365.25, 1)
    
    def can_access_feature(self, feature_name):
        """Check if employee has permission to access a specific feature."""
        if not self.permissions:
            return False
        
        # Check permissions for the feature
        return self.permissions.get(feature_name, False)
    
    class Meta:
        ordering = ['user__last_name', 'user__first_name']

# Update Department model to include the manager field
Department.add_to_class('manager', models.ForeignKey(
    Employee, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True, 
    related_name='managed_departments'
))
