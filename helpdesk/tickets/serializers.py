"""
Serializers for the tickets app.

Handles:
- Ticket CRUD serialization with field validation
- JWT token customization (adds username + is_staff claims)
- User registration with password hashing
"""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for Ticket model with read-only user field and rating/review validation."""

    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Ticket
        fields = '__all__'

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5."""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )
        return value

    def validate_review(self, value):
        """Trim whitespace and cap review length at 2000 characters."""
        value = value.strip()
        if len(value) > 2000:
            raise serializers.ValidationError(
                "Review must be 2000 characters or fewer."
            )
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Extends JWT token to include username and role information."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims embedded in the JWT payload
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    Validates username uniqueness, password strength, and password confirmation.
    Uses Django's built-in password hashing via create_user().
    """

    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=150,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this username already exists."
            )
        ],
    )
    email = serializers.EmailField(
        required=False,
        allow_blank=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="A user with this email already exists."
            )
        ],
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')

    def validate(self, attrs):
        """Ensure both passwords match."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        """Create user with hashed password using Django's create_user()."""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user