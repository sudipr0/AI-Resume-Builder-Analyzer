// src/components/builder/ExportManager.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const ExportManager = ({ isOpen, onClose, resumeData, onExportComplete }) => {
    const [exportFormat, setExportFormat] = useState('pdf');
    const [includeAtsReport, setIncludeAtsReport] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportQuality, setExportQuality] = useState('high');

    const handleExport = async () => {
        setIsExporting(true);
        // Simulate export logic (actual logic will use apiService.resume.exportResume)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsExporting(false);
        if (onExportComplete) onExportComplete();
    };

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
                        className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Export Resume</h2>
                                    <p className="text-gray-600 mt-1 text-sm">Download your resume in various formats</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Format Selection */}
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Format</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {['pdf', 'docx', 'txt'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setExportFormat(format)}
                                            className={`p-3 border rounded-2xl text-center transition-all ${
                                                exportFormat === format
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="font-bold uppercase text-xs">{format}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality */}
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Quality</h3>
                                <div className="space-y-2">
                                    {['high', 'medium', 'low'].map((quality) => (
                                        <label
                                            key={quality}
                                            className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all ${
                                                exportQuality === quality
                                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500'
                                                : 'bg-white border-gray-200 hover:border-blue-200'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="quality"
                                                checked={exportQuality === quality}
                                                onChange={() => setExportQuality(quality)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="ml-3 font-medium capitalize text-sm">{quality} Quality</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200/50">
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 disabled:opacity-50 transition-all hover:scale-[1.02]"
                            >
                                {isExporting ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span>Download Resume</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportManager;
