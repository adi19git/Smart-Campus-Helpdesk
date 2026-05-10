@echo off
echo ========================================
echo Smart Campus Helpdesk - Quick Start
echo ========================================
echo.
echo Starting Backend...
if exist "env\Scripts\activate" (
    call env\Scripts\activate
)
start python manage.py runserver
echo Backend started on http://localhost:8000
echo.
echo Starting Frontend...
cd frontend
start npm start
echo Frontend starting on http://localhost:3000
echo.
echo Both servers are starting...
echo Please wait for the browser to open automatically.
pause
