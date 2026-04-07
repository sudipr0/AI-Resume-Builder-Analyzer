// src/components/auth/GoogleOAuthButton.jsx - SIMPLE WORKING VERSION
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const GoogleOAuthButton = ({ text = 'Continue with Google', onClick, variant = 'outline', fullWidth = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (typeof onClick === 'function') {
        await onClick();
        return;
      }

      const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const frontendCallbackUrl = `${window.location.origin}/auth/callback`;
      const authUrl = `${backendUrl.replace(/\/$/, '')}/auth/google?redirect_uri=${encodeURIComponent(frontendCallbackUrl)}`;

      console.log('🌐 Starting Google OAuth...');
      console.log('🔗 URL:', authUrl);
      console.log('📝 Will return to:', frontendCallbackUrl);

      window.location.href = authUrl;
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error('Failed to start Google login');
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = 'flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium';
  const variantStyles = variant === 'solid'
    ? 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent'
    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  const widthStyle = fullWidth ? 'w-full' : 'inline-flex';

  return (
    <div className={widthStyle}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${baseStyles} ${variantStyles} ${widthStyle} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <FcGoogle className="w-5 h-5" />
            <span>{text}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default React.memo(GoogleOAuthButton);