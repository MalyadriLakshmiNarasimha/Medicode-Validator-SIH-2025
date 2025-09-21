<<<<<<< HEAD
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { mockPatients } from '../data/mockData';
import { subDays, subMonths, format as formatDate, startOfDay, eachDayOfInterval, startOfWeek, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, Users, CheckCircle, AlertTriangle } from 'lucide-react';

type DateRange = 'last7days' | 'last30days' | 'last3months' | 'last6months';

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('last6months');

  const analyticsData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let interval;
    let labelFormat: string;

    switch (dateRange) {
      case 'last7days':
        startDate = subDays(now, 6);
        interval = { start: startOfDay(startDate), end: now };
        labelFormat = 'MMM dd';
        break;
      case 'last30days':
        startDate = subDays(now, 29);
        interval = { start: startOfDay(startDate), end: now };
        labelFormat = 'MMM dd';
        break;
      case 'last3months':
        startDate = subMonths(now, 2);
        interval = { start: startOfWeek(startDate), end: now };
        labelFormat = 'MMM dd';
        break;
      case 'last6months':
      default:
        startDate = subMonths(now, 5);
        interval = { start: startOfDay(startDate), end: now };
        labelFormat = 'MMM';
        break;
    }

    const filteredPatients = mockPatients.filter(p => new Date(p.lastVisit) >= startDate);
    const allCodes = filteredPatients.flatMap(p => [...p.diagnoses, ...p.treatments]);

    // Code Usage (Pie Chart) - based on filtered data
    const icd11Count = allCodes.filter(c => c.codeSystem === 'ICD-11').length;
    const namasteCount = allCodes.filter(c => c.codeSystem === 'NAMASTE').length;
    const codeUsage = [
      { name: 'ICD-11', value: icd11Count, fill: '#3b82f6' },
      { name: 'NAMASTE', value: namasteCount, fill: '#22c55e' }
    ];

    // Validation Accuracy (Bar Chart) - based on filtered data
    const approvedCount = allCodes.filter(c => c.status === 'approved').length;
    const rejectedCount = allCodes.filter(c => c.status === 'rejected').length;
    const pendingCount = allCodes.filter(c => c.status === 'pending').length;
    const validationAccuracy = [
      { category: 'Approved', count: approvedCount, fill: '#22c55e' },
      { category: 'Rejected', count: rejectedCount, fill: '#ef4444' },
      { category: 'Pending', count: pendingCount, fill: '#f59e0b' }
    ];

    // Validation Trends (Line/Bar Chart) - dynamic grouping
    let trendLabels: Date[];
    if (dateRange === 'last7days' || dateRange === 'last30days') {
        trendLabels = eachDayOfInterval(interval);
    } else if (dateRange === 'last3months') {
        trendLabels = eachWeekOfInterval(interval, { weekStartsOn: 1 });
    } else { // last6months
        trendLabels = eachMonthOfInterval(interval);
    }

    const dataMap = new Map<string, { label: string; icd11: number; namaste: number; total: number }>();
    trendLabels.forEach(date => {
        const label = formatDate(date, labelFormat);
        dataMap.set(label, { label, icd11: 0, namaste: 0, total: 0 });
    });

    filteredPatients.forEach(patient => {
        const visitDate = new Date(patient.lastVisit);
        let key: string;
        if (dateRange === 'last3months') {
            key = formatDate(startOfWeek(visitDate, { weekStartsOn: 1 }), labelFormat);
        } else {
            key = formatDate(visitDate, labelFormat);
        }

        if (dataMap.has(key)) {
            const entry = dataMap.get(key)!;
            const patientIcd11 = patient.diagnoses.filter(d => d.codeSystem === 'ICD-11').length + patient.treatments.filter(t => t.codeSystem === 'ICD-11').length;
            const patientNamaste = patient.diagnoses.filter(d => d.codeSystem === 'NAMASTE').length + patient.treatments.filter(t => t.codeSystem === 'NAMASTE').length;
            entry.icd11 += patientIcd11;
            entry.namaste += patientNamaste;
            entry.total += patientIcd11 + patientNamaste;
        }
    });

    const validationTrends = Array.from(dataMap.values());

    return { codeUsage, validationAccuracy, validationTrends, allCodes };
  }, [dateRange]);
=======
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { generateAnalyticsData } from '../data/mockData';
import { TrendingUp, TrendingDown, Activity, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const Analytics: React.FC = () => {
  const data = generateAnalyticsData();
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48

  const overviewStats = [
    {
      title: 'Total Validations',
<<<<<<< HEAD
      value: analyticsData.allCodes.length.toLocaleString(),
=======
      value: '12,847',
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Accuracy Rate',
<<<<<<< HEAD
      value: analyticsData.allCodes.length > 0 ? `${((analyticsData.validationAccuracy[0].count / analyticsData.allCodes.length) * 100).toFixed(1)}%` : '0.0%',
=======
      value: '94.8%',
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
<<<<<<< HEAD
      value: analyticsData.validationAccuracy[2].count,
=======
      value: '127',
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
      change: '-15.3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

<<<<<<< HEAD
  const dateRanges: { value: DateRange; label: string }[] = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
  ];
=======
  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
<<<<<<< HEAD
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Visualize code usage trends and validation metrics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-transparent"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
=======
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Visualize code usage trends and validation metrics</p>
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend === 'up' ? 'text-medical-green-600' : 'text-red-500'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-medical-blue-100' :
                  stat.color === 'green' ? 'bg-medical-green-100' :
                  stat.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-medical-blue-600' :
                    stat.color === 'green' ? 'text-medical-green-600' :
                    stat.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Validation Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
<<<<<<< HEAD
              <LineChart data={analyticsData.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
=======
              <LineChart data={data.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="icd11" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="ICD-11"
                />
                <Line 
                  type="monotone" 
                  dataKey="namaste" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="NAMASTE"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Code System Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Code System Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
<<<<<<< HEAD
                  data={analyticsData.codeUsage}
=======
                  data={data.codeUsage}
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
<<<<<<< HEAD
                  {analyticsData.codeUsage.map((entry, index) => (
=======
                  {data.codeUsage.map((entry, index) => (
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Validation Accuracy & Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Validation Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Accuracy</h3>
            <ResponsiveContainer width="100%" height={300}>
<<<<<<< HEAD
              <BarChart data={analyticsData.validationAccuracy}>
=======
              <BarChart data={data.validationAccuracy}>
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
<<<<<<< HEAD
                <Bar dataKey="count">
                  {analyticsData.validationAccuracy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
=======
                <Bar dataKey="count" fill="#3b82f6" />
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Validation Volume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
<<<<<<< HEAD
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" name="Total Validations" />
=======
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Validation Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" />
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
<<<<<<< HEAD
=======

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-medical-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-medical-blue-600" />
                <span className="font-medium text-medical-blue-900">ICD-11 Adoption</span>
              </div>
              <p className="text-sm text-medical-blue-700">
                ICD-11 code usage has increased by 23% this quarter, showing strong adoption across healthcare facilities.
              </p>
            </div>

            <div className="p-4 bg-medical-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-medical-green-600" />
                <span className="font-medium text-medical-green-900">Validation Accuracy</span>
              </div>
              <p className="text-sm text-medical-green-700">
                Overall validation accuracy has improved to 94.8%, exceeding our target of 90% for clinical coding standards.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">NAMASTE Integration</span>
              </div>
              <p className="text-sm text-orange-700">
                NAMASTE code validation requires attention, with 15% of submissions needing manual review for Ayush treatments.
              </p>
            </div>
          </div>
        </motion.div>
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
      </div>
    </div>
  );
};

export default Analytics;
