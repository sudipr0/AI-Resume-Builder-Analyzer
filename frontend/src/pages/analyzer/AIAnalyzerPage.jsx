// src/pages/analyzer/AIAnalyzerEnhanced.jsx - COMPLETELY FIXED VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Icons
import {
  FaRobot, FaFileAlt, FaCheckCircle, FaSpinner, FaArrowLeft,
  FaHistory, FaPlus, FaTimes, FaClock, FaChartLine, FaSearch,
  FaCloudUploadAlt, FaGlobe, FaRegClock, FaTrash, FaFolderOpen,
  FaList, FaEdit, FaStar, FaExternalLinkAlt, FaCog, FaBolt,
  FaFilter, FaFilePdf, FaFileWord, FaLink, FaUser, FaCalendarAlt,
  FaAngleDown, FaAngleUp, FaRegCopy, FaDownload, FaShareAlt,
  FaLightbulb, FaBullseye, FaBalanceScale, FaMagic, FaCrown,
  FaWifi, FaBrain, FaMicrochip, FaChartBar,
  FaGraduationCap, FaBriefcase, FaCode, FaComments,
  FaExclamationTriangle, FaCloud, FaChevronRight
} from 'react-icons/fa';

// Context & Hooks
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../context/AIContext';

// Components
import Navbar from '../../components/Navbar';
import AIAnalysisReport from './AIAnalysisReport';
import AnalysisProgress from './AnalysisProgress';
import KeywordAnalysis from './KeywordAnalysis';
import ImprovementSuggestions from './ImprovementSuggestions';

// ==================== UTILITIES ====================
const getScoreColor = (score) => {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 80) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
};

