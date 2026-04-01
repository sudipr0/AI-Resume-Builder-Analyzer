// src/pages/analyzer/KeywordAnalysis.jsx
import React from 'react';
import { FaSearch, FaCheckCircle, FaTimes } from 'react-icons/fa';

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
};

const KeywordAnalysis = ({ keywords, matchPercentage, matchedKeywords, missingKeywords }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaSearch className="text-blue-600" />
                Keyword Analysis
            </h3>

            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Percentage</span>
                    <span className={`text-lg font-bold ${getScoreColor(matchPercentage)}`}>
                        {matchPercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full ${matchPercentage >= 80 ? 'bg-green-500' :
                                matchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${matchPercentage}%` }}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        Matched Keywords ({matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaTimes className="text-red-500" />
                        Missing Keywords ({missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {missingKeywords.map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {keywords && keywords.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Extracted Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {keywords.slice(0, 15).map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeywordAnalysis;