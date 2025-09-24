"# PebblePay

A modern point-of-sale and business management system with a React TypeScript frontend and Django backend.

## Project Structure

This project consists of two main parts:

1. **Frontend**: A React TypeScript application built with Vite
2. **Backend**: A Django REST API

## Features

- User authentication (Supabase + Django JWT)
- Device management
- Marketplace
- Order processing
- Inventory management
- Analytics
- Employee management

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Client
- React Router
- Axios

### Backend
- Django
- Django REST Framework
- SimpleJWT for authentication
- SQLite (development) / PostgreSQL (production)

## Setup and Installation

### Backend Setup

```bash
cd backend
# Create a virtual environment
python -m venv .venv
# Activate the virtual environment
.\.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Integration Testing

For details on testing the integration between the frontend and backend, see [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md).

## License

[MIT](LICENSE)" 
