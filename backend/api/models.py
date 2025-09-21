import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
        ('medical_coder', 'Medical Coder'),
        ('auditor', 'Auditor'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    patient_id = models.CharField(max_length=20, unique=True)
    last_visit = models.DateTimeField()

    def __str__(self):
        return f"{self.name} ({self.patient_id})"

class Diagnosis(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, related_name='diagnoses', on_delete=models.CASCADE)
    code = models.CharField(max_length=20)
    description = models.TextField()
    code_system = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    validation_date = models.DateTimeField()
    validated_by = models.CharField(max_length=255)
    suggestions = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.status}"

class Treatment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, related_name='treatments', on_delete=models.CASCADE)
    code = models.CharField(max_length=20)
    description = models.TextField()
    code_system = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    validation_date = models.DateTimeField()
    validated_by = models.CharField(max_length=255)
    suggestions = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.status}"

class Report(models.Model):
    REPORT_TYPES = [
        ('validation', 'Validation Summary'),
        ('patient', 'Patient Records'),
        ('code_usage', 'Code Usage Analysis'),
        ('compliance', 'EHR Compliance'),
        ('audit', 'Audit Report'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    generated_at = models.DateTimeField(auto_now_add=True)
    date_range_start = models.DateField()
    date_range_end = models.DateField()
    code_system = models.CharField(max_length=20, default='all')
    data = models.JSONField()  # Store the report data
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.name} - {self.report_type}"
