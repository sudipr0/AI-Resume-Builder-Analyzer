// src/components/section/PersonalInfoPage.jsx - UPDATED TO MATCH BACKEND MODEL
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Github, Linkedin, Camera, Save } from 'lucide-react';

const PersonalInfoPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  console.log('📝 PersonalInfoPage rendered with data:', data);

  // Refs
  const isInitialMount = useRef(true);
  const hasLoadedFromParent = useRef(false);
  const saveTimeoutRef = useRef(null);

  // State - Initialize with all fields from your model
  const [formData, setFormData] = useState(() => ({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    location: data?.location || '', // Keeping for backward compatibility
    address: data?.address || '',
    city: data?.city || '',
    state: data?.state || '',
    country: data?.country || '',
    zipCode: data?.zipCode || '',
    jobTitle: data?.jobTitle || '',
    website: data?.website || '',
    linkedin: data?.linkedin || '',
    github: data?.github || '',
    portfolio: data?.portfolio || '', // Added portfolio field
    photoUrl: data?.photoUrl || '',
    summary: data?.summary || '' // Added summary field (though it's separate in wizard)
  }));

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState('');
  const [errors, setErrors] = useState({});

  // Update local state when data prop changes (but only if actually different)
  useEffect(() => {
    // Only load from parent on initial mount
    if (!hasLoadedFromParent.current) {
      const newData = {
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        email: data?.email || '',
        phone: data?.phone || '',
        location: data?.location || '',
        address: data?.address || '',
        city: data?.city || '',
        state: data?.state || '',
        country: data?.country || '',
        zipCode: data?.zipCode || '',
        jobTitle: data?.jobTitle || '',
        website: data?.website || '',
        linkedin: data?.linkedin || '',
        github: data?.github || '',
        portfolio: data?.portfolio || '',
        photoUrl: data?.photoUrl || '',
        summary: data?.summary || ''
      };

      console.log('🔄 Initial load from parent');
      setFormData(newData);
      setLastSavedData(JSON.stringify(newData));
      hasLoadedFromParent.current = true;
      isInitialMount.current = false;
    }
  }, [data]);

  // ============ CLEAN DATA FOR BACKEND ============
  const prepareDataForBackend = useCallback((dataToClean) => {
    // Create a copy to avoid mutating original
    const cleaned = { ...dataToClean };

    // Remove location field (not in schema) - we'll use address fields instead
    delete cleaned.location;

    // For URL fields: if empty string, set to undefined (don't send)
    const urlFields = ['linkedin', 'github', 'portfolio', 'website', 'photoUrl'];
    urlFields.forEach(field => {
      if (cleaned[field] === '') {
        delete cleaned[field]; // Remove completely to avoid validation errors
      }
    });

    // For optional text fields: if empty string, set to undefined
    const optionalFields = ['phone', 'address', 'city', 'state', 'country', 'zipCode', 'jobTitle'];
    optionalFields.forEach(field => {
      if (cleaned[field] === '') {
        delete cleaned[field];
      }
    });

    // Ensure required fields are present
    if (!cleaned.email) cleaned.email = '';

    return cleaned;
  }, []);

  // ============ SAVE TO PARENT ============
  const saveToParent = useCallback((dataToSave) => {
    // Clean the data for backend before saving
    const cleanedData = prepareDataForBackend(dataToSave);

    if (onUpdate && JSON.stringify(cleanedData) !== lastSavedData) {
      console.log('📤 Sending cleaned data to parent:', cleanedData);
      setIsSaving(true);
      setLastSavedData(JSON.stringify(cleanedData));

      onUpdate(cleanedData);

      setTimeout(() => setIsSaving(false), 300);
    }
  }, [onUpdate, lastSavedData, prepareDataForBackend]);

  // Auto-save with debounce
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only auto-save if data has changed
    if (JSON.stringify(formData) !== lastSavedData) {
      saveTimeoutRef.current = setTimeout(() => {
        saveToParent(formData);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, lastSavedData, saveToParent]);

  // Memoized validation function - matches backend requirements
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'email':
        // Skip validation if empty (will be handled by required check)
        if (!value) return '';
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address'
          : '';
      case 'phone':
        if (!value) return '';
        return !/^[\d\s\+\-\(\)]{7,}$/.test(value)
          ? 'Please enter a valid phone number'
          : '';
      case 'website':
      case 'linkedin':
      case 'github':
      case 'portfolio':
      case 'photoUrl':
        // Skip validation if empty (won't be sent)
        if (!value) return '';
        // Simple URL validation
        return !/^https?:\/\/.+/.test(value) && !value.startsWith('www.')
          ? 'Please enter a valid URL (e.g., https://example.com)'
          : '';
      case 'zipCode':
        if (!value) return '';
        return !/^\d{5}(-\d{4})?$/.test(value)
          ? 'Please enter a valid ZIP code'
          : '';
      default:
        return '';
    }
  }, []);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Build new form data synchronously so we can push live updates to preview
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Validate field
      const error = validateField(name, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
      }));

      // Live update parent immediately so preview stays in sync
      try {
        if (onUpdate) {
          onUpdate(newData);
        }
      } catch (err) {
        console.warn('⚠️ Live update failed:', err);
      }

      return newData;
    });

    setIsDirty(true);
  }, [validateField, onUpdate]);

  // Memoized blur handler for validation
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Manual save handler
  const handleSave = useCallback(() => {
    saveToParent(formData);
    toast.success('Information saved!');
  }, [formData, saveToParent]);

  // Memoized submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      // Only validate fields that have values
      if (formData[key]) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Check required fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before continuing');
      return;
    }

    // Clean and save before navigating
    const cleanedData = prepareDataForBackend(formData);
    saveToParent(cleanedData);

    if (onNext) {
      setTimeout(() => onNext(), 100);
    }
  }, [formData, validateField, saveToParent, onNext, prepareDataForBackend]);

  const handlePrev = useCallback(() => {
    // Clean and save before navigating
    const cleanedData = prepareDataForBackend(formData);
    saveToParent(cleanedData);
    setTimeout(() => onPrev?.(), 100);
  }, [formData, saveToParent, onPrev, prepareDataForBackend]);

  // Memoized computed values
  const isFormValid = useMemo(() => {
    return Object.values(errors).every(error => !error) &&
      formData.firstName?.trim() &&
      formData.email?.trim();
  }, [errors, formData.firstName, formData.email]);

  const progress = useMemo(() => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'address', 'city', 'country'];
    const filled = fields.filter(f => formData[f]?.trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header with Save Status */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-blue-500 animate-pulse">Saving...</span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
              onClick={() => {
                // Mock photo upload - in real app, this would open file picker
                toast.success('Photo upload coming soon!');
              }}
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500">Upload a professional photo (optional)</p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="John"
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="john@example.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="+1 234 567 8900"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Location - Full Address (Matches schema) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Job Title
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        {/* Social Links - Matches schema */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Professional Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://johndoe.com"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.linkedin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-500">{errors.linkedin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.github ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://github.com/johndoe"
                />
              </div>
              {errors.github && (
                <p className="mt-1 text-sm text-red-500">{errors.github}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.portfolio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://johndoe.dev"
                />
              </div>
              {errors.portfolio && (
                <p className="mt-1 text-sm text-red-500">{errors.portfolio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Unsaved Changes Indicator */}
        {JSON.stringify(formData) !== lastSavedData && (
          <div className="text-xs text-amber-600 text-right">
            Unsaved changes...
          </div>
        )}
      </form>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(PersonalInfoPage, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if data actually changed
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});