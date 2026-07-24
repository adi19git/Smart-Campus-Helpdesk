# Smart Campus Helpdesk

A full-stack helpdesk management system for university campuses, built with Django and React.

## Features

- **JWT Authentication**: Secure login and token management.
- **Role-Based Access**: Admin and Student dashboards.
- **Ticket Management**: Create, track, and manage support requests.
- **Real-time Stats**: Dashboard with ticket volume and resolution metrics.
- **Filtering & Search**: Advanced search and filtering by category and status.
- **Interactive Ratings**: Student feedback system with animated ratings.

## Tech Stack

- **Backend**: Django, Django REST Framework, SimpleJWT, PostgreSQL.
- **Frontend**: React, Framer Motion, Tailwind CSS, Axios.
- **Deployment**: Backend on Render, Frontend on Vercel.

## Setup

### Backend
1. Create a virtual environment: `python -m venv env`
2. Activate: `env\Scripts\activate` (Windows) or `source env/bin/activate` (Linux/Mac)
3. Install dependencies: `pip install -r helpdesk/requirements.txt`
4. Run migrations: `cd helpdesk && python manage.py migrate`
5. Seed demo users: `python manage.py seed_users`
6. Start: `python manage.py runserver`

### Frontend
1. `cd helpdesk/frontend`
2. `npm install`
3. `npm start`

## Deployment (Render)

### Option A: One-Click Deploy (Blueprint)

1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect your GitHub repo and select the branch.
4. Render reads `render.yaml` and automatically creates:
   - A **PostgreSQL database** (`helpdesk-db`)
   - A **Web Service** (`helpdesk-backend`)
5. The build script runs migrations and seeds demo users automatically.

### Option B: Manual Setup

1. **Create a PostgreSQL database** on Render (free tier).
2. **Create a Web Service** from your GitHub repo:
   - **Root Directory**: `helpdesk`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn helpdesk.wsgi:application --bind 0.0.0.0:$PORT`
3. **Set environment variables** on the Web Service:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | *(copy Internal Database URL from Render DB)* |
   | `SECRET_KEY` | *(generate a random key)* |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `.onrender.com` |
   | `CORS_ALLOWED_ORIGINS` | `https://smart-campus-helpdesk-a548.vercel.app` |
   | `CSRF_TRUSTED_ORIGINS` | `https://smart-campus-helpdesk-a548.vercel.app` |
   | `ADMIN_PASSWORD` | `Admin@2026!` |
   | `STUDENT_PASSWORD` | `Student@2026!` |
   | `PYTHON_VERSION` | `3.12.3` |

### Frontend (Vercel)

After the Render backend is deployed, update your Vercel environment variable:

- `REACT_APP_API_URL` → `https://helpdesk-backend.onrender.com` *(your actual Render URL)*

> **Note:** Render's free tier services spin down after 15 minutes of inactivity. The first request after idle may take ~30 seconds to respond.

## Demo Credentials

You can use the following credentials to test the live application:

**Admin Account**
- Username: `admin`
- Password: `Admin@2026!`

**Student Account**
- Username: `student1`
- Password: `Student@2026!`

## API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/token/` | POST | No | JWT login (returns access + refresh tokens) |
| `/api/token/refresh/` | POST | No | Refresh JWT access token |
| `/api/register/` | POST | No | User self-registration |
| `/api/me/` | GET | Yes | Authenticated user profile |
| `/api/tickets/` | GET | Yes | List tickets (admin: all, student: own) |
| `/api/tickets/` | POST | Yes | Create a new ticket |
| `/api/tickets/{id}/` | GET | Yes | Retrieve a ticket |
| `/api/tickets/{id}/` | PATCH | Yes | Update ticket (admin: status; student: rating/review) |
| `/api/tickets/{id}/` | DELETE | Yes | Delete a ticket (admin only) |
