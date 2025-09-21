import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';
import {
  ArrowLeft,
  User,
  Hash,
  Cake,
  VenetianMask,
  Calendar,
  Plus,
  Check,
  X,
} from 'lucide-react';

import { Patient, Diagnosis, Treatment, ValidationStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { patientApi, diagnosisApi, treatmentApi } from '../utils/api';

const AddCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (code: Diagnosis | Treatment) => void;
  type: 'diagnoses' | 'treatments';
}> = ({ isOpen, onClose, onAdd, type }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [codeSystem, setCodeSystem] = useState<'ICD-11' | 'NAMASTE'>('ICD-11');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: faker.string.uuid(),
      code,
      description,
      codeSystem,
      status: 'pending' as ValidationStatus,
      validationDate: new Date().toISOString(),
      validatedBy: 'N/A',
    };
    onAdd(newEntry);
    onClose();
    setCode('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New {type === 'diagnoses' ? 'Diagnosis' : 'Treatment'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code System</label>
                  <select
                    value={codeSystem}
                    onChange={(e) => setCodeSystem(e.target.value as 'ICD-11' | 'NAMASTE')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                  >
                    <option value="ICD-11">ICD-11</option>
                    <option value="NAMASTE">NAMASTE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                    placeholder={type === 'diagnoses' ? 'e.g., 1A01' : 'e.g., NAM001'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                    rows={3}
                    placeholder="e.g., Cholera due to Vibrio cholerae 01"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnoses' | 'treatments'>('diagnoses');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const canApprove = user?.role === 'admin' || user?.role === 'auditor';

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('Patient ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch patient data from API
        const patientData = await patientApi.getById(patientId);

        // Transform API data to match frontend types
        const transformedPatient: Patient = {
          id: patientData.id,
          name: patientData.name,
          age: patientData.age,
          gender: patientData.gender,
          patientId: patientData.patient_id,
          lastVisit: patientData.last_visit,
          diagnoses: patientData.diagnoses || [],
          treatments: patientData.treatments || [],
        };

        setPatient(transformedPatient);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleStatusUpdate = async (type: 'diagnoses' | 'treatments', id: string, newStatus: ValidationStatus) => {
    if (!patient) return;

    try {
      let response;
      if (type === 'diagnoses') {
        response = await diagnosisApi.updateStatus(id, newStatus);
      } else {
        response = await treatmentApi.updateStatus(id, newStatus);
      }

      // Update local state after successful API call
      const updatedPatient = { ...patient };
      if (type === 'diagnoses') {
        updatedPatient.diagnoses = updatedPatient.diagnoses.map(d =>
          d.id === id ? { ...d, status: newStatus, validatedBy: user?.name || 'Admin', validationDate: new Date().toISOString() } : d
        );
      } else {
        updatedPatient.treatments = updatedPatient.treatments.map(t =>
          t.id === id ? { ...t, status: newStatus, validatedBy: user?.name || 'Admin', validationDate: new Date().toISOString() } : t
        );
      }
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleAddCode = async (newCode: Diagnosis | Treatment) => {
    if (!patient) return;

    try {
      let response;
      if (activeTab === 'diagnoses') {
        response = await patientApi.addDiagnosis(patient.id, {
          code: newCode.code,
          description: newCode.description,
          code_system: newCode.codeSystem,
          status: 'pending',
          suggestions: null
        });
        // Add the new diagnosis to local state
        const updatedPatient = { ...patient };
        updatedPatient.diagnoses.unshift(newCode as Diagnosis);
        setPatient(updatedPatient);
      } else {
        response = await patientApi.addTreatment(patient.id, {
          code: newCode.code,
          description: newCode.description,
          code_system: newCode.codeSystem,
          status: 'pending',
          suggestions: null
        });
        // Add the new treatment to local state
        const updatedPatient = { ...patient };
        updatedPatient.treatments.unshift(newCode as Treatment);
        setPatient(updatedPatient);
      }
    } catch (error) {
      console.error('Error adding code:', error);
      alert('Failed to add code. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 text-center py-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/dashboard" className="text-medical-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="pt-16 text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800">Patient not found</h2>
        <Link to="/dashboard" className="text-medical-blue-600 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const infoItems = [
    { icon: User, label: 'Name', value: patient.name },
    { icon: Hash, label: 'Patient ID', value: patient.patientId },
    { icon: Cake, label: 'Age', value: `${patient.age} years` },
    { icon: VenetianMask, label: 'Gender', value: patient.gender, capitalized: true },
    { icon: Calendar, label: 'Last Visit', value: format(new Date(patient.lastVisit), 'MMM dd, yyyy') },
  ];

  const renderCodeList = (items: (Diagnosis | Treatment)[], type: 'diagnoses' | 'treatments') => (
    <div className="space-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 mb-3 sm:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-bold text-gray-800 text-lg">{item.code}</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{item.codeSystem}</span>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={item.status} />
              {canApprove && item.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleStatusUpdate(type, item.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleStatusUpdate(type, item.id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/dashboard" className="flex items-center space-x-2 text-medical-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Details</h1>

        {/* Patient Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {infoItems.map(item => (
              <div key={item.label}>
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <p className={`text-gray-800 font-medium mt-1 ${item.capitalized ? 'capitalize' : ''}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('diagnoses')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'diagnoses'
                  ? 'border-medical-blue-500 text-medical-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Diagnoses</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200">{patient.diagnoses.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('treatments')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'treatments'
                  ? 'border-medical-blue-500 text-medical-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Treatments</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200">{patient.treatments.length}</span>
            </button>
          </nav>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-medical-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New {activeTab === 'diagnoses' ? 'Diagnosis' : 'Treatment'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'diagnoses' ? renderCodeList(patient.diagnoses, 'diagnoses') : renderCodeList(patient.treatments, 'treatments')}
        </div>
      </div>

      <AddCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCode}
        type={activeTab}
      />
    </div>
  );
};

export default PatientDetails;
