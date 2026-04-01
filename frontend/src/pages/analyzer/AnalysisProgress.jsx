// src/pages/analyzer/AnalysisProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    FaSearch, FaBrain, FaCode, FaChartBar, FaLightbulb,
    FaCheckCircle, FaSpinner
} from 'react-icons/fa';

const AnalysisProgress = ({ progress, stage, status }) => {
    const stages = [
        { id: 'extracting', label: 'Extracting Keywords', icon: FaSearch },
        { id: 'analyzing', label: 'Analyzing Content', icon: FaBrain },
        { id: 'matching', label: 'Matching Skills', icon: FaCode },
        { id: 'scoring', label: 'Calculating ATS Score', icon: FaChartBar },
        { id: 'suggesting', label: 'Generating Suggestions', icon: FaLightbulb }
    ];

    const currentIndex = stages.findIndex(s => s.id === stage);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaBrain className="text-blue-600" />
                AI Analysis in Progress
            </h3>

            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm font-medium text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {stages.map((s, index) => {
                    const Icon = s.icon;
                    const isComplete = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-100' : isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                <Icon className={`text-sm ${isComplete ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                            </div>
                            <span className={`flex-1 ${isComplete ? 'text-gray-900 font-medium' :
                                    isCurrent ? 'text-blue-600 font-medium' : 'text-gray-400'
                                }`}>
                                {s.label}
                            </span>
                            {isComplete && <FaCheckCircle className="text-green-500" />}
                            {isCurrent && <FaSpinner className="animate-spin text-blue-500" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalysisProgress;