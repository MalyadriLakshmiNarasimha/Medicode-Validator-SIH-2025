
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  Download,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { validationHistoryApi } from '../utils/api';

interface RejectedCode {
  id: string;
  submitted_code: string;
  submitted_code_system: string;
  validation_result: string;
  rejection_reason: string;
  validated_by: string;
  validated_at: string;
  patient_name: string;
  patient_id: string;
  doctor_name: string;
  suggestions?: string[];
  is_read: boolean;
}

const RejectedCodes: React.FC = () => {
  const [rejectedCodes, setRejectedCodes] = useState<RejectedCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<RejectedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCode, setSelectedCode] = useState<RejectedCode | null>(null);

  // Fetch rejected codes
  const fetchRejectedCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await validationHistoryApi.getRejected();
      const data = response as RejectedCode[];
      setRejectedCodes(data || []);
      setFilteredCodes(data || []);
    } catch (err) {
      setError('Failed to fetch rejected codes');
      console.error('Error fetching rejected codes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedCodes();
  }, []);

  // Filter codes based on search and filter criteria
  useEffect(() => {
    let filtered = rejectedCodes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(code =>
        code.submitted_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.rejection_reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(code => !code.is_read);
      } else if (selectedFilter === 'read') {
        filtered = filtered.filter(code => code.is_read);
      }
    }

    setFilteredCodes(filtered);
  }, [rejectedCodes, searchTerm, selectedFilter]);

  const handleMarkAsRead = async (codeId: string) => {
    try {
      // Update local state
      setRejectedCodes(prev =>
        prev.map(code =>
          code.id === codeId ? { ...code, is_read: true } : code
        )
      );
    } catch (err) {
      console.error('Error marking code as read:', err);
    }
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Code', 'System', 'Patient', 'Doctor', 'Reason', 'Date', 'Status'].join(','),
      ...filteredCodes.map(code => [
        code.submitted_code,
        code.submitted_code_system,
        code.patient_name,
        code.doctor_name,
        `"${code.rejection_reason}"`,
        new Date(code.validated_at).toLocaleString(),
        code.is_read ? 'Read' : 'Unread'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rejected-codes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatistics = () => {
    const total = rejectedCodes.length;
    const unread = rejectedCodes.filter(code => !code.is_read).length;
    const read = total - unread;
    const today = rejectedCodes.filter(code => {
      const codeDate = new Date(code.validated_at);
      const today = new Date();
      return codeDate.toDateString() === today.toDateString();
    }).length;

    return { total, unread, read, today };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-medical-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading rejected codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 text-red-600 mr-3" />
                Rejected Codes Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and review all rejected medical codes with detailed information
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchRejectedCodes}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleExportReport}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-orange-600">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-3xl font-bold text-green-600">{stats.read}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code, patient, doctor, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Codes</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Rejected Codes List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Rejected Codes ({filteredCodes.length})
            </h3>
          </div>

          {filteredCodes.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected codes found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'All submitted codes have been validated successfully.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCodes.map((code) => (
                <div
                  key={code.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !code.is_read ? 'bg-red-50 border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Code and System */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-2 h-2 rounded-full ${!code.is_read ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span className="text-lg font-semibold text-gray-900">
                          {code.submitted_code}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {code.submitted_code_system}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Rejected
                        </span>
                      </div>

                      {/* Rejection Reason */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                            <p className="text-sm text-red-700">{code.rejection_reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Patient and Doctor Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{code.patient_name}</p>
                            <p className="text-xs text-gray-500">Patient ID: {code.patient_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{code.doctor_name}</p>
                            <p className="text-xs text-gray-500">Validated by</p>
                          </div>
                        </div>
                      </div>

                      {/* Validation Details */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Validated: {new Date(code.validated_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            code.is_read
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {code.is_read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!code.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(code.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Mark Read</span>
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed View Modal */}
        {selectedCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Code Rejection Details</h2>
                  <button
                    onClick={() => setSelectedCode(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Submitted Code</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedCode.submitted_code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Code System</label>
                      <p className="text-gray-900">{selectedCode.submitted_code_system}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-1">
                      <p className="text-red-800">{selectedCode.rejection_reason}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Patient</label>
                      <p className="text-gray-900">{selectedCode.patient_name}</p>
                      <p className="text-sm text-gray-500">ID: {selectedCode.patient_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Doctor</label>
                      <p className="text-gray-900">{selectedCode.doctor_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Validation Date</label>
                      <p className="text-gray-900">{new Date(selectedCode.validated_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCode.is_read
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedCode.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedCodes;
