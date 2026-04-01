// src/components/section/CompletionTips.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb, Award, Target, Zap, TrendingUp,
    Users, Briefcase, GraduationCap, Code, Globe,
    FileText, Star, Heart, ThumbsUp, MessageSquare,
    CheckCircle, X, ChevronRight, ChevronLeft,
    Sparkles, Rocket, Crown, Diamond, Flame
} from 'lucide-react';

const CompletionTips = ({
    tips = [],
    onTipAction = () => { },
    currentSection = 'overview'
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dismissedTips, setDismissedTips] = useState([]);

    const defaultTips = [
        {
            id: 1,
            title: 'Quantify Your Achievements',
            content: 'Use numbers and percentages to make your accomplishments stand out. "Increased sales by 40%" is more impactful than "Increased sales significantly".',
            category: 'experience',
            icon: TrendingUp,
            color: 'green',
            action: 'experience',
            priority: 'high'
        },
        {
            id: 2,
            title: 'ATS Keywords Matter',
            content: 'Include industry-specific keywords from job descriptions to improve your ATS score. Research common terms in your target roles.',
            category: 'ats',
            icon: Target,
            color: 'blue',
            action: 'review',
            priority: 'high'
        },
        {
            id: 3,
            title: 'Keep It Concise',
            content: 'Recruiters spend an average of 6-8 seconds scanning a resume. Keep your resume to 1-2 pages and use bullet points for readability.',
            category: 'formatting',
            icon: FileText,
            color: 'purple',
            priority: 'medium'
        },
        {
            id: 4,
            title: 'Showcase Technical Skills',
            content: 'List technical skills prominently and consider grouping them by proficiency level. Include both hard skills and relevant soft skills.',
            category: 'skills',
            icon: Code,
            color: 'red',
            action: 'skills',
            priority: 'high'
        },
        {
            id: 5,
            title: 'Tailor for Each Application',
            content: 'Customize your resume for each job application by highlighting relevant experience and mirroring keywords from the job description.',
            category: 'general',
            icon: Rocket,
            color: 'amber',
            priority: 'medium'
        },
        {
            id: 6,
            title: 'Proofread Everything',
            content: 'Spelling and grammar errors can cost you the interview. Read your resume aloud, use spell check, and ask someone else to review it.',
            category: 'review',
            icon: CheckCircle,
            color: 'green',
            action: 'review',
            priority: 'high'
        },
        {
            id: 7,
            title: 'Include Action Verbs',
            content: 'Start bullet points with strong action verbs like "Led", "Developed", "Implemented", "Achieved" to make your experience more dynamic.',
            category: 'experience',
            icon: Zap,
            color: 'yellow',
            action: 'experience',
            priority: 'medium'
        },
        {
            id: 8,
            title: 'Highlight Certifications',
            content: 'Professional certifications demonstrate commitment to your field. List them prominently, especially if they are required for your target role.',
            category: 'certifications',
            icon: Award,
            color: 'purple',
            action: 'certifications',
            priority: 'medium'
        }
    ];

    const allTips = tips.length ? tips : defaultTips;

    // Filter tips based on current section
    const filteredTips = allTips.filter(tip =>
        currentSection === 'overview' || tip.category === currentSection
    ).filter(tip => !dismissedTips.includes(tip.id));

    const currentTip = filteredTips[currentIndex % filteredTips.length] || filteredTips[0];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredTips.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
    };

    const handleDismiss = (id) => {
        setDismissedTips([...dismissedTips, id]);
        if (filteredTips.length > 1) {
            handleNext();
        }
    };

    if (!filteredTips.length) return null;

    const Icon = currentTip.icon || Lightbulb;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900">Pro Tips</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                        {currentIndex + 1} of {filteredTips.length}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={handlePrev}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTip.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                >
                    {/* Priority Badge */}
                    {currentTip.priority === 'high' && (
                        <div className="absolute -top-2 -right-2">
                            <div className="px-2 py-1 bg-red-100 rounded-full text-xs font-medium text-red-700 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                High Priority
                            </div>
                        </div>
                    )}

                    {/* Tip Content */}
                    <div className={`p-5 rounded-xl bg-${currentTip.color || 'blue'}-50 border-2 border-${currentTip.color || 'blue'}-200`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 bg-${currentTip.color || 'blue'}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 text-${currentTip.color || 'blue'}-600`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{currentTip.title}</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">{currentTip.content}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 bg-${currentTip.color || 'blue'}-100 rounded-full text-xs font-medium text-${currentTip.color || 'blue'}-700`}>
                                {currentTip.category || 'General'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {currentTip.action && (
                                <button
                                    onClick={() => onTipAction(currentTip.action)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:opacity-90 transition-all"
                                >
                                    <Zap className="w-3 h-3" />
                                    Apply Now
                                </button>
                            )}
                            <button
                                onClick={() => handleDismiss(currentTip.id)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Dismiss"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-1 mt-4">
                {filteredTips.map((tip, i) => (
                    <button
                        key={tip.id}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === currentIndex
                                ? `w-6 bg-${currentTip.color || 'blue'}-600`
                                : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>💡 Tip of the day</span>
                    <span>✨ {filteredTips.length - dismissedTips.length} remaining</span>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(CompletionTips);