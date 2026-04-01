// src/pages/analyzer/ImprovementSuggestions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

const ImprovementSuggestions = ({ suggestions }) => {
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                <FaLightbulb className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Suggestions Available</h3>
                <p className="text-gray-600">Our AI couldn't generate any suggestions for this resume.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaLightbulb className="text-yellow-500" />
                AI-Powered Suggestions
            </h3>

            <div className="space-y-4">
                {suggestions.map((suggestion, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border-2 ${getPriorityColor(suggestion.priority)}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold">{suggestion.category || 'Improvement'}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${suggestion.priority?.toLowerCase() === 'high' ? 'bg-red-200 text-red-800' :
                                        suggestion.priority?.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-green-200 text-green-800'
                                        }`}>
                                        {(suggestion.priority || 'MEDIUM').toUpperCase()} PRIORITY
                                    </span>
                                </div>
                                <p className="text-gray-800 mb-2">{suggestion.suggestion || suggestion.title}</p>
                                {suggestion.impact && (
                                    <p className="text-sm opacity-75">{suggestion.impact}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ImprovementSuggestions;