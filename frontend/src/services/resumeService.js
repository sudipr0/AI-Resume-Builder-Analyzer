// src/services/resumeService.js - FIXED CRITICAL METHODS
import apiService from './api';
import { toast } from 'react-hot-toast';

class ResumeService {
  constructor() {
    this.cache = new Map();
    this.autoSaveQueue = new Map();
    this.autoSaveTimer = null;
    this.MAX_CACHE_SIZE = 50;
  }

  // ==================== VALIDATION HELPER ====================

  /**
   * Validate API response
   * @param {any} response - API response
   * @param {string} operation - Operation name for error message
   * @returns {Object} Validated response data
   */
  validateResponse(response, operation = 'API call') {
    // Check if response exists
    if (!response) {
      throw new Error(`${operation} failed: No response from server`);
    }

    // Extract data - handle different response formats
    const data = response.data || response;

    // Check if we have a valid resume object
    if (data && (data._id || data.id)) {
      return data;
    }

    // If it's an array, return as is (for list operations)
    if (Array.isArray(data)) {
      return data;
    }

    // If it's a success flag with no data, that's okay for delete operations
    if (data.success === true) {
      return data;
    }

    // Otherwise, it's an error
    console.error('❌ Invalid response format:', response);
    throw new Error(`${operation} failed: Invalid response format from server`);
  }

  // ==================== FIXED CREATE RESUME ====================

  /**
   * Create a new resume
   * @param {Object} resumeData - Resume data
   * @param {boolean} isTemplate - Whether creating from template
   * @returns {Promise<Object>} Created resume
   */
  async createResume(resumeData, isTemplate = false) {
    try {
      console.log('📝 Creating new resume...', { resumeData, isTemplate });

      // Get current user
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User authentication required');
      }

      // Prepare data with user ID - remove any system fields
      const { _id, id, __v, createdAt, updatedAt, ...cleanData } = resumeData;

      const dataToSend = {
        ...cleanData,
        userId: user.id,
        status: cleanData.status || 'draft',
        isTemplate: isTemplate,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create resume via API
      const response = await apiService.resume.createResume(dataToSend);

      // ✅ FIXED: Validate response before proceeding
      const createdResume = this.validateResponse(response, 'Create resume');

      // Cache the new resume
      this.cacheResume(createdResume);

      // Show success message
      toast.success(isTemplate ? 'Template created successfully!' : 'Resume created successfully!');

      // Track analytics if available
      this.trackEvent('resume_created', {
        resumeId: createdResume._id || createdResume.id,
        isTemplate,
        template: createdResume.template
      });

      return createdResume;
    } catch (error) {
      console.error('❌ Error creating resume:', error);

      // Provide user-friendly error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create resume';

      toast.error(errorMessage);
      throw error;
    }
  }

  // ==================== FIXED UPDATE RESUME ====================

