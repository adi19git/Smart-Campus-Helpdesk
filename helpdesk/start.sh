#!/bin/bash

echo "========================================"
echo "Smart Campus Helpdesk - Quick Start"
echo "========================================"
echo ""
echo "Starting Backend..."
if [ -f "env/bin/activate" ]; then
    source env/bin/activate
fi
python manage.py runserver &
BACKEND_PID=$!
echo "Backend started on http://localhost:8000"
echo ""
echo "Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
echo "Frontend starting on http://localhost:3000"
echo ""
echo "Both servers are starting..."
echo "Press Ctrl+C to stop both servers"
echo ""
wait $BACKEND_PID $FRONTEND_PID
