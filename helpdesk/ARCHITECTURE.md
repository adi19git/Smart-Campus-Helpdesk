# System Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                   http://localhost:3000                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Port 3000)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Components: Login, Dashboard, CreateTicket, TicketDetail  │ │
│  │  State: Context API (Authentication)                      │ │
│  │  HTTP Client: Axios with JWT Interceptors                │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                        API Calls (JSON)
                        JWT Tokens (Bearer)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               DJANGO REST API (Port 8000)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authentication: JWT Token (SimpleJWT)                    │ │
│  │  Routes:                                                  │ │
│  │    POST   /api/token/         - Login                    │ │
│  │    POST   /api/token/refresh/ - Refresh Token           │ │
│  │    GET    /tickets/           - List Tickets            │ │
│  │    POST   /tickets/           - Create Ticket           │ │
│  │    GET    /tickets/{id}/      - Get Detail              │ │
│  │    PATCH  /tickets/{id}/      - Update (Admin)          │ │
│  │    DELETE /tickets/{id}/      - Delete (Admin)          │ │
│  │                                                          │ │
│  │  Middleware: CORS, Authentication, Permissions          │ │
│  │  Caching: In-memory cache (60s)                           │   │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                          Django ORM
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite/PostgreSQL)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Tables:                                                  │ │
│  │    - auth_user (Django User Model)                       │ │
│  │    - tickets_ticket (Custom Ticket Model)                │ │
│  │    - Other Django tables (sessions, permissions, etc.)   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
1. USER ENTERS CREDENTIALS
   ↓
2. REACT SENDS POST /api/token/ {username, password}
   ↓
3. DJANGO VERIFIES CREDENTIALS & RETURNS JWT TOKENS
   {access: "eyJ...", refresh: "eyJ..."}
   ↓
4. REACT STORES TOKENS IN LOCALSTORAGE
   ↓
5. REACT INCLUDES ACCESS TOKEN IN HEADER FOR SUBSEQUENT REQUESTS
   Authorization: Bearer eyJ...
   ↓
6. DJANGO VALIDATES TOKEN & PROCESSES REQUEST
   ↓
7. IF TOKEN EXPIRED, REACT USES REFRESH TOKEN TO GET NEW ACCESS TOKEN
   ↓
8. IF REFRESH FAILS, REDIRECT TO LOGIN
```

---

## Request/Response Cycle

### Example: Create Ticket

```
FRONTEND (React)                     BACKEND (Django)
    │                                      │
    ├─ Click "Create Ticket" button        │
    │                                      │
    ├─ User fills form & submits           │
    │                                      │
    ├─ POST /tickets/                      │
    │  {                                   │
    │    "title": "Network down",          │
    │    "description": "WiFi not working",│
    │    "category": "network",            │
    │    "priority": "high"                │
    │  }                                   │
    ├─ + Authorization: Bearer TOKEN ─────>│
    │                                      ├─ Check auth (JWT)
    │                                      │
    │                                      ├─ Validate data
    │                                      │
    │                                      ├─ Save to database
    │                                      │
    │                                      ├─ Clear cache
    │                                      │
    │  201 Created                         │
    │  {                                   │
    │    "message": "Ticket created",      │
    │    "data": {                         │
    │      "id": 1,                        │
    │      "title": "...",                 │
    │      "user": "john_doe",             │
    │      "created_at": "2024-04-30",     │
    │      ...                             │
    │    }                                 │
    │  } <─────────────────────────────────┤
    │                                      │
    ├─ Show success message                │
    │                                      │
    ├─ Redirect to dashboard               │
    │                                      │
```

---

## Component Hierarchy

```
App.js (Router)
│
├── AuthProvider (Context)
│
├── ProtectedRoute Wrapper
│   │
│   ├── LoginPage
│   │   └── POST /api/token/
│   │
│   ├── DashboardPage
│   │   ├── FilterBar Component
│   │   ├── TicketList Component
│   │   │   └── StatusBadge, PriorityBadge, CategoryBadge
│   │   ├── StatCard Component (multiple)
│   │   └── GET /tickets/ (with filters)
│   │
│   ├── CreateTicketPage
│   │   └── POST /tickets/
│   │
│   └── TicketDetailPage
│       ├── GET /tickets/{id}/
│       ├── PATCH /tickets/{id}/ (status update)
│       └── Child Components (StatusBadge, PriorityBadge)
│
└── useAuth Hook (provides authentication context)
```

---

## Data Model

### Ticket Model
```
Ticket
├── id (Integer, Auto-increment Primary Key)
├── user (ForeignKey → User)
├── title (CharField, max_length=200)
├── description (TextField)
├── category (CharField)
│   ├── 'classroom'
│   ├── 'hostel'
│   └── 'network'
├── priority (CharField)
│   ├── 'low'
│   ├── 'medium'
│   └── 'high'
├── status (CharField, default='open')
│   ├── 'open'
│   ├── 'in-progress'
│   └── 'closed'
├── created_at (DateTimeField, auto_now_add=True)
└── updated_at (DateTimeField, auto_now=True)
```

### User Model (Django Built-in)
```
User
├── id
├── username
├── password (hashed)
├── email
├── first_name
├── last_name
├── is_staff (Admin indicator)
├── is_active
├── date_joined
└── ... (other Django user fields)
```

---

## Permission Model

```
┌─────────────────────────────────────────────────────┐
│              Permission Levels                      │
└─────────────────────────────────────────────────────┘

