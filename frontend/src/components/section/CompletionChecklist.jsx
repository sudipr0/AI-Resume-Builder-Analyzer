// src/components/section/CompletionChecklist.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Circle, AlertCircle, Target,
    Award, Star, Zap, Clock, FileText, Users,
    Briefcase, GraduationCap, Code, Globe
} from 'lucide-react';

const CompletionChecklist = ({
    items = [],
    onToggleItem = () => { },
    onItemAction = () => { }
}) => {
    const defaultItems = [
        { id: 1, text: 'Add personal information', completed: true, category: 'personal', action: 'personal' },
        { id: 2, text: 'Write professional summary', completed: true, category: 'summary', action: 'summary' },
        { id: 3, text: 'Add work experience (at least 2 entries)', completed: true, category: 'experience', action: 'experience' },
        { id: 4, text: 'Add education details', completed: true, category: 'education', action: 'education' },
        { id: 5, text: 'Add technical skills (5-10 skills)', completed: true, category: 'skills', action: 'skills' },
        { id: 6, text: 'Add projects (2-3 projects)', completed: true, category: 'projects', action: 'projects' },
        { id: 7, text: 'Add certifications', completed: false, category: 'certifications', action: 'certifications' },
        { id: 8, text: 'Add languages', completed: false, category: 'languages', action: 'languages' },
        { id: 9, text: 'Include quantifiable achievements', completed: true, category: 'content', action: 'experience' },
        { id: 10, text: 'Check for spelling errors', completed: false, category: 'review', action: 'review' },
        { id: 11, text: 'Run ATS compatibility check', completed: false, category: 'review', action: 'review' },
        { id: 12, text: 'Review formatting consistency', completed: false, category: 'review', action: 'review' }
    ];

    const finalItems = items.length ? items : defaultItems;
    const completedCount = finalItems.filter(i => i.completed).length;
    const totalCount = finalItems.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    const categories = [
        { id: 'personal', name: 'Personal Info', icon: Users, color: 'blue' },
        { id: 'summary', name: 'Summary', icon: FileText, color: 'green' },
        { id: 'experience', name: 'Experience', icon: Briefcase, color: 'purple' },
        { id: 'education', name: 'Education', icon: GraduationCap, color: 'amber' },
        { id: 'skills', name: 'Skills', icon: Code, color: 'red' },
        { id: 'projects', name: 'Projects', icon: Star, color: 'indigo' },
        { id: 'certifications', name: 'Certifications', icon: Award, color: 'pink' },
        { id: 'languages', name: 'Languages', icon: Globe, color: 'teal' },
        { id: 'content', name: 'Content', icon: FileText, color: 'orange' },
        { id: 'review', name: 'Review', icon: Target, color: 'cyan' }
    ];

    const getCategoryColor = (categoryId) => {
        return categories.find(c => c.id === categoryId)?.color || 'gray';
    };

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.icon || CheckCircle;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Completion Checklist</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{completedCount}/{totalCount}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-2 bg-green-600 rounded-full"
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {finalItems.map((item, index) => {
                    const CategoryIcon = getCategoryIcon(item.category);
                    const color = getCategoryColor(item.category);

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.completed ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => onToggleItem(item.id)}
                                className="flex-shrink-0"
                            >
                                {item.completed ? (
                                    <CheckCircle className={`w-5 h-5 text-${color}-600`} />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                                )}
                            </button>

                            {/* Content */}
                            <div className="flex-1">
                                <p className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {item.text}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`px-2 py-0.5 bg-${color}-100 rounded-full`}>
                                        <span className={`text-xs text-${color}-700`}>
                                            {categories.find(c => c.id === item.category)?.name || item.category}
                                        </span>
                                    </div>
                                    {!item.completed && item.action && (
                                        <button
                                            onClick={() => onItemAction(item.action)}
                                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Zap className="w-3 h-3" />
                                            Go to section
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Urgency Indicator */}
                            {!item.completed && item.urgent && (
                                <div className="flex items-center gap-1 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-xs">Required</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next milestone:</span>
                    <span className="text-sm font-medium text-gray-900">
                        {completedCount < 5 ? 'Complete basic info' :
                            completedCount < 8 ? 'Add achievements' :
                                completedCount < 11 ? 'Run reviews' : 'Finalize resume'}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                        className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(CompletionChecklist);