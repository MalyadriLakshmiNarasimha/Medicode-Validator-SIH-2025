import React, { useState } from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import {
  Users,
  Settings,
  Shield,
=======
import { 
  Users, 
  Settings, 
  Shield, 
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
  Database,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
<<<<<<< HEAD
  UserPlus,
  CheckCircle
=======
  UserPlus
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
} from 'lucide-react';
import { generateMockPatients } from '../data/mockData';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
<<<<<<< HEAD
    { id: 'treatments', label: 'Treatment Approval', icon: CheckCircle },
=======
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'datasets', label: 'Code Datasets', icon: Database },
    { id: 'system', label: 'System Settings', icon: Settings }
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@cityhospital.com',
      role: 'Doctor',
      organization: 'City General Hospital',
      status: 'Active',
      lastLogin: '2025-01-15T10:30:00Z',
      validations: 1247
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@aiims.in',
      role: 'Medical Coder',
      organization: 'AIIMS Delhi',
      status: 'Active',
      lastLogin: '2025-01-15T09:15:00Z',
      validations: 2156
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@fortis.com',
      role: 'Auditor',
      organization: 'Fortis Healthcare',
      status: 'Inactive',
      lastLogin: '2025-01-10T14:20:00Z',
      validations: 945
    },
    {
      id: 4,
      name: 'Admin User',
      email: 'admin@medicode.com',
      role: 'Administrator',
      organization: 'MediCode Validator',
      status: 'Active',
      lastLogin: '2025-01-15T11:45:00Z',
      validations: 0
    }
  ];

  const systemSettings = [
    {
      category: 'Validation Rules',
      settings: [
        { name: 'ICD-11 Strict Mode', value: true, description: 'Enforce strict validation for ICD-11 codes' },
        { name: 'NAMASTE Auto-suggestions', value: true, description: 'Enable automatic code suggestions for NAMASTE' },
        { name: 'Batch Processing', value: false, description: 'Allow batch validation of multiple codes' }
      ]
    },
    {
      category: 'Security',
      settings: [
        { name: 'Two-Factor Authentication', value: true, description: 'Require 2FA for all admin users' },
        { name: 'Session Timeout', value: '30 minutes', description: 'Automatic logout after inactivity' },
        { name: 'API Rate Limiting', value: true, description: 'Limit API requests per minute' }
      ]
    },
    {
      category: 'Data Management',
      settings: [
        { name: 'Auto Backup', value: true, description: 'Daily automatic database backups' },
        { name: 'Data Retention', value: '7 years', description: 'Patient data retention period' },
        { name: 'Export Encryption', value: true, description: 'Encrypt all data exports' }
      ]
    }
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* User Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>Filter</span>
          </button>
          <button className="bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-medical-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-medical-blue-600 font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Doctor' ? 'bg-medical-blue-100 text-medical-blue-800' :
                      user.role === 'Medical Coder' ? 'bg-medical-green-100 text-medical-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.organization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active' ? 'bg-medical-green-100 text-medical-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.validations.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-medical-blue-600 hover:text-medical-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {systemSettings.map((category, categoryIndex) => (
        <div key={category.category} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
          <div className="space-y-4">
            {category.settings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{setting.name}</div>
                  <div className="text-sm text-gray-500">{setting.description}</div>
                </div>
                <div className="ml-4">
                  {typeof setting.value === 'boolean' ? (
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.value ? 'bg-medical-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-sm text-gray-900">{setting.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage users, roles, datasets, and system configuration</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-medical-blue-500 text-medical-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'users' && renderUserManagement()}
<<<<<<< HEAD
          {activeTab === 'treatments' && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <CheckCircle className="h-16 w-16 text-medical-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Approval</h3>
              <p className="text-gray-600 mb-6">Review and approve/reject medical treatments submitted by healthcare providers</p>
              <a
                href="/admin/treatments"
                className="bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Go to Treatment Approval</span>
              </a>
            </div>
          )}
=======
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'roles' && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Roles & Permissions</h3>
              <p className="text-gray-600">Configure user roles and permission levels</p>
            </div>
          )}
          {activeTab === 'datasets' && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Datasets</h3>
              <p className="text-gray-600">Manage ICD-11 and NAMASTE code databases</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