Anonymous User (Not Logged In)
├── ❌ View tickets
├── ❌ Create tickets
└── ❌ Update/Delete (redirected to login)

Regular User (Student)
├── ✅ View own tickets
├── ✅ Create new tickets
├── ✅ View own ticket details
├── ❌ Update any ticket
├── ❌ Delete any ticket
└── ❌ Change ticket status

Admin User (Staff)
├── ✅ View all tickets
├── ✅ Create tickets
├── ✅ Update all tickets (especially status)
├── ✅ Delete tickets
├── ✅ Change ticket status
├── ✅ Access admin panel (/admin/)
└── ✅ Manage users
```

---

## Caching Strategy

```
GET /tickets/ Request
    ↓
Check Cache (60-second TTL)
    ├─ Cache Hit → Return cached data immediately
    │  (Fast response: ~1ms)
    │
    └─ Cache Miss → Query database
       ↓
       Fetch from DB
       ↓
       Cache result for 60 seconds
       ↓
       Return to client
       (Normal response: ~100ms)

Cache Invalidation (on write operations):
    └─ POST/PUT/PATCH/DELETE → Clear all cache
       └─ Next GET request will fetch fresh data
```

---

## Error Handling Flow

```
Frontend Request
    ↓
Backend Processing
    ├─ Status 200-299 ✅
    │  └─ Display data/success message
    │
    ├─ Status 400-499 ⚠️ (Client Error)
    │  ├─ 400 Bad Request (Validation error)
    │  ├─ 401 Unauthorized (Invalid token)
    │  │   └─ Try refresh token
    │  │   └─ If fails → Redirect to login
    │  ├─ 403 Forbidden (Permission denied)
    │  └─ 404 Not Found
    │  └─ Display error message to user
    │
    └─ Status 500+ ❌ (Server Error)
       └─ Log error, show generic message
```

---

## API Response Examples

### Login Response (200)
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ticket Creation Response (201)
```json
{
  "message": "Ticket created successfully",
  "data": {
    "id": 5,
    "user": "john_doe",
    "title": "Network Issue",
    "description": "WiFi not working in classroom",
    "category": "network",
    "priority": "high",
    "status": "open",
    "created_at": "2024-04-30T10:30:00Z",
    "updated_at": "2024-04-30T10:30:00Z"
  }
}
```

### List Tickets Response (200)
```json
{
  "count": 25,
  "next": "http://localhost:8000/tickets/?page=2",
  "previous": null,
  "results": [
    {
      "id": 5,
      "user": "john_doe",
      "title": "Network Issue",
      ...
    },
    ...
  ]
}
```

### Error Response (400)
```json
{
  "title": ["This field is required."],
  "description": ["This field is required."]
}
```

---

## Performance Metrics

| Operation | Expected Time |
|-----------|---------------|
| Login | 200-500ms |
| List Tickets (cached) | 1-5ms |
| List Tickets (DB query) | 50-150ms |
| Create Ticket | 100-300ms |
| Update Ticket | 100-300ms |
| View Ticket Detail | 50-150ms |

---

## Security Measures

✅ JWT Token-based authentication (expires in 60 minutes)
✅ Refresh token for extended sessions (24 hours)
✅ CORS protection (only allow localhost:3000)
✅ CSRF protection (Django middleware)
✅ Permission-based access control
✅ Admin-only operations protected
✅ User-scoped ticket visibility
✅ Password hashing (PBKDF2)
✅ HTTPS ready (configure in production)

---

## Deployment Checklist

- [ ] Set DEBUG=False in settings.py
- [ ] Configure ALLOWED_HOSTS
- [ ] Update CORS_ALLOWED_ORIGINS
- [ ] Use environment variables for SECRET_KEY
- [ ] Configure PostgreSQL for production
- [ ] Set up HTTPS/SSL
- [ ] Configure static files serving
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Enable rate limiting
- [ ] Test all features in production mode
- [ ] Set up monitoring and alerts
