// src/pages/dashboard/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Sparkle,
    Search,
    Grid,
    List,
    Filter,
    RefreshCw,
    LayoutDashboard,
    AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useDashboardStats, useUserResumes } from '../../hooks/useDashboard';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ResumeCard from '../../components/ResumeCard';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
        refetch: refetchStats
    } = useDashboardStats(user?._id || user?.id);

    const {
        data: resumes,
        isLoading: resumesLoading,
        isError: resumesError,
        refetch: refetchResumes
    } = useUserResumes(user?._id || user?.id);

    const filteredResumes = useMemo(() => {
        if (!resumes) return [];

        // Ensure we only work with valid resume objects that have an _id
        const valid = resumes.filter(r => r && (r._id || r.id));

        return valid.filter(resume => {
            const title = (resume.title || '').toString();
            const matchesSearch = title.toLowerCase().includes((searchQuery || '').toLowerCase());
            const matchesStatus = statusFilter === 'all' || resume.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [resumes, searchQuery, statusFilter]);

    const handleCreateResume = () => navigate('/builder');

    const handleRefresh = () => {
        refetchStats();
        refetchResumes();
    };

    if (resumesLoading || statsLoading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className={`mt-1 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Your professional journey continues here.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateResume}
                        className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New Resume</span>
                    </motion.button>
                </div>

                {/* Stats Section */}
                {!statsError && stats && <StatsGrid stats={stats} darkMode={darkMode} />}

                {/* Controls Bar */}
                <div className={`p-4 rounded-2xl mb-8 border flex flex-col md:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
                    }`}>
                    <div className="relative w-full md:w-96">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search your resumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'
                                }`}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-500' : 'text-gray-500'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-500' : 'text-gray-500'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`px-4 py-2.5 rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'
                                }`}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Drafts</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button
                            onClick={handleRefresh}
                            className={`p-2.5 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${darkMode ? 'border-gray-700' : 'border-gray-100'
                                }`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Resumes Content */}
                {resumesError ? (
                    <div className="text-center py-20">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-xl font-bold">Failed to load resumes</h2>
                        <button onClick={handleRefresh} className="mt-4 text-blue-500 underline">Try again</button>
                    </div>
                ) : filteredResumes.length === 0 && searchQuery === '' && statusFilter === 'all' ? (
                    <div className="text-center py-32 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] rounded-full mix-blend-multiply"></div>
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <Sparkle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Create your first resume</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg">Use our AI-powered builder to craft a professional, ATS-optimized resume.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateResume}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-3 mx-auto"
                        >
                            <Plus className="w-6 h-6" />
                            Start Building Now
                        </motion.button>
                    </div>
                ) : filteredResumes.length === 0 ? (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-2xl font-bold mb-2">No results found</h2>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "flex flex-col gap-4"
                    }>
                        <AnimatePresence>
                            {viewMode === 'grid' && (
                                <motion.div
                                    key="create-new"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreateResume}
                                    className={`group cursor-pointer rounded-2xl border-2 border-dashed flex flex-col items-center justify-center min-h-[300px] p-6 transition-all duration-500 ${darkMode
                                            ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-800/80'
                                            : 'border-blue-200 hover:border-blue-400 hover:bg-gradient-to-b from-blue-50 to-white hover:shadow-xl hover:shadow-blue-500/10 bg-white'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-90 ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Create New Resume</h3>
                                    <p className="text-sm text-gray-500 text-center">Start from scratch with AI assistance</p>
                                </motion.div>
                            )}
                            {filteredResumes.map((resume, index) => (
                                <motion.div
                                    key={resume._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ResumeCard
                                        resume={resume}
                                        darkMode={darkMode}
                                        view={viewMode}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
