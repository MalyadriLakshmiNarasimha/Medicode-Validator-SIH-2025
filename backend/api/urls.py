from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'diagnoses', views.DiagnosisViewSet)
router.register(r'treatments', views.TreatmentViewSet)
router.register(r'reports', views.ReportViewSet)
router.register(r'medical-codes', views.MedicalCodeViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'validation-history', views.ValidationHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
