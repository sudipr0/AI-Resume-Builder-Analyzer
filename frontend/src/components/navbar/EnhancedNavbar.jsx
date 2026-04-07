// src/components/navbar/EnhancedNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Search,
    Menu,
    X,
    Bell,
    LayoutDashboard,
    FileText,
    Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const EnhancedNavbar = ({ darkMode, setDarkMode }) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll for navbar style changes
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/builder', label: 'Builder', icon: FileText },
        { path: '/analyzer', label: 'Analyzer', icon: Search },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, ease: 'easeOut' },
        },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
    };

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || darkMode
                    ? darkMode
                        ? 'bg-gray-900/95 border-gray-800'
                        : 'bg-white/95 border-gray-100'
                    : darkMode
                        ? 'bg-gray-900/80 border-gray-800/50'
                        : 'bg-white/80 border-gray-100/50'
                    } backdrop-blur-xl border-b`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* LEFT SECTION: Logo + Resume Analyzer Button */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link
                                to={isAuthenticated ? '/dashboard' : '/'}
                                className="flex items-center gap-2 group flex-shrink-0"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-2 rounded-xl shadow-lg transition-all ${darkMode
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20'
                                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-600/20'
                                        } group-hover:shadow-xl group-hover:shadow-blue-600/30`}
                                >
                                    <Sparkles className="w-5 h-5 text-white fill-current" />
                                </motion.div>
                                <div className="hidden sm:flex flex-col">
                                    <span className={`text-base sm:text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        ResumeAI
                                    </span>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Pro
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav Items - Center */}
                            {isAuthenticated && (
                                <div className="hidden lg:flex items-center gap-1">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <motion.div
                                                key={item.path}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Link
                                                    to={item.path}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${active
                                                        ? darkMode
                                                            ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                                                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                                                        : darkMode
                                                            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="hidden sm:inline">{item.label}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* RIGHT SECTION: Actions + Profile */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {!isAuthenticated ? (
                                // Unauthenticated Actions
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Link
                                        to="/analyzer"
                                        className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${darkMode
                                            ? 'text-gray-400 hover:text-blue-400'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        <Search className="w-4 h-4" />
                                        <span className="hidden sm:inline">Analyzer</span>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${darkMode
                                            ? 'text-gray-400 hover:text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                // Authenticated Actions
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* Primary Action: Use Analyzer */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/analyzer')}
                                        className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${darkMode
                                            ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-900/50'
                                            : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                                            }`}
                                    >
                                        <Search className="w-4 h-4" />
                                        Analyze
                                    </motion.button>

                                    {/* Notifications */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative p-2 rounded-lg transition-all ${darkMode
                                            ? 'hover:bg-gray-800 text-gray-400'
                                            : 'hover:bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </motion.button>

                                    {/* Profile Avatar Button */}
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-2xl border transition-all ${darkMode
                                                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                                                : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <span className={`hidden sm:inline text-xs sm:text-sm font-semibold truncate max-w-[100px] ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {user?.name?.split(' ')[0] || 'User'}
                                            </span>
                                        </motion.button>

                                        {/* Profile Dropdown */}
                                        <ProfileDropdown
                                            isOpen={isProfileDropdownOpen}
                                            onClose={() => setIsProfileDropdownOpen(false)}
                                            user={user}
                                            darkMode={darkMode}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode
                                        ? 'hover:bg-gray-800 text-gray-400'
                                        : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="w-5 h-5" />
                                    ) : (
                                        <Menu className="w-5 h-5" />
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && isAuthenticated && (
                            <motion.div
                                variants={mobileMenuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`lg:hidden border-t ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
                                    }`}
                            >
                                <div className="px-4 py-3 space-y-2">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${active
                                                    ? darkMode
                                                        ? 'bg-blue-900/30 text-blue-400'
                                                        : 'bg-blue-50 text-blue-600'
                                                    : darkMode
                                                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                    <button
                                        onClick={() => {
                                            navigate('/analyzer');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${darkMode
                                            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            }`}
                                    >
                                        <Search className="w-5 h-5" />
                                        <span className="font-medium">Analyze Resume</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
};

export default EnhancedNavbar;
