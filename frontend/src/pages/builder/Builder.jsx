// src/pages/builder/Builder.jsx - COMPLETE UPDATED VERSION WITH DRAFT/COMPLETED LOGIC
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../context/AIContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Icons
import {
    ChevronLeft, ChevronRight, ArrowRight, Menu,
    Save as SaveIcon, Download, Cloud, Printer, Copy, Share2,
    Eye, EyeOff, Edit2, Layout, Grid, List, Search, Filter,
    Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
    CheckCircle, AlertCircle, Check, X,
    Brain, Sparkles, Zap, Target, TrendingUp, Lightbulb, Wand2,
    FileText, FileCheck, FileSearch, FileBarChart, FileCode, QrCode,
    PanelLeftClose, PanelLeftOpen,
    Clock, Award, Star, Medal, Trophy, Rocket,
    Users, Briefcase, GraduationCap, Calendar, MapPin, Building,
    Globe, Mail, Phone, Github, Linkedin, Twitter,
    Code, Palette, Cpu, Cloud as CloudIcon, Smartphone, Wrench,
    Pencil, Trash2, Plus, RefreshCw, Settings, Sliders,
    BookOpen, UserCheck, Flag, Layers,
    Monitor, Tablet, Battery, Wifi,
    Navigation, Compass,
    Volume2, VolumeX, Mic, MicOff, Camera, Image,
    Lock, Unlock, Bell, Bookmark, Heart, Loader2
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
import FinalReviewsPage from '../../components/section/CompletionPage';
import FloatingActionButtons from '../../components/ui/FloatingActionButtons';
import ResumePreview from '../../components/preview/RealTimePreview';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import useResumeCompletion from '../../hooks/useResumeCompletion';

// Utility functions
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
};

