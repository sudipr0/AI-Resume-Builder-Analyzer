// src/components/modals/AnalyzerModal.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Upload,
    FileText,
    Loader,
    CheckCircle,
    AlertCircle,
    Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AnalyzerModal = ({ isOpen, onClose, onAnalyze }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Please upload a PDF file');
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileChange({ target: { files: droppedFiles } });
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setLoading(true);
        try {
            // Call the analyze function passed as prop
            const analysisResult = await onAnalyze(file);
            setResult(analysisResult);
            toast.success('Analysis complete!');
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setLoading(false);
        onClose();
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: { duration: 0.2 },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        variants={modalVariants}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Analyze Resume
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {!result ? (
                                <>
                                    {/* Upload Area */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    Drag and drop your resume
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    or click to browse
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PDF up to 5MB
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Selected File */}
                                    {file && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                                        >
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-blue-900 dark:text-blue-100 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                                            >
                                                <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Features */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            What we'll analyze:
                                        </h3>
                                        <ul className="space-y-2 text-sm">
                                            {[
                                                { title: 'ATS Score', desc: 'Optimize for applicant tracking systems' },
                                                { title: 'Keywords', desc: 'Match job descriptions' },
                                                { title: 'Format', desc: 'Check structure and readability' },
                                                { title: 'Suggestions', desc: 'Personalized improvement tips' },
                                            ].map((item) => (
                                                <li key={item.title} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {item.title}
                                                        </span>
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {' '}— {item.desc}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAnalyze}
                                        disabled={!file || loading}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                {file ? 'Analyze Now' : 'Select File to Start'}
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            ) : (
                                // Results View
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="font-semibold text-green-900 dark:text-green-100">
                                                Analysis Complete!
                                            </p>
                                            <p className="text-sm text-green-700 dark:text-green-200">
                                                Your resume has been analyzed
                                            </p>
                                        </div>
                                    </div>

                                    {/* Score Display */}
                                    {result.atsScore && (
                                        <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                ATS Score
                                            </p>
                                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                {result.atsScore}%
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {result.atsScore >= 75
                                                    ? 'Excellent! Ready for top opportunities'
                                                    : result.atsScore >= 50
                                                        ? 'Good! Consider the suggestions below'
                                                        : 'Review suggestions for improvement'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {result.keywords && (
                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Keywords Found
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {result.keywords.length}
                                                </p>
                                            </div>
                                        )}
                                        {result.suggestions && (
                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Suggestions
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {result.suggestions.length}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                // Navigate to full analyzer page with results
                                                window.location.href = '/analyzer';
                                            }}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all"
                                        >
                                            View Full Report
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleClose}
                                            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                        >
                                            Done
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnalyzerModal;
