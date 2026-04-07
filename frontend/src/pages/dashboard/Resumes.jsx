// src/pages/dashboard/Resumes.jsx - ADVANCED RESUME MANAGEMENT
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import {
  FileText, Plus, Edit, Trash2, Eye, Download, Loader2,
  Search, Filter, Star, RefreshCw, X, Clock, AlertCircle,
  Grid, List, ChevronRight, TrendingUp, Target, Sparkles,
  Zap, Pin, Award, Copy, MoreVertical, Check, CheckCircle,
  Sun, Moon, Maximize2, Minimize2, ZoomIn, ZoomOut,
  RotateCcw, Printer, Share2, Bookmark, Flag, Layers,
  Settings, ExternalLink, ChevronLeft, Calendar
} from 'lucide-react';

import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import NewResumeModal from '../../components/NewResumeModal';

// ==================== ADVANCED PREVIEW MODAL ====================
const PreviewModal = ({ isOpen, onClose, resume, darkMode, onEdit }) => {
  const [previewZoom, setPreviewZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [isExporting, setIsExporting] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const previewRef = useRef(null);

  if (!isOpen || !resume) return null;

  const handleEdit = async () => {
    setIsEditLoading(true);
    try {
      // Close modal with smooth animation
      onClose();
      // Brief delay to allow animation
      await new Promise(resolve => setTimeout(resolve, 300));
      // Navigate to builder
      onEdit(resume);
    } catch (error) {
      console.error('Error navigating to editor:', error);
      setIsEditLoading(false);
      toast.error('Failed to open editor');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Edit Button */}
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'
              }`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resume.title}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Button in Preview */}
                <motion.button
                  onClick={handleEdit}
                  disabled={isEditLoading}
                  whileHover={{ scale: isEditLoading ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 shadow-lg transition-all ${isEditLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl'
                    }`}
                >
                  {isEditLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Editor...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Edit Resume</span>
                    </>
                  )}
                </motion.button>
                <button
                  onClick={onClose}
                  disabled={isEditLoading}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    } ${isEditLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Content - Simplified for clarity */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h1 className="text-3xl font-bold mb-2">
                    {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
                  </h1>
                  <p className="text-gray-600 mb-4">{resume.personalInfo?.email} • {resume.personalInfo?.phone}</p>

                  {resume.summary && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Summary</h2>
                      <p className="text-gray-700">{resume.summary}</p>
                    </div>
                  )}

                  {resume.experience?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4">Experience</h2>
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== ADVANCED RESUME CARD ====================
const ResumeCard = ({ resume, onEdit, onPreview, onDelete, onDuplicate, onToggleStar, onTogglePin, isSelected, onSelect, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative p-5 rounded-xl border transition-all cursor-pointer ${isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
        : darkMode
          ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800'
          : 'bg-white border-gray-200 hover:border-blue-500/50 hover:shadow-xl'
        }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(resume._id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-gray-300 text-blue-600"
        />
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {resume.isPrimary && (
          <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full">
            Primary
          </span>
        )}
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resume.status)}`}>
          {resume.status}
        </span>
      </div>

      {/* Content */}
      <div className="mt-8">
        <h3
          className={`font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
            }`}
          onClick={() => onPreview(resume)}
        >
          {resume.title || 'Untitled Resume'}
        </h3>

        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
          {!resume.personalInfo?.firstName && !resume.personalInfo?.lastName && 'No name'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(resume.analysis?.atsScore || 0)}`}>
              {resume.analysis?.atsScore || 0}% ATS
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{resume.views || 0}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Completion</span>
            <span className="font-medium text-blue-600">{resume.analysis?.completeness || 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${resume.analysis?.completeness || 0}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {new Date(resume.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleStar(resume._id, resume.isStarred); }}
              className={`p-1.5 rounded-lg transition-colors ${resume.isStarred
                ? 'text-amber-500'
                : darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
            >
              <Star className="w-4 h-4" fill={resume.isStarred ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(resume._id, resume.isPinned); }}
              className={`p-1.5 rounded-lg transition-colors ${resume.isPinned
                ? 'text-amber-500'
                : darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons - Appear on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/60 to-transparent rounded-b-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onPreview(resume); }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  title="Quick Preview"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onEdit(resume); }}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  title="Edit Resume"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onDuplicate(resume._id); }}
                  className="p-2 bg-green-600/80 hover:bg-green-700 rounded-lg text-white transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onDelete(resume); }}
                  className="p-2 bg-red-600/80 hover:bg-red-700 rounded-lg text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ==================== MAIN RESUMES COMPONENT ====================
