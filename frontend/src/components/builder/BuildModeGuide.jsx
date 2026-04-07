// src/components/builder/BuildModeGuide.jsx - MODE-SPECIFIC GUIDANCE
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Zap, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const BuildModeGuide = ({ mode, isVisible, onClose, jobDescription }) => {
    const guides = {
        magic: {
            title: '✨ Magic Build Mode',
            description: 'AI-powered resume building in 60 seconds',
            tips: [
                'AI is analyzing your job description to identify key requirements',
                'Complete each section - AI will provide suggestions',
                'Review and customize AI suggestions to match your experience',
                'Your ATS score updates in real-time'
            ],
            color: 'from-blue-600 to-cyan-600',
            icon: Sparkles,
            features: [
                { label: 'Job Description Provided', value: jobDescription ? '✓' : '✗', active: !!jobDescription },
                { label: 'AI Suggestions Enabled', value: '✓', active: true },
                { label: 'Real-time ATS Scoring', value: '✓', active: true },
                { label: 'Time to Complete', value: '~5-10 min', active: true }
            ]
        },
        quick: {
            title: '📝 Quick Build Mode',
            description: 'Guided builder with AI assistance',
            tips: [
                'Follow the step-by-step wizard through each section',
                'AI will provide suggestions based on your input',
                'You have full control over every field',
                'Optionally add job description for better suggestions'
            ],
            color: 'from-emerald-600 to-teal-600',
            icon: FileText,
            features: [
                { label: 'Guided Wizard', value: '✓', active: true },
                { label: 'AI Suggestions', value: '✓', active: true },
                { label: 'Full Customization', value: '✓', active: true },
                { label: 'Time to Complete', value: '~10-20 min', active: true }
            ]
        },
        pro: {
            title: '⚡ Pro Build Mode',
            description: 'Upload & upgrade your existing resume',
            tips: [
                'AI will extract information from your uploaded resume',
                'Review extracted data and make corrections',
                'AI will enhance each section automatically',
                'Customize as needed before saving'
            ],
            color: 'from-purple-600 to-pink-600',
            icon: Zap,
            features: [
                { label: 'Resume Upload', value: '✓', active: true },
                { label: 'AI Extraction', value: '✓', active: true },
                { label: 'Auto Enhancement', value: '✓', active: true },
                { label: 'Time to Complete', value: '~5-15 min', active: true }
            ]
        },
        blank: {
            title: '📄 Blank Template',
            description: 'Full manual control from scratch',
            tips: [
                'Start with a completely blank resume',
                'Add sections as you need them using the "+" button',
                'Fill in your information manually',
                'No AI assistance - fully customizable'
            ],
            color: 'from-orange-600 to-red-600',
            icon: FileText,
            features: [
                { label: 'Blank Starting Point', value: '✓', active: true },
                { label: 'Manual Entry', value: '✓', active: true },
                { label: 'Full Flexibility', value: '✓', active: true },
                { label: 'Time to Complete', value: '~20-30 min', active: true }
            ]
        }
    };

    const guide = guides[mode];
    if (!guide) return null;

    const IconComponent = guide.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed bottom-6 right-6 w-full max-w-md max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40"
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${guide.color} p-4 flex items-start justify-between gap-3 text-white`}>
                        <div className="flex items-start gap-3">
                            <div className={`p-2 bg-white/20 rounded-lg`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{guide.title}</h3>
                                <p className="text-xs text-white/80">{guide.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Features */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Mode Features</p>
                            <div className="grid grid-cols-2 gap-2">
                                {guide.features.map((feature, i) => (
                                    <div key={i} className={`p-2 rounded-lg border ${feature.active
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{feature.label}</p>
                                        <p className={`text-sm font-semibold ${feature.active ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                            {feature.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Tips</p>
                            <div className="space-y-2">
                                {guide.tips.map((tip, i) => (
                                    <div key={i} className="flex gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-700 dark:text-gray-300">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                You can change sections, skip steps, or customize everything. Click the help icon in the sidebar to show this guide again.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BuildModeGuide;
