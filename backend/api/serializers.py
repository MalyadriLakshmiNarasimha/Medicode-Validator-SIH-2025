from rest_framework import serializers
from .models import User, Patient, Diagnosis, Treatment, Report

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class DiagnosisSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    class Meta:
        model = Diagnosis
        fields = '__all__'

class TreatmentSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    class Meta:
        model = Treatment
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    diagnoses = DiagnosisSerializer(many=True, required=False)
    treatments = TreatmentSerializer(many=True, required=False)

    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'gender', 'patient_id', 'last_visit', 'diagnoses', 'treatments']

    def create(self, validated_data):
        diagnoses_data = validated_data.pop('diagnoses', [])
        treatments_data = validated_data.pop('treatments', [])
        patient = Patient.objects.create(**validated_data)
        for diagnosis_data in diagnoses_data:
            Diagnosis.objects.create(patient=patient, **diagnosis_data)
        for treatment_data in treatments_data:
            Treatment.objects.create(patient=patient, **treatment_data)
        return patient

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
