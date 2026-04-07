// src/components/navbar/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    History,
    BarChart3,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
    Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useHistoryManager from '../../hooks/useHistoryManager';
import toast from 'react-hot-toast';

const ProfileDropdown = ({ isOpen, onClose, user, darkMode }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const dropdownRef = useRef(null);
    const [activeTab, setActiveTab] = useState('main');
    const { resumeHistory, analyzerHistory } = useHistoryManager();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
        toast.success('Logged out successfully');
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    };

    // Main menu items
    const mainMenuItems = [
        {
            icon: User,
            label: 'My Profile',
            description: 'View and edit your profile',
            action: () => handleNavigate('/profile'),
        },
        {
            icon: History,
            label: 'Resume History',
            description: `${resumeHistory.length} resumes`,
            action: () => setActiveTab('resumes'),
        },
        {
            icon: BarChart3,
            label: 'Analysis History',
            description: `${analyzerHistory.length} analyses`,
            action: () => setActiveTab('analyses'),
        },
        {
            icon: Settings,
            label: 'Settings',
            description: 'Preferences and account',
            action: () => handleNavigate('/settings'),
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border overflow-hidden ${darkMode
                        ? 'bg-gray-800/95 border-gray-700'
                        : 'bg-white/95 border-gray-100'
                        } backdrop-blur-xl z-[100]`}
                >
                    {/* Main Menu */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'main' && (
                            <motion.div
                                key="main"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="divide-y divide-gray-200 dark:divide-gray-700"
                            >
                                {/* User Header */}
                                <div className={`p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 truncate">
                                            <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {user?.name || 'User'}
                                            </p>
                                            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2">
                                    {mainMenuItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.button
                                                key={item.label}
                                                variants={itemVariants}
                                                onClick={item.action}
                                                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all group ${darkMode
                                                    ? 'hover:bg-gray-700'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                    <div className="text-left flex-1">
                                                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {item.label}
                                                        </p>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors`} />
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Logout Button */}
                                <div className="p-2">
                                    <motion.button
                                        variants={itemVariants}
                                        onClick={handleLogout}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${darkMode
                                            ? 'hover:bg-red-900/20 text-red-400'
                                            : 'hover:bg-red-50 text-red-600'
                                            }`}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Resume History Tab */}
                        {activeTab === 'resumes' && (
                            <motion.div
                                key="resumes"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* Header */}
                                <div className={`flex items-center gap-3 p-4 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <button
                                        onClick={() => setActiveTab('main')}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <History className="w-5 h-5 text-blue-500" />
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Resume History
                                    </h3>
                                </div>

                                {/* Resumes List */}
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {resumeHistory.length > 0 ? (
                                        <motion.div className="space-y-2">
                                            {resumeHistory.slice(0, 10).map((resume, idx) => (
                                                <motion.button
                                                    key={resume.id}
                                                    variants={itemVariants}
                                                    custom={idx}
                                                    onClick={() => handleNavigate(`/builder/edit/${resume.id}`)}
                                                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-all group ${darkMode
                                                        ? 'hover:bg-gray-700'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {resume.title}
                                                        </p>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            <Clock className="w-3 h-3 inline mr-1" />
                                                            {new Date(resume.lastEdited).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <p className="text-sm">No resume history yet</p>
                                        </div>
                                    )}
                                </div>

                                {resumeHistory.length > 0 && (
                                    <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <button
                                            onClick={() => handleNavigate('/dashboard')}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${darkMode
                                                ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            View All Resumes
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Analyzer History Tab */}
                        {activeTab === 'analyses' && (
                            <motion.div
                                key="analyses"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* Header */}
                                <div className={`flex items-center gap-3 p-4 border-b ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <button
                                        onClick={() => setActiveTab('main')}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <BarChart3 className="w-5 h-5 text-green-500" />
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Analysis History
                                    </h3>
                                </div>

                                {/* Analyses List */}
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {analyzerHistory.length > 0 ? (
                                        <motion.div className="space-y-2">
                                            {analyzerHistory.slice(0, 10).map((analysis, idx) => (
                                                <motion.button
                                                    key={analysis.id}
                                                    variants={itemVariants}
                                                    custom={idx}
                                                    onClick={() => handleNavigate(`/analyzer?id=${analysis.id}`)}
                                                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-all group ${darkMode
                                                        ? 'hover:bg-gray-700'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <BarChart3 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {analysis.resumeTitle}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-xs font-bold px-2 py-1 rounded ${analysis.atsScore >= 75
                                                                ? 'bg-green-100 text-green-700'
                                                                : analysis.atsScore >= 50
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                ATS: {analysis.atsScore}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <p className="text-sm">No analysis history yet</p>
                                        </div>
                                    )}
                                </div>

                                {analyzerHistory.length > 0 && (
                                    <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <button
                                            onClick={() => handleNavigate('/analyzer/history')}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${darkMode
                                                ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                        >
                                            View All Analyses
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileDropdown;
