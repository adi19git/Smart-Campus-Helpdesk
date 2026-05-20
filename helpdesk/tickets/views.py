"""
Views for the tickets app.

Provides:
- CustomTokenObtainPairView — JWT login with custom claims
- RegisterView — User self-registration
- UserProfileView — Get current authenticated user info
- TicketViewSet — Full CRUD for support tickets with role-based access
"""

import logging

from django.contrib.auth.models import User
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Ticket
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    TicketSerializer,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Authentication Views
# ---------------------------------------------------------------------------

class CustomTokenObtainPairView(TokenObtainPairView):
    """JWT login endpoint that returns tokens with custom claims (username, is_staff)."""

    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    Public registration endpoint.
    
    POST /api/register/
    Body: { "username": "...", "email": "...", "password": "...", "password_confirm": "..." }
    
    Creates a new user with hashed password and returns success message.
    """

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    # Exempt from global throttle — use stricter anonymous rate limit
    throttle_scope = 'anon'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        logger.info("New user registered: %s", user.username)

        return Response(
            {
                "message": "Account created successfully. You can now log in.",
                "username": user.username,
            },
            status=status.HTTP_201_CREATED,
        )


class UserProfileView(generics.RetrieveAPIView):
    """
    Returns the authenticated user's profile information.
    
    GET /api/me/
    Requires: Bearer token
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "date_joined": user.date_joined,
        })


# ---------------------------------------------------------------------------
# Permissions
# ---------------------------------------------------------------------------

class IsAdminOrOwner(permissions.BasePermission):
    """Allow access if user is admin (is_staff) or the ticket owner."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user


# ---------------------------------------------------------------------------
# Ticket ViewSet
# ---------------------------------------------------------------------------

class TicketViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for support tickets.
    
    Access control:
    - Admin (is_staff): Can view all tickets, update status, delete
    - Student: Can view own tickets, create tickets, rate closed tickets
    
    Features:
    - Filtering by category and status
    - Full-text search on title and description
    - Ordering by priority and creation date
    - Response caching (60s) per user + query params
    """

    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    # Filtering, search, and ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Admin sees all tickets; students see only their own."""
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all().order_by('-created_at')
        return Ticket.objects.filter(user=user).order_by('-created_at')

    # ---------- LIST (with cache key that includes query params) ----------
    def list(self, request, *args, **kwargs):
        # Build cache key from user ID + all query parameters
        query_string = request.META.get('QUERY_STRING', '')
        cache_key = f"ticket_list_{request.user.id}_{query_string}"

        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            cache.set(cache_key, response.data, timeout=60)
            return response

        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=60)
        return Response(serializer.data)

    # ---------- CREATE ----------
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save(user=request.user)

        logger.info(
            "Ticket #%d created by %s: %s",
            ticket.id, request.user.username, ticket.title,
        )

        # Invalidate all ticket list caches
        cache.clear()

        return Response(
            {
                "message": "Ticket created successfully",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    # ---------- PARTIAL UPDATE (status, rating, or review) ----------
    def partial_update(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Non-staff users can only update rating/review on closed tickets
        if not request.user.is_staff:
            allowed_keys = {'rating', 'review'}
            request_keys = set(request.data.keys())

            if not request_keys.issubset(allowed_keys):
                return Response(
                    {"error": "Students can only update the ticket rating and review."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if ticket.status != 'closed':
                return Response(
                    {"error": "You can only rate or review a closed ticket."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # Prevent overwriting an existing rating (review once only)
            if ticket.rating is not None and 'rating' in request.data:
                return Response(
                    {"error": "You have already submitted a rating for this ticket."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info("Ticket #%d updated by %s", ticket.id, request.user.username)

        cache.clear()

        return Response({
            "message": "Ticket updated successfully",
            "data": serializer.data,
        })

    # ---------- DELETE ----------
    def destroy(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Only admin can delete tickets
        if not request.user.is_staff:
            return Response(
                {"error": "Only admin can delete tickets."},
                status=status.HTTP_403_FORBIDDEN,
            )

        ticket_id = ticket.id
        ticket.delete()

        logger.info("Ticket #%d deleted by %s", ticket_id, request.user.username)

        cache.clear()

        return Response(
            {"message": "Ticket deleted successfully."},
            status=status.HTTP_200_OK,
        )