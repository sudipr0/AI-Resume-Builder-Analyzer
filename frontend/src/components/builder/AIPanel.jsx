// src/components/builder/AIPanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, 
    X, 
    Sparkles, 
    TrendingUp, 
    Lightbulb, 
    FileText, 
    Wand2, 
    Eye 
} from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const AIPanel = ({ 
    isOpen, 
    onClose, 
    jobDescription, 
    setJobDescription, 
    handleAIAnalysis,
    handleGenerateSummary, 
    handleOptimizeSection, 
    isAnalyzing, 
    allAiSuggestions,
    aiScore, 
    currentResume 
}) => {

    const quickActions = [
        { icon: FileText, label: 'Generate Summary', desc: 'AI-powered professional summary', action: handleGenerateSummary, color: 'from-green-500 to-emerald-500' },
        { icon: Sparkles, label: 'Optimize Skills', desc: 'Match job requirements', action: () => handleOptimizeSection('skills'), color: 'from-blue-500 to-cyan-500' },
        { icon: Wand2, label: 'Improve Experience', desc: 'Enhance bullet points', action: () => handleOptimizeSection('experience'), color: 'from-purple-500 to-pink-500' },
        { icon: Eye, label: 'Live Preview', desc: 'Edit with real-time preview', action: () => { onClose(); }, color: 'from-gray-500 to-slate-500' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 sm:p-8">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                                        <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">AI Resume Assistant</h2>
                                        <p className="text-purple-100 text-sm sm:text-lg mt-1">Get personalized suggestions and improvements</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-purple-200 p-2 hover:bg-white/10 rounded-2xl"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[60vh]">
                            {/* Job Description Input */}
                            <div className="mb-6 sm:mb-8">
                                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-3">
                                    Job Description (for targeted suggestions)
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description you're applying for..."
                                    className="w-full h-32 p-4 border border-gray-300/50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                />
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        {jobDescription.length} characters
                                    </span>
                                    <motion.button
                                        onClick={handleAIAnalysis}
                                        disabled={!jobDescription.trim() || isAnalyzing}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span className="hidden sm:inline">Analyzing...</span>
                                                <span className="sm:hidden">Analyzing</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="hidden sm:inline">Analyze Resume</span>
                                                <span className="sm:hidden">Analyze</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            {allAiSuggestions && allAiSuggestions.length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-4 sm:mb-6">AI Suggestions</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        {allAiSuggestions.slice(0, 5).map((suggestion, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-lg border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                                            >
                                                <div className="flex items-start gap-3 sm:gap-4">
                                                    <div className="flex-shrink-0">
                                                        {suggestion.type === 'improvement' ? (
                                                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                                        ) : (
                                                            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">{suggestion.title}</h4>
                                                        <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">{suggestion.message}</p>
                                                        <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                                                            <span className="px-2 py-1 bg-blue-100/50 text-blue-700 text-xs sm:text-sm rounded-full">
                                                                {suggestion.section}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-gray-500">
                                                                Priority: {suggestion.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-4 sm:mb-6">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {quickActions.map((action, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => {
                                                action.action();
                                                if (idx !== 3) onClose();
                                            }}
                                            disabled={!currentResume || isAnalyzing}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`p-4 bg-gradient-to-r ${action.color}/10 border border-blue-200/50 rounded-xl sm:rounded-2xl hover:bg-white flex items-center gap-3 sm:gap-4 disabled:opacity-50`}
                                        >
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${action.color} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                                                <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-gray-900 text-sm sm:text-base">{action.label}</div>
                                                <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{action.desc}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 backdrop-blur-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-gray-700 font-medium text-sm sm:text-base">AI Score:</span>
                                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-800 font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base">
                                        {aiScore}/100
                                    </span>
                                </div>
                                <motion.button
                                    onClick={() => {
                                        onClose();
                                        handleAIAnalysis();
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                                >
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Re-analyze
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIPanel;
