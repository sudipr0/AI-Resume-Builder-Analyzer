// src/pages/AnalyzerHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Trash2,
    Eye,
    Calendar,
    Search,
    Filter,
    ChevronRight,
    Clock,
    AlertCircle,
    TrendingUp,
} from 'lucide-react';
import useHistoryManager from '../hooks/useHistoryManager';
import toast from 'react-hot-toast';

const AnalyzerHistoryPage = () => {
    const navigate = useNavigate();
    const { analyzerHistory, removeAnalysis, clearAnalyzerHistory } = useHistoryManager();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        let filtered = analyzerHistory.filter(analysis =>
            analysis.resumeTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.analyzedAt) - new Date(b.analyzedAt));
        } else if (sortBy === 'highScore') {
            filtered.sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
        } else if (sortBy === 'lowScore') {
            filtered.sort((a, b) => (a.atsScore || 0) - (b.atsScore || 0));
        }

        setFilteredHistory(filtered);
    }, [analyzerHistory, searchQuery, sortBy]);

    const handleView = (analysisId) => {
        navigate(`/analyzer/result/${analysisId}`);
    };

    const handleDelete = (analysisId, title) => {
        if (window.confirm(`Are you sure you want to delete the analysis for "${title}"?`)) {
            removeAnalysis(analysisId);
            toast.success('Analysis deleted');
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure? This will delete all analysis history.')) {
            clearAnalyzerHistory();
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

    const getScoreColor = (score) => {
        if (score >= 80) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Excellent' };
        if (score >= 60) return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Good' };
        if (score >= 40) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Fair' };
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Needs Work' };
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

    const statistics = {
        total: analyzerHistory.length,
        average: analyzerHistory.length > 0
            ? Math.round(analyzerHistory.reduce((sum, a) => sum + (a.atsScore || 0), 0) / analyzerHistory.length)
            : 0,
        highest: analyzerHistory.length > 0
            ? Math.max(...analyzerHistory.map(a => a.atsScore || 0))
            : 0,
        excellent: analyzerHistory.filter(a => (a.atsScore || 0) >= 80).length,
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
                        Analysis History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review all your previous resume analyses and improvement suggestions
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
                            placeholder="Search analyses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highScore">Highest Score</option>
                            <option value="lowScore">Lowest Score</option>
                        </select>
                    </div>
                </motion.div>

                {/* Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Analyses</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {statistics.total}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {statistics.average}%
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Highest Score</p>
                        <p className="text-2xl font-bold text-green-600">
                            {statistics.highest}%
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Excellent (80+)</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {statistics.excellent}
                        </p>
                    </div>
                </motion.div>

                {/* Analysis List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {filteredHistory.length > 0 ? (
                        <AnimatePresence>
                            {filteredHistory.map((analysis) => {
                                const scoreInfo = getScoreColor(analysis.atsScore || 0);
                                return (
                                    <motion.div
                                        key={analysis.id}
                                        variants={itemVariants}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="group bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => handleView(analysis.id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-3">
                                                    <BarChart3 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                            {analysis.resumeTitle}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                                            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                                                <Clock className="w-4 h-4" />
                                                                {formatDate(analysis.analyzedAt)}
                                                            </span>

                                                            {/* ATS Score */}
                                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${scoreInfo.bg} ${scoreInfo.text}`}>
                                                                <TrendingUp className="w-4 h-4" />
                                                                <span>{analysis.atsScore}%</span>
                                                                <span className="text-xs opacity-75">({scoreInfo.label})</span>
                                                            </div>

                                                            {/* Keywords */}
                                                            {analysis.keywords && analysis.keywords.length > 0 && (
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    {analysis.keywords.length} keywords found
                                                                </span>
                                                            )}

                                                            {/* Suggestions Count */}
                                                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    {analysis.suggestions.length} suggestions
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleView(analysis.id);
                                                    }}
                                                    className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(analysis.id, analysis.resumeTitle);
                                                    }}
                                                    className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>

                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            className="text-center py-12"
                        >
                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {searchQuery ? 'No analyses found' : 'No analysis history yet'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500 mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search terms'
                                    : 'Get started by analyzing your first resume'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => navigate('/analyzer')}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-600/30 transition-all"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Analyze a Resume
                                </button>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Clear History Button */}
                {analyzerHistory.length > 0 && (
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

export default AnalyzerHistoryPage;
