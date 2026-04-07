// src/pages/auth/Callback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback, loginWithGoogle } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const processCallback = async () => {
      setStatus('processing');
      setError(null);

      try {
        const result = await handleOAuthCallback();

        if (!isMounted) return;

        if (result.success) {
          setStatus('success');
          toast.success(`Welcome${result.user?.name ? `, ${result.user.name}!` : '!'}`, {
            icon: '👋',
            duration: 3000
          });

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1200);
          return;
        }

        throw new Error(result.error || 'Authentication failed');
      } catch (err) {
        if (!isMounted) return;
        setStatus('error');
        setError(err.message || 'Authentication failed');

        if (err.message.includes('cancelled') || err.message.includes('denied')) {
          toast.error('Login cancelled. Please try again.');
        } else if (err.message.includes('cookies')) {
          toast.error('Please enable third-party cookies for Google login.');
        } else if (err.message.includes('network')) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error(err.message || 'Authentication failed.');
        }

        setTimeout(() => {
          navigate('/login', { replace: true, state: { error: err.message || 'Authentication failed' } });
        }, 4000);
      }
    };

    processCallback();

    const cleanupTimer = setTimeout(() => {
      if (window.location.search.includes('token') ||
          window.location.search.includes('error') ||
          window.location.search.includes('state')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(cleanupTimer);
    };
  }, [handleOAuthCallback, navigate, location]);

  const handleRetry = () => {
    loginWithGoogle();
  };

  const handleManualLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-4 sm:p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Completing Authentication</h2>
          <p className="text-gray-600 text-base lg:text-lg mb-8">Please wait while we verify your Google credentials...</p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/20 to-rose-50/10 p-4 sm:p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-200/50 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Authentication failed</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to complete Google login.'}</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <button onClick={handleRetry} className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Retry</button>
            <button onClick={handleManualLogin} className="px-4 py-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Login</button>
            <button onClick={handleGoHome} className="px-4 py-3 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-slate-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl border border-gray-200 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Successfully authenticated</h2>
        <p className="text-gray-600 mb-6">Redirecting you to the dashboard...</p>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;
