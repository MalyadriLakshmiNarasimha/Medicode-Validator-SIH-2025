import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import { mockPatients } from '../data/mockData';
import { Patient } from '../types';
import ValidationBadge from '../components/Common/ValidationBadge';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients(mockPatients);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalPatients: patients.length,
    validCodes: patients.reduce((acc, patient) => 
      acc + patient.diagnoses.filter(d => d.isValid).length + 
      patient.treatments.filter(t => t.isValid).length, 0),
    invalidCodes: patients.reduce((acc, patient) => 
      acc + patient.diagnoses.filter(d => !d.isValid).length + 
      patient.treatments.filter(t => !t.isValid).length, 0),
    recentValidations: patients.filter(patient => 
      new Date(patient.lastVisit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and validate medical codes across your patients</p>
          </div>
          <button className="mt-4 lg:mt-0 bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2">
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
                <p className="text-gray-500 text-sm">Valid Codes</p>
                <p className="text-3xl font-bold text-medical-green-600">{stats.validCodes}</p>
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
                <p className="text-gray-500 text-sm">Invalid Codes</p>
                <p className="text-3xl font-bold text-red-500">{stats.invalidCodes}</p>
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
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-3xl font-bold text-blue-600">{stats.recentValidations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
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
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading patients...</p>
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
                              <ValidationBadge 
                                isValid={diagnosis.isValid} 
                                codeSystem={diagnosis.codeSystem}
                                showTooltip={false}
                              />
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
                              <ValidationBadge 
                                isValid={treatment.isValid} 
                                codeSystem={treatment.codeSystem}
                                showTooltip={false}
                              />
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
                        <button className="text-medical-blue-600 hover:text-medical-blue-700">
                          View Details
                        </button>
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

export default Dashboard;