  /**
   * Update a resume
   * @param {string} resumeId - Resume ID
   * @param {Object} updateData - Data to update
   * @param {boolean} silent - Don't show toast
   * @returns {Promise<Object>} Updated resume
   */
  async updateResume(resumeId, updateData, silent = false) {
    try {
      if (!resumeId) {
        throw new Error('Resume ID is required');
      }

      console.log('📝 Updating resume:', resumeId, updateData);

      // Get current user for validation
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User authentication required');
      }

      // Prepare update data
      const dataToSend = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Update via API
      const response = await apiService.resume.updateResume(resumeId, dataToSend);

      // ✅ FIXED: Validate response before proceeding
      const updatedResume = this.validateResponse(response, 'Update resume');

      // ✅ FIXED: Only update cache after successful API call
      this.cacheResume(updatedResume);

      // Invalidate user resumes cache
      this.invalidateUserCache();

      if (!silent) {
        toast.success('Resume updated successfully!');
      }

      // Track update
      this.trackEvent('resume_updated', {
        resumeId,
        fields: Object.keys(updateData)
      });

      return updatedResume;
    } catch (error) {
      console.error('❌ Error updating resume:', error);

      if (!silent) {
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to update resume';
        toast.error(errorMessage);
      }
      throw error;
    }
  }

  // ==================== FIXED SAVE RESUME SECTION ====================

  /**
   * Save a specific resume section
   * @param {string} resumeId - Resume ID
   * @param {string} section - Section name
   * @param {Object} data - Section data
   * @returns {Promise<Object>} Updated resume
   */
  async saveResumeSection(resumeId, section, data) {
    try {
      if (!resumeId || !section) {
        throw new Error('Resume ID and section are required');
      }

      console.log('📝 Saving resume section:', { resumeId, section });

      // Get current user for validation
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User authentication required');
      }

      // ✅ FIXED: Call API first, don't update cache prematurely
      const response = await apiService.resume.saveResumeSection(resumeId, section, data);

      // ✅ FIXED: Validate response
      const updatedResume = this.validateResponse(response, 'Save section');

      // ✅ FIXED: Only update cache after successful API call
      this.cacheResume(updatedResume);

      // Invalidate user resumes cache
      this.invalidateUserCache();

      return updatedResume;
    } catch (error) {
      console.error('❌ Error saving resume section:', error);

      // ✅ FIXED: Provide clear error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to save ${section} section`;

      toast.error(errorMessage);
      throw error;
    }
  }

  // ==================== FIXED AUTO-SAVE QUEUE ====================

  /**
   * Queue resume for auto-save
   * @param {string} resumeId - Resume ID
   * @param {Object} resumeData - Resume data to save
   */
  async queueAutoSave(resumeId, resumeData) {
    if (!resumeId || !resumeData) return;

    console.log('⏰ Queueing auto-save for resume:', resumeId);

    // Update cache immediately for responsive UI (optimistic update)
    this.cacheResume(resumeData);

    // Add to queue with timestamp and attempt counter
    this.autoSaveQueue.set(resumeId, {
      data: resumeData,
      timestamp: Date.now(),
      attempts: 0,
      lastError: null
    });

    // Start auto-save timer if not already running
    if (!this.autoSaveTimer) {
      this.autoSaveTimer = setTimeout(() => this.processAutoSaveQueue(), 2000);
    }
  }

  /**
   * Process the auto-save queue
   */
  async processAutoSaveQueue() {
    if (this.autoSaveQueue.size === 0) {
      this.autoSaveTimer = null;
      return;
    }

    console.log(`🔄 Processing auto-save queue (${this.autoSaveQueue.size} items)`);

    const queueEntries = Array.from(this.autoSaveQueue.entries());

    for (const [resumeId, queueItem] of queueEntries) {
      try {
        console.log('💾 Auto-saving resume:', resumeId);

        // Prepare data without system fields
        const { _id, id, __v, createdAt, ...saveData } = queueItem.data;

        const dataToSend = {
          ...saveData,
          updatedAt: new Date().toISOString()
        };

        // Call API
        const response = await apiService.resume.updateResume(resumeId, dataToSend);

        // ✅ FIXED: Validate response
        if (!response || (!response.data && !response._id && !response.id && response.success !== true)) {
          throw new Error('Invalid response from server');
        }

        const savedResume = response.data || response;

        // ✅ FIXED: Success - remove from queue
        this.autoSaveQueue.delete(resumeId);

        // Update cache with server response
        this.cacheResume(savedResume);

        console.log('✅ Auto-save successful:', resumeId);
      } catch (error) {
        console.warn('⚠️ Auto-save failed:', resumeId, error.message);

        // Increment attempts
        queueItem.attempts++;
        queueItem.lastError = error.message;

        // ✅ FIXED: Retry logic with exponential backoff
        if (queueItem.attempts >= 3) {
          console.error('❌ Giving up on auto-save after 3 attempts:', resumeId);
          this.autoSaveQueue.delete(resumeId);

          // Only show toast for persistent failures
          toast.error(`Auto-save failed for resume. Please save manually.`, {
            id: `auto-save-${resumeId}`,
            duration: 5000
          });
        } else {
          // Keep in queue for next batch
          console.log(`🔄 Will retry auto-save for ${resumeId} (attempt ${queueItem.attempts}/3)`);
        }
      }
    }

    // Schedule next batch if queue not empty
    if (this.autoSaveQueue.size > 0) {
      // ✅ FIXED: Exponential backoff - longer wait after each attempt
      const hasFailedItems = Array.from(this.autoSaveQueue.values())
        .some(item => item.attempts > 0);

      const delay = hasFailedItems ? 5000 : 3000;

      this.autoSaveTimer = setTimeout(() => this.processAutoSaveQueue(), delay);
    } else {
      this.autoSaveTimer = null;
      console.log('✅ Auto-save queue empty');
    }
  }

  // ==================== FIXED GET RESUME ====================

  /**
   * Get a single resume by ID
   * @param {string} resumeId - Resume ID
   * @param {boolean} forceRefresh - Skip cache
   * @returns {Promise<Object>} Resume data
   */
  async getResume(resumeId, forceRefresh = false) {
    try {
      if (!resumeId) {
        throw new Error('Resume ID is required');
      }

      // Check cache first
      if (!forceRefresh && this.cache.has(resumeId)) {
        console.log('📦 Serving resume from cache:', resumeId);
        return this.cache.get(resumeId);
      }

      console.log('📥 Fetching resume:', resumeId);

      // Get current user for validation
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User authentication required');
      }

      // Fetch from API
      const response = await apiService.resume.getResume(resumeId);

      // ✅ FIXED: Validate response
      const resume = this.validateResponse(response, 'Get resume');

      // Cache the resume
      this.cacheResume(resume);

      return resume;
    } catch (error) {
      console.error('❌ Error fetching resume:', error);

      // If we have cached data, return it even on error
      if (this.cache.has(resumeId)) {
        console.warn('⚠️ Using cached resume data due to fetch error');
        const cachedResume = this.cache.get(resumeId);

        // Show warning to user
        toast.error('Using cached version. Changes may not be saved.', {
          id: `cache-${resumeId}`,
          duration: 3000
        });

        return cachedResume;
      }

      throw error;
    }
  }

  // ==================== FIXED GET USER RESUMES ====================

  /**
   * Get all resumes for current user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of resumes
   */
  async getUserResumes(options = {}) {
    try {
      const {
        status = null,
        limit = 100,
        skip = 0,
        sortBy = 'updatedAt',
        sortOrder = 'desc',
        search = '',
        forceRefresh = false
      } = options;

      console.log('📥 Fetching user resumes with options:', options);

      // Get current user
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        console.warn('⚠️ No user found, returning empty list');
        return [];
      }

      // Check for cached user resumes
      const cacheKey = `user_${user.id}_${JSON.stringify(options)}`;
      if (!forceRefresh && this.cache.has(cacheKey)) {
        console.log('📦 Serving user resumes from cache');
        return this.cache.get(cacheKey);
      }

      // Fetch from API
      let resumes = [];
      try {
        const response = await apiService.resume.getUserResumes();
        resumes = Array.isArray(response) ? response : response.data || [];
      } catch (error) {
        console.log('❌ Failed to fetch resumes:', error);
        resumes = [];
      }

      // ✅ FIXED: Validate each resume
      const validResumes = resumes.filter(r => r && (r._id || r.id));

      // Apply filters
      let filteredResumes = [...validResumes];

      // Filter by status
      if (status && status !== 'all') {
        filteredResumes = filteredResumes.filter(r => r.status === status);
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredResumes = filteredResumes.filter(r =>
          (r.title && r.title.toLowerCase().includes(searchLower)) ||
          (r.personalInfo?.fullName && r.personalInfo.fullName.toLowerCase().includes(searchLower)) ||
          (r.tags && r.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }

      // Sort resumes
      filteredResumes.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (!aValue) return 1;
        if (!bValue) return -1;

        const multiplier = sortOrder === 'desc' ? -1 : 1;

        if (sortBy.includes('At')) {
          return multiplier * (new Date(bValue) - new Date(aValue));
        }

        if (typeof aValue === 'string') {
          return multiplier * aValue.localeCompare(bValue);
        }

        return multiplier * (bValue - aValue);
      });

      // Apply pagination
      const paginatedResumes = filteredResumes.slice(skip, skip + limit);

      // Cache individual resumes
      validResumes.forEach(resume => this.cacheResume(resume));

      // Cache filtered result
      this.cache.set(cacheKey, paginatedResumes);

      console.log(`✅ Found ${filteredResumes.length} resumes (showing ${paginatedResumes.length})`);
      return paginatedResumes;
    } catch (error) {
      console.error('❌ Error fetching user resumes:', error);
      toast.error('Failed to load resumes');
      return [];
    }
  }

  // ==================== FIXED DELETE RESUME ====================

  /**
   * Delete a resume
   * @param {string} resumeId - Resume ID
   * @param {boolean} confirm - Require confirmation
   * @returns {Promise<boolean>} Success status
   */
  async deleteResume(resumeId, confirm = true) {
    try {
      if (!resumeId) {
        throw new Error('Resume ID is required');
      }

      // Ask for confirmation
      if (confirm && !window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
        return false;
      }

      console.log('🗑️ Deleting resume:', resumeId);

      // Get current user for validation
      const user = apiService.auth.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User authentication required');
      }

      // Delete via API
      const response = await apiService.resume.deleteResume(resumeId);

      // ✅ FIXED: Check response
      const success = response?.success === true || response?.status === 'success';

      if (success) {
        // Remove from cache
        this.cache.delete(resumeId);

        // Invalidate user resumes cache
        this.invalidateUserCache();

        // Clear auto-save queue for this resume
        this.autoSaveQueue.delete(resumeId);

        toast.success('Resume deleted successfully!');

        // Track deletion
        this.trackEvent('resume_deleted', { resumeId });

        return true;
      }

      throw new Error('Failed to delete resume');
    } catch (error) {
      console.error('❌ Error deleting resume:', error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete resume';

      toast.error(errorMessage);
      throw error;
    }
  }

  // ==================== FIXED DUPLICATE RESUME ====================

  /**
   * Duplicate a resume
   * @param {string} resumeId - Resume ID to duplicate
   * @param {string} newTitle - Title for duplicated resume
   * @returns {Promise<Object>} Duplicated resume
   */
  async duplicateResume(resumeId, newTitle = null) {
    try {
      if (!resumeId) {
        throw new Error('Resume ID is required');
      }

      console.log('📋 Duplicating resume:', resumeId);

      // Get the resume to duplicate
      const originalResume = await this.getResume(resumeId, true); // Force refresh

      if (!originalResume) {
        throw new Error('Resume not found');
      }

      // Prepare duplicate data - remove system fields
      const { _id, id, __v, createdAt, updatedAt, views, downloads, shares, ...cleanData } = originalResume;

      const duplicateData = {
        ...cleanData,
        title: newTitle || `${originalResume.title || 'Resume'} (Copy)`,
        isPrimary: false,
        isStarred: false,
        isPinned: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create the duplicate using createResume method
      const duplicatedResume = await this.createResume(duplicateData);

      toast.success('Resume duplicated successfully!');

      // Track duplication
      this.trackEvent('resume_duplicated', {
        originalResumeId: resumeId,
        newResumeId: duplicatedResume._id || duplicatedResume.id
      });

      return duplicatedResume;
    } catch (error) {
      console.error('❌ Error duplicating resume:', error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to duplicate resume';

      toast.error(errorMessage);
      throw error;
    }
  }

  // ==================== CACHE MANAGEMENT ====================

  /**
   * Cache a resume
   * @param {Object} resume - Resume to cache
   */
  cacheResume(resume) {
    if (!resume) return;

    const resumeId = resume._id || resume.id;
    if (!resumeId) return;

    // Update cache
    this.cache.set(resumeId, resume);

    // Manage cache size
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    // Also cache by user
    if (resume.userId) {
      const userCacheKey = `user_${resume.userId}_resume_${resumeId}`;
      this.cache.set(userCacheKey, resume);
    }
  }

  /**
   * Invalidate user-specific cache
   */
  invalidateUserCache() {
    const user = apiService.auth.getCurrentUser();
    if (!user?.id) return;

    // Remove all cache entries for this user
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`user_${user.id}`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🧹 Invalidated ${keysToDelete.length} user cache entries`);
  }

  /**
   * Get empty resume structure
   * @returns {Object} Empty resume template
   */
  getEmptyResume() {
    const user = apiService.auth.getCurrentUser();

    return {
      title: 'Untitled Resume',
      template: 'modern',
      status: 'draft',
      isPrimary: false,
      isStarred: false,
      isPinned: false,
      personalInfo: {
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
        photo: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      analysis: {
        atsScore: 0,
        completeness: 0,
        suggestions: [],
        lastAnalyzed: null
      },
      settings: {
        template: 'modern',
        color: '#3b82f6',
        font: 'inter',
        fontSize: 'medium'
      },
      tags: [],
      views: 0,
      downloads: 0,
      shares: 0,
      userId: user?.id || null,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Track analytics event
   * @param {string} event - Event name
   * @param {Object} properties - Event properties
   */
  trackEvent(event, properties = {}) {
    try {
      console.log('📊 Analytics Event:', event, properties);
      // Add your analytics implementation here
    } catch (error) {
      console.warn('⚠️ Analytics tracking failed:', error);
    }
  }

  /**
   * Cleanup method (call on app shutdown)
   */
  cleanup() {
    // Process any remaining auto-saves
    if (this.autoSaveQueue.size > 0) {
      console.log('💾 Processing final auto-saves before cleanup');
      this.processAutoSaveQueue().catch(console.error);
    }

    // Clear timers
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    console.log('🧹 Resume service cleanup initiated');
  }
}

// Create singleton instance
const resumeServiceInstance = new ResumeService();

// Export the instance
export default resumeServiceInstance;

// Also export the class for testing/extending
export { ResumeService };