from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.core.cache import cache

from .models import Ticket
from .serializers import TicketSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ----------- Custom Permission -----------
class IsAdminOrOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user


# ----------- Main ViewSet -----------
class TicketViewSet(viewsets.ModelViewSet):

    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    # FILTERING + SEARCH + ORDERING
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']
    ordering = ['-created_at']


    # ---------- QUERYSET CONTROL ----------
    def get_queryset(self):
        user = self.request.user

        # Admin can see all tickets
        if user.is_staff:
            return Ticket.objects.all().order_by('-created_at')

        # Student can see only his tickets
        return Ticket.objects.filter(user=user).order_by('-created_at')


    # ---------- LIST (CACHED) ----------
    def list(self, request, *args, **kwargs):
        cache_key = f"ticket_list_{request.user.id}"

        # 1️⃣ Check cache first
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        # 2️⃣ Fetch from DB if not cached
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)

            # store in cache for 60 seconds
            cache.set(cache_key, response.data, timeout=60)
            return response

        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=60)
        return Response(serializer.data)


    # ---------- CREATE TICKET ----------
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(user=request.user)

        # clear cache
        cache.clear()

        return Response({
            "message": "Ticket created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


    # ---------- UPDATE (STATUS OR RATING) ----------
    def partial_update(self, request, *args, **kwargs):
        ticket = self.get_object()

        # If user is not staff, they can only update rating for closed tickets
        if not request.user.is_staff:
            allowed_keys = {'rating'}
            request_keys = set(request.data.keys())
            
            if not request_keys.issubset(allowed_keys):
                return Response(
                    {"error": "Students can only update the ticket rating."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if ticket.status != 'closed':
                return Response(
                    {"error": "You can only rate a closed ticket."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # clear cache
        cache.clear()

        return Response({
            "message": "Ticket updated successfully",
            "data": serializer.data
        })


    # ---------- DELETE ----------
    def destroy(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Only admin allowed
        if not request.user.is_staff:
            return Response(
                {"error": "Only admin can delete tickets"},
                status=status.HTTP_403_FORBIDDEN
            )

        ticket.delete()

        # clear cache
        cache.clear()

        return Response({"message": "Ticket deleted successfully"})