#!/usr/bin/env bash
# Build script for production deployment (Render, Railway, etc.)
# exit on error
set -o errexit

echo "========================================="
echo "Smart Campus Helpdesk — Production Build"
echo "========================================="

echo "1/3 Installing Python dependencies..."
pip install -r requirements.txt

echo "2/3 Running database migrations..."
python manage.py migrate --no-input

echo "3/3 Collecting static files..."
python manage.py collectstatic --no-input

echo "✅ Build complete!"
