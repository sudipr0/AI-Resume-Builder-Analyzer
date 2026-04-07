// src/components/NewResumeModal.jsx - ADVANCED RESUME CREATION MODAL
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, FileText, Zap, ArrowRight, Lightbulb,
  Upload, Clock, Wand2, Loader2, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const NewResumeModal = ({ isOpen, onClose, onSelectMode }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const modes = [
    {
      id: 'magic',
      title: '✨ MAGIC BUILD',
      subtitle: 'AI Creates Resume in 60 Seconds',
      description: 'Paste a job description and let our AI generate a complete, optimized resume instantly. Perfect for quick results.',
      time: '<60 seconds',
      best_for: '⚡ Fastest Way',
      icon: Sparkles,
      color: 'from-blue-600 to-cyan-600',
      features: [
        'Instant full resume generation',
        'AI-optimized for job description',
        '92% average ATS score',
        'One-click PDF download'
      ],
      requiresJd: true
    },
    {
      id: 'quick',
      title: '📝 QUICK BUILD',
      subtitle: 'AI Assists While You Build',
      description: 'Step-by-step guided builder with AI suggestions for every field. Full control with intelligent assistance.',
      time: '2-3 minutes',
      best_for: '🎯 Balanced Approach',
      icon: FileText,
      color: 'from-emerald-600 to-teal-600',
      features: [
        'Step-by-step guided builder',
        'AI suggestions for every field',
        'Real-time ATS scoring',
        'Full customization control'
      ],
      requiresJd: false
    },
    {
      id: 'pro',
      title: '⚡ PRO BUILD',
      subtitle: 'Upload & AI Upgrades',
      description: 'Upload your current resume and let AI extract, enhance, and optimize it automatically.',
      time: '1-2 minutes',
      best_for: '📤 Update Existing',
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Upload existing resume (PDF/DOC)',
        'AI extraction of all info',
        'Automatic AI enhancement',
        'Section-by-section improvement'
      ],
      requiresJd: false,
      requiresFile: true
    },
    {
      id: 'blank',
      title: '📄 BLANK TEMPLATE',
      subtitle: 'Start From Scratch',
      description: 'Full manual control. Build your resume from a blank template with complete flexibility.',
      time: '5-10 minutes',
      best_for: '🛠️ Full Control',
      icon: FileText,
      color: 'from-orange-600 to-red-600',
      features: [
        'Completely blank resume',
        'Add sections as you need',
        'No AI assistance',
        'Full manual customization'
      ],
      requiresJd: false
    }
  ];

  const handleModeSelect = async (mode) => {
    // Validation
    if (mode.requiresJd && !jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    if (mode.requiresFile && !uploadedFile) {
      toast.error('Please upload a resume file');
      return;
    }

    setIsSubmitting(true);
    try {
      // For pro mode with file, store file in sessionStorage as base64
      let fileData = null;
      if (uploadedFile) {
        const reader = new FileReader();
        fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve({
            data: reader.result,
            name: uploadedFile.name,
            type: uploadedFile.type
          });
          reader.onerror = reject;
          reader.readAsArrayBuffer(uploadedFile);
        });

        // Store file temporarily in sessionStorage
        sessionStorage.setItem('temp_resume_file', JSON.stringify({
          ...fileData,
          data: Array.from(new Uint8Array(fileData.data))
        }));
      }

      await onSelectMode(mode.id, {
        jobDescription: jobDescription.trim() || null,
        uploadedFile: uploadedFile ? { name: uploadedFile.name, type: uploadedFile.type } : null,
        hasFile: !!uploadedFile
      });
      onClose();
    } catch (error) {
      console.error('Error in mode selection:', error);
      toast.error(error.message || 'Failed to start builder');
      sessionStorage.removeItem('temp_resume_file');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMode = modes.find(m => m.id === selectedMode);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 max-w-7xl mx-auto text-white">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                  <Wand2 className="w-8 h-8 text-cyan-400" />
                  Create New Resume
                </h1>
                <p className="text-xl text-slate-300">
                  Choose how you want to build your AI-powered resume
                </p>
              </div>

              {/* Mode Not Selected - Show All Options */}
              {!selectedMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {modes.map((mode) => {
                    const IconComponent = mode.icon;
                    return (
                      <motion.button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left group ${selectedMode === mode.id
                          ? `border-blue-500 bg-gradient-to-br ${mode.color} bg-opacity-20 shadow-xl shadow-blue-500/20`
                          : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${mode.color} bg-opacity-20`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-lg font-bold mb-1">{mode.title}</h3>
                        <p className="text-blue-300 text-xs mb-2">{mode.subtitle}</p>

                        <div className="flex items-center gap-2 text-cyan-400 text-xs mb-3">
                          <Clock className="w-3 h-3" />
                          {mode.time}
                        </div>

                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                          {mode.description}
                        </p>

                        <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                          <span>{mode.best_for}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                /* Mode Selected - Show Detailed Form */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Back Button */}
                  <button
                    onClick={() => {
                      setSelectedMode(null);
                      setJobDescription('');
                      setUploadedFile(null);
                    }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    ← Back to all modes
                  </button>

                  {/* Selected Mode Display */}
                  <div className={`p-6 rounded-xl border-2 bg-gradient-to-br ${currentMode.color} bg-opacity-10 border-slate-600/50`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br ${currentMode.color} bg-opacity-20 flex-shrink-0`}>
                        {currentMode.icon && <currentMode.icon className="w-8 h-8 text-white" />}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-1">{currentMode.title}</h2>
                        <p className="text-slate-300 mb-4">{currentMode.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          {currentMode.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Description Input (for Magic Build) */}
                  {currentMode?.requiresJd && (
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-slate-200">
                        🔮 Paste Job Description
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Senior React Developer at TechCorp... 5+ years experience, React, Node.js, AWS, Docker..."
                        className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                      <p className="text-sm text-slate-400">
                        Paste the complete job description to get optimized resume suggestions
                      </p>
                    </div>
                  )}

                  {/* File Upload (for Pro Build) */}
                  {currentMode?.requiresFile && (
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-slate-200">
                        📤 Upload Existing Resume
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File size must be less than 5MB');
                              } else {
                                setUploadedFile(file);
                              }
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="block border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p className="font-semibold text-slate-200">
                            {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop'}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            PDF, DOC, or DOCX (max 5MB)
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Optional JD for other modes */}
                  {!currentMode?.requiresJd && !currentMode?.requiresFile && (
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-slate-200">
                        🔮 Job Description (Optional)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste a job description to get JD-optimized suggestions... (Optional)"
                        className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                      <p className="text-sm text-slate-400">
                        Adding a job description will help AI optimize your resume for that role
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-slate-700">
                    <button
                      onClick={() => {
                        setSelectedMode(null);
                        setJobDescription('');
                        setUploadedFile(null);
                      }}
                      className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleModeSelect(currentMode)}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Starting Builder...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Start Building
                        </>
                      )}
                    </button>
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

export default NewResumeModal;
