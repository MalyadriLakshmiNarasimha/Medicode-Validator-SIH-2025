# Data Flow and Storage in PostgreSQL

## How Data Saves in PostgreSQL

The Django backend uses Object-Relational Mapping (ORM) to interact with PostgreSQL. Here's the complete data flow:

### 1. Frontend Request
- User interacts with React frontend (e.g., adds a new patient)
- Frontend sends HTTP request to Django API endpoint

### 2. Django API Processing
- Request reaches Django REST Framework viewset
- Data is validated using serializers
- Django ORM creates Python model instances

### 3. Database Operations
- Django ORM translates Python objects to SQL queries
- PostgreSQL executes the SQL commands
- Data is stored in appropriate tables

### 4. Response
- Django sends success response back to frontend
- Frontend updates UI with new data

## Database Tables Created

When you run migrations, these PostgreSQL tables are created:

### api_user
```sql
CREATE TABLE api_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(254),
    role VARCHAR(20),
    -- other Django auth fields...
);
```

### api_patient
```sql
CREATE TABLE api_patient (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER,
    gender VARCHAR(10),
    patient_id VARCHAR(20) UNIQUE,
    last_visit TIMESTAMP WITH TIME ZONE
);
```

### api_diagnosis
```sql
CREATE TABLE api_diagnosis (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES api_patient(id),
    code VARCHAR(20),
    description TEXT,
    code_system VARCHAR(20),
    status VARCHAR(10),
    validation_date TIMESTAMP WITH TIME ZONE,
    validated_by VARCHAR(255),
    suggestions JSONB
);
```

### api_treatment
```sql
CREATE TABLE api_treatment (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES api_patient(id),
    code VARCHAR(20),
    description TEXT,
    code_system VARCHAR(20),
    status VARCHAR(10),
    validation_date TIMESTAMP WITH TIME ZONE,
    validated_by VARCHAR(255),
    suggestions JSONB
);
```

## Example Data Flow

1. **Create Patient API Call:**
   ```
   POST /api/patients/
   {
     "name": "John Doe",
     "age": 45,
     "gender": "male",
     "patient_id": "P1234"
   }
   ```

2. **Django ORM generates SQL:**
   ```sql
   INSERT INTO api_patient (id, name, age, gender, patient_id, last_visit)
   VALUES ('uuid-here', 'John Doe', 45, 'male', 'P1234', NOW());
   ```

3. **PostgreSQL stores the data** in the `api_patient` table

4. **Response returned** with the created patient data

## Key Features

- **Automatic SQL Generation:** Django ORM handles all SQL creation
- **Relationships:** Foreign keys maintain data integrity
- **Transactions:** Multiple operations can be atomic
- **Migrations:** Schema changes are tracked and versioned
- **Indexing:** Primary keys and unique constraints ensure performance

The data is safely stored in PostgreSQL and can be queried, updated, or deleted through the Django API endpoints.
