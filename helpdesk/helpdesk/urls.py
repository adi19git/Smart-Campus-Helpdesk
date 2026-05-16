"""
URL configuration for helpdesk project.

Routes:
- /admin/              — Django admin panel
- /api/token/          — JWT login (custom claims)
- /api/token/refresh/  — JWT token refresh
- /api/register/       — User self-registration
- /api/me/             — Authenticated user profile
- /api/tickets/        — Ticket CRUD (via router)
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from tickets.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # All ticket app routes (tickets CRUD, register, profile) under /api/
    path('api/', include('tickets.urls')),
]
