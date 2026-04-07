// src/components/section/ExperiencePage.jsx - FIXED VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Building,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  Award,
  Save,
  Copy,
  Clock
} from 'lucide-react';

const ExperiencePage = ({ data = [], onUpdate, onNext, onPrev }) => {
  // Initialize state with data or empty array
  const [experiences, setExperiences] = useState(() => {
    return Array.isArray(data) ? data : (data?.items || []);
  });

  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use ref to prevent infinite loops
  const updateTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Generate unique ID for new entries
  const generateId = () => `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create a new empty experience
  const createEmptyExperience = () => ({
    id: generateId(),
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: [''],
    isVisible: true
  });

  // Handle adding new experience
  const handleAddExperience = useCallback(() => {
    const newExp = createEmptyExperience();
    setExperiences(prev => {
      const updated = [...prev, newExp];
      setExpandedId(newExp.id);
      setEditingId(newExp.id);
      return updated;
    });
  }, []);

  // Handle removing experience
  const handleRemoveExperience = useCallback((id, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      if (expandedId === id) setExpandedId(null);
      if (editingId === id) setEditingId(null);
      toast.success('Experience removed');
    }
  }, [expandedId, editingId]);

  // Handle duplicate experience
  const handleDuplicateExperience = useCallback((exp, e) => {
    e?.stopPropagation();
    const newExp = {
      ...exp,
      id: generateId(),
      jobTitle: `${exp.jobTitle} (Copy)`
    };
    setExperiences(prev => [...prev, newExp]);
    toast.success('Experience duplicated');
  }, []);

  // Handle input changes
  const handleChange = useCallback((id, field, value) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  }, []);

  // Handle achievement changes
  const handleAchievementChange = useCallback((expId, index, value) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id !== expId) return exp;
      const updatedAchievements = [...exp.achievements];
      updatedAchievements[index] = value;
      return { ...exp, achievements: updatedAchievements };
    }));
  }, []);

  // Add new achievement
  const handleAddAchievement = useCallback((expId) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === expId
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    ));
  }, []);

  // Remove achievement
  const handleRemoveAchievement = useCallback((expId, index) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id !== expId) return exp;
      const updatedAchievements = exp.achievements.filter((_, i) => i !== index);
      return { ...exp, achievements: updatedAchievements };
    }));
  }, []);

  // Toggle current job
  const handleCurrentJobToggle = useCallback((id, checked) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === id
        ? { ...exp, isCurrent: checked, endDate: checked ? '' : exp.endDate }
        : exp
    ));
  }, []);

  // Toggle expand/collapse
  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // Start editing
  const startEditing = useCallback((id, e) => {
    e?.stopPropagation();
    setEditingId(id);
    setExpandedId(id);
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  // Save all changes - FIXED: Use debounce to prevent rapid updates
  const saveChanges = useCallback(() => {
    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    setIsSaving(true);

    // Debounce the update to prevent rapid fire API calls
    updateTimeoutRef.current = setTimeout(() => {
      // Filter out empty experiences? Optional - you can decide
      const validExperiences = experiences.filter(exp =>
        exp.jobTitle?.trim() || exp.company?.trim()
      );

      console.log('Saving experiences:', validExperiences);
      onUpdate(validExperiences);

      setIsSaving(false);
      setEditingId(null);

      toast.success('Experience saved', {
        icon: '✅',
        duration: 2000
      });
    }, 500); // 500ms debounce
  }, [experiences, onUpdate]);

  // Auto-save when experiences change - FIXED: Use ref to prevent first render trigger
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't auto-save if we're in the middle of editing
    if (editingId) return;

    // Debounced auto-save
    const timeoutId = setTimeout(() => {
      saveChanges();
    }, 2000); // 2 second debounce for auto-save

    return () => clearTimeout(timeoutId);
  }, [experiences, editingId, saveChanges]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add your relevant work history, internships, or volunteer experience
          </p>
        </div>
        <motion.button
          onClick={handleAddExperience}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </motion.button>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No experience added yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start by adding your work experience, including internships, freelance work, or volunteer positions.
          </p>
          <button
            onClick={handleAddExperience}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(exp.id)}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {exp.jobTitle || 'Job Title'}
                        {exp.company && <span className="text-gray-600"> at {exp.company}</span>}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        {exp.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {formatDate(exp.startDate)}
                              {exp.endDate && !exp.isCurrent && ` - ${formatDate(exp.endDate)}`}
                              {exp.isCurrent && ' - Present'}
                            </span>
                          </div>
                        )}
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId !== exp.id && (
                      <button
                        onClick={(e) => startEditing(exp.id, e)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => toggleExpand(exp.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      {expandedId === exp.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6 space-y-4">
                        {/* Job Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => handleChange(exp.id, 'jobTitle', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Senior Software Engineer"
                          />
                        </div>

                        {/* Company & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Company name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="City, Country"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                              disabled={exp.isCurrent}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${exp.isCurrent
                                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                  : 'border-gray-300'
                                }`}
                            />
                          </div>
                        </div>

                        {/* Current Job Checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.isCurrent}
                            onChange={(e) => handleCurrentJobToggle(exp.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                            I currently work here
                          </label>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>

                        {/* Achievements */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Key Achievements
                            </label>
                            <button
                              onClick={() => handleAddAchievement(exp.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Achievement
                            </button>
                          </div>
                          <div className="space-y-2">
                            {exp.achievements?.map((achievement, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => handleAchievementChange(exp.id, idx, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="e.g., Increased sales by 20%..."
                                />
                                <button
                                  onClick={() => handleRemoveAchievement(exp.id, idx)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <button
                            onClick={() => handleDuplicateExperience(exp)}
                            className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => handleRemoveExperience(exp.id, e)}
                            className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                          <button
                            onClick={saveChanges}
                            disabled={isSaving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;