// ==================== MODERN SIDEBAR COMPONENT ====================
const ModernSidebar = ({
    isOpen,
    onClose,
    wizardSteps,
    wizardStep,
    activeSection,
    onJumpToStep,
    completionData,
    atsScore,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentResume
}) => {
    const completion = completionData?.overall || 0;
    const isLocalResume = currentResume?._id?.startsWith('local_');
    const isCompleted = currentResume?.status === 'completed';

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ x: -320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -320, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`fixed lg:relative inset-y-0 left-0 z-40 h-full bg-white border-r border-gray-200 shadow-2xl lg:shadow-lg overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:w-24' : 'lg:w-80'
                        } w-80`}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 z-10">
                        <div className="flex items-center justify-between">
                            {!sidebarCollapsed ? (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 text-sm sm:text-base">Resume Builder</h2>
                                        <p className="text-xs text-gray-600">Step {wizardStep + 1}/{wizardSteps.length}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                {isCompleted && !sidebarCollapsed && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Completed
                                    </span>
                                )}
                                <button
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className="hidden lg:flex p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                >
                                    {sidebarCollapsed ? (
                                        <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                    ) : (
                                        <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        {/* Local Resume Badge */}
                        {!sidebarCollapsed && isLocalResume && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                                <CloudIcon className="w-4 h-4 text-yellow-600" />
                                <span className="text-xs text-yellow-800">Saved locally only</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Overview */}
                    {!sidebarCollapsed && (
                        <div className="p-4 border-b border-gray-200">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Completion</h3>
                                    <span className="text-xs sm:text-sm font-bold text-blue-600">{completion}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completion}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                {completionData?.suggestions?.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                        💡 {completionData.suggestions[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Steps */}
                    <div className="p-3 sm:p-4">
                        <h3 className={`text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4 ${sidebarCollapsed ? 'text-center' : ''
                            }`}>
                            {sidebarCollapsed ? 'Steps' : 'Build Steps'}
                        </h3>
                        <div className="space-y-1.5 sm:space-y-2">
                            {wizardSteps.map((step, index) => {
                                const isCompleted = completionData?.sections?.[step.id]?.percentage >= 70;
                                const isActive = activeSection === step.id;
                                const isCurrent = wizardStep === index;

                                return (
                                    <motion.button
                                        key={step.id}
                                        onClick={() => onJumpToStep(index)}
                                        whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${isActive || isCurrent
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'hover:bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <div className={`
                                            w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-medium
                                            ${isActive || isCurrent
                                                ? 'bg-white/20 text-white'
                                                : isCompleted
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}>
                                            {isCompleted ? (
                                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                            ) : (
                                                <span>{step.icon}</span>
                                            )}
                                        </div>
                                        {!sidebarCollapsed && (
                                            <>
                                                <span className="flex-1 text-left text-xs sm:text-sm font-medium truncate">
                                                    {step.label}
                                                </span>
                                                {step.required && (
                                                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${isActive || isCurrent
                                                        ? 'bg-white/20 text-white'
                                                        : isCompleted
                                                            ? 'bg-green-200 text-green-800'
                                                            : 'bg-gray-200 text-gray-700'
                                                        }`}>
                                                        {isCompleted ? '✓' : 'Req'}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ATS Score */}
                    {!sidebarCollapsed && (
                        <div className="p-4 border-t border-gray-200">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-gray-700" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-800">ATS Score</span>
                                    </div>
                                    <span className={`text-base sm:text-lg font-bold ${getScoreColor(atsScore)}`}>
                                        {atsScore}%
                                    </span>
                                </div>
                                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${atsScore >= 80 ? 'bg-green-500' :
                                            atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${atsScore}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                    {atsScore >= 80 ? 'Excellent! ATS-ready.' :
                                        atsScore >= 60 ? 'Good, can improve.' :
                                            'Needs optimization.'}
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ==================== TEMPLATE SELECTOR COMPONENT ====================
const TemplateSelector = ({ isOpen, onClose, currentTemplate, onTemplateSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const templates = [
        { id: 'modern', name: 'Modern', description: 'Clean and professional design', category: 'Professional', icon: '✨', color: 'from-blue-500 to-cyan-500', premium: false },
        { id: 'classic', name: 'Classic', description: 'Traditional resume format', category: 'Traditional', icon: '📜', color: 'from-amber-500 to-orange-500', premium: false },
        { id: 'creative', name: 'Creative', description: 'Unique and eye-catching', category: 'Creative', icon: '🎨', color: 'from-purple-500 to-pink-500', premium: true },
        { id: 'minimal', name: 'Minimal', description: 'Simple and elegant', category: 'Minimal', icon: '⚪', color: 'from-gray-500 to-slate-500', premium: false },
        { id: 'executive', name: 'Executive', description: 'Senior-level presentation', category: 'Professional', icon: '👔', color: 'from-emerald-500 to-teal-500', premium: true },
        { id: 'ats', name: 'ATS-Friendly', description: 'Optimized for applicant tracking', category: 'Professional', icon: '🤖', color: 'from-indigo-500 to-purple-500', premium: false }
    ];

    const categories = ['all', ...new Set(templates.map(t => t.category))];

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Choose Template</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search templates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="text-gray-900">
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {filteredTemplates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative overflow-hidden rounded-xl cursor-pointer group border-2 transition-all ${currentTemplate === template.id
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => onTemplateSelect(template.id)}
                                    >
                                        <div className={`h-24 sm:h-32 bg-gradient-to-br ${template.color} p-4 flex items-center justify-center`}>
                                            <span className="text-3xl sm:text-4xl">{template.icon}</span>
                                            {template.premium && (
                                                <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                                                    PRO
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3 sm:p-4 bg-white">
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">{template.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">{template.description}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-gray-600">{template.category}</span>
                                                {currentTemplate === template.id && (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition text-sm sm:text-base"
                            >
                                Apply Template
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ==================== EXPORT MANAGER COMPONENT ====================
const ExportManager = ({ isOpen, onClose, resumeData }) => {
    const [exportFormat, setExportFormat] = useState('pdf');
    const [exportQuality, setExportQuality] = useState('high');
    const [isExporting, setIsExporting] = useState(false);

    const formats = [
        { id: 'pdf', name: 'PDF', icon: FileText, desc: 'Best for printing', color: 'from-red-500 to-rose-500' },
        { id: 'docx', name: 'DOCX', icon: FileText, desc: 'Editable format', color: 'from-blue-500 to-cyan-500' },
        { id: 'txt', name: 'TXT', icon: FileText, desc: 'Plain text', color: 'from-gray-500 to-slate-500' }
    ];

    const qualities = [
        { id: 'high', name: 'High', desc: 'Best quality', icon: Award },
        { id: 'medium', name: 'Medium', desc: 'Balanced', icon: Star },
        { id: 'low', name: 'Low', desc: 'Smallest file', icon: Zap }
    ];

    const handleExport = async () => {
        setIsExporting(true);
        toast.loading('Preparing your resume...', { id: 'export' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Resume exported successfully!', { id: 'export' });
        setIsExporting(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white">Export Resume</h2>
                                        <p className="text-xs sm:text-sm text-green-100">Download in your preferred format</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Format Selection */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Export Format</h3>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {formats.map((format) => (
                                        <motion.button
                                            key={format.id}
                                            onClick={() => setExportFormat(format.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all ${exportFormat === format.id
                                                ? `bg-gradient-to-r ${format.color} text-white border-transparent shadow-lg`
                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-800'
                                                }`}
                                        >
                                            <format.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${exportFormat === format.id ? 'text-white' : 'text-gray-700'
                                                }`} />
                                            <span className="font-bold text-xs sm:text-sm block">{format.name}</span>
                                            <span className="text-[10px] sm:text-xs opacity-80 hidden sm:block">{format.desc}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality Settings */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Quality</h3>
                                <div className="space-y-2">
                                    {qualities.map((quality) => (
                                        <label
                                            key={quality.id}
                                            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${exportQuality === quality.id
                                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-opacity-10 flex items-center justify-center">
                                                    <quality.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{quality.name}</div>
                                                    <div className="text-xs sm:text-sm text-gray-700 hidden sm:block">{quality.desc}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="radio"
                                                name="quality"
                                                checked={exportQuality === quality.id}
                                                onChange={() => setExportQuality(quality.id)}
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 sm:p-6 bg-gray-50">
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Export
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ==================== MAIN BUILDER COMPONENT ====================
const Builder = ({ isNewResume: propIsNew, resumeId, importedData }) => {
    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const location = useLocation();
    const actualId = paramId || resumeId;
    const resumeFromState = location.state?.resumeData;

    // ── Core UI & flow state ─────────────────────────────────────────────
    const [isNewResume, setIsNewResume] = useState(
        propIsNew || !actualId || actualId === 'new' || actualId === 'new-resume' || location.pathname.includes('/builder/new')
    );
    const [activeView, setActiveView] = useState('editor');
    const [activeSection, setActiveSection] = useState('personal');
    const [wizardStep, setWizardStep] = useState(0);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showExportManager, setShowExportManager] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loadAttempted, setLoadAttempted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [previewScale, setPreviewScale] = useState(0.8);
    const [syncAttempted, setSyncAttempted] = useState(false);
    const [showSyncPrompt, setShowSyncPrompt] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Final review states
    const [reviewStatus, setReviewStatus] = useState({});
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // Title editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInputValue, setTitleInputValue] = useState('');
    const titleInputRef = useRef(null);

    // ── Refs ─────────────────────────────────────────────────────────────
    const hasLoadedRef = useRef(false);
    const hasCreatedRef = useRef(false);
    const autoSaveTimeoutRef = useRef(null);
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    const containerRef = useRef(null);

    // ── Context & hooks ──────────────────────────────────────────────────
    const {
        currentResume,
        saveResume,
        updateCurrentResumeData,
        loadResume,
        loading: resumeLoading,
        error: resumeError,
        isSaving,
        createResume,
        syncSingleResumeToServer,
        offlineMode
    } = useResume();

    const { aiScore } = useAI();
    const completionData = useResumeCompletion(currentResume);

    // ── Wizard steps configuration ───────────────────────────────────────
    const wizardSteps = useMemo(() => [
        { id: 'personal', label: 'Personal Info', icon: '👤', component: PersonalInfoPage, required: true },
        { id: 'summary', label: 'Summary', icon: '📝', component: SummaryPage, required: true },
        { id: 'experience', label: 'Experience', icon: '💼', component: ExperiencePage, required: true },
        { id: 'skills', label: 'Skills', icon: '⚡', component: SkillsPage, required: true },
        { id: 'education', label: 'Education', icon: '🎓', component: EducationPage, required: true },
        { id: 'projects', label: 'Projects', icon: '🚀', component: ProjectsPage, required: false },
        { id: 'certifications', label: 'Certifications', icon: '🏆', component: CertificationsPage, required: false },
        { id: 'languages', label: 'Languages', icon: '🌐', component: LanguagesPage, required: false },
        { id: 'finalize', label: 'Final Reviews', icon: '✅', component: FinalReviewsPage, required: true }
    ], []);

    // ── Before unload warning ────────────────────────────────────────────
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // ── Load & initialization logic ─────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (hasLoadedRef.current && !resumeFromState) return;

            try {
                if (isNewResume) {
                    hasLoadedRef.current = true;
                    setIsInitialLoad(false);
                    setLoadAttempted(true);
                    return;
                }

                if (resumeFromState) {
                    const merged = currentResume ? {
                        ...currentResume,
                        ...resumeFromState,
                        title: resumeFromState.title || currentResume.title,
                        summary: resumeFromState.summary || currentResume.summary || '',
                        personalInfo: {
                            ...(currentResume.personalInfo || {}),
                            ...(resumeFromState.personalInfo || {})
                        }
                    } : resumeFromState;

                    updateCurrentResumeData(merged);
                    setIsNewResume(false);
                    hasLoadedRef.current = true;
                    setIsInitialLoad(false);
                    setLoadAttempted(true);
                    return;
                }

                if (currentResume && actualId && (currentResume._id === actualId || currentResume.id === actualId)) {
                    setIsNewResume(false);
                    hasLoadedRef.current = true;
                    setIsInitialLoad(false);
                    setLoadAttempted(true);
                    return;
                }

                if (actualId && !loadAttempted) {
                    setLoadAttempted(true);
                    try {
                        await loadResume(actualId);
                        setIsNewResume(false);
                        hasLoadedRef.current = true;
                        setIsInitialLoad(false);
                    } catch (err) {
                        console.log('Load failed, creating new:', err);
                        setIsNewResume(true);
                        hasLoadedRef.current = true;
                        setIsInitialLoad(false);
                    }
                }
            } catch (err) {
                console.error('Load error:', err);
            } finally {
                if (isMounted) setIsInitialLoad(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, [actualId, isNewResume, resumeFromState, currentResume, loadResume, updateCurrentResumeData]);

    // ── Auto-save – faster & dirty-aware ─────────────────────────────────
    useEffect(() => {
        if (!currentResume || !currentResume._id || isSaving || !isDirty) return;

        if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

        autoSaveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus('saving');
            try {
                await saveResume(currentResume);
                setIsDirty(false);
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1200);
            } catch (err) {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        }, 1000);

        return () => clearTimeout(autoSaveTimeoutRef.current);
    }, [currentResume, isSaving, isDirty, saveResume]);

    // ── Check for local resume and prompt sync ──────────────────────────
    useEffect(() => {
        if (currentResume?._id?.startsWith('local_') && !syncAttempted && !offlineMode) {
            const hasData = currentResume.personalInfo?.firstName ||
                currentResume.summary ||
                (currentResume.experience?.length > 0);

            if (hasData) {
                setShowSyncPrompt(true);
            }
        }
    }, [currentResume, syncAttempted, offlineMode]);

    // ── Create new resume ───────────────────────────────────────────────
    useEffect(() => {
        if (isNewResume && !currentResume && !hasCreatedRef.current && isInitialLoad) {
            console.log('🚀 Creating new resume...');
            hasCreatedRef.current = true;

            const createNew = async () => {
                try {
                    const userData = localStorage.getItem('user_data');
                    const user = userData ? JSON.parse(userData) : { name: 'User', email: 'user@example.com' };
                    const firstName = user.name?.split(' ')[0] || 'User';
                    const lastName = user.name?.split(' ').slice(1).join(' ') || 'Name';

                    const newResume = await createResume({
                        title: `${firstName}'s Resume`,
                        status: 'draft',
                        personalInfo: {
                            firstName,
                            lastName,
                            email: user.email || '',
                            phone: '',
                            location: ''
                        }
                    });

                    if (newResume?._id) {
                        navigate(`/builder/edit/${newResume._id}`, { replace: true });
                    }
                } catch (error) {
                    console.error('❌ Create failed:', error);
                    toast.error('Failed to create resume');
                }
            };
            createNew();
        }
    }, [isNewResume, currentResume, createResume, navigate, isInitialLoad]);

    // ── Update title input ──────────────────────────────────────────────
    useEffect(() => {
        if (currentResume?.title) {
            setTitleInputValue(currentResume.title);
        } else if (isNewResume) {
            setTitleInputValue('New Resume');
        } else {
            setTitleInputValue('Untitled Resume');
        }
    }, [currentResume, isNewResume]);

    // ── Focus input when editing ────────────────────────────────────────
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
            titleInputRef.current.select();
        }
    }, [isEditingTitle]);

    // ── Manual save ─────────────────────────────────────────────────────
    const handleManualSave = useCallback(async () => {
        if (!currentResume) return toast.error('No resume to save');

        setSaveStatus('saving');
        try {
            const savedResume = await saveResume({
                ...currentResume,
                updatedAt: new Date().toISOString()
            });

            if (savedResume?._id) {
                setSaveStatus('saved');
                setIsDirty(false);

                const wasLocal = currentResume._id?.startsWith('local_');
                const nowServer = !savedResume._id?.startsWith('local_');

                if (wasLocal && nowServer) {
                    toast.success('✨ Resume saved to server!');
                    setSyncAttempted(true);
                    setShowSyncPrompt(false);
                    navigate(`/builder/edit/${savedResume._id}`, { replace: true });
                } else {
                    toast.success('Resume saved successfully!');
                }

                setTimeout(() => setSaveStatus('idle'), 2000);

                if (isNewResume && savedResume._id && savedResume._id !== 'new') {
                    setIsNewResume(false);
                    navigate(`/builder/edit/${savedResume._id}`, { replace: true });
                }
            }
        } catch (error) {
            console.error('Manual save failed:', error);
            setSaveStatus('error');
            toast.error('Failed to save resume');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [currentResume, saveResume, isNewResume, navigate]);

    // ── Title handlers ────────────────────────────────────────────────────
    const startEditingTitle = useCallback(() => {
        setIsEditingTitle(true);
    }, []);

    const cancelEditingTitle = useCallback(() => {
        setIsEditingTitle(false);
        if (currentResume?.title) {
            setTitleInputValue(currentResume.title);
        }
    }, [currentResume]);

    const saveTitle = useCallback(async () => {
        if (!currentResume) return;

        const newTitle = titleInputValue.trim() || 'Untitled Resume';
        if (currentResume.title === newTitle) {
            setIsEditingTitle(false);
            return;
        }

        setSaveStatus('saving');
        setIsDirty(true);

        try {
            updateCurrentResumeData({ title: newTitle });
            await saveResume({
                ...currentResume,
                title: newTitle,
                updatedAt: new Date().toISOString()
            });
            setSaveStatus('saved');
            setIsDirty(false);
            setTimeout(() => setSaveStatus('idle'), 1200);
        } catch (err) {
            setSaveStatus('error');
            console.error(err);
        }

        setIsEditingTitle(false);
    }, [currentResume, titleInputValue, updateCurrentResumeData, saveResume]);

    const handleTitleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveTitle();
        } else if (e.key === 'Escape') {
            cancelEditingTitle();
        }
    }, [saveTitle, cancelEditingTitle]);

    // ── Force sync to server ────────────────────────────────────────────
    const handleForceSync = useCallback(async () => {
        if (!currentResume || !currentResume._id?.startsWith('local_')) {
            toast.error('No local resume to sync');
            return;
        }

        const toastId = toast.loading('Syncing to server...');
        try {
            const saved = await syncSingleResumeToServer(currentResume);
            if (saved?._id) {
                toast.success('✅ Resume synced to server!', { id: toastId });
                setSyncAttempted(true);
                setShowSyncPrompt(false);
                setIsDirty(false);
                navigate(`/builder/edit/${saved._id}`, { replace: true });
            } else {
                toast.error('❌ Sync failed', { id: toastId });
            }
        } catch (error) {
            console.error('Force sync failed:', error);
            toast.error('Sync failed', { id: toastId });
        }
    }, [currentResume, syncSingleResumeToServer, navigate]);

    // ── Update resume data ────────────────────────────────────────────
    const handleUpdateResumeData = useCallback((updates) => {
        if (!currentResume) {
            console.warn('⚠️ No current resume to update');
            return;
        }

        const key = Object.keys(updates)[0];
        const newValue = updates[key];
        const currentValue = currentResume[key];

        let hasChanges = false;

        if (newValue === undefined) {
            console.log('⏭️ No value to update');
            return;
        }

        if (typeof newValue === 'object' && newValue !== null) {
            hasChanges = JSON.stringify(newValue) !== JSON.stringify(currentValue);
        } else {
            hasChanges = newValue !== currentValue;
        }

        if (!hasChanges) {
            console.log(`⏭️ No changes detected for ${key}, skipping update`);
            return;
        }

        console.log(`📥 Builder received updates for ${key} with changes:`, newValue);
        updateCurrentResumeData(updates);
        setIsDirty(true);
        setSaveStatus('unsaved');
    }, [currentResume, updateCurrentResumeData]);

    // ── Force save if dirty (for navigation) ──────────────────────────────
    const forceSaveIfDirty = useCallback(async () => {
        if (!isDirty || !currentResume) return true;

        setSaveStatus('saving');
        try {
            await saveResume(currentResume);
            setIsDirty(false);
            await new Promise(r => setTimeout(r, 80));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 1000);
            return true;
        } catch (err) {
            console.error('Forced save failed:', err);
            setSaveStatus('error');
            return false;
        }
    }, [isDirty, currentResume, saveResume]);

    const handleNextStep = useCallback(async () => {
        const saved = await forceSaveIfDirty();
        if (!saved) return;

        if (wizardStep < wizardSteps.length - 1) {
            setWizardStep(prev => prev + 1);
            setActiveSection(wizardSteps[wizardStep + 1].id);
            editorRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [wizardStep, wizardSteps, forceSaveIfDirty]);

    const handlePrevStep = useCallback(async () => {
        const saved = await forceSaveIfDirty();
        if (!saved) return;

        if (wizardStep > 0) {
            setWizardStep(wizardStep - 1);
            setActiveSection(wizardSteps[wizardStep - 1].id);
            editorRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [wizardStep, wizardSteps, forceSaveIfDirty]);

    const handleJumpToStep = useCallback(async (index) => {
        const saved = await forceSaveIfDirty();
        if (!saved) return;

        setWizardStep(index);
        setActiveSection(wizardSteps[index].id);
        setIsMobileMenuOpen(false);
        editorRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [wizardSteps, forceSaveIfDirty]);

    const handleBack = useCallback(() => {
        if (isDirty && currentResume) {
            saveResume(currentResume).finally(() => {
                navigate('/dashboard');
            });
        } else {
            navigate('/dashboard');
        }
    }, [currentResume, saveResume, navigate, isDirty]);

    // ── View controls ───────────────────────────────────────────────────
    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    }, []);

    const handleZoomIn = useCallback(() => {
        setPreviewScale(prev => Math.min(prev + 0.1, 1.5));
    }, []);

    const handleZoomOut = useCallback(() => {
        setPreviewScale(prev => Math.max(prev - 0.1, 0.5));
    }, []);

    const handleZoomReset = useCallback(() => {
        setPreviewScale(0.8);
    }, []);

    const handleViewMode = useCallback((mode) => {
        setActiveView(mode);
    }, []);

    // ── ATS score ───────────────────────────────────────────────────────
    const atsScore = useMemo(() => {
        return completionData?.estimatedATS || 0;
    }, [completionData]);

    // ── Validate for completion ──────────────────────────────────────────
    const validateForCompletion = useCallback(() => {
        if (!currentResume) return false;

        const requiredSections = ['personal', 'summary', 'experience', 'skills', 'education'];
        let valid = true;
        let missingSections = [];

        requiredSections.forEach(section => {
            const percentage = completionData?.sections?.[section]?.percentage || 0;
            if (percentage < 70) {
                valid = false;
                missingSections.push(section);
            }
        });

        if (!valid) {
            toast.error(`Please complete these sections first: ${missingSections.join(', ')}`);
        } else if (atsScore < 60) {
            toast.error('ATS score needs to be at least 60% to complete');
            valid = false;
        }

        return valid;
    }, [currentResume, completionData, atsScore]);

    // ── Complete resume ──────────────────────────────────────────────────
    const handleCompleteResume = useCallback(async () => {
        if (!validateForCompletion()) return;

        setIsCompleting(true);
        try {
            // Final save first
            await saveResume(currentResume);

            // Mark as completed - Note: This function needs to be added to context
            // For now, we'll update status manually
            const completedResume = {
                ...currentResume,
                status: 'completed',
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const saved = await saveResume(completedResume);

            if (saved) {
                toast.success('🎉 Resume completed successfully!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (error) {
            console.error('Completion failed:', error);
            toast.error('Failed to complete resume');
        } finally {
            setIsCompleting(false);
        }
    }, [currentResume, saveResume, validateForCompletion, navigate]);

    // ── Final reviews handlers ──────────────────────────────────────────
    const handleReviewComplete = (reviewId, data) => {
        setReviewStatus(prev => ({
            ...prev,
            [reviewId]: data
        }));
    };

    const handleExport = (format) => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            toast.success(`Resume exported as ${format.toUpperCase()}`);
        }, 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleGenerateQR = () => {
        setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=resume-preview');
        toast.success('QR Code generated!');
    };

    // ── Utilities ───────────────────────────────────────────────────────
    const getCurrentComponent = useCallback(() => {
        const step = wizardSteps.find(s => s.id === activeSection);
        return step?.component || null;
    }, [activeSection, wizardSteps]);

    const getResumeTitle = useCallback(() => {
        if (currentResume?.title) return currentResume.title;
        return isNewResume ? 'New Resume' : 'Untitled Resume';
    }, [currentResume?.title, isNewResume]);

    const getSaveStatusColor = useCallback(() => {
        switch (saveStatus) {
            case 'saving': return 'bg-yellow-100 text-yellow-800';
            case 'saved': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return '';
        }
    }, [saveStatus]);

    // ── Loading state ───────────────────────────────────────────────────
    if (isInitialLoad && !currentResume && !isNewResume && !resumeFromState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <Navbar />
                <div className="pt-20 flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <LoadingSpinner size="lg" text="Loading your resume..." />
                </div>
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────────────────
    const CurrentComponent = getCurrentComponent();

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            {/* Sync Prompt Modal */}
            <AnimatePresence>
                {showSyncPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full mx-4 border border-blue-400"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Cloud className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">Sync to Cloud?</h3>
                                <p className="text-sm text-blue-100 mb-4">
                                    Your resume is currently saved locally. Save it to the cloud to access it from anywhere.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleForceSync}
                                        className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition text-sm"
                                    >
                                        Sync Now
                                    </button>
                                    <button
                                        onClick={() => setShowSyncPrompt(false)}
                                        className="px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition text-sm"
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSyncPrompt(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-20 left-4 z-40 p-2.5 sm:p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                aria-label="Toggle menu"
            >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>

            {/* Main Container */}
            <div className="pt-16 lg:pt-20 h-screen flex flex-col">
                {/* Top Bar */}
                <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
                        <div className="flex items-center justify-between">
                            {/* Left Section */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <motion.button
                                    onClick={handleBack}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-1.5 sm:p-2.5 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-all"
                                    aria-label="Go back"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>

                                <div className="relative flex items-center">
                                    {isEditingTitle ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center gap-1 sm:gap-2"
                                        >
                                            <input
                                                ref={titleInputRef}
                                                type="text"
                                                value={titleInputValue}
                                                onChange={(e) => setTitleInputValue(e.target.value)}
                                                onKeyDown={handleTitleKeyDown}
                                                onBlur={saveTitle}
                                                className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 bg-white border-2 border-blue-500 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 w-32 sm:w-40 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                placeholder="Resume title"
                                            />
                                            <button
                                                onClick={saveTitle}
                                                className="p-1.5 sm:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                title="Save title"
                                            >
                                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEditingTitle}
                                                className="p-1.5 sm:p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                                title="Cancel"
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-1 sm:gap-2 group"
                                        >
                                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 max-w-[120px] sm:max-w-[200px] lg:max-w-xs truncate">
                                                {getResumeTitle()}
                                            </h2>
                                            <button
                                                onClick={startEditingTitle}
                                                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                                title="Edit title"
                                            >
                                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Status Badges */}
                                <div className="flex items-center gap-2 ml-2">
                                    {currentResume?.status === 'completed' && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Completed
                                        </span>
                                    )}
                                    {currentResume?._id?.startsWith('local_') && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                            Local
                                        </span>
                                    )}
                                    {isDirty && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full animate-pulse">
                                            Unsaved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                {saveStatus !== 'idle' && saveStatus !== 'unsaved' && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`hidden sm:inline px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getSaveStatusColor()}`}
                                    >
                                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Error'}
                                    </motion.span>
                                )}

                                {/* Force Sync Button for Local Resumes */}
                                {currentResume?._id?.startsWith('local_') && !offlineMode && (
                                    <motion.button
                                        onClick={handleForceSync}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-1 sm:gap-2 shadow-md"
                                        title="Sync to server"
                                    >
                                        <Cloud className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline text-xs sm:text-sm">Sync</span>
                                    </motion.button>
                                )}

                                {/* View Mode Toggle */}
                                <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg sm:rounded-xl p-1">
                                    <button
                                        onClick={() => handleViewMode('editor')}
                                        className={`p-1.5 sm:p-2 rounded-lg transition-all ${activeView === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        title="Editor"
                                    >
                                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleViewMode('split')}
                                        className={`p-1.5 sm:p-2 rounded-lg transition-all ${activeView === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        title="Split View"
                                    >
                                        <Layout className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleViewMode('preview')}
                                        className={`p-1.5 sm:p-2 rounded-lg transition-all ${activeView === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        title="Preview"
                                    >
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>

                                {/* Save Button */}
                                <motion.button
                                    onClick={handleManualSave}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-1 sm:gap-2 shadow-md"
                                >
                                    <SaveIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline text-xs sm:text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
                                </motion.button>

                                {/* Fullscreen Toggle */}
                                <motion.button
                                    onClick={toggleFullScreen}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="hidden lg:flex p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                                    title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                >
                                    {isFullScreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                                </motion.button>
                            </div>
                        </div>

                        {/* Mobile Progress */}
                        <div className="sm:hidden mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700">Progress</span>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionData?.overall || 0}%` }} />
                                </div>
                                <span className="text-xs font-bold text-blue-600">{completionData?.overall || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Modern Sidebar */}
                    <ModernSidebar
                        isOpen={isMobileMenuOpen || !sidebarCollapsed}
                        onClose={() => setIsMobileMenuOpen(false)}
                        wizardSteps={wizardSteps}
                        wizardStep={wizardStep}
                        activeSection={activeSection}
                        onJumpToStep={handleJumpToStep}
                        completionData={completionData}
                        atsScore={atsScore}
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                        currentResume={currentResume}
                    />

                    {/* Editor/Preview Area */}
                    <div ref={editorRef} className="flex-1 overflow-y-auto">
                        {/* Editor View */}
                        {(activeView === 'editor' || activeView === 'split') && (
                            <div className={`${activeView === 'split' ? 'lg:w-1/2' : 'w-full'} mx-auto transition-all duration-300`}>
                                <div className="max-w-3xl mx-auto p-3 sm:p-4 lg:p-6">
                                    {/* Section Header */}
                                    <div className="mb-4 sm:mb-6">
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                            {wizardSteps[wizardStep].label}
                                        </h1>
                                        {completionData?.sections?.[activeSection] && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${completionData.sections[activeSection].percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">
                                                    {completionData.sections[activeSection].percentage}% complete
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Section Component */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeSection}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
                                        >
                                            {activeSection === 'finalize' ? (
                                                <FinalReviewsPage
                                                    resumeData={currentResume}
                                                    stats={{
                                                        atsScore,
                                                        completion: completionData?.overall || 0,
                                                        wordCount: currentResume?.summary?.split(' ').length || 0,
                                                        sections: completionData?.sections || {},
                                                        suggestions: completionData?.suggestions || []
                                                    }}
                                                    reviewStatus={reviewStatus}
                                                    onReviewComplete={handleReviewComplete}
                                                    onExport={handleExport}
                                                    onPrint={handlePrint}
                                                    onGenerateQR={handleGenerateQR}
                                                    qrCodeUrl={qrCodeUrl}
                                                    isExporting={isExporting}
                                                    onClose={() => setActiveView('editor')}
                                                    onComplete={handleCompleteResume}
                                                    isCompleting={isCompleting}
                                                />
                                            ) : CurrentComponent ? (
                                                <CurrentComponent
                                                    data={
                                                        activeSection === 'summary'
                                                            ? { summary: currentResume?.summary || '' }
                                                            : activeSection === 'personal'
                                                                ? currentResume?.personalInfo || {}
                                                                : currentResume?.[activeSection] || {}
                                                    }
                                                    onUpdate={(receivedData) => {
                                                        console.log(`📝 Updating ${activeSection} with:`, receivedData);

                                                        let updatesToSend;

                                                        if (activeSection === 'summary') {
                                                            const summaryText = typeof receivedData === 'string'
                                                                ? receivedData
                                                                : receivedData?.summary || '';

                                                            if (typeof summaryText !== 'string') {
                                                                console.warn('⚠️ Invalid summary data received:', receivedData);
                                                                return;
                                                            }
                                                            updatesToSend = { summary: summaryText };
                                                        } else {
                                                            const propertyMap = {
                                                                'personal': 'personalInfo',
                                                                'experience': 'experience',
                                                                'education': 'education',
                                                                'skills': 'skills',
                                                                'projects': 'projects',
                                                                'certifications': 'certifications',
                                                                'languages': 'languages'
                                                            };

                                                            const targetProperty = propertyMap[activeSection] || activeSection;

                                                            if (receivedData === null || receivedData === undefined) {
                                                                console.warn(`⚠️ Invalid data for ${activeSection}: null or undefined`);
                                                                return;
                                                            }

                                                            updatesToSend = { [targetProperty]: receivedData };
                                                        }

                                                        console.log('📤 Sending to context:', updatesToSend);
                                                        handleUpdateResumeData(updatesToSend);
                                                    }}
                                                    onNext={handleNextStep}
                                                    onPrev={handlePrevStep}
                                                />
                                            ) : null}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Navigation Buttons */}
                                    {activeSection !== 'finalize' && (
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                                            <button
                                                onClick={handlePrevStep}
                                                disabled={wizardStep === 0}
                                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">
                                                    Step {wizardStep + 1} of {wizardSteps.length - 1}
                                                </span>
                                                {isDirty && (
                                                    <span className="text-xs text-amber-600">*</span>
                                                )}
                                            </div>

                                            {wizardStep < wizardSteps.length - 1 ? (
                                                <button
                                                    onClick={handleNextStep}
                                                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-md shadow-blue-500/20"
                                                >
                                                    Next
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveView('preview')}
                                                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-md shadow-green-500/20"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Preview
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Preview View */}
                        {(activeView === 'preview' || activeView === 'split') && (
                            <div className={`${activeView === 'split' ? 'lg:w-1/2' : 'w-full'} h-full border-l border-gray-200 bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-sm overflow-hidden flex flex-col`}>
                                {/* Preview Controls */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Live Preview</h3>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <button
                                            onClick={handleZoomOut}
                                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <span className="text-xs sm:text-sm font-medium text-gray-800 min-w-[50px] sm:min-w-[60px] text-center">
                                            {Math.round(previewScale * 100)}%
                                        </span>
                                        <button
                                            onClick={handleZoomIn}
                                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                            onClick={handleZoomReset}
                                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
                                            title="Reset Zoom"
                                        >
                                            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Content */}
                                <div className="flex-1 overflow-auto p-3 sm:p-6">
                                    <div className="flex justify-center items-start h-full">
                                        <div
                                            ref={previewRef}
                                            className="bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 w-full max-w-[800px]"
                                            style={{
                                                transform: `scale(${previewScale})`,
                                                transformOrigin: 'top center',
                                            }}
                                        >
                                            <ResumePreview
                                                resumeData={currentResume}
                                                template={currentResume?.templateSettings?.templateName || 'modern'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Actions */}
                                <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3">
                                        <button
                                            onClick={() => setActiveView('editor')}
                                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <Edit2 className="w-4 h-4" /> Back to Editor
                                        </button>
                                        <button
                                            onClick={() => setShowExportManager(true)}
                                            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <Download className="w-4 h-4" /> Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <FloatingActionButtons
                onSave={handleManualSave}
                onPreview={() => setActiveView(activeView === 'preview' ? 'editor' : 'preview')}
                onExport={() => setShowExportManager(true)}
                onTemplate={() => setShowTemplateSelector(true)}
                onFullScreen={toggleFullScreen}
                isFullScreen={isFullScreen}
                isSaving={isSaving}
                completion={completionData?.overall || 0}
                atsScore={atsScore}
                currentView={activeView}
            />

            {/* Modals */}
            <TemplateSelector
                isOpen={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                currentTemplate={currentResume?.templateSettings?.templateName}
                onTemplateSelect={(templateId) => {
                    const updatedTemplateSettings = {
                        ...(currentResume?.templateSettings || {}),
                        templateName: templateId,
                        colors: currentResume?.templateSettings?.colors || {
                            primary: '#3b82f6',
                            secondary: '#6b7280',
                            accent: '#10b981',
                            background: '#ffffff',
                            text: '#000000',
                            header: '#1e40af'
                        },
                        font: currentResume?.templateSettings?.font || 'Roboto',
                        fontSize: currentResume?.templateSettings?.fontSize || 'medium',
                        spacing: currentResume?.templateSettings?.spacing || 'normal',
                        showPhoto: currentResume?.templateSettings?.showPhoto || false,
                        layout: currentResume?.templateSettings?.layout || 'single-column'
                    };

                    handleUpdateResumeData({
                        template: templateId,
                        templateSettings: updatedTemplateSettings
                    });
                    setShowTemplateSelector(false);
                    toast.success('Template changed');
                }}
            />

            <ExportManager
                isOpen={showExportManager}
                onClose={() => setShowExportManager(false)}
                resumeData={currentResume}
            />
        </div>
    );
};

export default Builder;