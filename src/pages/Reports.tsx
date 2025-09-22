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
import { subDays, subMonths, subYears } from 'date-fns';
import { generatePdfReport } from '../utils/exportUtils';
import { mockPatients } from '../data/mockData';
import { Patient } from '../types';

interface MockReport {
  id: number;
  name: string;
  type: string;
  generated: string;
  size: string;
  format: 'PDF' | 'Excel' | 'JSON';
}

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('validation');
  const [codeSystem, setCodeSystem] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const initialReports: MockReport[] = [
    { id: 1, name: 'Monthly Validation Report - January 2025', type: 'Validation Summary', generated: '2025-01-15', size: '2.4 MB', format: 'PDF' },
    { id: 2, name: 'ICD-11 Code Usage Analysis', type: 'Code Usage Analysis', generated: '2025-01-10', size: '1.8 MB', format: 'Excel' },
    { id: 3, name: 'EHR Compliance Audit Q4 2024', type: 'EHR Compliance', generated: '2025-01-05', size: '3.2 MB', format: 'PDF' },
    { id: 4, name: 'Patient Records Export', type: 'Patient Records', generated: '2025-01-03', size: '5.1 MB', format: 'JSON' }
  ];

  const [reports, setReports] = useState<MockReport[]>(initialReports);

  const getFilteredPatients = (): Patient[] => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'last7days': startDate = subDays(now, 7); break;
      case 'last30days': startDate = subDays(now, 30); break;
      case 'last3months': startDate = subMonths(now, 3); break;
      case 'lastyear': startDate = subYears(now, 1); break;
      default: return mockPatients;
    }

    return mockPatients.filter(p => new Date(p.lastVisit) >= startDate);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/reports/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_type: reportType, date_range: dateRange, code_system: codeSystem }),
      });

      if (response.ok) {
        const newReport = await response.json();
        const reportForUI: MockReport = {
          id: newReport.id,
          name: newReport.name,
          type: newReport.report_type,
          generated: new Date(newReport.generated_at).toISOString().split('T')[0],
          size: 'Generated',
          format: 'PDF'
        };
        setReports(prev => [reportForUI, ...prev]);
      } else {
        console.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: string) => {
    const filteredPatients = getFilteredPatients();
    if (filteredPatients.length === 0) {
      alert(`No patient data found for the selected time range (${dateRange}).`);
      return;
    }

    if (format === 'pdf') generatePdfReport(filteredPatients);
    else if (format === 'json') {
      const jsonData = JSON.stringify(filteredPatients, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_report_${dateRange}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      const csvData = [
        ['Patient ID', 'Name', 'Age', 'Gender', 'Last Visit'],
        ...filteredPatients.map(p => [p.patientId, p.name, p.age, p.gender, p.lastVisit])
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_report_${dateRange}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent">
                {reportTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent">
                {dateRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code System</label>
              <select value={codeSystem} onChange={e => setCodeSystem(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent">
                {codeSystems.map(system => <option key={system.value} value={system.value}>{system.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map(({ format, label, icon: Icon, color }) => (
                <motion.button key={format} onClick={() => handleExport(format)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
            <button onClick={handleGenerateReport} disabled={isGenerating} className="bg-medical-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-wait">
              {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <BarChart3 className="h-5 w-5" />}
              <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <motion.tr key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-medical-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium bg-medical-blue-100 text-medical-blue-800 rounded-full">{report.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-1"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-500">{report.generated}</span></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${report.format === 'PDF' ? 'bg-red-100 text-red-800' : report.format === 'Excel' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{report.format}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleExport(report.format.toLowerCase())} className="text-medical-blue-600 hover:text-medical-blue-700 mr-4">Download</button>
                      <button className="text-gray-600 hover:text-gray-700">Share</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
