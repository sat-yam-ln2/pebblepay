import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pebblepay.settings')
django.setup()

# Import models
from django.contrib.auth.models import User
from apps.authentication.models import Profile

# Create or update demo user
def create_demo_user():
    # Regular demo user
    user, created = User.objects.get_or_create(
        username='demo@pebblepay.com',
        email='demo@pebblepay.com',
        defaults={
            'first_name': 'Demo',
            'last_name': 'User',
            'is_staff': False
        }
    )
    
    # Set password only if newly created
    if created:
        user.set_password('demo123')
        user.save()
    else:
        # Update password for existing user
        user.set_password('demo123')
        user.save()
    
    # Update profile
    profile = Profile.objects.get(user=user)
    profile.company_name = 'Demo Company'
    profile.business_type = 'retail'
    profile.subscription_plan = 'premium'
    profile.phone_number = '555-DEMO-123'
    profile.save()
    
    print(f"{'Created' if created else 'Updated'} demo user: demo@pebblepay.com / demo123")

    # Create admin user if it doesn't exist
    admin_user, admin_created = User.objects.get_or_create(
        username='admin@pebblepay.com',
        email='admin@pebblepay.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if admin_created:
        admin_user.set_password('admin123')
        admin_user.save()
    else:
        admin_user.set_password('admin123')
        admin_user.save()
        
    admin_profile = Profile.objects.get(user=admin_user)
    admin_profile.company_name = 'PebblePay'
    admin_profile.subscription_plan = 'enterprise'
    admin_profile.save()
    
    print(f"{'Created' if admin_created else 'Updated'} admin user: admin@pebblepay.com / admin123")
    
if __name__ == "__main__":
    create_demo_user()