// src/components/dashboard/EditResumeModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, FileText, User, Mail, Phone, MapPin,
    Briefcase, GraduationCap, Award, Globe, Code,
    Eye, Download, Star, Pin, Check, AlertCircle,
    Tag, Calendar, Clock, Target, Sparkles, Edit,
    Trash2, Copy, Settings, ChevronDown, ChevronUp,
    Plus, Minus, Upload, Image, Palette, Type
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditResumeModal = ({ isOpen, onClose, onSave, resume, darkMode }) => {
    // ============ STATE MANAGEMENT ============
    const [formData, setFormData] = useState({
        title: '',
        template: 'modern',
        status: 'draft',
        isPrimary: false,
        isStarred: false,
        isPinned: false,
        tags: [],
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            linkedin: '',
            github: '',
            portfolio: '',
            website: '',
            jobTitle: '',
            photoUrl: ''
        },
        summary: '',
        templateSettings: {
            templateName: 'modern',
            colors: {
                primary: '#3b82f6',
                secondary: '#6b7280',
                accent: '#10b981',
                background: '#ffffff',
                text: '#000000',
                header: '#1e40af'
            },
            font: 'Roboto',
            fontSize: 'medium',
            spacing: 'normal',
            showPhoto: false,
            layout: 'single-column'
        }
    });

    const [activeTab, setActiveTab] = useState('basic');
    const [newTag, setNewTag] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        template: false,
        settings: false
    });

    // ============ TEMPLATE OPTIONS ============
    const templateOptions = [
        { id: 'modern', name: 'Modern', icon: '✨', color: 'from-blue-500 to-cyan-500' },
        { id: 'classic', name: 'Classic', icon: '📜', color: 'from-amber-500 to-orange-500' },
        { id: 'creative', name: 'Creative', icon: '🎨', color: 'from-purple-500 to-pink-500' },
        { id: 'minimal', name: 'Minimal', icon: '⚪', color: 'from-gray-500 to-slate-500' },
        { id: 'executive', name: 'Executive', icon: '👔', color: 'from-emerald-500 to-teal-500' },
        { id: 'ats', name: 'ATS-Friendly', icon: '🤖', color: 'from-indigo-500 to-purple-500' }
    ];

    // ============ STATUS OPTIONS ============
    const statusOptions = [
        { id: 'draft', name: 'Draft', color: 'bg-gray-500' },
        { id: 'in-progress', name: 'In Progress', color: 'bg-blue-500' },
        { id: 'completed', name: 'Completed', color: 'bg-green-500' }
    ];

    // ============ FONT OPTIONS ============
    const fontOptions = [
        'Roboto', 'Inter', 'Montserrat', 'Open Sans', 'Lato', 'Poppins', 'Merriweather'
    ];

    // ============ COLOR PRESETS ============
    const colorPresets = [
        { primary: '#3b82f6', secondary: '#6b7280', accent: '#10b981', name: 'Blue' },
        { primary: '#ef4444', secondary: '#6b7280', accent: '#f59e0b', name: 'Red' },
        { primary: '#8b5cf6', secondary: '#6b7280', accent: '#ec4899', name: 'Purple' },
        { primary: '#10b981', secondary: '#6b7280', accent: '#3b82f6', name: 'Green' },
        { primary: '#f59e0b', secondary: '#6b7280', accent: '#ef4444', name: 'Orange' },
        { primary: '#000000', secondary: '#374151', accent: '#3b82f6', name: 'Dark' }
    ];

    // ============ LOAD RESUME DATA ============
    useEffect(() => {
        if (resume) {
            setFormData({
                title: resume.title || 'Untitled Resume',
                template: resume.template || resume.templateSettings?.templateName || 'modern',
                status: resume.status || 'draft',
                isPrimary: resume.isPrimary || false,
                isStarred: resume.isStarred || false,
                isPinned: resume.isPinned || false,
                tags: resume.tags || [],
                personalInfo: {
                    firstName: resume.personalInfo?.firstName || '',
                    lastName: resume.personalInfo?.lastName || '',
                    email: resume.personalInfo?.email || '',
                    phone: resume.personalInfo?.phone || '',
                    address: resume.personalInfo?.address || '',
                    city: resume.personalInfo?.city || '',
                    state: resume.personalInfo?.state || '',
                    country: resume.personalInfo?.country || '',
                    zipCode: resume.personalInfo?.zipCode || '',
                    linkedin: resume.personalInfo?.linkedin || '',
                    github: resume.personalInfo?.github || '',
                    portfolio: resume.personalInfo?.portfolio || '',
                    website: resume.personalInfo?.website || '',
                    jobTitle: resume.personalInfo?.jobTitle || '',
                    photoUrl: resume.personalInfo?.photoUrl || ''
                },
                summary: resume.summary || '',
                templateSettings: {
                    templateName: resume.templateSettings?.templateName || resume.template || 'modern',
                    colors: {
                        primary: resume.templateSettings?.colors?.primary || '#3b82f6',
                        secondary: resume.templateSettings?.colors?.secondary || '#6b7280',
                        accent: resume.templateSettings?.colors?.accent || '#10b981',
                        background: resume.templateSettings?.colors?.background || '#ffffff',
                        text: resume.templateSettings?.colors?.text || '#000000',
                        header: resume.templateSettings?.colors?.header || '#1e40af'
                    },
                    font: resume.templateSettings?.font || 'Roboto',
                    fontSize: resume.templateSettings?.fontSize || 'medium',
                    spacing: resume.templateSettings?.spacing || 'normal',
                    showPhoto: resume.templateSettings?.showPhoto || false,
                    layout: resume.templateSettings?.layout || 'single-column'
                }
            });
        }
    }, [resume]);

    // ============ VALIDATION ============
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'Resume title is required';
        }

        if (!formData.personalInfo?.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.personalInfo?.email?.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.personalInfo.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (formData.personalInfo?.phone) {
            const phoneRegex = /^[\d\s\-+()]{10,}$/;
            if (!phoneRegex.test(formData.personalInfo.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        if (formData.personalInfo?.website) {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(formData.personalInfo.website)) {
                newErrors.website = 'Please enter a valid URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============ HANDLE INPUT CHANGE ============
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (errors[name] || errors[name.split('.')[1]]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                delete newErrors[name.split('.')[1]];
                return newErrors;
            });
        }
    };

    // ============ HANDLE COLOR CHANGE ============
    const handleColorChange = (colorType, value) => {
        setFormData(prev => ({
            ...prev,
            templateSettings: {
                ...prev.templateSettings,
                colors: {
                    ...prev.templateSettings.colors,
                    [colorType]: value
                }
            }
        }));
    };

    // ============ HANDLE PRESET SELECT ============
    const handlePresetSelect = (preset) => {
        setFormData(prev => ({
            ...prev,
            templateSettings: {
                ...prev.templateSettings,
                colors: {
                    ...prev.templateSettings.colors,
                    primary: preset.primary,
                    secondary: preset.secondary,
                    accent: preset.accent
                }
            }
        }));
    };

    // ============ HANDLE TAG ADD ============
    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    // ============ HANDLE TAG REMOVE ============
    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // ============ HANDLE KEY DOWN ============
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && newTag) {
            e.preventDefault();
            handleAddTag();
        }
    };

    // ============ HANDLE SAVE ============
    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

        setIsSaving(true);

        try {
            const updatedResume = {
                ...resume,
                ...formData,
                template: formData.template,
                templateSettings: {
                    ...formData.templateSettings,
                    templateName: formData.template
                },
                updatedAt: new Date().toISOString()
            };

            await onSave(updatedResume);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    // ============ TOGGLE SECTION ============
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // ============ RENDER ============
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-100'
                                    }`}>
                                    <FileText className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Edit Resume
                                    </h2>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Make changes to your resume details
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-lg transition-colors ${darkMode
                                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className={`flex border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'
                            }`}>
                            {[
                                { id: 'basic', label: 'Basic Info', icon: FileText },
                                { id: 'personal', label: 'Personal', icon: User },
                                { id: 'template', label: 'Template', icon: Palette },
                                { id: 'settings', label: 'Settings', icon: Settings }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                            ? darkMode
                                                ? 'text-blue-400 border-b-2 border-blue-400'
                                                : 'text-blue-600 border-b-2 border-blue-600'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                            <AnimatePresence mode="wait">
                                {/* Basic Info Tab */}
                                {activeTab === 'basic' && (
                                    <motion.div
                                        key="basic"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {/* Title */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Resume Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    } ${errors.title ? 'border-red-500' : ''}`}
                                                placeholder="e.g., Software Engineer Resume"
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                            )}
                                        </div>

                                        {/* Status & Flags */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Status */}
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white'
                                                            : 'bg-white border-gray-300 text-gray-900'
                                                        }`}
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Template */}
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Template
                                                </label>
                                                <select
                                                    name="template"
                                                    value={formData.template}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white'
                                                            : 'bg-white border-gray-300 text-gray-900'
                                                        }`}
                                                >
                                                    {templateOptions.map(option => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Flags */}
                                        <div className="space-y-3">
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Resume Flags
                                            </label>
                                            <div className="flex flex-wrap gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="isPrimary"
                                                        checked={formData.isPrimary}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Set as Primary Resume
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="isStarred"
                                                        checked={formData.isStarred}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Star this Resume
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="isPinned"
                                                        checked={formData.isPinned}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Pin to Top
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Tags
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full ${darkMode
                                                                ? 'bg-gray-800 text-gray-300'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {tag}
                                                        <button
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className={`p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Add a tag..."
                                                    className={`flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                />
                                                <button
                                                    onClick={handleAddTag}
                                                    disabled={!newTag.trim()}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Professional Summary
                                            </label>
                                            <textarea
                                                name="summary"
                                                value={formData.summary}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                    }`}
                                                placeholder="Write a brief professional summary..."
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Personal Info Tab */}
                                {activeTab === 'personal' && (
                                    <motion.div
                                        key="personal"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {/* Name */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.firstName"
                                                    value={formData.personalInfo.firstName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } ${errors.firstName ? 'border-red-500' : ''}`}
                                                    placeholder="John"
                                                />
                                                {errors.firstName && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.lastName"
                                                    value={formData.personalInfo.lastName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="personalInfo.email"
                                                    value={formData.personalInfo.email}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } ${errors.email ? 'border-red-500' : ''}`}
                                                    placeholder="john@example.com"
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="personalInfo.phone"
                                                    value={formData.personalInfo.phone}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        } ${errors.phone ? 'border-red-500' : ''}`}
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.address"
                                                    value={formData.personalInfo.address}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="123 Main St"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.city"
                                                    value={formData.personalInfo.city}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="San Francisco"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.state"
                                                    value={formData.personalInfo.state}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="CA"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.country"
                                                    value={formData.personalInfo.country}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="USA"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    Zip Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="personalInfo.zipCode"
                                                    value={formData.personalInfo.zipCode}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                        }`}
                                                    placeholder="94105"
                                                />
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div className="space-y-4">
                                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Social & Professional Links
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                        LinkedIn
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="personalInfo.linkedin"
                                                        value={formData.personalInfo.linkedin}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            }`}
                                                        placeholder="https://linkedin.com/in/johndoe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                        GitHub
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="personalInfo.github"
                                                        value={formData.personalInfo.github}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            }`}
                                                        placeholder="https://github.com/johndoe"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                        Portfolio
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="personalInfo.portfolio"
                                                        value={formData.personalInfo.portfolio}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            }`}
                                                        placeholder="https://johndoe.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                        Website
                                                    </label>
                                                    <input
                                                        type="url"
                                                        name="personalInfo.website"
                                                        value={formData.personalInfo.website}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                                            } ${errors.website ? 'border-red-500' : ''}`}
                                                        placeholder="https://johndoe.com"
                                                    />
                                                    {errors.website && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Template Tab */}
                                {activeTab === 'template' && (
                                    <motion.div
                                        key="template"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {/* Template Selection */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Select Template
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {templateOptions.map((template) => (
                                                    <button
                                                        key={template.id}
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                template: template.id,
                                                                templateSettings: {
                                                                    ...prev.templateSettings,
                                                                    templateName: template.id
                                                                }
                                                            }));
                                                        }}
                                                        className={`relative p-4 rounded-xl border-2 transition-all ${formData.template === template.id
                                                                ? `bg-gradient-to-r ${template.color} text-white border-transparent shadow-lg scale-105`
                                                                : darkMode
                                                                    ? 'border-gray-700 hover:border-gray-600'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-2xl mb-2">{template.icon}</span>
                                                            <span className="font-medium text-sm">{template.name}</span>
                                                        </div>
                                                        {formData.template === template.id && (
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color Scheme */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Color Scheme
                                            </label>

                                            {/* Color Presets */}
                                            <div className="mb-4">
                                                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    Presets
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    {colorPresets.map((preset, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePresetSelect(preset)}
                                                            className="flex flex-col items-center gap-1"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex">
                                                                <div className="w-1/3 h-full" style={{ backgroundColor: preset.primary }} />
                                                                <div className="w-1/3 h-full" style={{ backgroundColor: preset.secondary }} />
                                                                <div className="w-1/3 h-full" style={{ backgroundColor: preset.accent }} />
                                                            </div>
                                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                {preset.name}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Custom Colors */}
                                            <div className="space-y-3">
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    Custom Colors
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Primary
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.primary}
                                                            onChange={(e) => handleColorChange('primary', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Secondary
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.secondary}
                                                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Accent
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.accent}
                                                            onChange={(e) => handleColorChange('accent', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Background
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.background}
                                                            onChange={(e) => handleColorChange('background', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Text
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.text}
                                                            onChange={(e) => handleColorChange('text', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Header
                                                        </label>
                                                        <input
                                                            type="color"
                                                            value={formData.templateSettings.colors.header}
                                                            onChange={(e) => handleColorChange('header', e.target.value)}
                                                            className="w-full h-10 rounded-lg cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Font Settings */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Font Settings
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        Font Family
                                                    </label>
                                                    <select
                                                        value={formData.templateSettings.font}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            templateSettings: {
                                                                ...prev.templateSettings,
                                                                font: e.target.value
                                                            }
                                                        }))}
                                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white'
                                                                : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    >
                                                        {fontOptions.map(font => (
                                                            <option key={font} value={font}>{font}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        Font Size
                                                    </label>
                                                    <select
                                                        value={formData.templateSettings.fontSize}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            templateSettings: {
                                                                ...prev.templateSettings,
                                                                fontSize: e.target.value
                                                            }
                                                        }))}
                                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white'
                                                                : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        Spacing
                                                    </label>
                                                    <select
                                                        value={formData.templateSettings.spacing}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            templateSettings: {
                                                                ...prev.templateSettings,
                                                                spacing: e.target.value
                                                            }
                                                        }))}
                                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white'
                                                                : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    >
                                                        <option value="compact">Compact</option>
                                                        <option value="normal">Normal</option>
                                                        <option value="relaxed">Relaxed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Layout Settings */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                Layout Settings
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        Layout
                                                    </label>
                                                    <select
                                                        value={formData.templateSettings.layout}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            templateSettings: {
                                                                ...prev.templateSettings,
                                                                layout: e.target.value
                                                            }
                                                        }))}
                                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                                ? 'bg-gray-800 border-gray-700 text-white'
                                                                : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    >
                                                        <option value="single-column">Single Column</option>
                                                        <option value="two-column">Two Column</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 mt-6 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.templateSettings.showPhoto}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                templateSettings: {
                                                                    ...prev.templateSettings,
                                                                    showPhoto: e.target.checked
                                                                }
                                                            }))}
                                                            className="w-4 h-4 text-blue-600 rounded"
                                                        />
                                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                            Show Profile Photo
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                            }`}>
                                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Resume Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Resume ID
                                                    </span>
                                                    <span className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        {resume?._id || 'New'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Created
                                                    </span>
                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                        {resume?.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Not yet created'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Last Modified
                                                    </span>
                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                        {resume?.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                        Version
                                                    </span>
                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                        {resume?.version || 1}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                            }`}>
                                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Export Options
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                            PDF Export
                                                        </span>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Download as PDF document
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (resume?._id) {
                                                                apiService.resume.exportResume(resume._id, 'pdf');
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Export PDF
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                            DOCX Export
                                                        </span>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Download as Word document
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (resume?._id) {
                                                                apiService.resume.exportResume(resume._id, 'docx');
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Export DOCX
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                            }`}>
                                            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Danger Zone
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-red-500 font-medium">
                                                            Delete Resume
                                                        </span>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            Permanently delete this resume and all its data
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            onClose();
                                                            // Trigger delete modal
                                                            setTimeout(() => {
                                                                const event = new CustomEvent('openDeleteModal', { detail: resume });
                                                                window.dispatchEvent(event);
                                                            }, 100);
                                                        }}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className={`flex items-center justify-end gap-3 p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'
                            }`}>
                            <button
                                onClick={onClose}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${darkMode
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 flex items-center gap-2"
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditResumeModal;