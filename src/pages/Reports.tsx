import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  FileText, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('validation');
  const [codeSystem, setCodeSystem] = useState('all');

  const reportTypes = [
    { value: 'validation', label: 'Validation Summary' },
    { value: 'patient', label: 'Patient Records' },
    { value: 'code_usage', label: 'Code Usage Analysis' },
    { value: 'compliance', label: 'EHR Compliance' },
    { value: 'audit', label: 'Audit Report' }
  ];

  const dateRanges = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const codeSystems = [
    { value: 'all', label: 'All Systems' },
    { value: 'icd11', label: 'ICD-11 Only' },
    { value: 'namaste', label: 'NAMASTE Only' }
  ];

  const exportFormats = [
    { format: 'pdf', label: 'PDF', icon: FileText, color: 'bg-red-500' },
    { format: 'excel', label: 'Excel', icon: BarChart3, color: 'bg-green-500' },
    { format: 'json', label: 'JSON', icon: PieChart, color: 'bg-blue-500' }
  ];

  const mockReports = [
    {
      id: 1,
      name: 'Monthly Validation Report - January 2025',
      type: 'Validation Summary',
      generated: '2025-01-15',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'ICD-11 Code Usage Analysis',
      type: 'Code Usage Analysis',
      generated: '2025-01-10',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      name: 'EHR Compliance Audit Q4 2024',
      type: 'EHR Compliance',
      generated: '2025-01-05',
      size: '3.2 MB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Patient Records Export',
      type: 'Patient Records',
      generated: '2025-01-03',
      size: '5.1 MB',
      format: 'JSON'
    }
  ];

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    // In a real app, this would trigger the actual export
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download standardized medical coding reports</p>
        </div>

        {/* Report Generation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code System
              </label>
              <select
                value={codeSystem}
                onChange={(e) => setCodeSystem(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
              >
                {codeSystems.map(system => (
                  <option key={system.value} value={system.value}>
                    {system.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map(({ format, label, icon: Icon, color }) => (
                <motion.button
                  key={format}
                  onClick={() => handleExport(format)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Export as {label}</div>
                    <div className="text-sm text-gray-500">Download {format.toUpperCase()} format</div>
                  </div>
                  <Download className="h-5 w-5 text-gray-400 ml-auto" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockReports.map((report) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-medical-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-medical-blue-100 text-medical-blue-800 rounded-full">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{report.generated}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.format === 'PDF' ? 'bg-red-100 text-red-800' :
                        report.format === 'Excel' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-medical-blue-600 hover:text-medical-blue-700 mr-4">
                        Download
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        Share
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-medical-green-600 text-sm">↑ 12% this month</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-medical-blue-600" />
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
                <p className="text-gray-500 text-sm">Data Exported</p>
                <p className="text-2xl font-bold text-gray-900">284 MB</p>
                <p className="text-medical-green-600 text-sm">↑ 8% this month</p>
              </div>
              <div className="w-12 h-12 bg-medical-green-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-medical-green-600" />
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
                <p className="text-gray-500 text-sm">Avg. Generation Time</p>
                <p className="text-2xl font-bold text-gray-900">23s</p>
                <p className="text-medical-green-600 text-sm">↓ 15% faster</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