const getScoreBgColor = (score) => {
  if (score >= 90) return 'bg-emerald-100';
  if (score >= 80) return 'bg-green-100';
  if (score >= 70) return 'bg-yellow-100';
  if (score >= 60) return 'bg-orange-100';
  return 'bg-red-100';
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get display name from resume
const getResumeDisplayName = (resume) => {
  if (!resume) return 'Unknown';
  if (resume.personalInfo) {
    const { firstName, lastName } = resume.personalInfo;
    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
  }
  if (resume.title && resume.title !== 'Untitled Resume') {
    return resume.title;
  }
  return 'Unnamed Resume';
};

// Get skills summary
const getSkillsSummary = (resume) => {
  if (!resume?.skills) return [];
  if (Array.isArray(resume.skills)) return resume.skills.slice(0, 5);
  if (typeof resume.skills === 'string') return resume.skills.split(',').map(s => s.trim()).slice(0, 5);
  return [];
};

// ==================== HISTORY COMPONENT ====================
const AnalysisHistoryList = ({ history, searchQuery, onSelect, onDelete, onViewAll }) => {
  const filtered = history.filter(report =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaHistory className="text-2xl text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Recent Analyses</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          View All <FaExternalLinkAlt />
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <FaClock className="text-5xl text-blue-300 mx-auto mb-4" />
          <p className="text-gray-600">No analysis history yet</p>
          <p className="text-gray-500 text-sm mt-2">Your first AI analysis will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filtered.slice(0, 5).map((report) => (
            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onSelect(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFileAlt className="text-blue-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 truncate">
                      {report.title || 'Untitled Analysis'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    vs. {report.jobTitle || 'Unknown Job'}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock /> {formatTimeAgo(report.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaChartLine /> Score: {report.overallScore || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-black ${getScoreColor(report.overallScore || 0)}`}>
                    {report.overallScore || 0}%
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(report.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete analysis"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length > 5 && (
            <div className="text-center pt-2">
              <button
                onClick={onViewAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 w-full py-2 border-t border-gray-100"
              >
                View All {filtered.length} Reports <FaChevronRight className="text-xs" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== RESUME SELECTION MODAL ====================
const ResumeSelectionModal = ({ isOpen, onClose, resumes, selectedIds, onSelect, search, onSearch }) => {
  const filteredResumes = resumes.filter(r => {
    const name = getResumeDisplayName(r).toLowerCase();
    const title = (r.title || '').toLowerCase();
    const searchLower = search.toLowerCase();
    return name.includes(searchLower) || title.includes(searchLower);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Select Resumes to Analyze</h2>
                  <p className="text-blue-100">Choose one or more resumes for AI analysis</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="relative mt-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            {/* Status Bar */}
            <div className="px-6 py-2 bg-gray-50 border-b flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  <span className="font-semibold">{resumes.length}</span> total resumes
                </span>
                <span className="text-gray-600">
                  <span className="font-semibold">{selectedIds.length}</span> selected
                </span>
              </div>
              {resumes.some(r => r.offline) && (
                <div className="flex items-center gap-1 text-amber-600">
                  <FaExclamationTriangle className="text-amber-600" />
                  <span>Offline mode</span>
                </div>
              )}
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {filteredResumes.length === 0 ? (
                <div className="text-center py-12">
                  <FaFileAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-4">
                    {search ? 'No matching resumes found' : 'No resumes available'}
                  </p>
                  {!search && (
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = '/builder';
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      <FaPlus className="inline mr-2" /> Create Your First Resume
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResumes.map((resume) => {
                    const isSelected = selectedIds.includes(resume._id);
                    const displayName = getResumeDisplayName(resume);
                    const skills = getSkillsSummary(resume);
                    const atsScore = resume.analysis?.atsScore || resume.atsScore || 0;
                    const isOffline = resume.offline;

                    return (
                      <motion.div
                        key={resume._id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => onSelect(resume._id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-blue-300'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-600' : getScoreBgColor(atsScore)
                              }`}>
                              {isSelected ? (
                                <FaCheckCircle className="text-white text-xl" />
                              ) : (
                                <FaFileAlt className={`text-xl ${atsScore >= 80 ? 'text-green-600' :
                                  atsScore >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {resume.title || 'Untitled Resume'}
                                </h4>
                                {isOffline && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                                    <FaExclamationTriangle className="text-xs" />
                                    Offline
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                {displayName}
                              </p>

                              {skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {resume.skills?.length > 5 && (
                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full">
                                      +{resume.skills.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FaRegClock />
                                  Updated {formatTimeAgo(resume.updatedAt)}
                                </span>
                                {resume.experience?.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FaUser />
                                    {resume.experience.length} {resume.experience.length === 1 ? 'role' : 'roles'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end ml-4">
                            <div className={`text-2xl font-black ${getScoreColor(atsScore)}`}>
                              {atsScore}%
                            </div>
                            <span className="text-xs text-gray-500">ATS Score</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
              <p className="font-semibold text-gray-900">
                {selectedIds.length} resume{selectedIds.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== MAIN COMPONENT ====================
const AIAnalyzerEnhanced = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { resumes, loading: resumesLoading, refreshResumes } = useResume();
  const {
    isAnalyzing,
    analyzeResume,
    extractKeywords,
    aiStatus,
    atsScore,
    keywordMatch,
    aiSuggestions,
    globalKeywords,
    setGlobalJobDescription
  } = useAI();

  // Refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const refreshCountRef = useRef(0);

  // Navbar menu items
  const navMenuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: FaChartLine,
      active: false
    },
    {
      label: 'Builder',
      href: '/builder',
      icon: FaFileAlt,
      active: false
    },
    {
      label: 'Analyzer',
      href: '/analyzer',
      icon: FaRobot,
      active: true
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: FaFileWord,
      active: false
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: FaCog,
      active: false
    }
  ];

  // State
  const [activeTab, setActiveTab] = useState('my-resumes');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [urls, setUrls] = useState(['']);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResumeIds, setSelectedResumeIds] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeSearch, setResumeSearch] = useState('');
  const [advancedOptions, setAdvancedOptions] = useState({
    depth: 'standard',
    optimizeFor: 'both',
    includeKeywords: true,
    showSuggestions: true,
    compareMode: 'detailed'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeView, setActiveView] = useState('input');
  const [localLoading, setLocalLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('extracting');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Debug: Log resumes when they change
  useEffect(() => {
    console.log('📊 AIAnalyzer - Resumes:', {
      count: resumes.length,
      loading: resumesLoading,
      aiStatus: aiStatus.connected ? 'Connected' : 'Offline'
    });

    const hasOffline = resumes.some(r => r.offline);
    setShowOfflineIndicator(hasOffline);

    // Mark data as loaded when we have resumes or loading is done
    if (resumes.length > 0) {
      setDataLoaded(true);
      setInitialLoadComplete(true);
    } else if (!resumesLoading) {
      // Loading finished but no resumes
      setDataLoaded(true);
      setInitialLoadComplete(true);
    }
  }, [resumes, resumesLoading, aiStatus]);

  // Initialize - with prevention of infinite loops
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Prevent multiple initializations
    if (hasInitializedRef.current) {
      console.log('⏭️ Already initialized, skipping...');
      return;
    }

    // Load analysis history
    const saved = localStorage.getItem('aiAnalysisHistory');
    if (saved) {
      try {
        setAnalysisHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }

    // If we already have resumes, mark as complete immediately
    if (resumes.length > 0) {
      console.log('✅ Already have resumes, skipping load');
      setInitialLoadComplete(true);
      setDataLoaded(true);
      hasInitializedRef.current = true;
      return;
    }

    // Only call refreshResumes once if we don't have data
    const loadResumes = async () => {
      try {
        hasInitializedRef.current = true;

        if (typeof refreshResumes === 'function') {
          console.log('🔄 Initial resume load');
          await refreshResumes();
          // Data will be loaded through the useEffect above
        } else {
          console.error('refreshResumes is not available');
          setInitialLoadComplete(true);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading resumes:', error);
        toast.error('Failed to load resumes');
        setInitialLoadComplete(true);
        setDataLoaded(true);
      }
    };

    loadResumes();

    // Safety timeout - if loading takes more than 5 seconds, force exit
    const timer = setTimeout(() => {
      if (resumesLoading && !dataLoaded) {
        console.warn('⚠️ Resume loading timeout - forcing exit');
        setLoadingTimeout(true);
        setInitialLoadComplete(true);
        setDataLoaded(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, navigate, resumes.length]); // Remove refreshResumes from deps to prevent loops

  // Handle refresh with rate limiting
  const handleRefreshResumes = useCallback(async () => {
    // Rate limit refreshes
    refreshCountRef.current++;
    if (refreshCountRef.current > 3) {
      toast.error('Too many refresh attempts. Please wait.');
      return;
    }

    try {
      if (typeof refreshResumes === 'function') {
        await refreshResumes();
        toast.success('Resumes refreshed!');
        // Reset counter after success
        setTimeout(() => {
          refreshCountRef.current = 0;
        }, 5000);
      } else {
        toast.error('Refresh function not available');
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh resumes');
    }
  }, [refreshResumes]);

  // Save history
  useEffect(() => {
    localStorage.setItem('aiAnalysisHistory', JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  // Update global job description when user types
  useEffect(() => {
    const debounce = setTimeout(() => {
      setGlobalJobDescription(jobDescription);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [jobDescription, setGlobalJobDescription]);

  // Handlers
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(selected.type)) {
      toast.error('Please upload PDF or DOCX only');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setFile(selected);
    setActiveTab('upload');
    toast.success(`Selected: ${selected.name}`);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => setUrls([...urls, '']);

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleViewAllHistory = () => {
    navigate('/analyzer/history');
  };

  const handleStartAnalysis = async () => {
    // Validation
    if (activeTab === 'my-resumes' && selectedResumeIds.length === 0) {
      toast.error('Please select at least one resume');
      return;
    }
    if (activeTab === 'upload' && !file) {
      toast.error('Please upload a file');
      return;
    }
    if (activeTab === 'url' && urls.filter(u => u.trim()).length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    setLocalLoading(true);
    setActiveView('analysis');

    try {
      // Stage 1: Extract Keywords
      setAnalysisStage('extracting');
      setAnalysisProgress(20);
      const keywordResult = await extractKeywords(jobDescription);
      setExtractedKeywords(keywordResult.keywords || []);

      // Stage 2: Get resume data
      setAnalysisStage('analyzing');
      setAnalysisProgress(40);

      let resumeData = null;
      if (activeTab === 'my-resumes') {
        const selectedResumes = resumes.filter(r => selectedResumeIds.includes(r._id));
        if (selectedResumes.length === 0) {
          toast.error('Selected resume not found');
          return;
        }
        resumeData = selectedResumes[0];
      }

      // Stage 3: Perform AI Analysis
      setAnalysisStage('matching');
      setAnalysisProgress(60);
      const analysisResult = await analyzeResume(resumeData, jobDescription);

      // Stage 4: Calculate final scores
      setAnalysisStage('scoring');
      setAnalysisProgress(80);

      // Stage 5: Generate suggestions
      setAnalysisStage('suggesting');
      setAnalysisProgress(95);

      // Wait a moment for the final stage
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisProgress(100);

      // Create final report
      const newReport = {
        id: Date.now(),
        title: `Analysis: ${jobDescription.split('\n')[0]?.substring(0, 30) || 'Job Analysis'}...`,
        jobTitle: jobDescription.split('\n')[0] || 'Unknown Job',
        fileName: file?.name || `${selectedResumeIds.length} resume(s)`,
        timestamp: new Date().toISOString(),
        overallScore: atsScore?.score || 85,
        resumeData,
        jobDescription,
        analysis: analysisResult,
        keywordAnalysis: {
          keywords: extractedKeywords,
          matchPercentage: keywordMatch?.matchPercentage || 75,
          matchedKeywords: keywordMatch?.matchedKeywords || [],
          missingKeywords: keywordMatch?.missingKeywords || []
        },
        suggestions: aiSuggestions || [],
        options: advancedOptions
      };

      setAnalysisHistory(prev => [newReport, ...prev.slice(0, 49)]);
      setAnalysisResult(newReport);
      setActiveView('report');
      toast.success('AI Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Analysis failed');
      setActiveView('input');
    } finally {
      setLocalLoading(false);
      setAnalysisProgress(0);
    }
  };

  const handleLoadFromHistory = (report) => {
    setAnalysisResult(report);
    setActiveView('report');
  };

  const handleDeleteReport = (id) => {
    setAnalysisHistory(prev => prev.filter(r => r.id !== id));
    toast.success('Report deleted');
  };

  const handleForceExitLoading = () => {
    setLoadingTimeout(true);
    setInitialLoadComplete(true);
    setDataLoaded(true);
  };

  const selectedResumes = resumes.filter(r => selectedResumeIds.includes(r._id));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md">
          <FaRobot className="text-7xl text-blue-600 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">Sign in to access the AI Resume Analyzer</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl hover:shadow-lg transition"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Only show loading if we're actually loading AND no data AND not timed out
  const showLoading = (resumesLoading && !dataLoaded && !loadingTimeout) || (localLoading && activeView !== 'analysis');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
      <Navbar
        user={user}
        menuItems={navMenuItems}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        darkMode={false}
        onToggleDarkMode={() => { }}
        onLogout={() => logout(navigate)}
      />

      {/* Resume Selection Modal */}
      <ResumeSelectionModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        resumes={resumes}
        selectedIds={selectedResumeIds}
        onSelect={(id) => {
          setSelectedResumeIds(prev =>
            prev.includes(id)
              ? prev.filter(i => i !== id)
              : [...prev, id]
          );
        }}
        search={resumeSearch}
        onSearch={setResumeSearch}
      />

      {/* Simple Header with Slogan */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRobot className="text-3xl text-white" />
              <div>
                <h1 className="text-2xl font-bold tracking-wide">Optimize. Stand Out. Win.</h1>
                <p className="text-sm text-blue-100">AI-Powered Resume Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {aiStatus.connected ? (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                  <FaWifi className="text-green-300" />
                  <span className="text-sm text-green-100">{aiStatus.model}</span>
                </div>
              ) : (
                <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                  <FaExclamationTriangle className="text-amber-300" />
                  <span className="text-sm text-amber-100">Offline Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-5xl text-blue-600 mb-4" />
            <span className="text-lg text-gray-600">
              {resumesLoading ? 'Loading your resumes...' : 'Processing...'}
            </span>
            <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={handleRefreshResumes}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
              >
                <FaSpinner className="w-4 h-4" /> Retry
              </button>
              <button
                onClick={handleForceExitLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm"
              >
                Skip to analyzer
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Input or Analysis Progress */}
            <div className="lg:col-span-2 space-y-8">
              {activeView === 'input' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Input Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900">Analyze Your Resume</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {resumes.length} resume{resumes.length !== 1 ? 's' : ''} available
                        </span>
                        <button
                          onClick={handleRefreshResumes}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Refresh resumes"
                        >
                          <FaSpinner className={resumesLoading ? 'animate-spin' : ''} />
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-gray-200">
                      {[
                        { id: 'my-resumes', icon: FaFolderOpen, label: 'My Resumes' },
                        { id: 'upload', icon: FaCloudUploadAlt, label: 'Upload File' },
                        { id: 'url', icon: FaGlobe, label: 'From URL' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all ${activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                          <tab.icon className="inline mr-3" /> {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mb-8">
                      {activeTab === 'my-resumes' && (
                        <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                          <FaFolderOpen className="text-6xl text-blue-600 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {selectedResumeIds.length > 0
                              ? `${selectedResumeIds.length} Resume(s) Selected`
                              : resumes.length > 0
                                ? 'No Resumes Selected'
                                : 'No Resumes Available'}
                          </h3>

                          {resumes.length === 0 ? (
                            <div>
                              <p className="text-gray-600 mb-4">You haven't created any resumes yet.</p>
                              <div className="flex flex-col gap-3 items-center">
                                <button
                                  onClick={() => navigate('/builder')}
                                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center gap-3"
                                >
                                  <FaPlus /> Create Your First Resume
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {selectedResumes.length > 0 && (
                                <div className="mb-4 text-left max-w-md mx-auto">
                                  {selectedResumes.map(resume => (
                                    <div key={resume._id} className="flex items-center gap-2 p-2 bg-white rounded-lg mb-2">
                                      <FaCheckCircle className="text-green-500" />
                                      <span className="text-gray-700">{resume.title}</span>
                                      {resume.offline && (
                                        <span className="text-xs text-amber-600 ml-auto">Offline</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={() => setShowResumeModal(true)}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center gap-3 mx-auto"
                              >
                                <FaList /> {selectedResumeIds.length > 0 ? 'Change Selection' : 'Select Resumes'}
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {activeTab === 'upload' && (
                        <div
                          className="text-center p-12 border-4 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 transition cursor-pointer"
                          onClick={() => document.getElementById('file-upload').click()}
                        >
                          <label className="cursor-pointer">
                            <FaCloudUploadAlt className="text-7xl text-blue-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {file ? file.name : 'Click to Upload Resume'}
                            </h3>
                            <p className="text-gray-600">PDF • DOCX • Max 10MB</p>
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      )}

                      {activeTab === 'url' && (
                        <div className="space-y-4">
                          {urls.map((url, index) => (
                            <div key={index} className="flex gap-3 items-center">
                              <FaLink className="text-blue-600 text-xl flex-shrink-0" />
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder="https://linkedin.com/in/... or Google Drive link"
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                              {urls.length > 1 && (
                                <button
                                  onClick={() => removeUrlField(index)}
                                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={addUrlField}
                            className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-3"
                          >
                            <FaPlus /> Add Another URL
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Job Description */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <FaBullseye /> Target Job Description
                      </h3>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job posting here for the most accurate AI analysis..."
                        rows="8"
                        className="w-full p-6 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-gray-900 placeholder-gray-500"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaLightbulb className="text-yellow-500" />
                          Pro tip: Include the full job description for better AI keyword matching
                        </p>
                        <span className="text-sm text-gray-500">
                          {jobDescription.length} characters
                        </span>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="border-t pt-8">
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <FaCog className="text-blue-600" />
                          <span className="text-xl font-bold text-gray-900">Advanced Settings</span>
                        </div>
                        {showAdvanced ? <FaAngleUp /> : <FaAngleDown />}
                      </button>

                      <AnimatePresence>
                        {showAdvanced && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 space-y-6"
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Analysis Depth
                                </label>
                                <select
                                  value={advancedOptions.depth}
                                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, depth: e.target.value }))}
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500"
                                >
                                  <option value="quick">Quick (30 seconds)</option>
                                  <option value="standard">Standard (60 seconds)</option>
                                  <option value="deep">Deep Analysis (90 seconds)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Optimize For
                                </label>
                                <select
                                  value={advancedOptions.optimizeFor}
                                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, optimizeFor: e.target.value }))}
                                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500"
                                >
                                  <option value="ats">ATS Systems</option>
                                  <option value="recruiter">Human Recruiters</option>
                                  <option value="both">Both (Recommended)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex gap-6">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={advancedOptions.includeKeywords}
                                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, includeKeywords: e.target.checked }))}
                                  className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-700">Include Keyword Analysis</span>
                              </label>

                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={advancedOptions.showSuggestions}
                                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, showSuggestions: e.target.checked }))}
                                  className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-700">Show Improvement Suggestions</span>
                              </label>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Analyze Button */}
                    <motion.button
                      onClick={handleStartAnalysis}
                      disabled={isAnalyzing || localLoading}
                      whileHover={{ scale: (isAnalyzing || localLoading) ? 1 : 1.02 }}
                      whileTap={{ scale: (isAnalyzing || localLoading) ? 1 : 0.98 }}
                      className={`w-full mt-8 py-5 rounded-xl text-2xl font-bold transition-all shadow-lg ${(isAnalyzing || localLoading)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white'
                        }`}
                    >
                      {(isAnalyzing || localLoading) ? (
                        <>
                          <FaSpinner className="animate-spin inline mr-3" /> AI Processing...
                        </>
                      ) : (
                        <>
                          <FaRobot className="inline mr-3" /> Start AI Analysis
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Features Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                      <FaCrown className="text-yellow-300" />
                      AI-Powered Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { icon: FaChartLine, title: 'Smart Job Fit Score', desc: 'AI calculates exact match percentage' },
                        { icon: FaMagic, title: 'Deep Keyword Analysis', desc: 'Extract and match critical keywords' },
                        { icon: FaBalanceScale, title: 'ATS Compatibility', desc: 'Advanced resume scanner score' },
                        { icon: FaLightbulb, title: 'Intelligent Tips', desc: 'Context-aware improvement suggestions' }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="bg-white/20 p-3 rounded-xl">
                            <feature.icon className="text-2xl text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">{feature.title}</h4>
                            <p className="text-blue-100 text-sm">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'analysis' && (
                <AnalysisProgress
                  progress={analysisProgress}
                  stage={analysisStage}
                  status={`AI is ${analysisStage} your resume...`}
                />
              )}

              {activeView === 'report' && analysisResult && (
                <div className="space-y-8">
                  <AIAnalysisReport analysis={analysisResult} />

                  {analysisResult.keywordAnalysis && (
                    <KeywordAnalysis
                      keywords={analysisResult.keywordAnalysis.keywords}
                      matchPercentage={analysisResult.keywordAnalysis.matchPercentage}
                      matchedKeywords={analysisResult.keywordAnalysis.matchedKeywords}
                      missingKeywords={analysisResult.keywordAnalysis.missingKeywords}
                    />
                  )}

                  {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                    <ImprovementSuggestions suggestions={analysisResult.suggestions} />
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={() => setActiveView('input')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center gap-3"
                    >
                      <FaPlus /> New Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - History & Stats */}
            <div className="space-y-8">
              {/* History Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
                <AnalysisHistoryList
                  history={analysisHistory}
                  searchQuery={searchQuery}
                  onSelect={handleLoadFromHistory}
                  onDelete={handleDeleteReport}
                  onViewAll={handleViewAllHistory}
                />
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <FaChartLine /> Analysis Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-white">{analysisHistory.length}</div>
                    <div className="text-indigo-200">Total AI Analyses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {analysisHistory.length > 0
                        ? Math.round(analysisHistory.reduce((a, b) => a + (b.overallScore || 0), 0) / analysisHistory.length)
                        : 0}%
                    </div>
                    <div className="text-indigo-200">Average Score</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {new Set(analysisHistory.map(h => h.jobTitle)).size}
                    </div>
                    <div className="text-indigo-200">Different Jobs Analyzed</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/builder')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                  >
                    <FaPlus className="text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Create New Resume</div>
                      <div className="text-sm text-gray-600">Start from scratch</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('input');
                      setJobDescription('');
                      setFile(null);
                      setUrls(['']);
                      setSelectedResumeIds([]);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                  >
                    <FaFileAlt className="text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">New Analysis</div>
                      <div className="text-sm text-gray-600">Start fresh AI analysis</div>
                    </div>
                  </button>
                  <button
                    onClick={handleRefreshResumes}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
                  >
                    <FaSpinner className="text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Refresh Resumes</div>
                      <div className="text-sm text-gray-600">Reload from server</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* AI Status Card */}
              <div className={`rounded-2xl p-6 ${aiStatus.connected ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                }`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <FaMicrochip className={aiStatus.connected ? 'text-green-600' : 'text-amber-600'} />
                  AI Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Connection:</span>
                    <span className={`font-semibold flex items-center gap-1 ${aiStatus.connected ? 'text-green-600' : 'text-amber-600'
                      }`}>
                      {aiStatus.connected ? <FaWifi /> : <FaExclamationTriangle />}
                      {aiStatus.connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  {aiStatus.connected && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-semibold text-gray-900">{aiStatus.model}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Processing:</span>
                        <span className={`font-semibold ${aiStatus.processing ? 'text-blue-600' : 'text-gray-900'}`}>
                          {aiStatus.processing ? 'Active' : 'Idle'}
                        </span>
                      </div>
                    </>
                  )}
                  {!aiStatus.connected && (
                    <p className="text-sm text-amber-700 mt-2">
                      Using fallback analysis mode. Some features may be limited.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AIAnalyzerEnhanced);