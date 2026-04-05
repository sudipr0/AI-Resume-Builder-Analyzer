// src/components/builder/ResumeNameEditor.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ResumeNameEditor = ({ isOpen, onClose, currentName, onSave }) => {
    const [name, setName] = useState(currentName);
    const [error, setError] = useState('');

    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    const handleSave = () => {
        if (!name.trim()) {
            setError('Resume name cannot be empty');
            return;
        }
        if (name.trim().length > 50) {
            setError('Name must be less than 50 characters');
            return;
        }
        onSave(name);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Rename Resume</h2>
                                <p className="text-gray-500 text-sm mt-1">Give your resume a clear, professional name</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Senior Software Engineer - Google"
                                className={`w-full p-4 border rounded-2xl focus:ring-4 transition-all outline-none text-lg font-medium ${
                                    error 
                                    ? 'border-red-300 focus:ring-red-100' 
                                    : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-white rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResumeNameEditor;
