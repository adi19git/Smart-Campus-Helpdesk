"""
Management command to seed demo users (admin + student).

Usage:
    python manage.py seed_users

Reads passwords from environment variables:
    ADMIN_PASSWORD   — defaults to 'Admin@2026!'
    STUDENT_PASSWORD — defaults to 'Student@2026!'

Idempotent: safe to run multiple times. Existing users are updated
(password re-hashed, flags corrected) rather than duplicated.
"""

import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update demo admin and student users."

    def handle(self, *args, **options):
        admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@2026!")
        student_password = os.environ.get("STUDENT_PASSWORD", "Student@2026!")

        # ── Admin user ────────────────────────────────────────────────
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@campus.edu",
                "is_staff": True,
                "is_superuser": True,
                "first_name": "Admin",
                "last_name": "User",
            },
        )
        admin.set_password(admin_password)
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} admin user: admin"))

        # ── Student user ──────────────────────────────────────────────
        student, created = User.objects.get_or_create(
            username="student1",
            defaults={
                "email": "student1@campus.edu",
                "is_staff": False,
                "is_superuser": False,
                "first_name": "Student",
                "last_name": "One",
            },
        )
        student.set_password(student_password)
        student.save()

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} student user: student1"))

        self.stdout.write(self.style.SUCCESS("Demo users ready."))
