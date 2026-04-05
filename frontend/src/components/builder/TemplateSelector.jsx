// src/components/builder/TemplateSelector.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layout, Check } from 'lucide-react';

const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional design', category: 'Professional' },
    { id: 'classic', name: 'Classic', description: 'Traditional resume format', category: 'Traditional' },
    { id: 'creative', name: 'Creative', description: 'Unique and eye-catching', category: 'Creative' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant', category: 'Minimal' },
    { id: 'executive', name: 'Executive', description: 'Senior-level presentation', category: 'Professional' },
    { id: 'ats', name: 'ATS-Friendly', description: 'Optimized for applicant tracking systems', category: 'Professional' },
];

const TemplateSelector = ({ isOpen, onClose, currentTemplate, onTemplateSelect }) => {
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
                        className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] border border-white/20 overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
                                <p className="text-gray-600 mt-1">Select a design for your professional resume</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className={`relative overflow-hidden rounded-2xl cursor-pointer group border-2 transition-all ${
                                            currentTemplate === template.id 
                                            ? 'border-blue-500 ring-4 ring-blue-500/10' 
                                            : 'border-white hover:border-blue-300 shadow-sm'
                                        }`}
                                        onClick={() => onTemplateSelect(template.id)}
                                    >
                                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                                            <div className="text-center">
                                                <Layout className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                                                    currentTemplate === template.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'
                                                }`} />
                                                <span className={`font-bold transition-colors ${
                                                    currentTemplate === template.id ? 'text-blue-600' : 'text-gray-500'
                                                }`}>{template.name}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-gray-900">{template.name}</h3>
                                                {currentTemplate === template.id && (
                                                    <div className="bg-blue-500 text-white p-1 rounded-full">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs line-clamp-2">{template.description}</p>
                                            <div className="mt-3">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                    {template.category}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200/50 p-6 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-bold"
                            >
                                Apply Template
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TemplateSelector;
