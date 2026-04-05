// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Search, 
    LayoutDashboard, 
    User, 
    LogOut, 
    Menu, 
    X, 
    ChevronDown,
    Plus,
    Sparkle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/builder', label: 'Builder', icon: FileText },
        { path: '/analyzer', label: 'Analyzer', icon: Search },
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
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            darkMode ? 'bg-gray-900/80' : 'bg-white/80'
        } backdrop-blur-xl border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                            <Sparkle className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">ResumeAI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {isAuthenticated && navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    location.pathname.startsWith(item.path)
                                    ? (darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600')
                                    : (darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-blue-500 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary px-5 py-2 rounded-xl text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => navigate('/builder/new')}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                                >
                                    <Plus className="w-4 h-4" />
                                    New
                                </button>

                                <div className="relative" ref={userMenuRef}>
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className={`flex items-center gap-2 p-1 pr-3 rounded-2xl border transition-all ${
                                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="hidden sm:inline text-sm font-semibold truncate max-w-[100px]">
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
                                                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden ${
                                                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                                                }`}
                                            >
                                                <div className="p-4 border-b dark:border-gray-700">
                                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Signed in as</p>
                                                    <p className="text-sm font-bold truncate">{user?.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <button 
                                                        onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        Profile Settings
                                                    </button>
                                                    <button 
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
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
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
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
                        className="md:hidden border-t dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900"
                    >
                        <div className="p-4 space-y-2">
                            {isAuthenticated && navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <item.icon className="w-5 h-5 text-gray-400" />
                                    {item.label}
                                </Link>
                            ))}
                            {!isAuthenticated && (
                                <>
                                    <Link to="/login" className="block w-full text-center py-3 font-medium">Login</Link>
                                    <Link to="/register" className="btn btn-primary block w-full text-center py-3 rounded-xl">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
