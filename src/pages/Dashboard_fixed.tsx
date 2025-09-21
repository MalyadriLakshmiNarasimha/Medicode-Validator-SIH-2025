import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Patient } from '../types';
import StatusBadge from '../components/Common/StatusBadge';
import { format } from 'date-fns';
import AddPatientModal from '../components/Dashboard/AddPatientModal';
import { patientApi } from '../utils/api';

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [codeSystemFilter, setCodeSystemFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await patientApi.getAll() as any[];

        // Transform API data to match frontend types
        const mappedData: Patient[] = response.map((patient: any) => ({
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          patientId: patient.patient_id,
          lastVisit: patient.last_visit,
          diagnoses: patient.diagnoses || [],
          treatments: patient.treatments || [],
        }));

        setPatients(mappedData);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to load patients. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };

  const filteredPatients = patients.filter(patient => {
    // Search functionality
    const matchesSearch = searchTerm === '' ||
                         patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' ||
      patient.diagnoses.some(d => d.status === statusFilter) ||
      patient.treatments.some(t => t.status === statusFilter);

    // Code system filter
    const matchesCodeSystem = codeSystemFilter === 'all' ||
      patient.diagnoses.some(d => d.codeSystem === codeSystemFilter) ||
      patient.treatments.some(t => t.codeSystem === codeSystemFilter);

    return matchesSearch && matchesStatus && matchesCodeSystem;
  });

  // Sort filtered patients by lastVisit descending to show recent patients first
  filteredPatients.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());

  const stats = {
    totalPatients: patients.length,
    approvedCodes: patients.reduce((acc, patient) =>
      acc + patient.diagnoses.filter(d => d.status === 'approved').length +
      patient.treatments.filter(t => t.status === 'approved').length, 0),
    rejectedCodes: patients.reduce((acc, patient) =>
      acc + patient.diagnoses.filter(d => d.status === 'rejected').length +
      patient.treatments.filter(t => t.status === 'rejected').length, 0),
    pendingCodes: patients.reduce((acc, patient) =>
      acc + patient.diagnoses.filter(d => d.status === 'pending').length +
      patient.treatments.filter(t => t.status === 'pending').length, 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue-600"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-10">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-medical-blue-600 text-white px-4 py-2 rounded-lg hover:bg-medical-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and validate medical codes across your patients</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 lg:mt-0 bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Patient</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-medical-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved Codes</p>
                <p className="text-3xl font-bold text-medical-green-600">{stats.approvedCodes}</p>
              </div>
              <div className="w-12 h-12 bg-medical-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-medical-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected Codes</p>
                <p className="text-3xl font-bold text-red-500">{stats.rejectedCodes}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-orange-500">{stats.pendingCodes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5 text-gray-400" />
                <span>Filters</span>
              </button>
              {(statusFilter !== 'all' || codeSystemFilter !== 'all') && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setCodeSystemFilter('all');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code System</label>
                  <select
                    value={codeSystemFilter}
                    onChange={(e) => setCodeSystemFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                  >
                    <option value="all">All Systems</option>
                    <option value="ICD-11">ICD-11</option>
                    <option value="NAMASTE">NAMASTE</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">No patients match your current search and filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnoses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.slice(0, 10).map((patient) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.patientId} • {patient.age}Y • {patient.gender}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {patient.diagnoses.slice(0, 2).map((diagnosis) => (
                            <div key={diagnosis.id} className="flex items-center space-x-2">
                              <StatusBadge status={diagnosis.status} />
                              <span className="text-sm text-gray-600 truncate">
                                {diagnosis.code}
                              </span>
                            </div>
                          ))}
                          {patient.diagnoses.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{patient.diagnoses.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {patient.treatments.slice(0, 2).map((treatment) => (
                            <div key={treatment.id} className="flex items-center space-x-2">
                              <StatusBadge status={treatment.status} />
                              <span className="text-sm text-gray-600 truncate">
                                {treatment.code}
                              </span>
                            </div>
                          ))}
                          {patient.treatments.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{patient.treatments.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                          {format(new Date(patient.lastVisit), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/patient/${patient.id}`} className="text-medical-blue-600 hover:text-medical-blue-700">
                          View Details
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPatient}
      />
    </div>
  );
};

export default Dashboard;
