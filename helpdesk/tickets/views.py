from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Ticket
from .serializers import TicketSerializer


# ----------- Custom Permission -----------
class IsAdminOrOwner(permissions.BasePermission):
    """
    Student: can access only his own tickets
    Admin: can access all tickets
    """

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

    # ---------- CREATE TICKET ----------
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # assign logged-in user automatically
        serializer.save(user=request.user)

        return Response({
            "message": "Ticket created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    # ---------- UPDATE (STATUS CHANGE) ----------
    def partial_update(self, request, *args, **kwargs):
        ticket = self.get_object()

        # Only admin can change status
        if not request.user.is_staff:
            return Response(
                {"error": "Only admin can update ticket status"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

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
        return Response({"message": "Ticket deleted successfully"})