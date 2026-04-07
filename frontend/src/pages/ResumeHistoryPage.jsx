// src/pages/ResumeHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    Edit3,
    Eye,
    Calendar,
    Download,
    Archive,
    Search,
    Filter,
    ChevronRight,
    Clock,
    Zap,
    AlertCircle,
} from 'lucide-react';
import useHistoryManager from '../hooks/useHistoryManager';
import toast from 'react-hot-toast';

const ResumeHistoryPage = () => {
    const navigate = useNavigate();
    const { resumeHistory, removeResume, clearResumeHistory, loading } = useHistoryManager();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        let filtered = resumeHistory.filter(resume =>
            resume.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.lastEdited) - new Date(b.lastEdited));
        } else if (sortBy === 'aToZ') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'score') {
            filtered.sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
        }

        setFilteredHistory(filtered);
    }, [resumeHistory, searchQuery, sortBy]);

    const handleEdit = (resumeId) => {
        navigate(`/builder/edit/${resumeId}`);
    };

    const handleView = (resumeId) => {
        navigate(`/preview/${resumeId}`);
    };

    const handleDelete = (resumeId, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            removeResume(resumeId);
            toast.success('Resume deleted');
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure? This will delete all resume history.')) {
            clearResumeHistory();
            toast.success('History cleared');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;

        return date.toLocaleDateString();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Resume History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and access all your previously created or uploaded resumes
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    {/* Search */}
                    <div className="relative col-span-1 md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="aToZ">A to Z</option>
                            <option value="score">Highest Score</option>
                        </select>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Resumes</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {resumeHistory.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Analyzed</p>
                        <p className="text-2xl font-bold text-green-600">
                            {resumeHistory.filter(r => r.atsScore).length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {resumeHistory.length > 0
                                ? Math.round(
                                    resumeHistory.reduce((sum, r) => sum + (r.atsScore || 0), 0) /
                                    resumeHistory.filter(r => r.atsScore).length
                                )
                                : '—'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {resumeHistory.length > 0
                                ? formatDate(resumeHistory[0].lastEdited)
                                : 'Never'}
                        </p>
                    </div>
                </motion.div>

                {/* Resume List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {filteredHistory.length > 0 ? (
                        <AnimatePresence>
                            {filteredHistory.map((resume, idx) => (
                                <motion.div
                                    key={resume.id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3">
                                                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                        {resume.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                                        <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                                            <Clock className="w-4 h-4" />
                                                            {formatDate(resume.lastEdited)}
                                                        </span>
                                                        {resume.atsScore && (
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-xs ${resume.atsScore >= 75
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                    : resume.atsScore >= 50
                                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                    }`}
                                                            >
                                                                <Zap className="w-3 h-3" />
                                                                ATS: {resume.atsScore}%
                                                            </span>
                                                        )}
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {resume.status && `Status: ${resume.status}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleView(resume.id)}
                                                className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                                                title="Preview"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleEdit(resume.id)}
                                                className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(resume.id, resume.title)}
                                                className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>

                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            className="text-center py-12"
                        >
                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {searchQuery ? 'No resumes found' : 'No resume history yet'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500 mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search terms'
                                    : 'Start by creating or uploading a new resume'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => navigate('/builder')}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition-all"
                                >
                                    <Zap className="w-4 h-4" />
                                    Create New Resume
                                </button>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Clear History Button */}
                {resumeHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={handleClearHistory}
                            className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        >
                            Clear all history
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResumeHistoryPage;
