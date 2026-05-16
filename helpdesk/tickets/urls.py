"""
URL configuration for the tickets app.

Provides:
- /tickets/         — CRUD via router (list, create, retrieve, update, delete)
- /register/        — User self-registration
- /me/              — Authenticated user profile
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import RegisterView, TicketViewSet, UserProfileView

# Router automatically creates all CRUD routes for tickets
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='tickets')

urlpatterns = [
    # Ticket CRUD
    path('', include(router.urls)),

    # Auth endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
]