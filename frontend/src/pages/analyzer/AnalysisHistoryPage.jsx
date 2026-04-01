// src/pages/analyzer/AnalysisHistoryPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Icons - Fixed imports (removed FaWifiSlash)
import {
    FaHistory, FaFileAlt, FaTrash, FaEye, FaDownload, FaShareAlt,
    FaSearch, FaFilter, FaSort, FaCalendarAlt, FaChartLine,
    FaChevronLeft, FaChevronRight, FaTimes, FaCheck, FaExclamationTriangle,
    FaClock, FaUser, FaBriefcase, FaStar, FaRegStar, FaSortAmountDown,
    FaSortAmountUp, FaFilePdf, FaPrint, FaCopy, FaExternalLinkAlt,
    FaChartBar, FaBrain, FaMicrochip, FaWifi
} from 'react-icons/fa';

// Components
import AIAnalysisReport from './AIAnalysisReport';

const AnalysisHistoryPage = () => {
    const navigate = useNavigate();

    // State
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid, list, detail
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // date, score, title
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [scoreFilter, setScoreFilter] = useState('all'); // all, high, medium, low
    const [showFilters, setShowFilters] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        uniqueJobs: 0
    });

    // Load reports from localStorage
    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = () => {
        setIsLoading(true);
        try {
            const saved = localStorage.getItem('aiAnalysisHistory');
            if (saved) {
                const parsed = JSON.parse(saved);
                setReports(parsed);
                setFilteredReports(parsed);
                calculateStats(parsed);
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            toast.error('Failed to load analysis history');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (reportsData) => {
        if (reportsData.length === 0) {
            setStats({
                total: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                uniqueJobs: 0
            });
            return;
        }

        const scores = reportsData.map(r => r.overallScore || 0);
        const uniqueJobs = new Set(reportsData.map(r => r.jobTitle)).size;

        setStats({
            total: reportsData.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            uniqueJobs
        });
    };

    // Filter and sort reports
    useEffect(() => {
        let filtered = [...reports];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(report =>
                report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            filtered = filtered.filter(report => {
                const reportDate = new Date(report.timestamp);
                switch (dateFilter) {
                    case 'today':
                        return reportDate >= today;
                    case 'week':
                        return reportDate >= weekAgo;
                    case 'month':
                        return reportDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Apply score filter
        if (scoreFilter !== 'all') {
            filtered = filtered.filter(report => {
                const score = report.overallScore || 0;
                switch (scoreFilter) {
                    case 'high':
                        return score >= 80;
                    case 'medium':
                        return score >= 60 && score < 80;
                    case 'low':
                        return score < 60;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(b.timestamp) - new Date(a.timestamp);
                    break;
                case 'score':
                    comparison = (b.overallScore || 0) - (a.overallScore || 0);
                    break;
                case 'title':
                    comparison = (a.title || '').localeCompare(b.title || '');
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'desc' ? comparison : -comparison;
        });

        setFilteredReports(filtered);
    }, [reports, searchQuery, dateFilter, scoreFilter, sortBy, sortOrder]);

    // Handlers
    const handleViewReport = (report) => {
        setSelectedReport(report);
        setViewMode('detail');
    };

    const handleDeleteReport = (id) => {
        if (window.confirm('Are you sure you want to delete this analysis report?')) {
            const updated = reports.filter(r => r.id !== id);
            setReports(updated);
            localStorage.setItem('aiAnalysisHistory', JSON.stringify(updated));
            calculateStats(updated);
            toast.success('Report deleted');

            if (selectedReport?.id === id) {
                setSelectedReport(null);
                setViewMode('grid');
            }
        }
    };

    const handleDeleteSelected = () => {
        if (selectedReports.length === 0) return;

        if (window.confirm(`Delete ${selectedReports.length} selected reports?`)) {
            const updated = reports.filter(r => !selectedReports.includes(r.id));
            setReports(updated);
            localStorage.setItem('aiAnalysisHistory', JSON.stringify(updated));
            setSelectedReports([]);
            calculateStats(updated);
            toast.success(`${selectedReports.length} reports deleted`);
        }
    };

    const handleSelectReport = (id) => {
        setSelectedReports(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedReports.length === filteredReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(filteredReports.map(r => r.id));
        }
    };

    const handleExportReport = (report) => {
        try {
            const reportContent = `
AI RESUME ANALYSIS REPORT
========================

Title: ${report.title || 'Analysis Report'}
Date: ${new Date(report.timestamp).toLocaleString()}
Job Title: ${report.jobTitle || 'Not Specified'}

OVERALL SCORE: ${report.overallScore || 0}%

===== JOB DESCRIPTION =====
${report.jobDescription || 'No job description available'}

===== ANALYSIS RESULTS =====
${JSON.stringify(report.analysis, null, 2)}

Generated by AI Resume Analyzer
`;

            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
            element.setAttribute('download', `analysis_${report.id}.txt`);
            element.click();
            toast.success('Report exported');
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const handleExportAll = () => {
        try {
            const reportsContent = reports.map(report => `
========================================
Report ID: ${report.id}
Date: ${new Date(report.timestamp).toLocaleString()}
Title: ${report.title}
Job: ${report.jobTitle}
Score: ${report.overallScore}%
========================================
`).join('\n');

            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportsContent));
            element.setAttribute('download', `all_analyses_${new Date().getTime()}.txt`);
            element.click();
            toast.success('All reports exported');
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const handleCompareSelected = () => {
        if (selectedReports.length < 2) {
            toast.error('Select at least 2 reports to compare');
            return;
        }

        const selected = reports.filter(r => selectedReports.includes(r.id));
        // Navigate to comparison view or open modal
        toast.success(`Comparing ${selected.length} reports`);
        // Implement comparison logic here
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

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (viewMode === 'detail' && selectedReport) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => {
                            setSelectedReport(null);
                            setViewMode('grid');
                        }}
                        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        <FaChevronLeft /> Back to History
                    </button>
                    <AIAnalysisReport
                        analysis={selectedReport}
                        onBack={() => {
                            setSelectedReport(null);
                            setViewMode('grid');
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/analyzer')}
                                className="p-3 hover:bg-white/20 rounded-xl transition-all"
                            >
                                <FaChevronLeft className="text-xl" />
                            </button>
                            <div>
                                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                    <FaHistory /> Analysis History
                                </h1>
                                <p className="text-blue-100">
                                    View and manage all your AI resume analyses
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                                <div className="text-3xl font-bold">{stats.total}</div>
                                <div className="text-sm text-blue-200">Total Reports</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Reports</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.highestScore}%</div>
                        <div className="text-sm text-gray-600">Highest Score</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.lowestScore}%</div>
                        <div className="text-sm text-gray-600">Lowest Score</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{stats.uniqueJobs}</div>
                        <div className="text-sm text-gray-600">Unique Jobs</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, job, or filename..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 rounded-xl border-2 font-semibold flex items-center gap-2 transition-all ${showFilters ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <FaFilter /> Filters
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="score">Sort by Score</option>
                                <option value="title">Sort by Title</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                            >
                                {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-gray-200"
                            >
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date Range
                                        </label>
                                        <select
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">Last 7 Days</option>
                                            <option value="month">Last 30 Days</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Score Range
                                        </label>
                                        <select
                                            value={scoreFilter}
                                            onChange={(e) => setScoreFilter(e.target.value)}
                                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500"
                                        >
                                            <option value="all">All Scores</option>
                                            <option value="high">High (80%+)</option>
                                            <option value="medium">Medium (60-79%)</option>
                                            <option value="low">Low (Below 60%)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setDateFilter('all');
                                                setScoreFilter('all');
                                                setSortBy('date');
                                                setSortOrder('desc');
                                            }}
                                            className="px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bulk Actions */}
                {selectedReports.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSelectAll}
                                className="w-6 h-6 border-2 border-blue-600 rounded flex items-center justify-center"
                            >
                                {selectedReports.length === filteredReports.length && (
                                    <FaCheck className="text-blue-600 text-sm" />
                                )}
                            </button>
                            <span className="font-semibold text-gray-900">
                                {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCompareSelected}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <FaChartBar /> Compare
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Reports Grid/List View */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <FaBrain className="animate-pulse text-5xl text-blue-600 mb-4" />
                        <span className="text-lg text-gray-600">Loading reports...</span>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                        <FaHistory className="text-7xl text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reports Found</h3>
                        <p className="text-gray-600 mb-8">
                            {searchQuery || dateFilter !== 'all' || scoreFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Start analyzing resumes to see reports here'}
                        </p>
                        <button
                            onClick={() => navigate('/analyzer')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                        >
                            Go to Analyzer
                        </button>
                    </div>
                ) : (
                    <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                        {filteredReports.map((report) => (
                            <motion.div
                                key={report.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group relative"
                            >
                                {/* Selection Checkbox */}
                                <div className="absolute top-4 left-4 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectReport(report.id);
                                        }}
                                        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${selectedReports.includes(report.id)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 hover:border-blue-600 bg-white'
                                            }`}
                                    >
                                        {selectedReports.includes(report.id) && (
                                            <FaCheck className="text-white text-sm" />
                                        )}
                                    </button>
                                </div>

                                {/* Score Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold z-10 ${getScoreBg(report.overallScore || 0)} ${getScoreColor(report.overallScore || 0)}`}>
                                    {report.overallScore || 0}%
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-16">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${getScoreBg(report.overallScore || 0)}`}>
                                            <FaFileAlt className={`text-xl ${getScoreColor(report.overallScore || 0)}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                                {report.title || 'Untitled Analysis'}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <FaBriefcase className="flex-shrink-0" />
                                                <span className="truncate">{report.jobTitle || 'Unknown Job'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <FaClock /> Date
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatDate(report.timestamp)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <FaChartLine /> Score
                                            </span>
                                            <span className={`font-bold ${getScoreColor(report.overallScore || 0)}`}>
                                                {report.overallScore || 0}%
                                            </span>
                                        </div>
                                        {report.fileName && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 flex items-center gap-2">
                                                    <FaFileAlt /> File
                                                </span>
                                                <span className="font-medium text-gray-900 truncate max-w-[150px]">
                                                    {report.fileName}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewReport(report)}
                                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                                        >
                                            <FaEye /> View
                                        </button>
                                        <button
                                            onClick={() => handleExportReport(report)}
                                            className="p-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
                                            title="Export"
                                        >
                                            <FaDownload />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReport(report.id)}
                                            className="p-2.5 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="h-1 w-full bg-gray-200">
                                    <div
                                        className={`h-1 ${getScoreBg(report.overallScore || 0)}`}
                                        style={{ width: `${report.overallScore || 0}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {filteredReports.length > 0 && (
                    <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg p-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{filteredReports.length}</span> of{' '}
                            <span className="font-semibold">{reports.length}</span> reports
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisHistoryPage;