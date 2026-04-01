// src/components/section/CompletionProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Circle, Clock, Zap, Target,
    TrendingUp, Award, Star, Flag
} from 'lucide-react';

const CompletionProgress = ({
    sections = [],
    currentSection = 0,
    onSectionClick = () => { }
}) => {
    const defaultSections = [
        { id: 'personal', name: 'Personal Info', completed: true, active: false },
        { id: 'summary', name: 'Summary', completed: true, active: false },
        { id: 'experience', name: 'Experience', completed: true, active: false },
        { id: 'education', name: 'Education', completed: true, active: false },
        { id: 'skills', name: 'Skills', completed: true, active: false },
        { id: 'projects', name: 'Projects', completed: true, active: false },
        { id: 'certifications', name: 'Certifications', completed: false, active: true },
        { id: 'languages', name: 'Languages', completed: false, active: false }
    ];

    const finalSections = sections.length ? sections : defaultSections;
    const completedCount = finalSections.filter(s => s.completed).length;
    const totalCount = finalSections.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Completion Progress</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{completedCount}/{totalCount}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {percentage}%
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Started</span>
                    <span className="text-xs text-gray-500">In Progress</span>
                    <span className="text-xs text-gray-500">Complete</span>
                </div>
            </div>

            {/* Section List */}
            <div className="space-y-3">
                {finalSections.map((section, index) => (
                    <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSectionClick(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${section.active
                                ? 'bg-blue-50 border-2 border-blue-500'
                                : section.completed
                                    ? 'bg-gray-50 hover:bg-gray-100'
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        {/* Status Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.completed
                                ? 'bg-green-100'
                                : section.active
                                    ? 'bg-blue-100'
                                    : 'bg-gray-200'
                            }`}>
                            {section.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : section.active ? (
                                <Zap className="w-5 h-5 text-blue-600" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                            )}
                        </div>

                        {/* Section Info */}
                        <div className="flex-1 text-left">
                            <p className={`font-medium ${section.completed
                                    ? 'text-gray-900'
                                    : section.active
                                        ? 'text-blue-900'
                                        : 'text-gray-600'
                                }`}>
                                {section.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {section.completed
                                    ? 'Completed'
                                    : section.active
                                        ? 'In Progress'
                                        : 'Pending'}
                            </p>
                        </div>

                        {/* Score or Time */}
                        {section.completed && section.score && (
                            <div className="px-2 py-1 bg-green-100 rounded-lg">
                                <span className="text-xs font-medium text-green-700">{section.score}%</span>
                            </div>
                        )}
                        {section.active && (
                            <div className="flex items-center gap-1 text-blue-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium">Now</span>
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Milestone */}
            {percentage === 100 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200"
                >
                    <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-amber-600" />
                        <div>
                            <h4 className="font-semibold text-gray-900">Milestone Achieved!</h4>
                            <p className="text-sm text-gray-600">You've completed all sections. Ready for final review!</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default React.memo(CompletionProgress);