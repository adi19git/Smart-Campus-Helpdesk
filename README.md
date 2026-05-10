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

## Deployment

The project is pre-configured for Render via `render.yaml`. Connect your GitHub repository to Render and use the Blueprint deployment option.
