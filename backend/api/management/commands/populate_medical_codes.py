from django.core.management.base import BaseCommand
from api.models import MedicalCode
from datetime import datetime

class Command(BaseCommand):
    help = 'Populate the MedicalCode model with sample medical codes for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing medical codes before populating',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing medical codes...')
            MedicalCode.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Successfully cleared existing medical codes'))

        # Sample ICD-11 codes
        icd11_codes = [
            {
                'code': '1A00',
                'description': 'COVID-19, virus identified',
                'code_system': 'ICD-11',
                'category': 'Infectious diseases',
                'is_active': True,
            },
            {
                'code': '1A01',
                'description': 'COVID-19, virus not identified',
                'code_system': 'ICD-11',
                'category': 'Infectious diseases',
                'is_active': True,
            },
            {
                'code': 'BA00',
                'description': 'Hypertension',
                'code_system': 'ICD-11',
                'category': 'Cardiovascular diseases',
                'is_active': True,
            },
            {
                'code': 'BA01',
                'description': 'Ischaemic heart diseases',
                'code_system': 'ICD-11',
                'category': 'Cardiovascular diseases',
                'is_active': True,
            },
            {
                'code': '5A11',
                'description': 'Type 2 diabetes mellitus',
                'code_system': 'ICD-11',
                'category': 'Endocrine diseases',
                'is_active': True,
            },
            {
                'code': '5A10',
                'description': 'Type 1 diabetes mellitus',
                'code_system': 'ICD-11',
                'category': 'Endocrine diseases',
                'is_active': True,
            },
            {
                'code': 'CA00',
                'description': 'Malignant neoplasms of lip, oral cavity and pharynx',
                'code_system': 'ICD-11',
                'category': 'Neoplasms',
                'is_active': True,
            },
            {
                'code': 'CA01',
                'description': 'Malignant neoplasms of digestive organs',
                'code_system': 'ICD-11',
                'category': 'Neoplasms',
                'is_active': True,
            },
            {
                'code': '8A00',
                'description': 'Dementia',
                'code_system': 'ICD-11',
                'category': 'Mental disorders',
                'is_active': True,
            },
            {
                'code': '8A01',
                'description': 'Schizophrenia',
                'code_system': 'ICD-11',
                'category': 'Mental disorders',
                'is_active': True,
            },
        ]

        # Sample CPT codes
        cpt_codes = [
            {
                'code': '99213',
                'description': 'Office or other outpatient visit for the evaluation and management of an established patient',
                'code_system': 'CPT',
                'category': 'Evaluation and Management',
                'is_active': True,
            },
            {
                'code': '99214',
                'description': 'Office or other outpatient visit for the evaluation and management of an established patient',
                'code_system': 'CPT',
                'category': 'Evaluation and Management',
                'is_active': True,
            },
            {
                'code': '99203',
                'description': 'Office or other outpatient visit for the evaluation and management of a new patient',
                'code_system': 'CPT',
                'category': 'Evaluation and Management',
                'is_active': True,
            },
            {
                'code': '99204',
                'description': 'Office or other outpatient visit for the evaluation and management of a new patient',
                'code_system': 'CPT',
                'category': 'Evaluation and Management',
                'is_active': True,
            },
            {
                'code': '90471',
                'description': 'Immunization administration',
                'code_system': 'CPT',
                'category': 'Medicine',
                'is_active': True,
            },
            {
                'code': '90472',
                'description': 'Immunization administration',
                'code_system': 'CPT',
                'category': 'Medicine',
                'is_active': True,
            },
            {
                'code': '71045',
                'description': 'Radiologic examination, chest; single view',
                'code_system': 'CPT',
                'category': 'Radiology',
                'is_active': True,
            },
            {
                'code': '71046',
                'description': 'Radiologic examination, chest; 2 views',
                'code_system': 'CPT',
                'category': 'Radiology',
                'is_active': True,
            },
            {
                'code': '85025',
                'description': 'Blood count; complete (CBC), automated',
                'code_system': 'CPT',
                'category': 'Pathology and Laboratory',
                'is_active': True,
            },
            {
                'code': '80053',
                'description': 'Comprehensive metabolic panel',
                'code_system': 'CPT',
                'category': 'Pathology and Laboratory',
                'is_active': True,
            },
        ]

        # Sample HCPCS codes
        hcpcs_codes = [
            {
                'code': 'J3420',
                'description': 'Injection, vitamin B-12 cyanocobalamin, up to 1000 mcg',
                'code_system': 'HCPCS',
                'category': 'Drugs',
                'is_active': True,
            },
            {
                'code': 'G0008',
                'description': 'Administration of influenza virus vaccine',
                'code_system': 'HCPCS',
                'category': 'Preventive Services',
                'is_active': True,
            },
            {
                'code': 'G0009',
                'description': 'Administration of pneumococcal vaccine',
                'code_system': 'HCPCS',
                'category': 'Preventive Services',
                'is_active': True,
            },
        ]

        # Combine all codes
        all_codes = icd11_codes + cpt_codes + hcpcs_codes

        # Create medical codes
        created_count = 0
        for code_data in all_codes:
            code, created = MedicalCode.objects.get_or_create(
                code=code_data['code'],
                code_system=code_data['code_system'],
                defaults=code_data
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated {created_count} medical codes. '
                f'Total codes in database: {MedicalCode.objects.count()}'
            )
        )

        # Display summary by code system
        self.stdout.write('\nCode system summary:')
        for code_system in ['ICD-11', 'CPT', 'HCPCS']:
            count = MedicalCode.objects.filter(code_system=code_system).count()
            self.stdout.write(f'  {code_system}: {count} codes')
