# Quick Start Commands

## Windows Setup

### 1. Backend Setup (Run once)
```powershell
cd "c:\Smart campus\helpdesk"
.\env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

### 2. Start Backend (Terminal 1)
```powershell
cd "c:\Smart campus\helpdesk"
.\env\Scripts\activate
python manage.py runserver
```
→ Backend available at: http://localhost:8000

### 3. Start Frontend (Terminal 2)
```powershell
cd "c:\Smart campus\helpdesk\frontend"
npm install  # (first time only)
npm start
```
→ Frontend available at: http://localhost:3000

---

## Linux/Mac Setup

### 1. Backend Setup (Run once)
```bash
cd ~/helpdesk
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

### 2. Start Backend (Terminal 1)
```bash
cd ~/helpdesk
source env/bin/activate
python manage.py runserver
```
→ Backend available at: http://localhost:8000

### 3. Start Frontend (Terminal 2)
```bash
cd ~/helpdesk/frontend
npm install  # (first time only)
npm start
```
→ Frontend available at: http://localhost:3000

---

## Automated Startup

### Windows:
```powershell
cd "c:\Smart campus\helpdesk"
.\start.bat
```

### Linux/Mac:
```bash
cd ~/helpdesk
chmod +x start.sh
./start.sh
```

---

## Common Commands

### Database Operations
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py flush  # Clear all data
```

### Create Sample Data
```bash
python manage.py createsuperuser  # Create admin user
```

### Frontend
```bash
npm install          # Install dependencies
npm start            # Start dev server
npm build            # Build for production
npm test             # Run tests
```

### Django Admin
```
http://localhost:8000/admin
Username: admin
Password: (from createsuperuser)
```

---

## Testing the API with curl

### Get Access Token
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"your_password\"}"
```

### List Tickets (replace TOKEN)
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/tickets/
```

### Create Ticket
```bash
curl -X POST http://localhost:8000/tickets/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Ticket\",\"description\":\"Test Description\",\"category\":\"network\",\"priority\":\"high\"}"
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `PORT=3001 npm start` |
| Port 8000 in use | `python manage.py runserver 8001` |
| Module not found | `pip install -r requirements.txt` or `npm install` |
| CORS error | Check CORS_ALLOWED_ORIGINS in settings.py |
| Database error | Run `python manage.py migrate` |
| Login fails | Create user: `python manage.py createsuperuser` |
| Token invalid | Clear localStorage and login again |

---

## File Locations

- Backend: `c:\Smart campus\helpdesk\`
- Frontend: `c:\Smart campus\helpdesk\frontend\`
- Database: `c:\Smart campus\helpdesk\db.sqlite3`
- Logs: Check terminal output
- Admin Panel: http://localhost:8000/admin

---

## Key URLs

| Page | URL |
|------|-----|
| Frontend Home | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Create Ticket | http://localhost:3000/create-ticket |
| Ticket Detail | http://localhost:3000/ticket/:id |
| Django Admin | http://localhost:8000/admin |
| API Root | http://localhost:8000/tickets/ |

---

## Environment Variables (Optional)

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_LOGGING=true
```

---

## Need Help?

1. Check SETUP_GUIDE.md for detailed instructions
2. Check IMPLEMENTATION_SUMMARY.md for features overview
3. Review error messages in browser console (F12)
4. Check Django error messages in terminal
5. Ensure both servers are running

---

**All set! Happy coding!** 🚀
