// src/components/section/CompletionOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Award, Target, Clock, Users, Briefcase,
    GraduationCap, Code, Globe, FileText, Star, Zap,
    TrendingUp, BarChart, PieChart, Layers
} from 'lucide-react';
import CompletionBadge from './CompletionBadge';

const CompletionOverview = ({
    resumeData = {},
    stats = {},
    achievements = [],
    onViewResume = () => { }
}) => {
    const defaultStats = {
        atsScore: 94,
        completeness: 100,
        readability: 88,
        impact: 92,
        sections: 8,
        completedSections: 8,
        words: 1247,
        bulletPoints: 48
    };

    const finalStats = { ...defaultStats, ...stats };

    const sections = [
        { name: 'Personal Info', icon: Users, completed: true, color: 'blue' },
        { name: 'Professional Summary', icon: FileText, completed: true, color: 'green' },
        { name: 'Work Experience', icon: Briefcase, completed: true, color: 'purple' },
        { name: 'Education', icon: GraduationCap, completed: true, color: 'amber' },
        { name: 'Skills', icon: Code, completed: true, color: 'red' },
        { name: 'Projects', icon: Star, completed: true, color: 'indigo' },
        { name: 'Certifications', icon: Award, completed: true, color: 'pink' },
        { name: 'Languages', icon: Globe, completed: true, color: 'teal' }
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
                    <h2 className="text-2xl font-bold text-gray-900">Resume Overview</h2>
                    <p className="text-gray-600 mt-1">Your resume is complete and ready to impress!</p>
                </div>
                <CompletionBadge type="gold" size="md" score={finalStats.atsScore} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'ATS Score', value: `${finalStats.atsScore}%`, icon: Target, color: 'green' },
                    { label: 'Readability', value: `${finalStats.readability}%`, icon: BarChart, color: 'blue' },
                    { label: 'Impact Score', value: `${finalStats.impact}%`, icon: Zap, color: 'purple' },
                    { label: 'Completeness', value: `${finalStats.completeness}%`, icon: PieChart, color: 'amber' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                            <span className="text-xs text-gray-500">{stat.label}</span>
                        </div>
                        <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: stat.value }}
                                className={`h-1.5 rounded-full bg-${stat.color}-600`}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Section Progress */}
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Section Completion</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                            <div className={`w-8 h-8 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                                <section.icon className={`w-4 h-4 text-${section.color}-600`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{section.name}</p>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600">Complete</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Content Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Words', value: finalStats.words, icon: FileText, color: 'blue' },
                    { label: 'Bullet Points', value: finalStats.bulletPoints, icon: Layers, color: 'green' },
                    { label: 'Sections', value: finalStats.completedSections, icon: CheckCircle, color: 'purple' },
                    { label: 'Achievements', value: achievements.length, icon: Award, color: 'amber' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                        <div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </motion.div>
                ))}
            </div>

            {/* View Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewResume}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-all"
            >
                View Complete Resume
            </motion.button>
        </motion.div>
    );
};

export default React.memo(CompletionOverview);