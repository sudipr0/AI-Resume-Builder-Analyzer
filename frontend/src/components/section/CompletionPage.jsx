// src/components/builder/FinalReviewsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Status & Feedback Icons
  CheckCircle, AlertCircle, Check, X,
  ThumbsUp, ThumbsDown, ShieldCheck, Eye, EyeOff, Lightbulb,

  // File & Document Icons
  FileCheck, FileSearch, FileBarChart, FileText, FileCode,

  // Actions Icons
  Printer, Download, QrCode, RefreshCw, Copy,
  ExternalLink, Plus, Edit, Trash2, Save,

  // Navigation Icons
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ArrowRight, Menu, Grid, List, Search, Filter,

  // View & Layout Icons
  Maximize2, Minimize2, Layout, Layers, Palette,

  // Device & Tech Icons
  Smartphone, Tablet, Monitor, Cpu, Cloud, Wrench,
  Code, Database, Globe, Wifi, Bluetooth,

  // AI & Intelligence Icons
  Brain, Sparkles, Zap, Target, TrendingUp,

  // Achievement & Reward Icons
  Award, Star, Crown, Diamond, Flame, Heart, Trophy, Medal, Gift,
  Rocket, Rocket as RocketIcon,

  // Time & Progress Icons
  Clock, Activity, BarChart, LineChart, PieChart,

  // Social & Communication Icons
  Users, Share2, MessageSquare, Volume2, VolumeX, Mic, MicOff,

  // Personal & Profile Icons
  User, UserCheck, Briefcase, GraduationCap, BookOpen, Calendar,
  MapPin, Building, Mail, Phone, Globe as GlobeIcon,

  // Weather & Environment Icons
  Sun, Moon, Coffee, Compass, Wind, Thermometer, Droplet,

  // Misc Icons
  Lock, Unlock, Bell, Settings, Sliders, Filter as FilterIcon,
  Copy as CopyIcon, Download as DownloadIcon, UploadCloud,
  Maximize, Minimize, RotateCcw
} from 'lucide-react';

import { toast } from 'react-hot-toast';

import CompletionBadge from '../section/CompletionBadge';
import CompletionOverview from '../section/CompletionOverview';
import CompletionProgress from '../section/CompletionProgress';
import CompletionChecklist from '../section/CompletionChecklist';
import CompletionStats from '../section/CompletionStats';
import CompletionTips from '../section/CompletionTips';

// ==================== HELPER FUNCTIONS (DEFINED FIRST) ====================

// Helper function to get icon for section
const getIconForSection = (sectionId) => {
  const icons = {
    personal: Users,
    summary: FileText,
    experience: Briefcase,
    skills: Code,
    education: GraduationCap,
    projects: Star,
    certifications: Award,
    languages: Globe
  };
  return icons[sectionId] || FileText;
};

// Helper function to get achievements based on resume data
const getAchievements = (data, items) => {
  const achievements = [];
  if (data?.personalInfo?.firstName) achievements.push('Profile Complete');
  if (data?.summary?.length > 50) achievements.push('Strong Summary');
  if (data?.experience?.length > 0) achievements.push('Experience Added');
  if (data?.skills?.length >= 5) achievements.push('Skills Showcase');
  if (items?.filter(i => i.completed).length === items?.length) achievements.push('All Sections Complete');
  return achievements;
};

// Helper function to get tips based on resume data
const getTipsForResume = (data) => {
  const tips = [];
  if (!data?.summary || data.summary.length < 50) {
    tips.push({
      id: 1,
      title: 'Enhance Your Summary',
      content: 'Add more detail to your professional summary to make it stand out.',
      category: 'summary',
      icon: FileText,
      color: 'blue',
      action: 'summary',
      priority: 'high'
    });
  }
  if (!data?.experience || data.experience.length === 0) {
    tips.push({
      id: 2,
      title: 'Add Work Experience',
      content: 'Work experience is crucial for employers. Add your relevant positions.',
      category: 'experience',
      icon: Briefcase,
      color: 'green',
      action: 'experience',
      priority: 'high'
    });
  }
  if (!data?.skills || data.skills.length < 3) {
    tips.push({
      id: 3,
      title: 'Add More Skills',
      content: 'List at least 5-10 relevant skills to improve your ATS score.',
      category: 'skills',
      icon: Code,
      color: 'purple',
      action: 'skills',
      priority: 'medium'
    });
  }
  return tips;
};

