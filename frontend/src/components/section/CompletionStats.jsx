// src/components/section/CompletionStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, PieChart, TrendingUp, Users, Clock,
    Target, Award, Star, Zap, Eye, Download, Share2,
    CheckCircle, FileText, Briefcase, GraduationCap,
    Code, Globe, Heart, ThumbsUp, MessageSquare
} from 'lucide-react';

const CompletionStats = ({
    stats = {},
    achievements = [],
    showDetailed = true
}) => {
    const defaultStats = {
        atsScore: 94,
        readability: 88,
        impact: 92,
        completeness: 100,
        views: 156,
        downloads: 45,
        shares: 23,
        likes: 67,
        comments: 12,
        timeSpent: 45,
        words: 1247,
        characters: 8765,
        sections: 8,
        bulletPoints: 48,
        keywords: 156,
        achievements: 12
    };

    const finalStats = { ...defaultStats, ...stats };

    const scoreCards = [
        {
            label: 'ATS Score',
            value: finalStats.atsScore,
            icon: Target,
            color: 'green',
            description: 'Applicant Tracking System compatibility'
        },
        {
            label: 'Readability',
            value: finalStats.readability,
            icon: BarChart,
            color: 'blue',
            description: 'How easy your resume is to read'
        },
        {
            label: 'Impact Score',
            value: finalStats.impact,
            icon: Zap,
            color: 'purple',
            description: 'Strength of achievements and results'
        },
        {
            label: 'Completeness',
            value: finalStats.completeness,
            icon: CheckCircle,
            color: 'amber',
            description: 'Overall section completion'
        }
    ];

    const engagementCards = [
        { label: 'Profile Views', value: finalStats.views, icon: Eye, color: 'blue', trend: '+12%' },
        { label: 'Downloads', value: finalStats.downloads, icon: Download, color: 'green', trend: '+5%' },
        { label: 'Shares', value: finalStats.shares, icon: Share2, color: 'purple', trend: '+23%' },
        { label: 'Likes', value: finalStats.likes, icon: Heart, color: 'red', trend: '+8%' }
    ];

    const contentCards = [
        { label: 'Total Words', value: finalStats.words, icon: FileText, color: 'blue' },
        { label: 'Bullet Points', value: finalStats.bulletPoints, icon: Briefcase, color: 'green' },
        { label: 'Keywords', value: finalStats.keywords, icon: Target, color: 'purple' },
        { label: 'Achievements', value: finalStats.achievements, icon: Award, color: 'amber' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Resume Statistics</h2>
                    <p className="text-gray-600 mt-1">Detailed analytics and performance metrics</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-700">Updated just now</span>
                </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {scoreCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gray-50 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon className={`w-5 h-5 text-${card.color}-600`} />
                                <span className={`text-2xl font-bold text-${card.color}-600`}>{card.value}%</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{card.label}</p>
                            <p className="text-xs text-gray-500">{card.description}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${card.value}%` }}
                                    className={`h-1.5 rounded-full bg-${card.color}-600`}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Engagement Stats */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                    Engagement Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {engagementCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="bg-gray-50 rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-5 h-5 text-${card.color}-600`} />
                                    {card.trend && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {card.trend}
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-sm text-gray-600">{card.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Content Stats */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-700" />
                    Content Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contentCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="bg-gray-50 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 bg-${card.color}-100 rounded-lg flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 text-${card.color}-600`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                        <p className="text-sm text-gray-600">{card.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Additional Metrics */}
            {showDetailed && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Additional Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Time Spent', value: `${finalStats.timeSpent} min`, icon: Clock },
                            { label: 'Characters', value: finalStats.characters.toLocaleString(), icon: FileText },
                            { label: 'Sections', value: finalStats.sections, icon: PieChart },
                            { label: 'Avg. Section Length', value: `${Math.round(finalStats.words / finalStats.sections)} words`, icon: BarChart }
                        ].map((metric, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                                <metric.icon className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{metric.value}</p>
                                    <p className="text-xs text-gray-500">{metric.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievement Summary */}
            {achievements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                >
                    <h3 className="font-semibold text-gray-900 mb-3">Recent Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                        {achievements.slice(0, 5).map((ach, i) => (
                            <div key={i} className="px-3 py-1.5 bg-amber-100 rounded-full flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-600" />
                                <span className="text-xs text-amber-700">{ach}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default React.memo(CompletionStats);