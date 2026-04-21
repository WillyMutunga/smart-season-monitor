#!/usr/bin/env bash
# exit on error
set -o errexit

# Build the frontend
echo "Building frontend..."
pushd ../frontend
npm install
npm run build
popd

# Install backend dependencies
pip install -r requirements.txt

# Gather static files and migrate
python manage.py collectstatic --no-input
python manage.py migrate
