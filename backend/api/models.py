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

# New models for automatic validation system

class MedicalCode(models.Model):
    """Master dataset of valid medical codes"""
    CODE_SYSTEMS = [
        ('ICD-11', 'ICD-11'),
        ('NAMASTE', 'NAMASTE'),
        ('CPT', 'CPT'),
        ('HCPCS', 'HCPCS'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)
    code_system = models.CharField(max_length=20, choices=CODE_SYSTEMS)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['code', 'code_system']),
            models.Index(fields=['code_system', 'is_active']),
        ]

    def __str__(self):
        return f"{self.code} ({self.code_system})"

class Notification(models.Model):
    """Notifications for rejected codes"""
    NOTIFICATION_TYPES = [
        ('code_rejected', 'Code Rejected'),
        ('validation_failed', 'Validation Failed'),
        ('code_suggestion', 'Code Suggestion'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    related_patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    related_diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, null=True, blank=True)
    related_treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

class ValidationHistory(models.Model):
    """Track all validation attempts for admin review"""
    VALIDATION_RESULTS = [
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, null=True, blank=True)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE, null=True, blank=True)
    submitted_code = models.CharField(max_length=20)
    submitted_code_system = models.CharField(max_length=20)
    validation_result = models.CharField(max_length=10, choices=VALIDATION_RESULTS)
    matched_master_code = models.ForeignKey(MedicalCode, on_delete=models.SET_NULL, null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)
    validated_by = models.CharField(max_length=255)
    validated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-validated_at']
        indexes = [
            models.Index(fields=['validation_result', 'validated_at']),
            models.Index(fields=['patient', 'validated_at']),
        ]

    def __str__(self):
        return f"{self.submitted_code} - {self.validation_result} ({self.validated_at})"
