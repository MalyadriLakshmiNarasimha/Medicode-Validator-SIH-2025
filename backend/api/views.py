from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import User, Patient, Diagnosis, Treatment, Report
from .serializers import UserSerializer, PatientSerializer, DiagnosisSerializer, TreatmentSerializer, ReportSerializer
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
import uuid

# ---------------- UserViewSet ----------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# ---------------- PatientViewSet ----------------
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    @action(detail=True, methods=['post'])
    def add_diagnosis(self, request, pk=None):
        patient = self.get_object()
        data = request.data.copy()
        data['patient'] = patient.id
        data['id'] = str(uuid.uuid4())
        data['status'] = 'pending'
        data['validation_date'] = timezone.now()
        data['validated_by'] = 'N/A'

        serializer = DiagnosisSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            # Update last_visit
            patient.last_visit = timezone.now()
            patient.save(update_fields=['last_visit'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_treatment(self, request, pk=None):
        patient = self.get_object()
        data = request.data.copy()
        data['patient'] = patient.id
        data['id'] = str(uuid.uuid4())
        data['status'] = 'pending'
        data['validation_date'] = timezone.now()
        data['validated_by'] = 'N/A'

        serializer = TreatmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            # Update last_visit
            patient.last_visit = timezone.now()
            patient.save(update_fields=['last_visit'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def list_patients_with_last_visit(self, request):
        patients = Patient.objects.all()
        patient_list = [
            {
                'id': str(p.id),
                'name': p.name,
                'last_visit': p.last_visit.isoformat() if p.last_visit else None
            } for p in patients
        ]
        return Response({'patients': patient_list})

# ---------------- DiagnosisViewSet ----------------
class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        diagnosis = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['approved', 'rejected']:
            diagnosis.status = new_status
            diagnosis.validated_by = request.user.username if request.user.is_authenticated else 'N/A'
            diagnosis.validation_date = timezone.now()
            diagnosis.save()
            serializer = self.get_serializer(diagnosis)
            return Response(serializer.data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- TreatmentViewSet ----------------
class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        treatment = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['approved', 'rejected']:
            treatment.status = new_status
            treatment.validated_by = request.user.username if request.user.is_authenticated else 'N/A'
            treatment.validation_date = timezone.now()
            treatment.save()
            serializer = self.get_serializer(treatment)
            return Response(serializer.data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- ReportViewSet ----------------
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        report_type = request.data.get('report_type')
        date_range = request.data.get('date_range', 'last30days')
        code_system = request.data.get('code_system', 'all')

        now = timezone.now().date()
        if date_range == 'last7days':
            start_date = now - timedelta(days=7)
        elif date_range == 'last30days':
            start_date = now - timedelta(days=30)
        elif date_range == 'last3months':
            start_date = now - timedelta(days=90)
        elif date_range == 'lastyear':
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=30)  # default

        end_date = now

        start_datetime = timezone.make_aware(datetime.combine(start_date, datetime.min.time()))
        end_datetime = timezone.make_aware(datetime.combine(end_date, datetime.max.time()))

        # ✅ Filter patients by diagnosis/treatment validation_date
        patients = Patient.objects.filter(
            Q(diagnoses__validation_date__gte=start_datetime, diagnoses__validation_date__lte=end_datetime) |
            Q(treatments__validation_date__gte=start_datetime, treatments__validation_date__lte=end_datetime)
        ).distinct()

        if code_system != 'all':
            patients = patients.filter(
                Q(diagnoses__code_system=code_system) | Q(treatments__code_system=code_system)
            ).distinct()

        # Debug endpoint to list patients
        if request.query_params.get('debug') == 'list_patients':
            patient_list = [
                {
                    'id': str(p.id),
                    'name': p.name,
                    'last_visit': p.last_visit.isoformat() if p.last_visit else None
                } for p in patients
            ]
            return Response({'patients': patient_list})

        # Generate report data
        if report_type == 'validation':
            data = self.generate_validation_summary(patients)
        elif report_type == 'patient':
            data = self.generate_patient_records(patients)
        elif report_type == 'code_usage':
            data = self.generate_code_usage_analysis(patients)
        elif report_type == 'compliance':
            data = self.generate_compliance_report(patients)
        elif report_type == 'audit':
            data = self.generate_audit_report(patients)
        else:
            return Response({'error': 'Invalid report type'}, status=status.HTTP_400_BAD_REQUEST)

        # Save report
        report = Report.objects.create(
            name=f"{dict(Report.REPORT_TYPES)[report_type]} - {start_date} to {end_date}",
            report_type=report_type,
            date_range_start=start_date,
            date_range_end=end_date,
            code_system=code_system,
            data=data,
            created_by=request.user if request.user.is_authenticated else None
        )

        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def generate_validation_summary(self, patients):
        total_codes = 0
        approved = 0
        rejected = 0
        pending = 0

        for patient in patients.prefetch_related('diagnoses', 'treatments'):
            for diagnosis in patient.diagnoses.all():
                total_codes += 1
                if diagnosis.status == 'approved':
                    approved += 1
                elif diagnosis.status == 'rejected':
                    rejected += 1
                else:
                    pending += 1
            for treatment in patient.treatments.all():
                total_codes += 1
                if treatment.status == 'approved':
                    approved += 1
                elif treatment.status == 'rejected':
                    rejected += 1
                else:
                    pending += 1

        return {
            'total_codes': total_codes,
            'approved': approved,
            'rejected': rejected,
            'pending': pending,
            'approval_rate': (approved / total_codes * 100) if total_codes > 0 else 0
        }

    def generate_patient_records(self, patients):
        return [
            {
                'id': str(p.id),
                'name': p.name,
                'age': p.age,
                'gender': p.gender,
                'patient_id': p.patient_id,
                'last_visit': p.last_visit.isoformat() if p.last_visit else None,
                'diagnoses_count': p.diagnoses.count(),
                'treatments_count': p.treatments.count()
            } for p in patients
        ]

    def generate_code_usage_analysis(self, patients):
        code_usage = {}
        for patient in patients.prefetch_related('diagnoses', 'treatments'):
            for diagnosis in patient.diagnoses.all():
                key = f"{diagnosis.code} ({diagnosis.code_system})"
                if key not in code_usage:
                    code_usage[key] = {'count': 0, 'description': diagnosis.description}
                code_usage[key]['count'] += 1
            for treatment in patient.treatments.all():
                key = f"{treatment.code} ({treatment.code_system})"
                if key not in code_usage:
                    code_usage[key] = {'count': 0, 'description': treatment.description}
                code_usage[key]['count'] += 1
        return code_usage

    def generate_compliance_report(self, patients):
        return {'message': 'Compliance report generation not implemented yet'}

    def generate_audit_report(self, patients):
        return {'message': 'Audit report generation not implemented yet'}
