import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../components/Common/StatusBadge';
import { treatmentApi } from '../utils/api';

interface TreatmentApproval {
  id: string;
  patientName: string;
  patientId: string;
  code: string;
  description: string;
  codeSystem: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  submittedBy: string;
}

const AdminTreatmentApproval: React.FC = () => {
  const [treatments, setTreatments] = useState<TreatmentApproval[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<TreatmentApproval[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch treatments from API
        const treatmentsData = await treatmentApi.getAll() as any[];

        // Transform API data to match frontend interface
        const transformedTreatments: TreatmentApproval[] = treatmentsData.map(treatment => ({
          id: treatment.id,
          patientName: treatment.patient_name || 'Unknown Patient',
          patientId: treatment.patient_id || 'N/A',
          code: treatment.code,
          description: treatment.description,
          codeSystem: treatment.code_system,
          status: treatment.status,
          submittedDate: treatment.validation_date || treatment.created_at,
          submittedBy: treatment.validated_by || 'System',
        }));

        setTreatments(transformedTreatments);
        setFilteredTreatments(transformedTreatments);
      } catch (error) {
        console.error('Error fetching treatments:', error);
        setError('Failed to load treatments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  useEffect(() => {
    let filtered = treatments.filter(treatment => {
      const matchesSearch = treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           treatment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           treatment.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || treatment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredTreatments(filtered);
  }, [treatments, searchTerm, statusFilter]);

  const handleStatusUpdate = async (treatmentId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Update treatment status via API
      const response = await treatmentApi.updateStatus(treatmentId, newStatus);

      // Update local state
      setTreatments(prev => prev.map(t =>
        t.id === treatmentId ? { ...t, status: newStatus } : t
      ));
      alert(`Treatment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating treatment status:', error);
      alert('Failed to update treatment status. Please try again.');
    }
  };

  const handleBulkApproval = async (treatmentIds: string[]) => {
    try {
      const promises = treatmentIds.map(id =>
        treatmentApi.updateStatus(id, 'approved')
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r).length;

      if (successCount === treatmentIds.length) {
        setTreatments(prev => prev.map(t =>
          treatmentIds.includes(t.id) ? { ...t, status: 'approved' } : t
        ));
        alert(`Successfully approved ${successCount} treatments!`);
      } else {
        alert(`Approved ${successCount} out of ${treatmentIds.length} treatments.`);
      }
    } catch (error) {
      console.error('Error in bulk approval:', error);
      alert('Error in bulk approval. Please try again.');
    }
  };

  const pendingCount = treatments.filter(t => t.status === 'pending').length;
  const approvedCount = treatments.filter(t => t.status === 'approved').length;
  const rejectedCount = treatments.filter(t => t.status === 'rejected').length;

  if (isLoading) {
    return (
      <div className="pt-16 flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue-600"></div>
        <span className="ml-2">Loading treatments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 text-center py-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-medical-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Treatment Approval</h1>
          <p className="text-gray-600 mt-2">Review and approve/reject medical treatments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-3xl font-bold text-medical-green-600">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-medical-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-medical-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
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
                placeholder="Search by patient name, ID, or treatment code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {pendingCount > 0 && (
                <button
                  onClick={() => {
                    const pendingIds = treatments.filter(t => t.status === 'pending').map(t => t.id);
                    if (pendingIds.length > 0) {
                      handleBulkApproval(pendingIds);
                    }
                  }}
                  className="bg-medical-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-medical-green-700 transition-colors flex items-center space-x-2"
                >
                  <Check className="h-5 w-5" />
                  <span>Approve All Pending</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Treatments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Treatments for Review</h2>
          </div>

          {filteredTreatments.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No treatments found</h3>
              <p className="text-gray-600">No treatments match your current search and filter criteria.</p>
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
                      Treatment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code System
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTreatments.map((treatment) => (
                    <motion.tr
                      key={treatment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{treatment.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {treatment.patientId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{treatment.code}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{treatment.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          treatment.codeSystem === 'ICD-11' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {treatment.codeSystem}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {treatment.submittedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(treatment.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={treatment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {treatment.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(treatment.id, 'approved')}
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(treatment.id, 'rejected')}
                              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {treatment.status !== 'pending' && (
                          <span className="text-gray-400">Completed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTreatmentApproval;
