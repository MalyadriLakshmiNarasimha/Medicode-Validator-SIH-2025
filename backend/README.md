# Medicode Backend

This is the Django backend for the Medicode project.

## Setup Instructions

1. Create a virtual environment and activate it:

```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure PostgreSQL database:

- Create a PostgreSQL database named `medicode_db`.
- Create a user `medicode_user` with password `medicode_password`.
- Grant all privileges on the database to the user.

4. Apply migrations:

```bash
python manage.py migrate
```

5. Create a superuser for admin access:

```bash
python manage.py createsuperuser
```

6. (Optional) Populate sample data:

```bash
python manage.py populate_sample_data
```

7. Run the development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`.

## Notes

- The backend uses Django REST Framework.
- CORS is enabled for all origins to allow frontend access.
- The custom user model includes roles: doctor, admin, medical_coder, auditor.
- API endpoints are available for users, patients, diagnoses, and treatments.
