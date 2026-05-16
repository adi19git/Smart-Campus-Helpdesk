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
- **Deployment**: Configured for Render.

## Setup

### Backend
1. Create a virtual environment: `python -m venv env`
2. Activate: `env\Scripts\activate` (Windows) or `source env/bin/activate` (Linux/Mac)
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `python manage.py migrate`
5. Start: `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Deployment (Railway)

### Backend
1. Create a new service on Railway from your GitHub repo.
2. In **Settings**, set the **Root Directory** to `helpdesk`.
3. Railway will use the `Procfile` and `build.sh` automatically.
4. Add environment variables: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_HOSTS` (set to `.railway.app`).

### Frontend
1. Create another service from the same repo.
2. In **Settings**, set the **Root Directory** to `helpdesk/frontend`.
3. Add environment variable: `REACT_APP_API_URL` (set to your Railway backend URL).

## Demo Credentials

You can use the following credentials to test the live application:

**Admin Account**
- Username: `admin`
- Password: `***REMOVED***`

**Student Account**
- Username: `student1`
- Password: `***REMOVED***`
