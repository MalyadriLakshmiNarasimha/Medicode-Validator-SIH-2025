import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { generateAnalyticsData } from '../data/mockData';
import { TrendingUp, TrendingDown, Activity, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const Analytics: React.FC = () => {
  const data = generateAnalyticsData();

  const overviewStats = [
    {
      title: 'Total Validations',
      value: '12,847',
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
      value: '94.8%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
      value: '127',
      change: '-15.3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Visualize code usage trends and validation metrics</p>
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
              <LineChart data={data.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
                  data={data.codeUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.codeUsage.map((entry, index) => (
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
              <BarChart data={data.validationAccuracy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Validation Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.validationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

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
      </div>
    </div>
  );
};

export default Analytics;
