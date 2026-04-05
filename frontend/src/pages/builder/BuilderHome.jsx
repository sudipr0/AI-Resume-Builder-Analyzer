// src/pages/builder/BuilderHome.jsx - IMPROVED VERSION
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

// Icons
import {
  Plus,
  Upload,
  Layout,
  ChevronRight,
  FileText,
  Sparkles,
  Clock,
  Star,
  Zap
} from 'lucide-react';

const BuilderHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(null);

  const creationOptions = [
    {
      id: 'scratch',
      title: 'Start from Scratch',
      description: 'Build a resume from the ground up with our AI-powered builder',
      icon: <Plus className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-blue-600 to-indigo-600', // Matches your navbar gradient
      delay: 0.1
    },
    {
      id: 'upload',
      title: 'Upload & Edit',
      description: 'Upload an existing resume (PDF, DOCX) to edit and enhance',
      icon: <Upload className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-purple-600 to-pink-600', // Matches your new-resume-btn gradient
      delay: 0.2
    },
    {
      id: 'templates',
      title: 'Browse Templates',
      description: 'Choose from 12+ professional, ATS-friendly templates',
      icon: <Layout className="w-8 h-8" />,
      gradient: 'bg-gradient-to-br from-green-600 to-emerald-600', // Matches your export button
      delay: 0.3
    }
  ];

  const handleOptionClick = async (optionId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to create a resume');
      navigate('/login');
      return;
    }

    setActiveLoading(optionId);
    setIsLoading(true);

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (optionId) {
        case 'scratch':
          navigate('/builder/new', { state: { importedData: {} } });
          break;
        case 'upload':
          navigate('/builder/upload');
          break;
        case 'templates':
          navigate('/builder/templates');
          break;
        default:
          navigate('/builder/new', { state: { importedData: {} } });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Something went wrong');
    } finally {
      setActiveLoading(null);
      setIsLoading(false);
    }
  };

  // Quick Stats (you can add real data later)
  const stats = [
    { label: 'Resumes Created', value: '10K+', icon: <FileText className="w-4 h-4" /> },
    { label: 'ATS Score Avg', value: '85%', icon: <Zap className="w-4 h-4" /> },
    { label: 'Templates', value: '12+', icon: <Layout className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col">
      {/* Animated Background Blobs */}
      <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none z-0"
      />
      <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-40 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none z-0"
      />
      <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none z-0"
      />
      
      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Message for Authenticated Users */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-gray-600">
                Welcome back, <span className="font-semibold text-gray-900">{user.name || 'User'}</span>! 👋
              </p>
            </motion.div>
          )}

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Create Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}Perfect Resume
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Build, upload, or choose from templates. Our AI-powered builder helps you create resumes that get noticed by recruiters and ATS systems.
            </p>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {stat.icon}
                </div>
                <div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm ml-1">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationOptions.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: option.delay }}
                whileHover={{ y: -8 }}
                className="relative group h-full"
              >
                <div className="relative h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl hover:bg-white/80 transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl ${option.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="text-white">
                      {option.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Get Started Button - Styled like your navbar new-resume-btn */}
                  <button
                    onClick={() => handleOptionClick(option.id)}
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold transition-all duration-300 group-hover:shadow-lg"
                  >
                    {activeLoading === option.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Optional: Add a small feature tag */}
                  {option.id === 'templates' && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                      NEW
                    </span>
                  )}
                  {option.id === 'upload' && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md">
                      PDF/DOCX
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA for non-authenticated users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-600 mb-4">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>AI-powered • ATS-optimized • Free to start</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BuilderHome);