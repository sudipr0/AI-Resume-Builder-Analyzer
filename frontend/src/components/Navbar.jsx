// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    LayoutDashboard,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Plus,
    Sparkles,
    History,
    BarChart3,
    Clock,
    Zap,
    ChevronRight,
    Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useHistoryManager from '../hooks/useHistoryManager';

const Navbar = ({ darkMode }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('main');
    const userMenuRef = useRef(null);

    // Import history manager
    const { resumeHistory, analyzerHistory } = useHistoryManager();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
        { path: '/builder', label: 'Resume Builder', icon: FileText, protected: true },
        { path: '/builder/templates', label: 'Templates', icon: Layers, protected: false },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleLogoClick = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'
            } backdrop-blur-md border-b ${darkMode ? 'border-gray-800' : 'border-gray-100 shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-8">
                        <button onClick={handleLogoClick} className="flex items-center gap-2 group transition-transform active:scale-95">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md group-hover:rotate-12 transition-all">
                                <Sparkles className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ResumeCraft</span>
                        </button>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                if (item.protected && !isAuthenticated) return null;
                                
                                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                                
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isActive
                                            ? (darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                                            : (darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* High-Impact AI Analyzer Button */}
                        <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/analyzer')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-900 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-white/10 hover:shadow-indigo-500/30 transition-all"
                        >
                            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="hidden sm:inline">AI Analyzer</span>
                        </motion.button>

                        {!isAuthenticated ? (
                            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 ml-2 pl-4">
                                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95">
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-200 dark:border-gray-700 ml-2 pl-4">
                                <button
                                    onClick={() => navigate('/builder/new')}
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create
                                </button>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className={`flex items-center gap-2 p-1 pr-3 rounded-2xl border transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="hidden sm:inline text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                                                    }`}
                                            >
                                                {/* Header */}
                                                <div className={`p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="flex-1 truncate">
                                                            <p className={`font-bold truncate text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {user?.name || 'User'}
                                                            </p>
                                                            <p className={`text-[10px] truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2 border-t dark:border-gray-700">
                                                    <button
                                                        onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <User className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm font-medium">Profile Settings</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { navigate('/resume-history'); setIsUserMenuOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <History className="w-4 h-4 text-amber-500" />
                                                        <span className="text-sm font-medium">History ({resumeHistory.length})</span>
                                                    </button>
                                                </div>

                                                <div className="p-2 border-t dark:border-gray-700">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span className="text-sm font-bold">Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { navigate('/analyzer'); setIsMobileMenuOpen(false); }}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-800"
                                >
                                    <Zap className="w-6 h-6" />
                                    <span>Analyzer</span>
                                </button>
                                <button
                                    onClick={() => { navigate('/builder/templates'); setIsMobileMenuOpen(false); }}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700"
                                >
                                    <Layers className="w-6 h-6" />
                                    <span>Templates</span>
                                </button>
                            </div>

                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    if (item.protected && !isAuthenticated) return null;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <item.icon className="w-5 h-5 text-blue-500" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {!isAuthenticated ? (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/20">
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
