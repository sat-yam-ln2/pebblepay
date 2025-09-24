"""
URL configuration for pebblepay project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

# Simple API status view for the root URL
@csrf_exempt
def api_home(request):
    return JsonResponse({
        'status': 'online',
        'message': 'PebblePay API is running',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/',
            'devices': '/api/devices/',
            'marketplace': '/api/marketplace/',
            'orders': '/api/orders/',
            'inventory': '/api/inventory/',
            'analytics': '/api/analytics/',
            'employees': '/api/employees/'
        }
    })

urlpatterns = [
    # Root URL returns API status
    path('', api_home, name='api_home'),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.authentication.urls')),
    path('api/devices/', include('apps.devices.urls')),
    path('api/marketplace/', include('apps.marketplace.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/employees/', include('apps.employees.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
