// src/pages/builder/Builder.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    ChevronLeft, ChevronRight, Eye, Download,
    Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
    Layout, Settings, Sparkles, Save as SaveIcon,
    Brain, Edit2, Check, Wand2, Plus, X, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../context/AIContext';

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
import ResumePreview from '../../components/preview/RealTimePreview';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Extracted Builder Components
import AIPanel from '../../components/builder/AIPanel';
import ExportManager from '../../components/builder/ExportManager';
import TemplateSelector from '../../components/builder/TemplateSelector';
import ResumeNameEditor from '../../components/builder/ResumeNameEditor';
import MobileBottomNav from '../../components/builder/MobileBottomNav';

const Builder = ({ isNewResume = false, resumeId = null, importedData = null }) => {
    const { id: urlId } = useParams();
    const effectiveId = resumeId || urlId;
    const navigate = useNavigate();
    const location = useLocation();
    
    // ============ CONTEXT HOOKS ============
    const { 
        currentResume, 
        updateResume, 
        saveResume, 
        loadResume, 
        createResume,
        loading: resumeLoading 
    } = useResume();
    
    const { 
        analyzeResume, 
        isAnalyzing, 
        aiSuggestions, 
        atsScore 
    } = useAI();

    // ============ STATE ============
    const [activeView, setActiveView] = useState('split');
    const [activeSection, setActiveSection] = useState('personalInfo');
    const [wizardStep, setWizardStep] = useState(0);
    const [previewScale, setPreviewScale] = useState(0.8);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [showExportManager, setShowExportManager] = useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showNameEditor, setShowNameEditor] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    const wizardSteps = useMemo(() => [
        { id: 'personalInfo', label: 'Personal Info', component: PersonalInfoPage },
        { id: 'summary', label: 'Professional Summary', component: SummaryPage },
        { id: 'experience', label: 'Work Experience', component: ExperiencePage },
        { id: 'skills', label: 'Key Skills', component: SkillsPage },
        { id: 'education', label: 'Education', component: EducationPage },
        { id: 'projects', label: 'Projects', component: ProjectsPage },
        { id: 'certifications', label: 'Certifications', component: CertificationsPage },
        { id: 'languages', label: 'Languages', component: LanguagesPage }
    ], []);

    // Initial Load Logic
    useEffect(() => {
        let mounted = true;

        const initializeBuilder = async () => {
            if (!mounted) return;
            setIsInitializing(true);
            
            try {
                if (effectiveId && effectiveId !== 'new') {
                    // Only load if it's not already loaded
                    if (!currentResume || currentResume._id !== effectiveId) {
                        console.log('🔍 Loading existing resume:', effectiveId);
                        await loadResume(effectiveId);
                    }
                } else if (isNewResume || effectiveId === 'new') {
                    // If we already have a currentResume that was just created, don't create another
                    if (currentResume && (currentResume._id === 'new' || currentResume._id?.startsWith('local_'))) {
                        setIsInitializing(false);
                        return;
                    }

                    console.log('📝 Creating new resume session');
                    const initialData = importedData || location.state?.importedData || {};
                    const newResume = await createResume(initialData);
                    
                    if (newResume?._id && mounted) {
                        console.log('✅ New resume created:', newResume._id);
                        // Redirect to the edit URL so refresh doesn't re-create
                        navigate(`/builder/edit/${newResume._id}`, { replace: true });
                    }
                }
            } catch (error) {
                console.error('❌ Builder initialization error:', error);
                if (mounted) toast.error('Failed to initialize builder');
            } finally {
                if (mounted) setIsInitializing(false);
            }
        };

        initializeBuilder();

        return () => { mounted = false; };
    }, [effectiveId, isNewResume]); // Removed importedData and location.state to avoid infinite loops

    const handleNextStep = () => {
        if (wizardStep < wizardSteps.length - 1) {
            setWizardStep(prev => prev + 1);
            setActiveSection(wizardSteps[wizardStep + 1].id);
        }
    };

    const handlePrevStep = () => {
        if (wizardStep > 0) {
            setWizardStep(prev => prev - 1);
            setActiveSection(wizardSteps[wizardStep - 1].id);
        }
    };

    const handleUpdateResume = (data) => {
        updateResume(data);
    };

    if (resumeLoading || isInitializing) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <LoadingSpinner size="lg" />
                <div className="text-center">
                    <p className="text-gray-900 font-bold text-xl animate-pulse">
                        ResumeAI is preparing your workspace
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        Organizing your professional story...
                    </p>
                </div>
            </div>
        );
    }

    const CurrentComponent = wizardSteps[wizardStep].component;

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <Navbar />
            
            {/* Builder Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-3 flex items-center justify-between z-30 shadow-sm relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-50 mix-blend-multiply pointer-events-none"></div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-gray-200 mx-2" />
                    <div 
                        className="cursor-pointer group"
                        onClick={() => setShowNameEditor(true)}
                    >
                        <h1 className="text-lg font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors text-gray-900">
                            {currentResume?.title || 'Untitled Resume'}
                            <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            {currentResume?._id?.startsWith('local_') ? 'Offline Draft' : 'Cloud Saved'} • {new Date(currentResume?.updatedAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowAIPanel(true)}
                        className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-purple-100 transition-colors"
                    >
                        <Wand2 className="w-4 h-4" />
                        AI Assistant
                    </button>
                    <button 
                        onClick={() => setShowExportManager(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Steps Sidebar */}
                <aside className={`bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col relative z-20 ${sidebarCollapsed ? 'w-20' : 'w-80'}`}>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-1">
                            {wizardSteps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => { setWizardStep(index); setActiveSection(step.id); }}
                                    className={`group w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
                                        wizardStep === index 
                                        ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-700 shadow-sm border border-blue-100/50' 
                                        : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-700 border border-transparent'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        wizardStep === index 
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                                        : 'bg-gray-100/80 group-hover:bg-gray-200/80 group-hover:scale-105 text-gray-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    {!sidebarCollapsed && <span className="font-semibold text-sm">{step.label}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-4 border-t border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                        {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </aside>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    <div className={`flex-1 overflow-y-auto p-6 transition-all ${activeView === 'preview' ? 'hidden lg:block lg:w-0' : 'w-full'}`}>
                        <div className="max-w-2xl mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100/80 relative overflow-hidden"
                                >
                                    {CurrentComponent && (
                                        <CurrentComponent 
                                            data={currentResume?.[activeSection] || {}}
                                            onUpdate={(data) => handleUpdateResume({ [activeSection]: data })}
                                            onNext={handleNextStep}
                                            onPrev={handlePrevStep}
                                        />
                                    )}
                                    
                                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between">
                                        <button 
                                            onClick={handlePrevStep}
                                            disabled={wizardStep === 0}
                                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-30"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={handleNextStep}
                                            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black"
                                        >
                                            {wizardStep === wizardSteps.length - 1 ? 'Finish' : 'Next Step'}
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className={`flex-1 bg-gray-100 overflow-hidden flex flex-col border-l border-gray-200 transition-all ${activeView === 'editor' ? 'hidden lg:block lg:w-0' : 'w-full'}`}>
                        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-4">Live Preview</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPreviewScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-gray-100 rounded-lg"><ZoomOut className="w-4 h-4"/></button>
                                <span className="text-xs font-bold w-12 text-center">{Math.round(previewScale * 100)}%</span>
                                <button onClick={() => setPreviewScale(s => Math.min(1.5, s + 0.1))} className="p-2 hover:bg-gray-100 rounded-lg"><ZoomIn className="w-4 h-4"/></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200/50">
                            <div 
                                className="shadow-2xl transition-transform duration-300 origin-top"
                                style={{ transform: `scale(${previewScale})` }}
                            >
                                <ResumePreview 
                                    resumeData={currentResume} 
                                    template={currentResume?.template || 'modern'} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AIPanel 
                isOpen={showAIPanel}
                onClose={() => setShowAIPanel(false)}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                handleAIAnalysis={() => analyzeResume(currentResume, jobDescription)}
                isAnalyzing={isAnalyzing}
                allAiSuggestions={aiSuggestions}
                aiScore={atsScore}
                currentResume={currentResume}
            />

            <ExportManager 
                isOpen={showExportManager}
                onClose={() => setShowExportManager(false)}
                resumeData={currentResume}
            />

            <TemplateSelector 
                isOpen={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                currentTemplate={currentResume?.template}
                onTemplateSelect={(template) => handleUpdateResume({ template })}
            />

            <ResumeNameEditor 
                isOpen={showNameEditor}
                onClose={() => setShowNameEditor(false)}
                currentName={currentResume?.title}
                onSave={(title) => handleUpdateResume({ title })}
            />

            <MobileBottomNav 
                activeView={activeView}
                onViewChange={setActiveView}
                onAI={() => setShowAIPanel(true)}
                onSave={saveResume}
                onExport={() => setShowExportManager(true)}
            />
        </div>
    );
};

export default Builder;
