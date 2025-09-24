from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Profile
import re

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with profile information."""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    # Profile fields
    phone_number = serializers.CharField(required=False, allow_blank=True)
    company_name = serializers.CharField(required=False, allow_blank=True)
    business_type = serializers.ChoiceField(choices=Profile.BUSINESS_TYPE_CHOICES, default='retail')
    subscription_plan = serializers.ChoiceField(choices=Profile.SUBSCRIPTION_CHOICES, default='free')
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password_confirm',
                  'phone_number', 'company_name', 'business_type', 'subscription_plan')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate_email(self, value):
        """Validate email is unique and properly formatted."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Enter a valid email address.")
            
        return value
    
    def validate_password(self, value):
        """Validate password strength."""
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        
        # Additional password strength checks
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            
        return value
    
    def validate(self, attrs):
        """Validate that password and password_confirm match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """Create a new user with profile."""
        # Extract profile data
        profile_data = {
            'phone_number': validated_data.pop('phone_number', ''),
            'company_name': validated_data.pop('company_name', ''),
            'business_type': validated_data.pop('business_type', 'retail'),
            'subscription_plan': validated_data.pop('subscription_plan', 'free'),
        }
        
        # Remove password_confirm field
        validated_data.pop('password_confirm')
        
        # Create user
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Update profile
        profile = Profile.objects.get(user=user)
        for key, value in profile_data.items():
            setattr(profile, key, value)
        profile.save()
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    
    class Meta:
        model = Profile
        fields = ('username', 'email', 'first_name', 'last_name', 'phone_number', 
                  'company_name', 'business_type', 'subscription_plan', 'avatar')
        read_only_fields = ('username',)
    
    def update(self, instance, validated_data):
        """Update user and profile data."""
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        user = instance.user
        if 'email' in user_data:
            # Check email uniqueness if changed
            new_email = user_data.get('email')
            if new_email != user.email and User.objects.filter(email=new_email).exists():
                raise serializers.ValidationError({"email": "A user with this email already exists."})
            user.email = new_email
            
        if 'first_name' in user_data:
            user.first_name = user_data.get('first_name')
        if 'last_name' in user_data:
            user.last_name = user_data.get('last_name')
        user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    current_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    
    def validate_current_password(self, value):
        """Validate current password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
    
    def validate_new_password(self, value):
        """Validate new password strength."""
        try:
            validate_password(value, self.context['request'].user)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        
        # Additional password strength checks
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            
        return value
    
    def validate(self, attrs):
        """Validate that new_password and confirm_password match."""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        return attrs