# PebblePay Integration Testing Guide

This guide provides instructions for testing the integration between the React TypeScript frontend and Django backend.

## Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- Python (v3.10+)
- Django and required packages
- A Supabase account (with the project configured)

## Starting the Servers

### 1. Start the Django Backend

Open a terminal and run:

```bash
cd backend
# Activate your virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

# Install requirements if you haven't already
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

The Django server should now be running at http://localhost:8000

### 2. Start the Frontend

Open another terminal and run:

```bash
cd frontend
# Install dependencies if you haven't already
npm install

# Start the development server
npm run dev
```

The Vite development server should now be running at http://localhost:8081 (or another port if 8081 is in use)

## Testing the Integration

1. Open your browser and navigate to http://localhost:8081/login
2. Log in with your Supabase account (or create a new account)
3. After successful login, navigate to http://localhost:8081/api-test
4. The API Test page provides several tests:
   - Test basic connection to Django backend
   - Verify Supabase authentication status
   - Test Django authentication by fetching your profile
   - Test API calls to different endpoints (devices, analytics, etc.)

## What to Look For

A successful integration will show:

1. Successful connection to the Django backend
2. Proper authentication with both Supabase and Django
3. Ability to fetch your Django user profile
4. Successful API calls to other endpoints

## Troubleshooting

If you encounter issues:

1. Check that both servers are running
2. Verify CORS settings in the Django `settings.py` file
3. Check the browser's developer console for error messages
4. Verify environment variables in the frontend `.env` file
5. Check that all required packages are installed

## Next Steps

After confirming the integration works, you can:

1. Add more API endpoints to the Django backend
2. Create more frontend components that use the API
3. Implement additional features like file uploads, real-time updates, etc.