// ==================== AI REVIEW MODAL ====================
const AIReviewModal = ({ review, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('balanced');
  const [enhancedVersion, setEnhancedVersion] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const styles = [
    { id: 'balanced', label: 'Balanced', icon: Target, color: 'blue', desc: 'Optimize all aspects' },
    { id: 'ats', label: 'ATS Focus', icon: FileSearch, color: 'green', desc: 'Maximize ATS score' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'purple', desc: 'Stand out creatively' },
    { id: 'concise', label: 'Concise', icon: Zap, color: 'yellow', desc: 'Short and impactful' },
    { id: 'professional', label: 'Professional', icon: Briefcase, color: 'red', desc: 'Formal business tone' }
  ];

  const analysisSteps = [
    'Analyzing content structure...',
    'Checking keyword density...',
    'Evaluating readability...',
    'Calculating ATS score...',
    'Generating recommendations...'
  ];

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    setTimeout(() => {
      setEnhancedVersion({
        score: 96,
        previousScore: review?.score || 85,
        issues: [
          { id: 1, text: 'Add more quantifiable achievements', severity: 'high', fix: 'Use numbers and percentages' },
          { id: 2, text: 'Include industry-specific keywords', severity: 'medium', fix: 'Add 5-7 relevant keywords' },
          { id: 3, text: 'Strengthen opening statement', severity: 'medium', fix: 'Start with a powerful achievement' }
        ],
        suggestions: [
          'Consider adding metrics to your experience section',
          'Add 3-5 more relevant keywords for better ATS matching',
          'Strengthen your professional summary with more impact',
          'Use action verbs consistently throughout'
        ],
        improvements: [
          { area: 'ATS Score', before: 85, after: 96 },
          { area: 'Readability', before: 78, after: 92 },
          { area: 'Keyword Density', before: 65, after: 88 }
        ],
        optimized: true
      });
    }, 3000);
  }, [review]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient animation */}
        <motion.div
          className="p-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden"
          animate={{
            background: [
              'linear-gradient(45deg, #9333ea, #db2777, #2563eb)',
              'linear-gradient(45deg, #2563eb, #9333ea, #db2777)',
              'linear-gradient(45deg, #db2777, #2563eb, #9333ea)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          {/* Animated background particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [Math.random() * 800, Math.random() * 800],
                y: [Math.random() * 200, Math.random() * 200],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              >
                <Brain className="w-8 h-8" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  AI Review Assistant
                </motion.h2>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-purple-100"
                >
                  Deep analysis and optimization
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Live score indicator */}
          {enhancedVersion && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 right-8 flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3"
            >
              <div className="text-right">
                <p className="text-xs opacity-80">Previous Score</p>
                <p className="text-xl line-through opacity-60">{enhancedVersion.previousScore}%</p>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div>
                <p className="text-xs opacity-80">New Score</p>
                <p className="text-3xl font-bold">{enhancedVersion.score}%</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Content with smooth scroll */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {/* Original Review Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Current Review
            </h3>
            <p className="text-gray-800 font-medium mb-1">
              {review?.title || 'Review'} - Score: {review?.score || 85}/100
            </p>
            <p className="text-gray-600 text-sm">{review?.description || 'Standard review analysis'}</p>
          </motion.div>

          {/* Style Selection with hover effects */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Choose Enhancement Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden group ${selectedStyle === style.id
                    ? `border-${style.color}-500 bg-${style.color}-50`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  {/* Hover glow effect */}
                  <motion.div
                    className={`absolute inset-0 bg-${style.color}-100 opacity-0 group-hover:opacity-20`}
                    initial={false}
                    animate={{ scale: selectedStyle === style.id ? 1 : 0 }}
                  />

                  <style.icon className={`w-8 h-8 mx-auto mb-3 text-${style.color}-600`} />
                  <span className={`text-sm font-medium block text-center ${selectedStyle === style.id ? `text-${style.color}-700` : 'text-gray-700'
                    }`}>
                    {style.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-2 block">{style.desc}</span>

                  {selectedStyle === style.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Version */}
          {isProcessing ? (
            <div className="flex flex-col items-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Brain className="w-20 h-20 text-purple-600" />
                <motion.div
                  className="absolute -inset-4 border-4 border-purple-200 border-t-purple-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <p className="text-gray-700 mt-6 font-medium text-lg">{analysisSteps[currentStep]}</p>
              <p className="text-sm text-gray-500 mt-2">This will take just a moment</p>

              {/* Progress bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          ) : enhancedVersion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score improvement visualization */}
              <div className="grid grid-cols-3 gap-4">
                {enhancedVersion.improvements.map((imp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2">{imp.area}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 line-through">{imp.before}%</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-bold">{imp.after}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${imp.after}%` }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        transition={{ duration: 0.5, delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Analysis Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-200"
              >
                {/* Issues Section */}
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Critical Issues to Fix
                </h4>
                <div className="space-y-3 mb-6">
                  {enhancedVersion.issues.map((issue, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${issue.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{issue.text}</p>
                        {issue.fix && (
                          <p className="text-xs text-gray-600 mt-1">Fix: {issue.fix}</p>
                        )}
                      </div>
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                        Fix it
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* AI Suggestions */}
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI-Powered Suggestions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enhancedVersion.suggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(enhancedVersion)}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  Apply All Optimizations
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== REVIEW CARD ====================
const ReviewCard = ({ review, index, onRunReview, onEnhance, isCompleted, score, issues, isHovered, setIsHovered }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const Icon = review.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white rounded-2xl border-2 transition-all duration-500 ${isHovered ? 'border-purple-400 shadow-2xl' : 'border-gray-200 shadow-lg'
        }`}
      onHoverStart={() => setIsHovered(review.id)}
      onHoverEnd={() => setIsHovered(null)}
      style={{
        transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front of card */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Animated Icon */}
          <motion.div
            animate={isHovered === review.id ? {
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1.1, 1],
            } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-16 h-16 ${review.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden`}
          >
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={isHovered === review.id ? {
                scale: [1, 1.5, 1],
                opacity: [0, 0.5, 0],
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <Icon className="w-8 h-8 text-gray-700" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{review.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{review.description}</p>
              </div>

              {/* Score and Expand */}
              <div className="flex items-center gap-2">
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{score}%</span>
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                    }`} />
                </motion.button>
              </div>
            </div>

            {/* Quick Info with animated counters */}
            <div className="flex items-center gap-6 mt-4">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">~2 min</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{issues || 0} issues</span>
              </motion.div>
              {review.importance === 'high' && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                >
                  High Priority
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRunReview(review.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
              title="Run review"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Run Review
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEnhance(review)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative group"
              title="AI Enhance"
            >
              <Brain className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                AI Analysis
              </span>
            </motion.button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && isCompleted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-4 border-t border-gray-200">
                {/* Animated Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">Overall Score</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-bold text-gray-900 text-lg"
                    >
                      {score}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative"
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {['Grammar', 'Structure', 'Keywords', 'Impact'].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      <p className="text-xs text-gray-500">{item}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${70 + i * 5}%` }}
                            className="h-full bg-purple-600 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{70 + i * 5}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Score Interpretation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 mb-4"
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Score Interpretation
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {score >= 90 && '🌟 Excellent! Your resume performs exceptionally well in this area. Small tweaks can make it perfect.'}
                    {score >= 70 && score < 90 && '📈 Good foundation! Address the suggestions below to further improve your score.'}
                    {score < 70 && '🎯 Needs attention. Focus on the critical issues highlighted to improve significantly.'}
                  </p>
                </motion.div>

                {/* AI Deep Analysis Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(review)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg group"
                >
                  <Brain className="w-5 h-5 group-hover:animate-pulse" />
                  Run Deep AI Analysis
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back of card (for flip effect) */}
      {isFlipping && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8" />
            <h4 className="font-bold">AI Analysis</h4>
          </div>
          <p className="text-sm opacity-90">Analyzing your resume...</p>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ==================== MAIN FINAL REVIEWS PAGE ====================
const FinalReviewsPage = ({
  resumeData = {},
  stats = {},
  reviewStatus = {},
  onReviewComplete = () => { },
  onExport = () => { },
  onPrint = () => { },
  onGenerateQR = () => { },
  qrCodeUrl = '',
  isExporting = false,
  onClose = () => { },
  onComplete = () => { }
}) => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [isChecking, setIsChecking] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');
  const [enhancingReview, setEnhancingReview] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);

  // Initialize checklist items based on resume data
  useEffect(() => {
    const sections = [
      { id: 'personal', name: 'Personal Information', completed: !!resumeData?.personalInfo?.firstName },
      { id: 'summary', name: 'Professional Summary', completed: !!resumeData?.summary?.length > 20 },
      { id: 'experience', name: 'Work Experience', completed: resumeData?.experience?.length > 0 },
      { id: 'skills', name: 'Skills', completed: resumeData?.skills?.length >= 3 },
      { id: 'education', name: 'Education', completed: resumeData?.education?.length > 0 },
      { id: 'projects', name: 'Projects', completed: resumeData?.projects?.length > 0 },
      { id: 'certifications', name: 'Certifications', completed: resumeData?.certifications?.length > 0 },
      { id: 'languages', name: 'Languages', completed: resumeData?.languages?.length > 0 }
    ];

    const items = sections.map((section, index) => ({
      id: index + 1,
      text: `Complete ${section.name} section`,
      completed: section.completed,
      category: section.id,
      action: section.id
    }));

    setChecklistItems(items);
  }, [resumeData]);

  const reviewTypes = [
    {
      id: 'grammar',
      title: 'Grammar & Spelling',
      description: 'Check for typos, grammar errors, and punctuation',
      icon: FileText,
      color: 'bg-blue-100',
      importance: 'high'
    },
    {
      id: 'ats',
      title: 'ATS Compatibility',
      description: 'Optimize for Applicant Tracking Systems',
      icon: FileSearch,
      color: 'bg-green-100',
      importance: 'high'
    },
    {
      id: 'design',
      title: 'Design & Formatting',
      description: 'Ensure consistent formatting and visual appeal',
      icon: FileCode,
      color: 'bg-purple-100',
      importance: 'medium'
    },
    {
      id: 'content',
      title: 'Content Quality',
      description: 'Review content effectiveness and impact',
      icon: FileBarChart,
      color: 'bg-amber-100',
      importance: 'high'
    }
  ];

  // Completion data based on actual resume data
  const completionData = useMemo(() => ({
    stats: {
      atsScore: stats.atsScore || 85,
      readability: 88,
      impact: 92,
      completeness: stats.completion || 75,
      views: 0,
      downloads: 0,
      shares: 0,
      words: resumeData?.summary?.split(' ').length || 0,
      bulletPoints: resumeData?.experience?.reduce((acc, exp) => acc + (exp.achievements?.length || 0), 0) || 0,
      sections: 8,
      completedSections: checklistItems.filter(i => i.completed).length
    },
    sections: checklistItems.map(item => ({
      id: item.category,
      name: item.text.replace('Complete ', '').replace(' section', ''),
      completed: item.completed,
      score: item.completed ? 100 : 0,
      icon: getIconForSection(item.category)
    })),
    achievements: getAchievements(resumeData, checklistItems),
    tips: getTipsForResume(resumeData)
  }), [resumeData, stats, checklistItems]);

  const sampleIssues = {
    grammar: [
      { id: 1, type: 'spelling', text: 'Incorrect spelling of "accomplishment"', severity: 'low' },
      { id: 2, type: 'grammar', text: 'Missing comma after introductory phrase', severity: 'medium' },
      { id: 3, type: 'punctuation', text: 'Inconsistent use of semicolons', severity: 'low' }
    ],
    ats: [
      { id: 1, type: 'keyword', text: 'Add more industry-specific keywords', severity: 'medium' },
      { id: 2, type: 'format', text: 'Avoid using tables for layout', severity: 'high' },
      { id: 3, type: 'header', text: 'Use standard section headers', severity: 'medium' }
    ],
    design: [
      { id: 1, type: 'consistency', text: 'Font sizes inconsistent across sections', severity: 'low' },
      { id: 2, type: 'spacing', text: 'Adjust line spacing for better readability', severity: 'medium' },
      { id: 3, type: 'alignment', text: 'Improve text alignment in experience section', severity: 'low' }
    ],
    content: [
      { id: 1, type: 'impact', text: 'Quantify achievements with numbers', severity: 'high' },
      { id: 2, type: 'clarity', text: 'Simplify complex sentences', severity: 'medium' },
      { id: 3, type: 'relevance', text: 'Remove outdated or irrelevant experience', severity: 'medium' }
    ]
  };

  const handleRunReview = (reviewId) => {
    setIsChecking(true);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70;
      const issues = sampleIssues[reviewId] || [];

      onReviewComplete(reviewId, {
        score,
        issues,
        checked: true,
        lastChecked: new Date().toISOString(),
        suggestions: getSuggestions(reviewId, score)
      });

      setIsChecking(false);
      toast.success(`${reviewTypes.find(r => r.id === reviewId)?.title} check completed!`);
    }, 2000);
  };

  const getSuggestions = (reviewId, score) => {
    const suggestions = {
      grammar: score > 90 ? [
        'Excellent grammar and spelling',
        'Consider using more varied vocabulary'
      ] : [
        'Run spell check thoroughly',
        'Read aloud to catch awkward phrasing'
      ],
      ats: score > 85 ? [
        'Great ATS compatibility',
        'Add 2-3 more industry keywords'
      ] : [
        'Use standard section headers',
        'Avoid tables and complex formatting'
      ],
      design: score > 80 ? [
        'Clean and professional design',
        'Consider adding subtle color accents'
      ] : [
        'Ensure consistent font usage',
        'Improve spacing between sections'
      ],
      content: score > 85 ? [
        'Strong, impactful content',
        'Consider adding metrics to 1-2 more achievements'
      ] : [
        'Add more quantifiable achievements',
        'Use action verbs consistently'
      ]
    };

    return suggestions[reviewId] || [];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isReviewCompleted = (reviewId) => {
    return reviewStatus[reviewId]?.checked || false;
  };

  const allReviewsCompleted = reviewTypes.every(review => isReviewCompleted(review.id));

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document', icon: FileText, color: 'bg-red-100' },
    { id: 'docx', name: 'Word Document', icon: FileText, color: 'bg-blue-100' },
    { id: 'txt', name: 'Plain Text', icon: FileText, color: 'bg-gray-100' },
    { id: 'json', name: 'JSON Data', icon: FileCode, color: 'bg-green-100' }
  ];

  const handleEnhance = (review) => {
    setEnhancingReview(review);
  };

  const handleApplyEnhancement = (enhanced) => {
    setEnhancingReview(null);
    toast.success('AI optimization applied! ✨');
  };

  const stats_data = {
    total: reviewTypes.length,
    completed: reviewTypes.filter(r => isReviewCompleted(r.id)).length,
    average: Math.round(
      reviewTypes.reduce((acc, r) => acc + (reviewStatus[r.id]?.score || 0), 0) /
      (reviewTypes.filter(r => reviewStatus[r.id]?.score).length || 1)
    )
  };

  // Handle checklist item toggle
  const handleToggleItem = (itemId) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    toast.success('Progress updated!');
  };

  // Handle tip action
  const handleTipAction = (action) => {
    // Navigate to the appropriate section
    window.location.href = `/builder/${action}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <FileCheck className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Final Reviews</h1>
                <p className="text-gray-600 mt-2 text-lg">Complete these final checks to ensure your resume is perfect</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Completion Badge */}
              <CompletionBadge
                type={allReviewsCompleted ? 'gold' : 'silver'}
                size="md"
                score={stats_data.average}
              />
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-lg">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Reviews', value: stats_data.total, icon: FileCheck, color: 'blue', trend: '+2' },
              { label: 'Completed', value: stats_data.completed, icon: CheckCircle, color: 'green', trend: '+1' },
              { label: 'Average Score', value: `${stats_data.average}%`, icon: Target, color: 'purple', trend: '+5%' },
              { label: 'Issues Found', value: Object.values(reviewStatus).reduce((acc, r) => acc + (r.issues?.length || 0), 0), icon: AlertCircle, color: 'yellow', trend: '-3' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-600">{stat.trend} from last week</span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 inline-flex shadow-lg">
            {[
              { id: 'reviews', label: 'Reviews', icon: FileCheck },
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'progress', label: 'Progress', icon: Activity },
              { id: 'checklist', label: 'Checklist', icon: CheckCircle },
              { id: 'stats', label: 'Statistics', icon: BarChart },
              { id: 'tips', label: 'Tips', icon: Lightbulb }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-sm font-medium capitalize transition-all flex items-center gap-2 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dynamic Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Reviews */}
              <div className="lg:col-span-2 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 shadow-lg"
                  />
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {reviewTypes
                      .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((review, index) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          index={index}
                          onRunReview={handleRunReview}
                          onEnhance={handleEnhance}
                          isCompleted={isReviewCompleted(review.id)}
                          score={reviewStatus[review.id]?.score}
                          issues={reviewStatus[review.id]?.issues?.length}
                          isHovered={hoveredId}
                          setIsHovered={setHoveredId}
                        />
                      ))}
                  </AnimatePresence>
                </div>

                {/* Run All Button */}
                {!allReviewsCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      reviewTypes.forEach(review => {
                        if (!isReviewCompleted(review.id)) {
                          handleRunReview(review.id);
                        }
                      });
                    }}
                    disabled={isChecking}
                    className="w-full mt-4 p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl disabled:opacity-50 text-lg"
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Running all checks...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Run All Reviews
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Right Column - Export & Actions */}
              <div className="space-y-6">
                {/* Export Options */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Resume
                  </h3>

                  <div className="space-y-3 mb-6">
                    {exportFormats.map((format) => {
                      const Icon = format.icon;
                      return (
                        <motion.button
                          key={format.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedExportFormat(format.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedExportFormat === format.id
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${format.color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-gray-700" />
                            </div>
                            <span className="font-medium text-gray-900">{format.name}</span>
                          </div>
                          {selectedExportFormat === format.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExport(selectedExportFormat)}
                    disabled={isExporting || !allReviewsCompleted}
                    className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all text-lg ${isExporting || !allReviewsCompleted
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                      }`}
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Export {selectedExportFormat.toUpperCase()}
                      </>
                    )}
                  </motion.button>
                  {!allReviewsCompleted && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-500 mt-3 text-center"
                    >
                      Complete all reviews before exporting
                    </motion.p>
                  )}
                </motion.div>

                {/* QR Code */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">Digital Resume</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Generate a QR code for easy sharing of your digital resume.
                    </p>

                    {qrCodeUrl ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <motion.img
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          src={qrCodeUrl}
                          alt="Resume QR Code"
                          className="w-48 h-48 mx-auto mb-4 rounded-xl border-2 border-gray-200 shadow-lg"
                        />
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = qrCodeUrl;
                              link.download = 'resume-qr-code.png';
                              link.click();
                            }}
                            className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                          >
                            Download QR Code
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onPrint}
                            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Print with QR
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onGenerateQR}
                        disabled={!allReviewsCompleted}
                        className={`w-full py-4 rounded-xl font-medium transition-all ${!allReviewsCompleted
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-lg'
                          }`}
                      >
                        Generate QR Code
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Completion Status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`rounded-2xl p-8 ${allReviewsCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200'
                    } shadow-xl`}
                >
                  <div className="text-center">
                    {allReviewsCompleted ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">All Reviews Complete! 🎉</h3>
                        <p className="text-gray-600 mb-6">
                          Your resume is ready for submission. Export or print your final version.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={onComplete}
                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
                        >
                          Mark as Complete
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Complete All Reviews</h3>
                        <p className="text-gray-600 mb-6">
                          Run all checks to ensure your resume is polished and professional.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            reviewTypes.forEach(review => {
                              if (!isReviewCompleted(review.id)) {
                                handleRunReview(review.id);
                              }
                            });
                          }}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
                        >
                          Run All Checks
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CompletionOverview
                resumeData={resumeData}
                stats={completionData.stats}
                achievements={completionData.achievements}
                onViewResume={() => window.open('/preview', '_blank')}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <CompletionProgress
                sections={completionData.sections}
                currentSection={checklistItems.filter(i => i.completed).length}
                onSectionClick={(id) => {
                  toast.success(`Navigate to ${id} section`);
                  handleTipAction(id);
                }}
              />
              <div className="space-y-6">
                <CompletionBadge type="gold" size="lg" score={completionData.stats.atsScore} />
                <CompletionBadge type="expert" size="lg" score={completionData.stats.completeness} />
              </div>
            </motion.div>
          )}

          {activeTab === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <CompletionChecklist
                items={checklistItems}
                onToggleItem={handleToggleItem}
                onItemAction={(action) => handleTipAction(action)}
              />
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Completion Rate</span>
                    <span className="font-bold text-gray-900">
                      {Math.round((checklistItems.filter(i => i.completed).length / checklistItems.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Items Left</span>
                    <span className="font-bold text-gray-900">
                      {checklistItems.filter(i => !i.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Est. Time Remaining</span>
                    <span className="font-bold text-gray-900">
                      {checklistItems.filter(i => !i.completed).length * 5} min
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CompletionStats
                stats={completionData.stats}
                achievements={completionData.achievements}
                showDetailed={true}
              />
            </motion.div>
          )}

          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <CompletionTips
                tips={completionData.tips}
                onTipAction={handleTipAction}
                currentSection="overview"
              />
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Tip</h3>
                <p className="text-gray-700 leading-relaxed">
                  Did you know? Resumes with quantified achievements are 40% more likely to get interviews.
                  Add numbers, percentages, and specific results to your experience section.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Editing
          </motion.button>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrint}
              disabled={!allReviewsCompleted}
              className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-medium ${!allReviewsCompleted
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900 shadow-lg'
                }`}
            >
              <Printer className="w-4 h-4" />
              Print Preview
            </motion.button>
            {allReviewsCompleted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-medium shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                Finalize Resume
                <Rocket className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingReview && (
          <AIReviewModal
            review={enhancingReview}
            onClose={() => setEnhancingReview(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(FinalReviewsPage);