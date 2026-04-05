// src/pages/auth/Login.jsx - COMPLETELY FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';
// Navbar imported in layout
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaWifi,
  FaCloud,
  FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [serverStatus, setServerStatus] = useState('checking');
  const [loginError, setLoginError] = useState(null);

  const { login: contextLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '35584631622-tl8qqbeer98vbd4t11thjfpqfpv86dlp.apps.googleusercontent.com';

  // Check server status
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const health = await apiService.health.check();
        setServerStatus(health.healthy ? 'online' : 'offline');
        console.log(health.healthy ? '✅ Server is online' : '⚠️ Server is offline');
      } catch (error) {
        setServerStatus('offline');
        console.error('❌ Failed to check server status:', error);
      }
    };

    checkServerStatus();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('✅ User is authenticated, redirecting to dashboard');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      console.log('🔐 Attempting login with:', formData.email);

      const result = await contextLogin(formData.email, formData.password, rememberMe);

      if (result?.success) {
        console.log('✅ Login successful, waiting for redirect...');
        // Navigation is handled by the useEffect above
      } else {
        setLoginError(result?.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoginError(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      toast.loading('Setting up demo account...', { id: 'demo-login' });

      const demoUser = {
        _id: 'demo-user-id-' + Date.now(),
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'user'
      };

      localStorage.setItem('token', 'demo-token-' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(demoUser));

      // Force page reload to re-initialize auth
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('❌ Demo login error:', error);
      toast.error('Demo login failed', { id: 'demo-login' });
    } finally {
      setIsLoading(false);
    }
  };

  // Offline login
  const handleOfflineLogin = async () => {
    setIsLoading(true);
    try {
      toast.loading('Setting up offline session...', { id: 'offline-login' });

      const offlineUser = {
        _id: 'offline-user-' + Date.now(),
        email: formData.email || 'offline@example.com',
        name: formData.email?.split('@')[0] || 'Offline User',
        role: 'user'
      };

      localStorage.setItem('token', 'offline-token-' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(offlineUser));

      // Force page reload to re-initialize auth
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('❌ Offline login error:', error);
      toast.error('Failed to create offline session', { id: 'offline-login' });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };



  const getFeatures = () => {
    return serverStatus === 'online'
      ? [
        { icon: '🚀', text: 'AI-Powered Builder', desc: 'Create professional resumes' },
        { icon: '📊', text: 'Real-time Analytics', desc: 'Track performance' },
        { icon: '🎨', text: '10+ Templates', desc: 'Professional designs' },
        { icon: '🔒', text: 'Secure & Private', desc: 'Data protected' }
      ]
      : [
        { icon: '📱', text: 'Offline Mode', desc: 'Working without server' },
        { icon: '💾', text: 'Local Storage', desc: 'Data in browser' },
        { icon: '🎨', text: 'Templates Available', desc: 'All templates work' },
        { icon: '🔄', text: 'Auto-Sync', desc: 'Sync when online' }
      ];
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col">
        {/* Animated Background Blobs */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"
        />
        <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-40 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"
        />
        <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"
        />


        {/* Server Status Banner */}
        {serverStatus !== 'checking' && (
          <div className={`fixed top-16 left-0 right-0 z-40 py-2 px-4 text-center text-sm font-medium ${serverStatus === 'online'
              ? 'bg-green-50 text-green-700 border-b border-green-200'
              : 'bg-yellow-50 text-yellow-700 border-b border-yellow-200'
            }`}>
            <div className="flex items-center justify-center gap-2">
              {serverStatus === 'online' ? (
                <>
                  <FaWifi className="text-green-500" />
                  <span>Server is online - Full functionality available</span>
                </>
              ) : (
                <>
                  <FaCloud className="text-yellow-600" />
                  <FaExclamationTriangle className="text-yellow-600" />
                  <span>Offline mode - Some features limited</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="pt-24 flex items-center justify-center p-4 md:p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          <motion.div
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Brand Section */}
            <motion.div
              className="hidden lg:flex flex-col items-center justify-center text-center p-8 lg:p-12"
              variants={itemVariants}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {serverStatus === 'online' ? '📄✨' : '📱💾'}
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-left max-w-2xl"
                variants={itemVariants}
              >
                {getFeatures().map((feature, index) => (
                  <motion.div
                    key={`${feature.text}-${index}`}
                    className={`p-4 lg:p-5 rounded-xl border transition-all duration-300 hover:shadow-lg ${serverStatus === 'online'
                        ? 'bg-white/50 backdrop-blur-sm border-gray-200/50 hover:border-blue-200'
                        : 'bg-gray-100/50 border-gray-300/50 hover:border-yellow-300'
                      }`}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <span className="text-2xl lg:text-3xl flex-shrink-0">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm lg:text-base">{feature.text}</h3>
                        <p className="text-gray-600 text-xs lg:text-sm mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Login Form */}
            <motion.div className="relative" variants={itemVariants}>
              {/* Back button for mobile */}
              <motion.div
                className="lg:hidden mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
                >
                  <FaArrowLeft className="text-sm" />
                  <span>Back to Home</span>
                </Link>
              </motion.div>

              {/* Tabs */}
              <div className="flex space-x-2 mb-6 lg:mb-8 bg-gray-100 p-1 rounded-xl max-w-md mx-auto lg:mx-0">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'login'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {serverStatus === 'online' ? 'Sign In' : 'Offline Login'}
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'demo'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Demo
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login-form"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 xl:p-10 border border-white/50 w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg relative z-10"
                  >
                    <div className="text-center mb-6 lg:mb-8">
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
                        {serverStatus === 'online' ? 'Sign In' : 'Offline Access'}
                      </h2>
                      <p className="text-gray-600 text-sm lg:text-base">
                        {serverStatus === 'online'
                          ? 'Enter your credentials to access your account'
                          : 'Create a local session to explore features'}
                      </p>
                    </div>

                    {serverStatus === 'online' && (
                      <>
                        <div className="mb-4 lg:mb-6">
                          <GoogleOAuthButton
                            text="Continue with Google"
                            type="login"
                            variant="outline"
                            fullWidth={true}
                          />
                        </div>

                        <div className="flex items-center mb-6 lg:mb-8">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <span className="px-4 text-sm lg:text-base text-gray-500">Or with email</span>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      </>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required={serverStatus === 'online'}
                            className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm lg:text-base placeholder-gray-400 hover:border-gray-400"
                            placeholder="your@email.com"
                            disabled={isLoading}
                            autoComplete="email"
                          />
                        </div>
                      </motion.div>

                      {serverStatus === 'online' && (
                        <motion.div variants={itemVariants}>
                          <label htmlFor="password" className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <FaLock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className="w-full pl-10 lg:pl-12 pr-12 py-3 lg:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm lg:text-base placeholder-gray-400 hover:border-gray-400"
                              placeholder="••••••••"
                              disabled={isLoading}
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                              disabled={isLoading}
                            >
                              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {serverStatus === 'online' && (
                        <motion.div className="flex items-center justify-between" variants={itemVariants}>
                          <div className="flex items-center space-x-2">
                            <input
                              id="remember-me"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              disabled={isLoading}
                            />
                            <label htmlFor="remember-me" className="text-sm lg:text-base text-gray-700 select-none">
                              Remember me
                            </label>
                          </div>

                          <Link
                            to="/forgot-password"
                            className="text-sm lg:text-base font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </motion.div>
                      )}

                      {loginError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <p className="text-sm text-red-600">{loginError}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${serverStatus === 'online'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                            : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }`}
                        variants={itemVariants}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2 lg:space-x-3">
                            <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>
                              {serverStatus === 'online' ? 'Signing in...' : 'Creating offline session...'}
                            </span>
                          </div>
                        ) : (
                          serverStatus === 'online' ? 'Sign in to your account' : 'Create Offline Session'
                        )}
                      </motion.button>

                      {serverStatus === 'offline' && (
                        <motion.div
                          className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                          variants={itemVariants}
                        >
                          <p className="text-sm text-yellow-700">
                            ⚠️ <strong>Offline Mode:</strong> Your data will be stored locally.
                            Some features may not work without server connection.
                          </p>
                        </motion.div>
                      )}
                    </form>

                    <motion.div
                      className="text-center mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200"
                      variants={itemVariants}
                    >
                      <p className="text-gray-600 text-sm lg:text-base">
                        Don't have an account?{' '}
                        <Link
                          to="/register"
                          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors hover:underline"
                        >
                          Create account
                        </Link>
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="demo-form"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 xl:p-10 border border-white/50 w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg relative z-10"
                  >
                    <div className="text-center mb-6 lg:mb-8">
                      <div className="text-4xl lg:text-5xl mb-4">🚀</div>
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
                        Try Demo Account
                      </h2>
                      <p className="text-gray-600 text-sm lg:text-base">
                        Experience all features instantly with pre-loaded data
                      </p>
                    </div>

                    <motion.div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8" variants={itemVariants}>
                      {[
                        'Pre-loaded professional resume templates',
                        'Sample data for testing',
                        'No registration required',
                        'Full access to all features',
                        serverStatus === 'online' ? 'Cloud sync available' : 'Local data only'
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          className="flex items-center space-x-3 lg:space-x-4"
                          variants={itemVariants}
                          custom={index}
                        >
                          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-sm lg:text-base">✓</span>
                          </div>
                          <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.button
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 lg:py-4 px-4 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
                      variants={itemVariants}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2 lg:space-x-3">
                          <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Launching Demo...</span>
                        </div>
                      ) : (
                        'Launch Demo Account'
                      )}
                    </motion.button>

                    {serverStatus === 'offline' && (
                      <motion.div
                        className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        variants={itemVariants}
                      >
                        <p className="text-xs text-yellow-700">
                          ⚠️ Server is offline. Demo data will be stored locally.
                        </p>
                      </motion.div>
                    )}

                    <motion.div
                      className="text-center mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200"
                      variants={itemVariants}
                    >
                      <button
                        onClick={() => setActiveTab('login')}
                        className="text-sm lg:text-base text-blue-600 hover:text-blue-500 transition-colors hover:underline font-medium"
                      >
                        ← Back to {serverStatus === 'online' ? 'regular login' : 'offline login'}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="lg:hidden mt-6 text-center">
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors hover:underline"
                >
                  ← Back to Homepage
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default React.memo(Login);