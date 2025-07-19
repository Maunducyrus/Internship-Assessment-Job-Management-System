# Job Management Backend - Django API

![Job management system](/project%20screenshots/all-jobs.png)

A Django REST API backend for managing job listings with PostgreSQL database.

## Features

- Full CRUD operations for job listings
- Soft delete functionality (status-based)
- PostgreSQL database integration
- RESTful API endpoints
- Admin interface
- Input validation
- Filtering and search capabilities
- CORS support for React frontend

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- PostgreSQL
- pip (Python package manager)

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE job_management_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE job_management_db TO your_username;
```

### 3. Environment Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_NAME=job_management_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 4. Django Setup

1. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. Create superuser (optional):
```bash
python manage.py createsuperuser
```

3. Start development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Job Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all active jobs |
| POST | `/api/jobs/` | Create a new job |
| GET | `/api/jobs/<id>/` | Get job details |
| PUT | `/api/jobs/<id>/update/` | Update a job |
| PATCH | `/api/jobs/<id>/update/` | Partially update a job |
| PATCH | `/api/jobs/<id>/deactivate/` | Soft delete a job |
| PATCH | `/api/jobs/<id>/activate/` | Activate a job |
| GET | `/api/jobs/stats/` | Get job statistics |

### Query Parameters (for GET /api/jobs/)

- `location`: Filter by location
- `company`: Filter by company name
- `search`: Search in title, company, or description
- `page`: Page number for pagination

### Example Requests

#### Create a Job
```bash
curl -X POST http://localhost:8000/api/jobs/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "description": "We are looking for a skilled software engineer...",
    "company_name": "Tech Corp",
    "location": "New York, NY",
    "salary": 75000
  }'
```

#### Get All Active Jobs
```bash
curl http://localhost:8000/api/jobs/
```

#### Update a Job
```bash
curl -X PUT http://localhost:8000/api/jobs/1/update/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "salary": 85000
  }'
```

#### Soft Delete a Job
```bash
curl -X PATCH http://localhost:8000/api/jobs/1/deactivate/
```

## Job Model Fields

- `id`: Auto-generated primary key
- `title`: Job title (string, max 200 chars)
- `description`: Full job description (text)
- `company_name`: Company name (string, max 200 chars)
- `location`: Job location (string, max 200 chars)
- `salary`: Salary amount (integer)
- `status`: Job status ('active' or 'inactive')
- `created_at`: Creation timestamp (auto)
- `updated_at`: Last update timestamp (auto)

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- View all jobs (active and inactive)
- Bulk activate/deactivate jobs
- Search and filter jobs
- Edit job details

## Testing

You can test the API using:
- Django admin interface
- curl commands
- Postman
- Your React frontend

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite)

Update `CORS_ALLOWED_ORIGINS` in `settings.py` if your frontend runs on different ports.


