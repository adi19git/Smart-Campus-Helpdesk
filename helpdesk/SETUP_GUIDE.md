# Smart Campus Helpdesk - Complete Setup Guide

## Backend Setup (Django)

### Prerequisites
- Python 3.8+
- PostgreSQL (or SQLite for development)
- pip

### Step 1: Backend Installation

Navigate to the helpdesk directory:
```bash
cd "c:\Smart campus\helpdesk"
```

Activate the virtual environment:
```bash
.\env\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### Step 2: Database Configuration

Update `helpdesk/settings.py` with your database credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'helpdesk_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Or use SQLite for development (update to use sqlite3):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Step 3: Run Migrations

```bash
python manage.py migrate
```

### Step 4: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 5: Start Backend Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### API Endpoints

- **Login**: POST `/api/token/`
  - Body: `{"username": "admin", "password": "your_password"}`
  - Returns: `{"access": "token", "refresh": "token"}`

- **Refresh Token**: POST `/api/token/refresh/`
  - Body: `{"refresh": "refresh_token"}`
  - Returns: `{"access": "new_token"}`

- **List Tickets**: GET `/tickets/`
- **Create Ticket**: POST `/tickets/`
- **Get Ticket**: GET `/tickets/{id}/`
- **Update Ticket**: PUT/PATCH `/tickets/{id}/`
- **Delete Ticket**: DELETE `/tickets/{id}/`

---

## Frontend Setup (React)

### Prerequisites
- Node.js 14+
- npm or yarn

### Step 1: Frontend Installation

Navigate to the frontend directory:
```bash
cd "c:\Smart campus\helpdesk\frontend"
```

Install dependencies:
```bash
npm install
```

### Step 2: Configure API Endpoint

If your Django backend runs on a different host/port, update `src/api.js`:

```javascript
const API_URL = 'http://localhost:8000'; // Change if needed
```

### Step 3: Start Frontend Server

```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

---

## Complete Startup Instructions

### Terminal 1: Backend
```bash
cd "c:\Smart campus\helpdesk"
.\env\Scripts\activate
python manage.py runserver
```

### Terminal 2: Frontend
```bash
cd "c:\Smart campus\helpdesk\frontend"
npm start
```

---

## Features

✅ **User Authentication**
- JWT-based login system
- Automatic token refresh
- Secure logout

✅ **Ticket Management**
- Create new support tickets
- View ticket details
- Update ticket status (admin only)
- Delete tickets (admin only)

✅ **Search & Filter**
- Filter by status (Open, In Progress, Closed)
- Filter by category (Classroom, Hostel, Network)
- Search by title and description

✅ **Dashboard**
- View all your tickets
- See ticket statistics
- Quick action buttons

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Modern UI with Tailwind CSS
- Smooth animations and transitions

---

## Troubleshooting

### 1. CORS Error
If you get CORS errors, ensure:
- `corsheaders` is installed: `pip install django-cors-headers`
- It's added to INSTALLED_APPS and MIDDLEWARE
- CORS_ALLOWED_ORIGINS includes your frontend URL

### 2. Database Connection Error
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE helpdesk_db;
\q
```

Then run migrations:
```bash
python manage.py migrate
```

### 3. Port Already in Use
Change Django port:
```bash
python manage.py runserver 8001
```

Change React port:
```bash
PORT=3001 npm start
```

Then update API_URL in `src/api.js`.

### 4. Module Not Found Errors
Reinstall dependencies:
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

### 5. JWT Token Errors
- Clear browser localStorage
- Log out and log in again
- Check that tokens are being stored correctly in localStorage

---

## Development Tips

### Django Admin Panel
Access admin at: `http://localhost:8000/admin/`
- Create users for testing
- View and manage tickets
- Monitor database

### Frontend Development
- Components are in `src/components/` and `src/pages/`
- API calls are centralized in `src/api.js`
- Authentication state is managed with Context API

### Testing the API
Use Postman or curl:

```bash
# Get token
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'

# Get tickets (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/tickets/
```

---

## Next Steps

1. Create test users
2. Create sample tickets
3. Test all features
4. Customize styling in Tailwind CSS
5. Deploy to production (guide in README files)

For questions or issues, check the README.md files in both frontend/ and backend/ directories.
