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
        'status', 'rating', 'short_review', 'created_at', 'updated_at',
    )
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('title', 'description', 'user__username', 'review')
    list_editable = ('status', 'priority')
    list_per_page = 25
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    def short_review(self, obj):
        if obj.review:
            return obj.review[:50] + '...' if len(obj.review) > 50 else obj.review
        return '—'
    short_review.short_description = 'Review'

    fieldsets = (
        ('Ticket Info', {
            'fields': ('title', 'description', 'user'),
        }),
        ('Classification', {
            'fields': ('category', 'priority', 'status'),
        }),
        ('Student Feedback', {
            'fields': ('rating', 'review'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )