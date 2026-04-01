// src/services/api.js - COMPLETE FIXED VERSION WITH BETTER ERROR HANDLING
import axios from 'axios';
import { toast } from 'react-hot-toast';

// ==================== CONFIGURATION ====================
const API_BASE_URL = (() => {
  let url = import.meta.env?.VITE_API_URL || 'http://localhost:5001';
  url = url.replace(/\/api\/?$/, '');
  url = url.endsWith('/') ? url.slice(0, -1) : url;
  console.log('🚀 API Base URL:', url);
  return url;
})();

const ENV = import.meta.env.MODE || 'development';

// ==================== ADVANCED LOGGER ====================
const logger = {
  info: (msg, data) => ENV === 'development' && console.log(`📘 ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`⚠️ ${msg}`, data || ''),
  error: (msg, err) => console.error(`❌ ${msg}`, err || ''),
  success: (msg, data) => console.log(`✅ ${msg}`, data || ''),
  api: (msg, data) => ENV === 'development' && console.log(`🌐 ${msg}`, data || ''),
  debug: (msg, data) => {
    if (ENV === 'development' && import.meta.env.VITE_DEBUG === 'true') {
      console.debug(`🔍 ${msg}`, data || '');
    }
  }
};

// ==================== REQUEST DEDUPLICATION ====================
const pendingRequests = new Map();
const requestCache = new Map();
const CACHE_TTL = 5000; // 5 seconds

const dedupRequest = async (key, fn, skipCache = false) => {
  if (!skipCache && requestCache.has(key)) {
    const { data, timestamp } = requestCache.get(key);
    if (Date.now() - timestamp < CACHE_TTL) {
      logger.debug(`📦 Cache hit: ${key}`);
      return data;
    }
    requestCache.delete(key);
  }

  if (pendingRequests.has(key)) {
    logger.debug(`⏭️ Dedup: ${key}`);
    return pendingRequests.get(key);
  }

  const promise = fn().then(data => {
    requestCache.set(key, { data, timestamp: Date.now() });
    return data;
  }).finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
};

// ==================== FIXED TOKEN MANAGEMENT ====================
const tokenManager = {
  getToken: () => localStorage.getItem('token'),

  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
  },

  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  },

  isValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Check if token has valid structure (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        logger.warn('Token has invalid structure');
        // Don't remove token here - let the interceptor handle it
        return false;
      }

      // Try to decode payload
      const payload = JSON.parse(atob(parts[1]));

      if (!payload.exp) {
        logger.debug('Token has no expiration - treating as valid');
        return true;
      }

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const tolerance = 5 * 60 * 1000; // 5 minutes tolerance

      return (expirationTime + tolerance) > currentTime;
    } catch (error) {
      logger.warn('Token validation error:', error.message);
      return false;
    }
  }
};

// ==================== USER MANAGEMENT ====================
const userManager = {
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem('user_data');
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error parsing user data', error);
      return null;
    }
  },

  getUserId: () => {
    const user = userManager.getCurrentUser();
    return user?._id || user?.id || null;
  },

  isAuthenticated: () => {
    return !!(tokenManager.getToken() && userManager.getCurrentUser());
  }
};

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url && !config.url.startsWith('http')) {
      if (!config.url.startsWith('/api') && !config.url.startsWith('/health')) {
        config.url = `/api${config.url}`;
      }
    }

    logger.api(`${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      tokenValid: token ? tokenManager.isValid() : false
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== FIXED RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const url = config?.url || 'unknown';

    if (!response) {
      logger.error('Network error', { url, error: error.message });
      if (!url.includes('/health')) {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }

    const { status, data } = response;

    if (status === 401) {
      logger.warn('Authentication failed', { url });

      if (url.includes('/auth/')) {
        logger.info('Auth endpoint 401 - not clearing token');
        return Promise.reject(error);
      }

      if (url.includes('/resumes') || url.includes('/dashboard')) {
        logger.info('Data endpoint 401 - may be normal for new user');
        return Promise.reject(error);
      }

      logger.warn('Clearing token due to 401 on protected endpoint');
      tokenManager.removeToken();

      const isAuthPage = window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');

      if (!isAuthPage) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }

    if (status === 400) {
      logger.error('Bad request:', { url, data });
      // Log the full error for debugging
      console.error('🔍 Server validation error:', data);
    }

    if (status === 403) {
      logger.error('Access forbidden:', { url });
      toast.error('You don\'t have permission to perform this action.');
    }

    if (status === 404) {
      logger.warn('Resource not found:', url);
    }

    if (status === 500) {
      logger.error('Server error:', { url, data });
      if (!url.includes('/health')) {
        toast.error('Server error. Please try again later.');
      }
    }

    return Promise.reject(error);
  }
);

// ==================== CORE API METHODS ====================
const coreApi = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// ==================== AUTH SERVICE ====================
const authService = {
  isAuthenticated: userManager.isAuthenticated,
  getCurrentUser: userManager.getCurrentUser,
  getUserId: userManager.getUserId,

  async login(email, password) {
    try {
      logger.api('POST /auth/login', { email });

      const response = await dedupRequest(`login:${email}`, () =>
        coreApi.post('/auth/login', {
          email: email.trim().toLowerCase(),
          password
        })
      );

      const { token, user } = response;
      if (token && user) {
        tokenManager.setToken(token);
        localStorage.setItem('user_data', JSON.stringify(user));
        logger.success('Login successful', { userId: user._id });
        return { success: true, token, user };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      logger.error('Login failed:', error);
      let message = 'Login failed. Please check your credentials.';
      if (error.response?.status === 401) message = 'Invalid email or password.';
      else if (error.response?.status === 404) message = 'Login service unavailable.';
      else if (error.message) message = error.message;
      throw new Error(message);
    }
  },

  async register(userData) {
    try {
      const sanitizedData = {
        name: String(userData.name).trim(),
        email: String(userData.email).trim().toLowerCase(),
        password: userData.password,
        confirmPassword: userData.confirmPassword
      };

      const response = await dedupRequest(`register:${sanitizedData.email}`, () =>
        coreApi.post('/auth/register', sanitizedData)
      );

      const { token, user } = response;
      if (token && user) {
        tokenManager.setToken(token);
        localStorage.setItem('user_data', JSON.stringify(user));
        logger.success('Registration successful', { userId: user._id });
        return { success: true, token, user };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      logger.error('Registration failed:', error);
      let message = 'Registration failed. Please try again.';
      if (error.response?.status === 409) message = 'Email already exists.';
      else if (error.response?.status === 400) {
        message = error.response.data?.message || 'Invalid registration data.';
      }
      throw new Error(message);
    }
  },

  async logout() {
    try {
      if (this.isAuthenticated()) {
        await coreApi.post('/auth/logout').catch(() => { });
      }
    } finally {
      tokenManager.removeToken();
      localStorage.removeItem('user_data');
      localStorage.removeItem('local_resumes');
      localStorage.removeItem('demo_user_id');
    }
    return { success: true };
  },

  async verifyToken() {
    return dedupRequest('auth:verify', async () => {
      try {
        const token = tokenManager.getToken();
        if (!token) {
          logger.debug('No token to verify');
          return { success: false, valid: false, authenticated: false };
        }

        if (!navigator.onLine) {
          logger.info('📴 Offline mode - using cached user');
          const user = userManager.getCurrentUser();
          return {
            success: true,
            valid: true,
            authenticated: true,
            offline: true,
            user
          };
        }

        logger.debug('Verifying token with backend');
        const response = await coreApi.get('/auth/verify');
        const result = response.data || response;

        logger.success('Token verified successfully');
        return {
          success: true,
          valid: true,
          authenticated: true,
          user: result.user || result,
          offline: false
        };
      } catch (error) {
        logger.warn('Token verification failed:', error.message);

        if (error.response?.status === 401) {
          logger.warn('Token rejected by backend - removing');
          tokenManager.removeToken();
          return { success: false, valid: false, authenticated: false };
        }

        if (error.message.includes('Network Error') || !navigator.onLine) {
          const user = userManager.getCurrentUser();
          if (user) {
            logger.info('Network error - using cached user');
            return {
              success: true,
              valid: true,
              authenticated: true,
              offline: true,
              user
            };
          }
        }

        return { success: false, valid: false, authenticated: false };
      }
    });
  }
};

// ==================== COMPLETE RESUME SERVICE ====================
const resumeService = {
  // GET ALL RESUMES
  async getUserResumes() {
    try {
      if (!tokenManager.getToken()) return [];
      logger.info('Fetching user resumes...');

      const response = await dedupRequest('resumes:list', () =>
        coreApi.get('/resumes').catch(err => {
          if (err.response?.status === 404) {
            logger.info('No resumes found (404)');
            return [];
          }
          throw err;
        })
      );

      const resumes = Array.isArray(response) ? response : response?.data || [];
      logger.success(`Fetched ${resumes.length} resumes`);
      return resumes;
    } catch (error) {
      logger.error('Failed to fetch resumes:', error);
      return [];
    }
  },

  // GET SINGLE RESUME
  async getResume(id) {
    try {
      if (!tokenManager.getToken()) throw new Error('Not authenticated');
      logger.info(`Fetching resume: ${id}`);

      const response = await dedupRequest(`resume:${id}`, () =>
        coreApi.get(`/resumes/${id}`)
      );

      const resume = response?.data || response;
      logger.success(`Fetched resume: ${id}`);
      return resume;
    } catch (error) {
      logger.error(`Failed to fetch resume ${id}:`, error);
      throw error;
    }
  },

  // CREATE RESUME - FIXED with templateSettings
  async createResume(resumeData) {
    try {
      const userId = userManager.getUserId();
      if (!userId) throw new Error('Not authenticated');

      logger.info('Creating resume with title:', resumeData.title);

      // Log the payload for debugging
      console.log('📦 Creating resume with data:', JSON.stringify(resumeData, null, 2));

      // Ensure templateSettings has valid values
      const validFonts = ["Roboto", "Inter", "Montserrat", "Open Sans", "Lato", "Poppins", "Merriweather"];

      // Create templateSettings with defaults if not provided
      const templateSettings = resumeData.templateSettings || {
        templateName: resumeData.template || 'modern',
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#10b981',
          background: '#ffffff',
          text: '#000000',
          header: '#1e40af'
        },
        font: 'Roboto',
        fontSize: 'medium',
        spacing: 'normal',
        showPhoto: false,
        layout: 'single-column'
      };

      // Capitalize font name if it exists
      if (templateSettings.font) {
        const font = templateSettings.font.charAt(0).toUpperCase() +
          templateSettings.font.slice(1).toLowerCase();
        templateSettings.font = validFonts.includes(font) ? font : "Roboto";
      } else {
        templateSettings.font = "Roboto";
      }

      const payload = {
        title: resumeData.title || 'My Resume',
        summary: resumeData.summary || '',
        personalInfo: {
          firstName: resumeData.personalInfo?.firstName || '',
          lastName: resumeData.personalInfo?.lastName || '',
          email: resumeData.personalInfo?.email || '',
          phone: resumeData.personalInfo?.phone || '',
          location: resumeData.personalInfo?.location || ''
        },
        experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
        education: Array.isArray(resumeData.education) ? resumeData.education : [],
        skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
        projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
        certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
        languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
        template: resumeData.template || 'modern',
        templateSettings: templateSettings,
        status: resumeData.status || 'draft',
        tags: Array.isArray(resumeData.tags) ? resumeData.tags : [],
        isPublic: resumeData.isPublic || false,
        user: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      logger.api('POST /resumes', { title: payload.title });

      const response = await coreApi.post('/resumes', payload);
      const created = response?.data || response;

      logger.success('Resume created successfully:', created._id);
      return created;
    } catch (error) {
      logger.error('Failed to create resume:', error);

      if (error.response?.status === 400) {
        console.error('🔍 Server validation error:', error.response.data);
        const errors = error.response.data?.errors ||
          error.response.data?.message ||
          'Invalid resume data';
        throw new Error(Array.isArray(errors) ? errors.join(', ') : errors);
      }
      throw error;
    }
  },

  // UPDATE RESUME - FIXED with templateSettings
  async updateResume(id, resumeData) {
    try {
      logger.info(`Updating resume: ${id}`);

      // Handle templateSettings if present
      let templateSettings = resumeData.templateSettings;
      if (templateSettings) {
        const validFonts = ["Roboto", "Inter", "Montserrat", "Open Sans", "Lato", "Poppins", "Merriweather"];
        if (templateSettings.font) {
          const font = templateSettings.font.charAt(0).toUpperCase() +
            templateSettings.font.slice(1).toLowerCase();
          templateSettings.font = validFonts.includes(font) ? font : "Roboto";
        }
      }

      const payload = {
        ...resumeData,
        templateSettings,
        updatedAt: new Date().toISOString()
      };

      logger.api('PUT /resumes', { id });

      const response = await coreApi.put(`/resumes/${id}`, payload);
      const updated = response?.data || response;

      logger.success(`Resume updated: ${id}`);
      return updated;
    } catch (error) {
      logger.error(`Failed to update resume ${id}:`, error);
      throw error;
    }
  },

  // DELETE RESUME
  async deleteResume(id) {
    try {
      logger.info(`Deleting resume: ${id}`);

      await coreApi.delete(`/resumes/${id}`);

      logger.success(`Resume deleted: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to delete resume ${id}:`, error);
      throw error;
    }
  },

  // EXPORT RESUME
  async exportResume(id, format = 'pdf') {
    try {
      logger.info(`Exporting resume: ${id} as ${format}`);

      const response = await coreApi.get(`/resumes/${id}/export?format=${format}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      logger.success(`Resume exported: ${id}`);
      return { success: true, url };
    } catch (error) {
      logger.error(`Failed to export resume ${id}:`, error);
      throw error;
    }
  },

  // DUPLICATE RESUME
  async duplicateResume(id) {
    try {
      logger.info(`Duplicating resume: ${id}`);

      const response = await coreApi.post(`/resumes/${id}/duplicate`);
      const duplicated = response?.data || response;

      logger.success(`Resume duplicated: ${duplicated._id}`);
      return duplicated;
    } catch (error) {
      logger.error(`Failed to duplicate resume ${id}:`, error);
      throw error;
    }
  },

  // GET EMPTY RESUME TEMPLATE
  getEmptyResume() {
    const user = userManager.getCurrentUser();
    return {
      _id: 'new',
      title: 'My Resume',
      summary: '',
      personalInfo: {
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '',
        location: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      template: 'modern',
      templateSettings: {
        templateName: 'modern',
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#10b981',
          background: '#ffffff',
          text: '#000000',
          header: '#1e40af'
        },
        font: 'Roboto',
        fontSize: 'medium',
        spacing: 'normal',
        showPhoto: false,
        layout: 'single-column'
      },
      status: 'draft',
      tags: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

// ==================== HEALTH SERVICE ====================
const healthService = {
  async check() {
    return dedupRequest('health:check', async () => {
      try {
        await api.get('/health', { timeout: 5000 });
        return { healthy: true, online: true };
      } catch (error) {
        return { healthy: false, online: false };
      }
    }, true);
  }
};

// ==================== MAIN API SERVICE ====================
const apiService = {
  get: coreApi.get,
  post: coreApi.post,
  put: coreApi.put,
  delete: coreApi.delete,
  auth: authService,
  resume: resumeService,
  health: healthService,
  token: tokenManager,
  user: userManager,
  logger,
  baseURL: API_BASE_URL,
  env: ENV,

  async init() {
    try {
      logger.info(`Initializing API Service (${ENV})`);
      await this.health.check();
      logger.success('API Service initialized');
    } catch (error) {
      logger.error('API Service initialization failed:', error);
    }
  }
};

setTimeout(() => apiService.init(), 1000);

export default apiService;