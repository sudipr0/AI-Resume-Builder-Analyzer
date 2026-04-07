// src/context/AuthContext.jsx - COMPLETELY FIXED VERSION
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user_data',
  REMEMBER_ME: 'remember_me',
  GOOGLE_STATE: 'google_auth_state',
  REDIRECT_PATH: 'auth_redirect'
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const initCalledRef = useRef(false);
  const verificationInProgressRef = useRef(false);

  // ==================== DEBUG AUTH STATE ====================
  useEffect(() => {
    console.log('🔐 Auth State:', {
      isAuthenticated: !!(token && user),
      hasToken: !!token,
      hasUser: !!user,
      tokenPreview: token ? `${token.substring(0, 15)}...` : 'none',
      userEmail: user?.email
    });
  }, [token, user]);

  // ==================== FIXED INITIALIZE AUTH ====================
  useEffect(() => {
    const initAuth = async () => {
      if (initCalledRef.current) {
        console.log('⏭️ [AuthContext] Initialization already in progress, skipping...');
        return;
      }

      initCalledRef.current = true;

      try {
        console.log('🔍 [AuthContext] Initializing authentication...');

        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        console.log('📦 [AuthContext] Storage check:', {
          hasUser: !!storedUser,
          hasToken: !!storedToken
        });

        if (storedUser && storedToken) {
          try {
            const parsedUser = JSON.parse(storedUser);

            // Set optimistically
            setUser(parsedUser);
            setToken(storedToken);

            // CRITICAL: Verify token BEFORE marking as authenticated
            console.log('🔍 Verifying stored token...');
            const verifyResult = await apiService.auth.verifyToken();

            if (!verifyResult.success || !verifyResult.valid) {
              console.warn('⚠️ [AuthContext] Token invalid on init, clearing session...');
              localStorage.removeItem(STORAGE_KEYS.TOKEN);
              localStorage.removeItem(STORAGE_KEYS.USER);
              setUser(null);
              setToken(null);
            } else {
              console.log('✅ [AuthContext] Token is valid on init');
              if (verifyResult.offline) {
                toast('Working in offline mode', { icon: '📴' });
              }
              // Update user if returned
              if (verifyResult.user && JSON.stringify(verifyResult.user) !== JSON.stringify(parsedUser)) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(verifyResult.user));
                setUser(verifyResult.user);
              }
            }
          } catch (parseError) {
            console.error('❌ [AuthContext] Failed to parse stored user:', parseError);
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            setUser(null);
            setToken(null);
          }
        } else {
          console.log('👤 [AuthContext] No stored auth data found');
          setUser(null);
          setToken(null);
        }

        setError(null);
      } catch (error) {
        console.error('❌ [AuthContext] Initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsInitializing(false);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ==================== FIXED LOGIN ====================
  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔐 [AuthContext] Login attempt:', { email });

      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const result = await apiService.auth.login(email, password);

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      console.log('✅ [AuthContext] Login successful:', {
        userId: result.user._id,
        email: result.user.email
      });

      // Save token and user
      if (result.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        setToken(result.token);
        console.log('📝 Token stored');
      }

      if (result.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
        setUser(result.user);
        console.log('📝 User data stored');
      }

      // CRITICAL: Verify token right after login
      console.log('🔍 Verifying token after login...');
      const verifyResult = await apiService.auth.verifyToken();

      if (!verifyResult.success || !verifyResult.valid) {
        console.warn('⚠️ Token verification failed after login');
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setToken(null);
        setUser(null);
        throw new Error('Authentication failed - invalid token');
      }

      console.log('✅ Token verified successfully after login');

      setError(null);

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }

      toast.success(`Welcome back, ${result.user.name || result.user.email}!`);

      console.log('📝 Login complete - State updated:', {
        token: !!result.token,
        user: !!result.user,
        isAuthenticated: !!(result.token && result.user)
      });

      return {
        success: true,
        user: result.user,
        token: result.token
      };

    } catch (error) {
      console.error('❌ [AuthContext] Login error:', error);

      let errorMessage = error.message || 'Login failed';
      setError(errorMessage);

      if (!errorMessage.includes('Please enter')) {
        toast.error(errorMessage, { duration: 5000 });
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== REGISTER ====================
  const register = useCallback(async (name, email, password, confirmPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📝 [AuthContext] Registration attempt:', { name, email });

      const errors = [];

      if (!name?.trim()) errors.push('Name is required');
      if (!email || !email.includes('@')) errors.push('Valid email is required');
      if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
      if (password !== confirmPassword) errors.push('Passwords do not match');

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const result = await apiService.auth.register({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password,
        confirmPassword
      });

      if (!result?.success) {
        throw new Error(result?.error || result?.message || 'Registration failed');
      }

      console.log('✅ [AuthContext] Registration successful:', result.user?.email);

      if (result.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        setToken(result.token);
        console.log('📝 Token stored');
      }

      if (result.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
        setUser(result.user);
        console.log('📝 User data stored');
      }

      // Verify token after registration
      const verifyResult = await apiService.auth.verifyToken();
      if (!verifyResult.success || !verifyResult.valid) {
        throw new Error('Token verification failed');
      }

      setError(null);
      toast.success('🎉 Account created successfully!');

      return {
        success: true,
        user: result.user,
        token: result.token
      };

    } catch (error) {
      console.error('❌ [AuthContext] Registration error:', error);

      let errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);

      if (!errorMessage.includes('required') && !errorMessage.includes('match')) {
        toast.error(errorMessage, { duration: 5000 });
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== LOGOUT ====================
  const logout = useCallback(async () => {
    console.log('👋 [AuthContext] Logging out...');

    setIsLoading(true);

    try {
      await apiService.auth.logout().catch(() => { });
    } catch (error) {
      console.warn('⚠️ [AuthContext] Logout API call failed:', error.message);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_STATE);
      localStorage.removeItem(STORAGE_KEYS.REDIRECT_PATH);

      setUser(null);
      setToken(null);
      setError(null);
      setIsLoading(false);

      console.log('✅ [AuthContext] Logout complete');
      toast.success('Logged out successfully!');

      // Navigate to home
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // ==================== GOOGLE OAUTH ====================
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const enabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';
      if (!enabled) {
        toast.error('Google login is not enabled');
        setIsLoading(false);
        return { success: false };
      }

      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(STORAGE_KEYS.GOOGLE_STATE, state);

      const redirectUri = `${window.location.origin}/auth/callback`;
      const authUrl = `${window.location.origin}/api/auth/google?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

      console.log('🌐 Redirecting to Google OAuth URL:', authUrl);
      window.location.href = authUrl;

      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Google OAuth error:', error);
      toast.error('Google login failed. Please try again.');
      setIsLoading(false);
      return { success: false, error: error?.message || 'Google login failed' };
    }
  }, []);

  // ==================== HANDLE OAUTH CALLBACK ====================
  const handleOAuthCallback = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userData = urlParams.get('user');
      const error = urlParams.get('error');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem(STORAGE_KEYS.GOOGLE_STATE);

      localStorage.removeItem(STORAGE_KEYS.GOOGLE_STATE);

      if (error) {
        throw new Error(decodeURIComponent(error));
      }

      if (state && storedState && state !== storedState) {
        throw new Error('Invalid Google OAuth state parameter');
      }

      if (token && userData) {
        const user = JSON.parse(decodeURIComponent(userData));

        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        setUser(user);
        setToken(token);
        window.history.replaceState({}, document.title, window.location.pathname);

        toast.success('Successfully logged in with Google!');
        return { success: true, user, token };
      }

      throw new Error('No authentication data received from Google');
    } catch (error) {
      console.error('❌ [AuthContext] OAuth callback error:', error);
      toast.error(`Authentication failed: ${error.message}`);
      return { success: false, error: error.message || 'OAuth callback failed' };
    }
  }, []);

  // ==================== VERIFY TOKEN ====================
  const verifyToken = useCallback(async () => {
    return apiService.auth.verifyToken();
  }, []);

  // ==================== COMPUTED VALUES ====================
  const isAuthenticated = useMemo(() => {
    return !!(token && user);
  }, [user, token]);

  // ==================== CONTEXT VALUE ====================
  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    error,
    isInitializing,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
    handleOAuthCallback,
    verifyToken,
    getUserId: () => user?._id || user?.id || null,
    getToken: () => token
  }), [
    user, token, isLoading, error, isInitializing, isAuthenticated,
    login, register, logout, loginWithGoogle, handleOAuthCallback, verifyToken
  ]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default React.memo(AuthProvider);