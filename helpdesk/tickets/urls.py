from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

# Router automatically creates all CRUD routes
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='tickets')

urlpatterns = [
    path('', include(router.urls)),
]