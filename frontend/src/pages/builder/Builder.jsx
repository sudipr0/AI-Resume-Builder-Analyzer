// src/pages/builder/Builder.jsx - FIXED VERSION
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../context/AIContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Icons
import {
  ChevronLeft, ChevronRight, Eye, EyeOff, Download,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  Layout, Settings, Sparkles, Save as SaveIcon,
  CheckCircle, AlertCircle, Printer, Brain,
  Copy, Trash2, Plus, X, ArrowRight,
  Menu, User, Building, GraduationCap,
  Briefcase, Award, Globe, Code, Target,
  Clock, Calendar, MapPin, Mail, Phone, ExternalLink,
  Edit2, Check, TrendingUp, Lightbulb, Wand2,
  FileText, Search, Filter, Layers, Star,
  Upload, Image, Palette, Type, Share,
  Grid, Sidebar, SidebarClose, PanelLeftClose, PanelLeftOpen,
  Smartphone, Tablet, Monitor, Maximize, Minimize,
  RefreshCw, ChevronDown, ChevronUp, Home
} from 'lucide-react';

// Components
import Navbar from '../../components/Navbar';
import PersonalInfoPage from '../../components/section/PersonalInfoPage';
import SummaryPage from '../../components/section/SummaryPage';
import ExperiencePage from '../../components/section/ExperiencePage';
import SkillsPage from '../../components/section/SkillsPage';
import EducationPage from '../../components/section/EducationPage';
import ProjectsPage from '../../components/section/ProjectsPage';
import CertificationsPage from '../../components/section/CertificationsPage';
import LanguagesPage from '../../components/section/LanguagesPage';
import FloatingActionButtons from '../../components/ui/FloatingActionButtons';
import ResumePreview from '../../components/preview/RealTimePreview';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Builder = ({ isNewResume: propIsNew, resumeId, importedData }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // ============ SIMPLIFIED STATE MANAGEMENT ============
  const [isNewResume, setIsNewResume] = useState(() => {
    // Check if this is a new resume based on props, URL params, or location
    return propIsNew ||
      location.pathname.includes('/builder/new') ||
      (id === 'new') ||
      (!id && !resumeId);
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState(null);

  const [activeView, setActiveView] = useState(() => {
    return window.innerWidth < 1024 ? 'editor' : 'split';
  });
  const [previewZoom, setPreviewZoom] = useState(() => {
    if (window.innerWidth < 640) return 0.5;
    if (window.innerWidth < 1024) return 0.7;
    return 0.8;
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [wizardStep, setWizardStep] = useState(0);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showExportManager, setShowExportManager] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [localAiSuggestions, setLocalAiSuggestions] = useState([]);
  const [completion, setCompletion] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1024);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false);
  const [showResumeNameEditor, setShowResumeNameEditor] = useState(false);

  // ============ RESPONSIVE BREAKPOINTS ============
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setWindowSize({
        width: newWidth,
        height: newHeight
      });

      if (newWidth < 768 && activeView === 'split') {
        setActiveView('editor');
      }

      if (newWidth < 640) {
        setPreviewZoom(0.5);
      } else if (newWidth < 1024) {
        setPreviewZoom(0.7);
      }

      if (newWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [activeView]);

  // ============ REFS ============
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const resumeNameInputRef = useRef(null);
  const initializationDoneRef = useRef(false);

  // ============ CONTEXT HOOKS ============
  const {
    currentResume,
    createResume,
    updateResume,
    saveResume,
    quickSave,
    updateCurrentResumeData,
    loadResume,
    loading: resumeLoading,
    error: resumeError,
    getEmptyResume
  } = useResume();

  const {
    analyzeResume,
    optimizeContent,
    generateSummary,
    improveSection,
    isAnalyzing,
    aiSuggestions,
    aiScore
  } = useAI();

  // ============ WIZARD STEPS ============
  const wizardSteps = useMemo(() => [
    { id: 'personal', label: 'Personal Info', icon: '👤', component: PersonalInfoPage, required: true },
    { id: 'summary', label: 'Summary', icon: '📝', component: SummaryPage, required: true },
    { id: 'experience', label: 'Experience', icon: '💼', component: ExperiencePage, required: true },
    { id: 'skills', label: 'Skills', icon: '⚡', component: SkillsPage, required: true },
    { id: 'education', label: 'Education', icon: '🎓', component: EducationPage, required: true },
    { id: 'projects', label: 'Projects', icon: '🚀', component: ProjectsPage, required: false },
    { id: 'certifications', label: 'Certifications', icon: '🏆', component: CertificationsPage, required: false },
    { id: 'languages', label: 'Languages', icon: '🌐', component: LanguagesPage, required: false },
    { id: 'finalize', label: 'Finalize', icon: '✅', component: null, required: true }
  ], []);

  // ============ SIMPLIFIED INITIALIZATION ============
  useEffect(() => {
    let mounted = true;

    const initializeBuilder = async () => {
      if (initializationDoneRef.current) return;

      setIsInitializing(true);
      setInitializationError(null);

      try {
        console.log('🚀 Initializing Builder:', { isNewResume, id, resumeId });

        if (!isNewResume && (id || resumeId)) {
          // Load existing resume
          const resumeToLoad = id || resumeId;
          if (resumeToLoad && resumeToLoad !== 'new') {
            console.log('📂 Loading existing resume:', resumeToLoad);
            await loadResume(resumeToLoad);
          }
        } else if (isNewResume) {
          // Create new resume workspace
          console.log('✨ Creating new resume workspace');

          // Get user data
          let user = null;
          try {
            const userStr = localStorage.getItem('user') || localStorage.getItem('user_data');
            if (userStr) user = JSON.parse(userStr);
          } catch (e) { }

          // Get imported data from location state or props
          const importedDataFromState = location.state?.importedData || importedData || {};

          // Create empty resume template
          const emptyTemplate = getEmptyResume();

          // Merge with imported data
          const newResumeData = {
            ...emptyTemplate,
            title: `${user?.name?.split(' ')[0] || 'My'}'s Resume`,
            template: 'modern',
            status: 'draft',
            createdBy: user?._id || user?.id,
            personalInfo: {
              name: user?.name || '',
              email: user?.email || '',
              ...(importedDataFromState.personalInfo || {})
            },
            ...importedDataFromState
          };

          // Update current resume data
          updateCurrentResumeData(newResumeData);

          // Don't automatically create in backend - wait for user to save
          console.log('✅ New resume workspace ready');
        }

        if (mounted) {
          initializationDoneRef.current = true;
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('❌ Builder initialization error:', error);
        if (mounted) {
          setInitializationError(error.message);
          toast.error('Failed to initialize builder');
          setIsInitializing(false);
        }
      }
    };

    initializeBuilder();

    return () => {
      mounted = false;
    };
  }, [isNewResume, id, resumeId]); // Only run once on mount

  // ============ UPDATE COMPLETION PERCENTAGE ============
  useEffect(() => {
    if (currentResume) {
      const calculateCompletion = () => {
        let completed = 0;
        const totalRequired = 5;

        if (currentResume.personalInfo?.name && currentResume.personalInfo?.email) completed++;
        if (currentResume.summary?.trim() && currentResume.summary.trim().length > 50) completed++;
        if (currentResume.experience?.length > 0) completed++;
        if (currentResume.skills?.length > 3) completed++;
        if (currentResume.education?.length > 0) completed++;

        if (currentResume.projects?.length > 0) completed += 0.5;
        if (currentResume.certifications?.length > 0) completed += 0.5;
        if (currentResume.languages?.length > 0) completed += 0.5;

        completed = Math.min(completed, totalRequired + 1.5);
        return Math.round((completed / totalRequired) * 100);
      };

      const newCompletion = calculateCompletion();
      if (newCompletion !== completion) {
        setCompletion(newCompletion);
      }
    }
  }, [currentResume, completion]);

  // ============ AUTO-SAVE (only for existing resumes) ============
  useEffect(() => {
    if (!currentResume || isNewResume || !currentResume._id || isCreating) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaveStatus('saving');
      try {
        await quickSave();
        setAutoSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    }, 10000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [currentResume, isNewResume, isCreating, quickSave]);

  // ============ MANUAL SAVE ============
  const handleManualSave = async () => {
    if (!currentResume) {
      toast.error('No resume data to save');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      let savedResume;

      if (isNewResume || !currentResume._id) {
        // Create new resume
        setIsCreating(true);
        savedResume = await createResume(currentResume);
        if (savedResume && savedResume._id) {
          setIsNewResume(false);
          // Update URL to edit mode
          navigate(`/builder/edit/${savedResume._id}`, { replace: true });
          toast.success('Resume created successfully!');
        }
      } else {
        // Update existing resume
        savedResume = await saveResume(currentResume);
        toast.success('Resume saved successfully!');
      }

      if (savedResume) {
        setAutoSaveStatus('saved');
      }

      setIsCreating(false);
      return savedResume;
    } catch (error) {
      console.error('Save failed:', error);
      setAutoSaveStatus('error');
      toast.error(`Failed to save: ${error.message}`);
      setIsCreating(false);
      throw error;
    }
  };

  // ============ RESUME NAME HANDLING ============
  const handleResumeNameUpdate = useCallback((newName) => {
    if (!currentResume || !newName.trim()) return;
    updateCurrentResumeData({ title: newName.trim() });
    setShowResumeNameEditor(false);
    toast.success('Resume name updated!');
  }, [currentResume, updateCurrentResumeData]);

  const getResumeTitle = useCallback(() => {
    return currentResume?.title || 'Untitled Resume';
  }, [currentResume]);

  // ============ PREVIEW UPDATE ============
  const [previewUpdateKey, setPreviewUpdateKey] = useState(0);

  useEffect(() => {
    if (currentResume) {
      setIsPreviewUpdating(true);
      const timer = setTimeout(() => {
        setPreviewUpdateKey(prev => prev + 1);
        setIsPreviewUpdating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentResume]);

  const handleZoomIn = () => {
    const maxZoom = previewDevice === 'mobile' ? 1.5 : previewDevice === 'tablet' ? 1.2 : 2;
    setPreviewZoom(prev => Math.min(prev + 0.1, maxZoom));
  };

  const handleZoomOut = () => {
    const minZoom = 0.3;
    setPreviewZoom(prev => Math.max(prev - 0.1, minZoom));
  };

  // ============ WIZARD NAVIGATION ============
  const handleNextStep = () => {
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(wizardStep + 1);
      setActiveSection(wizardSteps[wizardStep + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
      setActiveSection(wizardSteps[wizardStep - 1].id);
    }
  };

  const handleJumpToStep = (index) => {
    setWizardStep(index);
    setActiveSection(wizardSteps[index].id);
  };

  // ============ UPDATE RESUME DATA ============
  const handleUpdateResume = (data) => {
    if (!currentResume || !updateCurrentResumeData) return;
    updateCurrentResumeData(data);
  };

  // ============ AI FUNCTIONS ============
  const handleAIAnalysis = async () => {
    if (!jobDescription?.trim()) {
      toast.error('Please provide a job description');
      return;
    }

    if (!currentResume) {
      toast.error('No resume data available');
      return;
    }

    try {
      const result = await analyzeResume(currentResume, jobDescription);
      if (result.success) {
        toast.success('AI analysis complete!');
        setLocalAiSuggestions(result.suggestions || []);
      }
    } catch (error) {
      toast.error('Failed to analyze resume');
    }
  };

  const handleOptimizeSection = async (sectionId) => {
    try {
      const sectionData = currentResume?.[sectionId];
      const result = await improveSection(sectionId, sectionData, jobDescription);
      if (result.success && result.optimized) {
        handleUpdateResume({ [sectionId]: result.optimized });
        toast.success(`AI improved your ${sectionId} section`);
      }
    } catch (error) {
      toast.error('Failed to optimize section');
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummary(currentResume);
      if (result.success && result.summary) {
        handleUpdateResume({ summary: result.summary });
        toast.success('AI generated a new summary');
      }
    } catch (error) {
      toast.error('Failed to generate summary');
    }
  };

  // ============ VIEW CONTROLS ============
  const getCurrentComponent = () => {
    const step = wizardSteps.find(s => s.id === activeSection);
    return step?.component || null;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen && previewRef.current) {
      if (previewRef.current.requestFullscreen) {
        previewRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // ============ NAVIGATION ============
  const handleBack = () => {
    if (isNewResume) {
      navigate('/builder');
    } else {
      navigate('/dashboard');
    }
  };

  // ============ CALCULATE ATS SCORE ============
  const calculateATSScore = () => {
    if (!currentResume) return 0;

    let score = 0;

    if (currentResume.personalInfo?.name && currentResume.personalInfo?.email) score += 20;
    if (currentResume.summary?.trim() && currentResume.summary.trim().length > 50) score += 15;
    if (currentResume.experience?.length > 0) score += 20;
    if (currentResume.skills?.length > 3) score += 15;
    if (currentResume.education?.length > 0) score += 10;

    if (currentResume.projects?.length > 0) score += 5;
    if (currentResume.certifications?.length > 0) score += 5;
    if (currentResume.languages?.length > 0) score += 5;

    return Math.min(score, 100);
  };

  // ============ RESPONSIVE HELPERS ============
  const getViewClasses = () => {
    if (windowSize.width < 768) {
      return {
        editor: activeView === 'editor' ? 'w-full' : 'hidden',
        preview: activeView === 'preview' ? 'w-full' : 'hidden',
        split: 'hidden'
      };
    } else {
      return {
        editor: activeView === 'editor' ? 'w-full' :
          activeView === 'split' ? 'w-1/2' : 'hidden',
        preview: activeView === 'preview' ? 'w-full' :
          activeView === 'split' ? 'w-1/2' : 'hidden',
        split: 'flex'
      };
    }
  };

  const viewClasses = getViewClasses();
  const isMobile = windowSize.width < 768;

  // ============ LOADING & ERROR STATES ============
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="text-gray-900 font-bold text-xl animate-pulse">
            Loading Resume Builder...
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Preparing your workspace
          </p>
        </div>
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Builder</h2>
          <p className="text-gray-600 mb-4">{initializationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============ RENDER BUILDER ============
  const CurrentComponent = getCurrentComponent();
  const allAiSuggestions = [...(aiSuggestions || []), ...localAiSuggestions];
  const atsScore = calculateATSScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      <Navbar />

      {/* Main Builder Area */}
      <div className="pt-16 lg:pt-20 h-[calc(100vh-4rem)]">
        {/* Top Action Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => setShowResumeNameEditor(true)}
                    className="text-lg sm:text-xl font-bold bg-transparent border-none focus:outline-none truncate px-2 py-1 rounded-xl hover:bg-white/50 transition-all"
                  >
                    {getResumeTitle()}
                  </button>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${autoSaveStatus === 'saved'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : autoSaveStatus === 'saving'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {autoSaveStatus === 'saved' ? '✓ Saved' :
                    autoSaveStatus === 'saving' ? '● Saving...' :
                      '⚠ Error'}
                </div>
                <button
                  onClick={handleManualSave}
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg text-sm sm:text-base disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Build Steps</h3>
              <div className="space-y-1">
                {wizardSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleJumpToStep(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeSection === step.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Editor and Preview */}
          <div className="flex-1 flex overflow-hidden">
            <div className={viewClasses.editor + " h-full overflow-y-auto p-4 sm:p-6 lg:p-8"}>
              <div className="max-w-3xl mx-auto">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    {wizardSteps[wizardStep]?.icon} {wizardSteps[wizardStep]?.label}
                  </h2>

                  {activeSection === 'finalize' ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">All done!</h3>
                      <p className="text-gray-600 mb-8">Your resume is ready to download</p>
                      <button
                        onClick={() => setShowExportManager(true)}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                      >
                        Download PDF
                      </button>
                    </div>
                  ) : CurrentComponent && (
                    <CurrentComponent
                      data={currentResume?.[activeSection] || {}}
                      onUpdate={(data) => handleUpdateResume({ [activeSection]: data })}
                      resumeData={currentResume}
                    />
                  )}

                  <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      disabled={wizardStep === 0}
                      className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-8 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black"
                    >
                      {wizardStep === wizardSteps.length - 1 ? 'Finish' : 'Next Step'}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className={viewClasses.preview + " h-full bg-gray-100 overflow-hidden flex flex-col border-l border-gray-200"}>
              <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-4">Live Preview</span>
                <div className="flex items-center gap-2">
                  <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                  <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200/50">
                <div
                  className="shadow-2xl transition-transform duration-300 origin-top bg-white"
                  style={{
                    transform: `scale(${previewZoom})`,
                    width: '800px',
                    height: '1100px'
                  }}
                >
                  <ResumePreview
                    resumeData={currentResume}
                    template={currentResume?.settings?.template || 'modern'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showResumeNameEditor && (
        <ResumeNameEditor
          isOpen={showResumeNameEditor}
          onClose={() => setShowResumeNameEditor(false)}
          currentName={getResumeTitle()}
          onSave={handleResumeNameUpdate}
        />
      )}

      {showAIPanel && (
        <AIPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          handleAIAnalysis={handleAIAnalysis}
          isAnalyzing={isAnalyzing}
          allAiSuggestions={allAiSuggestions}
          aiScore={atsScore}
          currentResume={currentResume}
        />
      )}

      {showExportManager && (
        <ExportManager
          isOpen={showExportManager}
          onClose={() => setShowExportManager(false)}
          resumeData={currentResume}
          onExportComplete={() => setShowExportManager(false)}
        />
      )}

      {showTemplateSelector && (
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          currentTemplate={currentResume?.settings?.template || 'modern'}
          onTemplateSelect={(template) => handleUpdateResume({
            settings: { ...currentResume?.settings, template }
          })}
        />
      )}
    </div>
  );
};

// ============ SUB-COMPONENTS ============

const ResumeNameEditor = ({ isOpen, onClose, currentName, onSave }) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rename Resume</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={() => onSave(name)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

const AIPanel = ({ isOpen, onClose, jobDescription, setJobDescription, handleAIAnalysis, isAnalyzing, allAiSuggestions, aiScore, currentResume }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={6}
              placeholder="Paste the job description here for AI analysis..."
            />
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="mt-3 w-full py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>

          {aiScore > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">ATS Score</span>
                <span className="text-2xl font-bold text-green-600">{aiScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${aiScore}%` }}
                />
              </div>
            </div>
          )}

          {allAiSuggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Suggestions</h3>
              <div className="space-y-2">
                {allAiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ExportManager = ({ isOpen, onClose, resumeData, onExportComplete }) => {
  if (!isOpen) return null;

  const handleExport = () => {
    toast.success('PDF export started!');
    if (onExportComplete) onExportComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
        <Download className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Export Resume</h2>
        <p className="text-gray-600 mb-6">Download your resume as a professional PDF</p>
        <button
          onClick={handleExport}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
};

const TemplateSelector = ({ isOpen, onClose, currentTemplate, onTemplateSelect }) => {
  if (!isOpen) return null;

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional', color: 'blue' },
    { id: 'classic', name: 'Classic', description: 'Traditional layout', color: 'gray' },
    { id: 'creative', name: 'Creative', description: 'Bold and unique', color: 'purple' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant', color: 'green' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Select Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => {
                onTemplateSelect(template.id);
                onClose();
              }}
              className={`p-4 border-2 rounded-2xl text-center cursor-pointer transition-all ${currentTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${template.color}-400 to-${template.color}-600`} />
              <span className="font-bold capitalize block">{template.name}</span>
              <span className="text-xs text-gray-500">{template.description}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Builder);