const Resumes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // ============ STATE ============
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedResumes, setSelectedResumes] = useState([]);

  // Modal States
  const [resumeToPreview, setResumeToPreview] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewResumeModalOpen, setIsNewResumeModalOpen] = useState(false);

  // UI States
  const [darkMode, setDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // ============ LOAD RESUMES ============
  const loadResumes = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiService.resume.getUserResumes();
      const resumesData = Array.isArray(data) ? data : [];
      setResumes(resumesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadResumes();
    }
  }, [isAuthenticated, user, loadResumes]);

  // ============ LOAD THEME ============
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setDarkMode(storedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ============ FILTER & SORT ============
  const filteredResumes = useMemo(() => {
    let filtered = [...resumes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.title?.toLowerCase().includes(term) ||
        r.personalInfo?.firstName?.toLowerCase().includes(term) ||
        r.personalInfo?.lastName?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    filtered.sort((a, b) => {
      const order = sortOrder === 'desc' ? -1 : 1;
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return order * (aVal > bVal ? 1 : aVal < bVal ? -1 : 0);
    });

    return filtered;
  }, [resumes, searchTerm, filterStatus, sortBy, sortOrder]);

  // ============ STATS ============
  const stats = useMemo(() => ({
    total: resumes.length,
    completed: resumes.filter(r => r.status === 'completed').length,
    drafts: resumes.filter(r => r.status === 'draft').length,
    inProgress: resumes.filter(r => r.status === 'in-progress').length,
    avgAtsScore: resumes.length
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0
  }), [resumes]);

  // ============ ✅ SMART EDIT FUNCTION ============
  const handleEditResume = useCallback((resume) => {
    try {
      console.log('🚀 Opening builder for resume:', resume._id);

      // Show loading toast
      toast.loading('Opening editor...', { id: 'edit-resume' });

      // Navigate to builder with the resume ID
      // The builder will automatically load the resume data
      navigate(`/builder/edit/${resume._id}`, {
        state: {
          fromResumes: true,
          resumeData: resume, // Pass data for instant display
          timestamp: Date.now()
        }
      });

      // Dismiss loading toast after navigation intent
      setTimeout(() => {
        toast.dismiss('edit-resume');
      }, 1000);
    } catch (error) {
      console.error('❌ Error opening editor:', error);
      toast.error('Failed to open editor', { id: 'edit-resume' });
    }
  }, [navigate]);

  // ============ PREVIEW ============
  const handlePreviewResume = useCallback((resume) => {
    setResumeToPreview(resume);
    setIsPreviewModalOpen(true);
  }, []);

  // ============ CREATE NEW ============
  const handleCreateNew = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsNewResumeModalOpen(true);
  }, [isAuthenticated, navigate]);

  // ============ HANDLE NEW RESUME MODE SELECTION ============
  const handleNewResumeModeSelection = useCallback(async (modeId, data) => {
    try {
      // Show loading indication
      toast.loading('Preparing resume builder...', { id: 'new-resume-mode' });

      // Navigate to builder/new with selected mode and data
      // Note: File data is temporarily stored in sessionStorage (temp_resume_file)
      navigate('/builder/new', {
        state: {
          mode: modeId,
          jobDescription: data.jobDescription,
          uploadedFile: data.uploadedFile, // Only metadata, actual file in sessionStorage
          hasFile: data.hasFile
        }
      });

      // Dismiss toast after navigation completes
      setTimeout(() => {
        toast.dismiss('new-resume-mode');
      }, 500);
    } catch (error) {
      console.error('❌ Error in mode selection:', error);
      toast.error('Failed to start builder', { id: 'new-resume-mode' });
      sessionStorage.removeItem('temp_resume_file');
      throw new Error(error.message || 'Failed to start builder');
    }
  }, [navigate]);

  // ============ DUPLICATE ============
  const handleDuplicateResume = useCallback(async (resumeId) => {
    try {
      toast.loading('Duplicating...', { id: 'duplicate' });
      const duplicated = await apiService.resume.duplicateResume(resumeId);
      if (duplicated) {
        setResumes(prev => [duplicated, ...prev]);
        toast.success('Resume duplicated!', { id: 'duplicate' });
      }
    } catch (error) {
      toast.error('Failed to duplicate', { id: 'duplicate' });
    }
  }, []);

  // ============ TOGGLE STAR ============
  const handleToggleStar = useCallback(async (resumeId, isStarred) => {
    try {
      await apiService.resume.updateResume(resumeId, { isStarred: !isStarred });
      setResumes(prev => prev.map(r =>
        r._id === resumeId ? { ...r, isStarred: !isStarred } : r
      ));
    } catch (error) {
      toast.error('Failed to update star');
    }
  }, []);

  // ============ TOGGLE PIN ============
  const handleTogglePin = useCallback(async (resumeId, isPinned) => {
    try {
      await apiService.resume.updateResume(resumeId, { isPinned: !isPinned });
      setResumes(prev => prev.map(r =>
        r._id === resumeId ? { ...r, isPinned: !isPinned } : r
      ));
    } catch (error) {
      toast.error('Failed to update pin');
    }
  }, []);

  // ============ DELETE ============
  const handleDeleteResume = useCallback((resume) => {
    setResumeToDelete(resume);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!resumeToDelete) return;

    setIsDeleting(true);
    try {
      await apiService.resume.deleteResume(resumeToDelete._id);
      setResumes(prev => prev.filter(r => r._id !== resumeToDelete._id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setResumeToDelete(null);
    }
  }, [resumeToDelete]);

  // ============ SELECT ============
  const handleSelectResume = useCallback((resumeId) => {
    setSelectedResumes(prev =>
      prev.includes(resumeId)
        ? prev.filter(id => id !== resumeId)
        : [...prev, resumeId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedResumes.length === filteredResumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(filteredResumes.map(r => r._id));
    }
  }, [selectedResumes.length, filteredResumes]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(async () => {
    if (selectedResumes.length === 0) return;

    if (window.confirm(`Delete ${selectedResumes.length} resumes?`)) {
      try {
        toast.loading(`Deleting ${selectedResumes.length} resumes...`, { id: 'bulk' });
        await Promise.all(selectedResumes.map(id => apiService.resume.deleteResume(id)));
        setResumes(prev => prev.filter(r => !selectedResumes.includes(r._id)));
        setSelectedResumes([]);
        toast.success(`Deleted ${selectedResumes.length} resumes`, { id: 'bulk' });
      } catch (error) {
        toast.error('Bulk delete failed', { id: 'bulk' });
      }
    }
  }, [selectedResumes]);

  // ============ REFRESH ============
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadResumes();
    setIsRefreshing(false);
    toast.success('Resumes refreshed');
  }, [loadResumes]);

  // ============ TOGGLE DARK MODE ============
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // ============ LOADING ============
  if (loading && resumes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Resumes
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stats.total} resumes • {stats.completed} completed • {stats.drafts} drafts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                }`}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Resume
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: FileText, color: 'blue' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'yellow' },
            { label: 'ATS Score', value: `${stats.avgAtsScore}%`, icon: Target, color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className={`px-3 py-2 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              {sortOrder === 'desc' ? 'Desc' : 'Asc'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedResumes.length > 0 && (
          <div className={`mb-4 p-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {selectedResumes.length} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedResumes([])}
                  className={`px-3 py-1.5 rounded-lg border text-sm ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                    }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No resumes found
            </h3>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={handleEditResume}
                  onPreview={handlePreviewResume}
                  onDelete={handleDeleteResume}
                  onDuplicate={handleDuplicateResume}
                  onToggleStar={handleToggleStar}
                  onTogglePin={handleTogglePin}
                  onSelect={handleSelectResume}
                  isSelected={selectedResumes.includes(resume._id)}
                  darkMode={darkMode}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        resume={resumeToPreview}
        darkMode={darkMode}
        onEdit={handleEditResume}
      />

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className={`relative w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Resume
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete "{resumeToDelete?.title}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Resume Modal */}
      <NewResumeModal
        isOpen={isNewResumeModalOpen}
        onClose={() => setIsNewResumeModalOpen(false)}
        onSelectMode={handleNewResumeModeSelection}
      />
    </div>
  );
};

export default React.memo(Resumes);