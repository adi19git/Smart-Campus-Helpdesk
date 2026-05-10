# Smart Campus Helpdesk Frontend

A modern React-based frontend for the Smart Campus Helpdesk system.

## Features

- **User Authentication**: JWT-based login system
- **Ticket Management**: Create, view, and manage support tickets
- **Filtering & Search**: Filter tickets by status, category, and search by title/description
- **Dashboard**: Overview of all tickets with statistics
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Navigate to the frontend directory:
```bash
cd helpdesk/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Configuration

### API Base URL

The API base URL is configured in `src/api.js`:

```javascript
const API_URL = 'http://localhost:8000';
```

Update this if your Django backend is running on a different port or host.

## Usage

### Login

1. Navigate to `http://localhost:3000/login`
2. Enter your username and password
3. Click "Login"

### Dashboard

After logging in, you'll see:
- Statistics cards showing ticket counts
- List of all your tickets
- Filters for status, category, and search
- Button to create new tickets

### Create Ticket

1. Click "+ Create New Ticket" button
2. Fill in the form:
   - **Title**: Brief description of the issue
   - **Description**: Detailed explanation
   - **Category**: Classroom, Hostel, or Network
   - **Priority**: Low, Medium, or High
3. Click "Create Ticket"

### View Ticket Details

1. Click "View" on any ticket in the list
2. See full ticket details
3. (Admin only) Update the ticket status

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FilterBar.js
│   │   ├── ProtectedRoute.js
│   │   └── TicketList.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── CreateTicketPage.js
│   │   ├── DashboardPage.js
│   │   ├── LoginPage.js
│   │   └── TicketDetailPage.js
│   ├── App.js
│   ├── api.js
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## Deployment

To build for production:

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## Troubleshooting

### CORS Error

If you get CORS errors, ensure your Django backend has CORS enabled:

```python
# In settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Token Expired

If your JWT token expires:
- The app will automatically attempt to refresh it
- If refresh fails, you'll be logged out and redirected to login

## License

This project is part of the Smart Campus suite.
