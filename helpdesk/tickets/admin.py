"""
Django admin configuration for the tickets app.
"""

from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Enhanced admin interface for managing support tickets."""

    list_display = (
        'id', 'title', 'user', 'category', 'priority',
        'status', 'rating', 'created_at', 'updated_at',
    )
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    list_editable = ('status', 'priority')
    list_per_page = 25
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Ticket Info', {
            'fields': ('title', 'description', 'user'),
        }),
        ('Classification', {
            'fields': ('category', 'priority', 'status'),
        }),
        ('Feedback', {
            'fields': ('rating',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )