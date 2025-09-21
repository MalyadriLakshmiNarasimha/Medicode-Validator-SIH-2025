from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
import uuid
from api.models import User, Patient, Diagnosis, Treatment

fake = Faker()

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing patients, diagnoses, and treatments...')
        Treatment.objects.all().delete()
        Diagnosis.objects.all().delete()
        Patient.objects.all().delete()

        self.stdout.write('Creating sample users...')
        # Create sample users
        users_data = [
            {'username': 'doctor1', 'email': 'doctor@medicode.com', 'role': 'doctor'},
            {'username': 'admin1', 'email': 'admin@medicode.com', 'role': 'admin'},
            {'username': 'coder1', 'email': 'coder@medicode.com', 'role': 'medical_coder'},
            {'username': 'auditor1', 'email': 'auditor@medicode.com', 'role': 'auditor'},
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'role': user_data['role'],
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')

        self.stdout.write('Creating sample patients...')
        # Create sample patients
        for _ in range(20):
            patient = Patient.objects.create(
                id=str(uuid.uuid4()),
                name=fake.name(),
                age=fake.random_int(min=1, max=90),
                gender=fake.random_element(['male', 'female', 'other']),
                patient_id=f'P{fake.random_int(min=10000, max=99999)}',
                last_visit=fake.date_time_this_year(),
            )

            # Create diagnoses
            for _ in range(fake.random_int(min=1, max=3)):
                Diagnosis.objects.create(
                    id=str(uuid.uuid4()),
                    patient=patient,
                    code=fake.random_element(['1A00', '1A01', '8A00', '9A00']),
                    description=fake.sentence(),
                    code_system=fake.random_element(['ICD-11', 'NAMASTE']),
                    status=fake.random_element(['pending', 'approved', 'rejected']),
                    validation_date=fake.date_time_this_year(),
                    validated_by=fake.name(),
                )

            # Create treatments
            for _ in range(fake.random_int(min=1, max=4)):
                Treatment.objects.create(
                    id=str(uuid.uuid4()),
                    patient=patient,
                    code=fake.random_element(['NAM001', 'NAM002', 'NAM003']),
                    description=fake.sentence(),
                    code_system=fake.random_element(['ICD-11', 'NAMASTE']),
                    status=fake.random_element(['pending', 'approved', 'rejected']),
                    validation_date=fake.date_time_this_year(),
                    validated_by=fake.name(),
                )

        self.stdout.write(self.style.SUCCESS('Sample data populated successfully!'))
