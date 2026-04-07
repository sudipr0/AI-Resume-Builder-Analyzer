// src/pages/builder/Builder.jsx - FIXED VERSION
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../context/AIContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useAutoSave from '../../hooks/useAutoSave';

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

  // ============ AUTO-SAVE HOOK ============
  const { saveStatus: autoSaveStatus, forceSave } = useAutoSave({
    data: currentResume,
    onSave: quickSave,
    enabled: !!currentResume && !isNewResume && !!currentResume._id && !isCreating,
    localKey: currentResume ? `resume_backup_${currentResume._id || 'new'}` : null,
    delay: 3000
  });

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

  // Map wizard section IDs to resume model keys
  const SECTION_TO_MODEL_KEY = useMemo(() => ({
    personal: 'personalInfo',
    summary: 'summary',
    experience: 'experience',
    skills: 'skills',
    education: 'education',
    projects: 'projects',
    certifications: 'certifications',
    languages: 'languages'
  }), []);

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

  // ============ MANUAL SAVE ============
  const handleManualSave = async () => {
    if (!currentResume) {
      toast.error('No resume data to save');
      return;
    }

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

      setIsCreating(false);
      return savedResume;
    } catch (error) {
      console.error('Save failed:', error);
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
  const handleNextStep = async () => {
    // Automatically save data when moving to next step
    if (typeof forceSave === 'function') {
      forceSave();
    }

    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(wizardStep + 1);
      setActiveSection(wizardSteps[wizardStep + 1].id);
    } else {
      // Handle 'Finish' button click on the last step
      try {
        toast.loading('Saving and completing your resume...', { id: 'finish-save' });
        await handleManualSave();
        toast.success('Resume completed and saved!', { id: 'finish-save' });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Error finishing resume:', error);
        toast.error('Failed to save resume. Please try again.', { id: 'finish-save' });
      }
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
      setActiveSection(wizardSteps[wizardStep - 1].id);
    }
  };

  const handleJumpToStep = (index) => {
    // Automatically save data when jumping between steps
    if (typeof forceSave === 'function') {
      forceSave();
    }
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

  // ============ TEMPLATE HANDLING ============
  const handleTemplateSelect = async (templateId) => {
    // Update basic template setting
    handleUpdateResume({
      settings: { ...currentResume?.settings, template: templateId }
    });

    // Ask user if they want to apply AI optimization for this specific template style
    const shouldOptimize = window.confirm(`Would you like AI to optimize your resume content for the ${templateId.replace('_', ' ')} style?`);
    
    if (shouldOptimize && currentResume) {
      const toastId = toast.loading(`AI is optimizing for ${templateId.replace('_', ' ')}...`);
      try {
        const result = await apiService.resume.generateTemplateBasedResume(templateId, currentResume);
        if (result.success && result.data) {
          handleUpdateResume({
            summary: result.data.summary || currentResume.summary,
            experience: result.data.experience || currentResume.experience,
            skills: result.data.skills || currentResume.skills
          });
          toast.success('AI optimization applied!', { id: toastId });
        }
      } catch (error) {
        console.error('AI optimization failed:', error);
        toast.error('AI optimization failed, but template was changed.', { id: toastId });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 text-black">
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
            <div className={viewClasses.editor + " h-full overflow-y-auto p-4 md:p-6"}>
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
                      data={currentResume?.[SECTION_TO_MODEL_KEY[activeSection] || activeSection] || {}}
                      onUpdate={(data) => handleUpdateResume({ [SECTION_TO_MODEL_KEY[activeSection] || activeSection]: data })}
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

            <div className={viewClasses.preview + " h-full bg-gray-50 overflow-hidden flex flex-col border-l border-gray-200 text-black"}>
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <span className="text-sm font-bold text-black uppercase tracking-widest ml-4">Live Preview</span>
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
              <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-gray-50">
                <div
                  className="shadow-2xl transition-transform duration-300 origin-top bg-white"
                  style={{
                    transform: `scale(${previewZoom})`,
                    width: 'min(820px, 92%)',
                    height: 'auto'
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
          onTemplateSelect={handleTemplateSelect}
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

  const handleExport = async (format) => {
    if (!resumeData?._id) {
      toast.error('Please save your resume first');
      return;
    }

    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);
    try {
      const result = await apiService.resume.exportResume(resumeData._id, format);
      if (result.success) {
        toast.success(`Resume exported as ${format.toUpperCase()}!`, { id: toastId });
        if (onExportComplete) onExportComplete();
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}`, { id: toastId });
    }
  };

  const exportOptions = [
    { id: 'pdf', name: 'Professional PDF', icon: <FileText className="w-6 h-6 text-red-500" />, description: 'Best for printing and emailing' },
    { id: 'word', name: 'Microsoft Word', icon: <FileText className="w-6 h-6 text-blue-500" />, description: 'Editable DOCX format' },
    { id: 'json', name: 'Data Format (JSON)', icon: <Code className="w-6 h-6 text-amber-500" />, description: 'For backup and developers' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Your Resume</h2>
        <p className="text-gray-600 mb-8 text-sm px-4">Select your preferred format to download your professional resume.</p>
        
        <div className="space-y-3 mb-8">
          {exportOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleExport(opt.id)}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
            >
              <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{opt.name}</h3>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateSelector = ({ isOpen, onClose, currentTemplate, onTemplateSelect }) => {
  if (!isOpen) return null;

  const templates = [
    { id: 'modern_tech', name: 'Modern Tech', description: 'GitHub/portfolio focused', color: 'blue' },
    { id: 'creative_designer', name: 'Creative Designer', description: 'Visual-heavy, bold', color: 'purple' },
    { id: 'corporate_professional', name: 'Corporate', description: 'Formal and structured', color: 'gray' },
    { id: 'data_analyst', name: 'Data Analyst', description: 'Metrics and tools focused', color: 'cyan' },
    { id: 'fresher_student', name: 'Fresher/Student', description: 'Skills and projects focus', color: 'green' },
    { id: 'remote_job', name: 'Remote Job', description: 'Collaboration tools focus', color: 'indigo' },
    { id: 'startup', name: 'Startup', description: 'Impact and growth focus', color: 'orange' },
    { id: 'executive', name: 'Executive', description: 'Leadership and strategy', color: 'amber' },
    { id: 'engineering', name: 'Engineering', description: 'Technical depth', color: 'slate' },
    { id: 'marketing', name: 'Marketing', description: 'ROI and campaign focus', color: 'pink' },
    { id: 'ai_ml', name: 'AI / ML', description: 'Models and datasets focus', color: 'violet' },
    { id: 'mobile_dev', name: 'Mobile Dev', description: 'Apps and UI/UX focus', color: 'blue' },
    { id: 'web_dev', name: 'Web Dev', description: 'Full-stack/live projects', color: 'emerald' },
    { id: 'ats_optimized', name: 'ATS Optimized', description: 'Keyword-rich, clean', color: 'zinc' },
    { id: 'skill_based', name: 'Skill Based', description: 'Competency grouping', color: 'teal' },
    { id: 'career_change', name: 'Career Change', description: 'Transferable skills', color: 'rose' },
    { id: 'internship', name: 'Internship', description: 'Entry-level, learning', color: 'lime' },
    { id: 'government', name: 'Government', description: 'Detailed and formal', color: 'sky' },
    { id: 'academic', name: 'Academic (CV)', description: 'Research and publications', color: 'indigo' },
    { id: 'entrepreneur', name: 'Entrepreneur', description: 'Business impact focus', color: 'yellow' },
    { id: 'minimal', name: 'Minimalist', description: 'One-page, maximum clarity', color: 'stone' },
    { id: 'project_based', name: 'Project Based', description: 'Projects over jobs', color: 'orange' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl p-8 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Select Advanced Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => {
                  onTemplateSelect(template.id);
                  onClose();
                }}
                className={`p-4 border-2 rounded-2xl text-center cursor-pointer transition-all group ${currentTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${template.color}-400 to-${template.color}-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform`}>
                  {template.name.charAt(0)}
                </div>
                <span className="font-bold text-sm text-black block mb-1">{template.name}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{template.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Builder);