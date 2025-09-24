from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .views import (
    RegisterView,
    LoginView,
    RefreshTokenView,
    LogoutView,
    LogoutAllView,
    UserProfileView,
    PasswordChangeView,
    SupabaseAuthView
)

app_name = 'authentication'

@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    return Response({'message': 'Backend connected successfully!'})

urlpatterns = [
    # Test endpoint
    path('test/', test_connection, name='test'),
    
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout-all/', LogoutAllView.as_view(), name='logout_all'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
    
    # Supabase integration
    path('supabase-auth/', SupabaseAuthView.as_view(), name='supabase_auth'),
]