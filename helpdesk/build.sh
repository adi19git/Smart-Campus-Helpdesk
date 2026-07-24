#!/usr/bin/env bash
# Build script for Render production deployment.
# Render runs this during the build phase of each deploy.
set -o errexit

echo "========================================="
echo "Smart Campus Helpdesk — Production Build"
echo "========================================="

echo "1/4 Installing Python dependencies..."
pip install -r requirements.txt

echo "2/4 Collecting static files..."
python manage.py collectstatic --no-input

echo "3/4 Running database migrations..."
python manage.py migrate --no-input

echo "4/4 Seeding demo users..."
python manage.py seed_users

echo "✅ Build complete!"
