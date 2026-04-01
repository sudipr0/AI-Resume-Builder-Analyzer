// src/hooks/useResumeSection.js - COMPLETELY FIXED
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useResume } from '../context/ResumeContext';

export const useResumeSection = (initialData = null, options = {}) => {
  const {
    sectionId = '',
    onUpdate = null,
    onSave = null,
    autoSave = true,
    autoSaveDelay = 1000,
    validationRules = {},
    requiredFields = [],
    showNotifications = true
  } = options;

  // Get the resume context for direct saving
  const { currentResume, saveResume, updateCurrentResumeData } = useResume();

  const [formData, setFormData] = useState(() => {
    // Initialize from currentResume if available
    if (currentResume?.[sectionId] !== undefined) {
      const resumeData = currentResume[sectionId];
      return resumeData || initialData || getDefaultData(sectionId);
    }
    return initialData || getDefaultData(sectionId);
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [lastSavedData, setLastSavedData] = useState(formData);

  const autoSaveTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const saveInProgressRef = useRef(false);
  const hasInitialized = useRef(false);

  // Set mounted flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (isDirty && formData) {
        console.log(`⚠️ [useResumeSection] Component unmounting with unsaved changes - saving immediately for:`, sectionId);
        handleSaveImmediate();
      }
    };
  }, [sectionId, isDirty, formData]);

  // Get default data structure for section
  function getDefaultData(sectionId) {
    const defaults = {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: '',
        yearsOfExperience: '',
        availability: 'Immediately',
        visaStatus: '',
        nationality: '',
        dateOfBirth: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      references: []
    };

    return defaults[sectionId] || {};
  }

  // FIXED: Only sync external data on initial mount, never reset after user starts typing
  useEffect(() => {
    console.log('🔄 [useResumeSection] Checking external data for:', sectionId);

    // Only run if we haven't initialized yet
    if (!hasInitialized.current) {
      // Check if currentResume has data for this section
      if (currentResume?.[sectionId] !== undefined) {
        const resumeData = currentResume[sectionId];
        const mergedData = mergeWithDefaults(resumeData, sectionId);
        if (isMountedRef.current) {
          setFormData(mergedData);
          setLastSavedData(mergedData);
          setIsDirty(false);
          setErrors({});
        }
        console.log('✅ [useResumeSection] Initial data loaded from context');
      } else if (initialData) {
        const mergedData = mergeWithDefaults(initialData, sectionId);
        if (isMountedRef.current) {
          setFormData(mergedData);
          setLastSavedData(mergedData);
          setIsDirty(false);
          setErrors({});
        }
        console.log('✅ [useResumeSection] Initial data loaded from props');
      }
      hasInitialized.current = true;
    }
  }, [currentResume, sectionId, initialData]); // Add currentResume to dependencies

  // Merge external data with defaults
  function mergeWithDefaults(data, sectionId) {
    const defaults = getDefaultData(sectionId);

    if (Array.isArray(data)) {
      return data.map(item => ({
        ...getDefaultItem(sectionId),
        ...item
      }));
    }

    if (typeof data === 'string') {
      return data;
    }

    return {
      ...defaults,
      ...data
    };
  }

  // Get default item for array sections
  function getDefaultItem(sectionId) {
    const itemDefaults = {
      experience: {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      },
      education: {
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        honors: ''
      },
      projects: {
        title: '',
        description: '',
        technologies: [],
        link: '',
        startDate: '',
        endDate: ''
      },
      certifications: {
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: '',
        link: ''
      },
      languages: {
        language: '',
        proficiency: 'Intermediate'
      },
      references: {
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        relationship: ''
      }
    };

    return itemDefaults[sectionId] || {};
  }

  // Check if data has changed
  const hasDataChanged = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(lastSavedData);
  }, [formData, lastSavedData]);

  // Handle field change
  const handleChange = useCallback((field, value) => {
    console.log('✏️ [useResumeSection] Field changed:', { sectionId, field, value });

    setFormData(prev => {
      if (typeof prev === 'string') {
        return value;
      }

      if (Array.isArray(prev)) {
        return prev;
      }

      return { ...prev, [field]: value };
    });

    setIsDirty(true);
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear field error if exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-save after delay
    if (autoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveDelay);
    }
  }, [sectionId, autoSave, autoSaveDelay, errors]);

  // Handle array item change
  const handleArrayChange = useCallback((index, field, value) => {
    if (!Array.isArray(formData)) {
      return;
    }

    console.log('✏️ [useResumeSection] Array item changed:', { sectionId, index, field, value });

    const newArray = [...formData];
    newArray[index] = { ...newArray[index], [field]: value };

    setFormData(newArray);
    setIsDirty(true);

    if (autoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveDelay);
    }
  }, [formData, sectionId, autoSave, autoSaveDelay]);

  // Add item to array
  const addItem = useCallback((item = null) => {
    if (!Array.isArray(formData)) {
      return -1;
    }

    console.log('➕ [useResumeSection] Adding item to:', sectionId);

    const defaultItem = getDefaultItem(sectionId);
    const newItem = item || defaultItem;
    const newArray = [...formData, newItem];

    setFormData(newArray);
    setIsDirty(true);

    if (autoSave) {
      handleSave(); // Save immediately for array changes
    }

    return newArray.length - 1;
  }, [formData, sectionId, autoSave]);

  // Remove item from array
  const removeItem = useCallback((index) => {
    if (!Array.isArray(formData) || index < 0 || index >= formData.length) {
      return;
    }

    console.log('➖ [useResumeSection] Removing item:', { sectionId, index });

    const newArray = formData.filter((_, i) => i !== index);
    setFormData(newArray);
    setIsDirty(true);

    if (autoSave) {
      handleSave(); // Save immediately for array changes
    }
  }, [formData, sectionId, autoSave]);

  // Move item in array
  const moveItem = useCallback((fromIndex, toIndex) => {
    if (!Array.isArray(formData)) {
      return;
    }

    console.log('🔄 [useResumeSection] Moving item:', { sectionId, fromIndex, toIndex });

    const newArray = [...formData];
    const [removed] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, removed);

    setFormData(newArray);
    setIsDirty(true);

    if (autoSave) {
      handleSave(); // Save immediately for array changes
    }
  }, [formData, sectionId, autoSave]);

  // Validate form data
  const validate = useCallback(() => {
    console.log('🔍 [useResumeSection] Validating:', sectionId);

    const newErrors = {};

    if (requiredFields.length > 0 && typeof formData === 'object' && !Array.isArray(formData)) {
      requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
          newErrors[field] = `${field} is required`;
        }
      });
    }

    // Apply custom validation rules
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = formData[field];

      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.message || `${field} is required`;
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
      }

      if (rule.pattern && value && !new RegExp(rule.pattern).test(value)) {
        newErrors[field] = rule.message || 'Invalid format';
      }

      if (rule.validate && typeof rule.validate === 'function') {
        const customError = rule.validate(value, formData);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, sectionId, requiredFields, validationRules]);

  // Immediate save function
  const handleSaveImmediate = useCallback(async () => {
    if (!hasDataChanged() || saveInProgressRef.current) {
      console.log('⏸️ [useResumeSection] No changes to save or save in progress');
      return false;
    }

    // Validate before saving
    const isValid = validate();
    if (!isValid) {
      if (showNotifications) {
        toast.error('Please fix validation errors before saving');
      }
      return false;
    }

    saveInProgressRef.current = true;
    setIsSaving(true);
    console.log('💾 [useResumeSection] Saving immediately:', sectionId);

    try {
      // First update the resume context (local state)
      if (onUpdate) {
        await onUpdate(formData);
      } else {
        // Direct context update if no onUpdate provided
        updateCurrentResumeData({ [sectionId]: formData });
      }

      // Then trigger the actual API save through context
      if (currentResume) {
        const updatedResume = {
          ...currentResume,
          [sectionId]: formData,
          updatedAt: new Date().toISOString()
        };

        await saveResume(updatedResume);
        console.log('✅ [useResumeSection] Backend save successful');
      }

      // Call custom save callback if provided
      if (onSave) {
        await onSave();
      }

      if (isMountedRef.current) {
        setIsDirty(false);
        setLastSavedData(formData);
        setLastSaved(new Date());
      }

      if (showNotifications) {
        toast.success(`${sectionId} saved successfully`);
      }

      console.log('✅ [useResumeSection] Save successful');
      return true;
    } catch (error) {
      console.error('❌ [useResumeSection] Save failed:', error);

      if (showNotifications && isMountedRef.current) {
        toast.error('Failed to save changes');
      }

      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
      saveInProgressRef.current = false;
    }
  }, [hasDataChanged, formData, sectionId, onUpdate, onSave, validate, showNotifications, currentResume, saveResume, updateCurrentResumeData]);

  // Debounced save
  const handleSave = useCallback(async () => {
    return handleSaveImmediate();
  }, [handleSaveImmediate]);

  // Reset form
  const resetForm = useCallback(() => {
    console.log('🔄 [useResumeSection] Resetting form:', sectionId);

    const defaultData = getDefaultData(sectionId);
    setFormData(defaultData);
    setLastSavedData(defaultData);
    setIsDirty(false);
    setErrors({});
    setTouched({});

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  }, [sectionId]);

  // Mark field as touched
  const markAsTouched = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Get field error
  const getFieldError = useCallback((field) => {
    return touched[field] ? errors[field] : null;
  }, [errors, touched]);

  // Check if field is valid
  const isFieldValid = useCallback((field) => {
    return !errors[field];
  }, [errors]);

  // Check completion status
  const getCompletionStatus = useCallback(() => {
    if (typeof formData === 'string') {
      return {
        isComplete: formData.trim().length > 0,
        percentage: formData.trim().length > 0 ? 100 : 0,
        missingFields: formData.trim().length === 0 ? ['content'] : []
      };
    }

    if (Array.isArray(formData)) {
      const hasItems = formData.length > 0;
      return {
        isComplete: hasItems,
        percentage: hasItems ? 100 : 0,
        missingFields: hasItems ? [] : ['items']
      };
    }

    const completedFields = requiredFields.filter(field =>
      formData[field] && formData[field].toString().trim().length > 0
    );

    const percentage = requiredFields.length > 0
      ? Math.round((completedFields.length / requiredFields.length) * 100)
      : Object.keys(formData).length > 0 ? 100 : 0;

    return {
      isComplete: percentage === 100,
      percentage,
      missingFields: requiredFields.filter(field =>
        !formData[field] || formData[field].toString().trim().length === 0
      )
    };
  }, [formData, requiredFields]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    formData,
    isDirty,
    isSaving,
    errors,
    touched,
    lastSaved,
    hasDataChanged: hasDataChanged(),

    // Actions
    handleChange,
    handleArrayChange,
    addItem,
    removeItem,
    moveItem,
    handleSave,
    handleSaveImmediate,
    resetForm,
    validate,

    // Helper functions
    getFieldError,
    isFieldValid,
    markAsTouched,
    getCompletionStatus,

    // Utility
    isArray: Array.isArray(formData),
    isString: typeof formData === 'string',
    isObject: typeof formData === 'object' && !Array.isArray(formData) && formData !== null,
    completion: getCompletionStatus()
  };
};

// Predefined validation rules for common sections
export const sectionValidationRules = {
  personalInfo: {
    firstName: { required: true, minLength: 2, message: 'First name is required' },
    lastName: { required: true, minLength: 2, message: 'Last name is required' },
    email: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Valid email is required' },
    jobTitle: { required: true, minLength: 2, message: 'Job title is required' }
  },
  experience: {
    jobTitle: { required: true, message: 'Job title is required' },
    company: { required: true, message: 'Company name is required' },
    startDate: { required: true, message: 'Start date is required' }
  },
  education: {
    degree: { required: true, message: 'Degree is required' },
    institution: { required: true, message: 'Institution is required' }
  }
};

// Predefined required fields for common sections
export const sectionRequiredFields = {
  personalInfo: ['firstName', 'lastName', 'email', 'jobTitle'],
  summary: [],
  experience: ['jobTitle', 'company', 'startDate'],
  education: ['degree', 'institution'],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  references: []
};

export default useResumeSection;