import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  Users, 
  BarChart3,
  ArrowRight 
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'EHR Compliance',
      description: 'Fully compliant with India\'s Electronic Health Record standards and regulations.'
    },
    {
      icon: Zap,
      title: 'Real-time Validation',
      description: 'Instant validation of diagnosis and treatment codes with intelligent suggestions.'
    },
    {
      icon: Globe,
      title: 'Dual Code Systems',
      description: 'Supports both WHO ICD-11 and NAMASTE (Ayush) coding systems seamlessly.'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Secure access control for doctors, medical coders, auditors, and administrators.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics and standardized reporting for better insights.'
    },
    {
      icon: Activity,
      title: 'EMR Integration',
      description: 'Easy integration with existing hospital EMR systems via REST APIs.'
    }
  ];

  const stats = [
    { label: 'Healthcare Facilities', value: '500+' },
    { label: 'Codes Validated Daily', value: '10,000+' },
    { label: 'Accuracy Rate', value: '99.8%' },
    { label: 'API Uptime', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Medical Code Validation
                <span className="block text-medical-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Validate patient diagnosis and treatment codes using WHO ICD-11 and NAMASTE systems. 
                Ensure compliance with India's EHR standards and integrate seamlessly with your EMR.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/login"
                className="bg-medical-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-medical-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="border-2 border-medical-blue-600 text-medical-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-medical-blue-50 transition-colors"
              >
                Sign Up Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-medical-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediCode Validator?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for Indian healthcare providers with comprehensive code validation and seamless integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-medical-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medical-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Streamline Your Medical Coding?
            </h2>
            <p className="text-xl text-medical-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of healthcare facilities already using MediCode Validator for accurate, compliant medical coding.
            </p>
            <Link
              to="/signup"
              className="bg-white text-medical-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
