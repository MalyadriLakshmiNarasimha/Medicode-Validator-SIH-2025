#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicode.settings')
django.setup()

from api.models import MedicalCode

def remove_medical_codes(count=20):
    """Remove specified number of medical codes from the database"""
    current_count = MedicalCode.objects.count()
    print(f'Current MedicalCode count: {current_count}')

    if current_count < count:
        print(f'Cannot remove {count} codes. Only {current_count} codes exist.')
        return False

    # Get first 'count' codes to remove
    codes_to_remove = MedicalCode.objects.all()[:count]

    # Store info for logging
    removed_info = []
    for code in codes_to_remove:
        removed_info.append(f'{code.code} ({code.code_system}) - {code.description[:50]}...')

    print(f'Removing {count} medical codes...')

    # Remove the codes
    deleted_count, _ = codes_to_remove.delete()

    print(f'Successfully removed {deleted_count} medical codes')
    remaining_count = MedicalCode.objects.count()
    print(f'Remaining codes: {remaining_count}')

    print('\nRemoved codes:')
    for info in removed_info:
        print(f'  - {info}')

    return True

if __name__ == '__main__':
    remove_medical_codes(20)
