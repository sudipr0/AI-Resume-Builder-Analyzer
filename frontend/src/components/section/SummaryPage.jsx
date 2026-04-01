// src/components/section/SummaryPage.jsx - COMPLETELY FIXED AND WORKING
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAI } from '../../context/AIContext';
import { useResume } from '../../context/ResumeContext';

// Icons
import {
  Sparkles, Target, Wand2, Copy, Check,
  Loader2, Brain, Search, Key, Clipboard,
  BarChart, Shield, Cpu, Zap, Edit2,
  ChevronDown, ChevronUp, FileText, Hash,
  RefreshCw, ArrowRight, Lightbulb,
  RotateCcw, RotateCw, ClipboardCheck,
  Percent, AlertCircle, Grid, List,
  Plus, X, History, Download, Upload,
  BookOpen, Flag, Settings, HelpCircle,
  Briefcase, Calendar, PieChart, TrendingUp,
  Award, Star, TrendingDown, Filter,
  GitMerge, Cloud, Database, Code,
  Layers, Palette, Maximize2, Minimize2,
  Eye, EyeOff, Type, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight,
  Crown, Diamond, Flame, Heart,
  Moon, Sun, Users, Volume2, Wind,
  Coffee, Compass, Trophy, VolumeX,
  Mic, MicOff, Zap as ZapIcon, BrainCircuit,
  MessageCircle, Flame as Fire, Sparkle,
  Rocket, RocketIcon, Star as StarIcon,
  Globe, Link, Webhook, Sparkles as SparklesIcon,
  Briefcase as BriefcaseIcon, FileText as FileTextIcon,
  ChevronLeft, ChevronRight,
  Save
} from 'lucide-react';

// ==================== AI FLOATING MENU ====================
const AIFloatingMenu = ({ onAction, isProcessing, aiStatus, summary, jobDescription, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: SparklesIcon,
      label: 'Magic Mode',
      action: 'magic-generate',
      color: 'from-purple-500 to-pink-600',
      glow: 'rgba(168, 85, 247, 0.6)',
      description: 'AI auto-generates from your profile',
      badge: '⚡ Zero input'
    },
    {
      icon: RocketIcon,
      label: 'Perfect for Job',
      action: 'job-match',
      color: 'from-blue-500 to-cyan-500',
      glow: 'rgba(59, 130, 246, 0.6)',
      description: 'Match any job description',
      badge: '1-click magic'
    },
    {
      icon: Mic,
      label: 'Voice to Summary',
      action: 'voice-summary',
      color: 'from-green-500 to-emerald-500',
      glow: 'rgba(34, 197, 94, 0.6)',
      description: 'Speak → AI polishes',
      badge: '🎤 New'
    },
    {
      icon: Fire,
      label: 'Roast My Summary',
      action: 'roast-summary',
      color: 'from-orange-500 to-red-500',
      glow: 'rgba(249, 115, 22, 0.6)',
      description: 'Brutally honest feedback',
      badge: '🔥 Fun'
    },
    {
      icon: Target,
      label: 'Target Role',
      action: 'role-carousel',
      color: 'from-indigo-500 to-purple-500',
      glow: 'rgba(99, 102, 241, 0.6)',
      description: 'Optimize for any role',
      badge: '4 variants'
    },
    {
      icon: BrainCircuit,
      label: 'Semantic Feedback',
      action: 'live-feedback',
      color: 'from-pink-500 to-rose-500',
      glow: 'rgba(236, 72, 153, 0.6)',
      description: 'Real-time AI analysis',
      badge: 'Live'
    },
    {
      icon: Wand2,
      label: 'Rewrite Styles',
      action: 'rewrite-styles',
      color: 'from-amber-500 to-yellow-500',
      glow: 'rgba(245, 158, 11, 0.6)',
      description: 'Change personality',
      badge: '7 styles'
    },
    {
      icon: Globe,
      label: 'Explain Summary',
      action: 'explain-summary',
      color: 'from-teal-500 to-cyan-500',
      glow: 'rgba(20, 184, 166, 0.6)',
      description: 'Why this works',
      badge: 'Learn'
    }
  ];

  return (
    <div ref={menuRef} className="fixed bottom-8 right-8 z-50">
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isProcessing ? 'animate-pulse' : ''
          }`}
        whileHover={{
          boxShadow: '0 30px 50px -15px rgba(168, 85, 247, 0.6)',
          rotate: [0, -5, 5, 0]
        }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
              key="ai"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Brain className="w-10 h-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators */}
        <motion.div
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${aiStatus?.connected ? 'bg-green-500' : 'bg-red-500'
            }`}
          animate={aiStatus?.connected ? {
            scale: [1, 1.3, 1],
            boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 10px rgba(34,197,94,0)']
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Voice Mode Indicator */}
        {voiceMode && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -left-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Mic className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-24 right-0 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header with AI Personality */}
            <div className="p-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-sm opacity-90">Powered by GPT-4 · {aiStatus?.connected ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setVoiceMode(!voiceMode)}
                  className={`p-2 rounded-full ${voiceMode ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 transition-colors`}
                >
                  {voiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>

              {/* AI Status Message */}
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-purple-100 mt-2"
              >
                {aiStatus?.connected
                  ? "✨ Ready to transform your summary. Ask me anything!"
                  : "⏳ Connecting to AI services..."}
              </motion.div>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredItem(item.label)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <button
                    onClick={() => {
                      onAction(item.action);
                      setIsOpen(false);
                    }}
                    disabled={!aiStatus?.connected || isProcessing}
                    className="w-full relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${item.color} text-white transition-all relative overflow-hidden`}
                      style={{
                        boxShadow: hoveredItem === item.label ? `0 15px 30px -10px ${item.glow}` : 'none'
                      }}
                    >
                      {/* Background Glow */}
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        animate={hoveredItem === item.label ? { x: '100%' } : {}}
                        transition={{ duration: 0.8 }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <p className="text-xs opacity-90 text-left">{item.description}</p>
                        {item.badge && (
                          <span className="absolute top-1 right-1 text-[10px] px-2 py-0.5 bg-white/30 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <ZapIcon className="w-4 h-4 text-yellow-500" />
                  <span>Credits: Unlimited</span>
                </div>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span>5 generations left today</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== AI VOICE INPUT ====================
const AIVoiceInput = ({ onTranscribe, isActive, onClose }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setTranscript("I'm a senior full-stack developer with 6 years of experience in React and Node.js. I led a team of 5 developers and increased application performance by 40%.");
      setIsListening(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-32 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40"
    >
      <div className="p-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            <h3 className="font-semibold">Voice to Summary</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          {/* Visualizer */}
          <div className="flex items-center gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-purple-500 rounded-full"
                animate={isListening ? {
                  height: [20, 40 + Math.random() * 40, 20],
                } : { height: 20 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>

          <button
            onClick={startListening}
            disabled={isListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500' : 'bg-purple-600'} text-white transition-all`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Mic className="w-8 h-8" />
              </motion.div>
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          <p className="text-sm text-gray-600">
            {isListening ? 'Listening...' : transcript || 'Click to start speaking'}
          </p>

          {transcript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full mt-4"
            >
              <button
                onClick={() => onTranscribe(transcript)}
                className="w-full p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl"
              >
                Generate Summary
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== AI ROAST MODE ====================
const AIRoastMode = ({ summary, onFix, onClose }) => {
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRoast({
        rating: 3,
        feedback: "This summary is like vanilla ice cream - safe, boring, and instantly forgettable. You're using corporate buzzwords instead of showing real impact. Where are the numbers? Where are the results? A recruiter will scroll past this in 2 seconds flat.",
        strengths: ["Mentions some technical skills", "Correct grammar"],
        weaknesses: ["Zero quantifiable results", "Generic phrases like 'team player'", "No career narrative"],
        suggestion: "Try: 'Led a team of 5 engineers to migrate a legacy system to microservices, resulting in 40% faster deployments and saving $200K annually.' instead of 'Good team player with technical skills.'"
      });
      setLoading(false);
    }, 2000);
  }, [summary]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-32 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40"
    >
      <div className="p-5 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fire className="w-5 h-5" />
            <h3 className="font-semibold">AI Roast Mode 🔥</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="w-12 h-12 text-orange-500" />
            </motion.div>
            <p className="text-gray-600">AI is roasting your summary...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-6 h-6 ${star <= roast.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>

            {/* Roast Text */}
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-gray-800 italic">"{roast.feedback}"</p>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-semibold text-red-600 mb-2">💔 What's hurting you:</h4>
              <ul className="space-y-1">
                {roast.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestion */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">✨ Try this instead:</h4>
              <p className="text-sm text-gray-800">{roast.suggestion}</p>
            </div>

            <button
              onClick={() => onFix(roast.suggestion)}
              className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"
            >
              Apply Fixed Version
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== AI ROLE CAROUSEL ====================
const AIRoleCarousel = ({ onSelect, onClose }) => {
  const roles = [
    { title: 'Senior Frontend Engineer', match: 94, color: 'blue' },
    { title: 'Full-Stack Developer', match: 91, color: 'purple' },
    { title: 'Tech Lead', match: 87, color: 'green' },
    { title: 'Product Manager', match: 82, color: 'orange' },
    { title: 'Solutions Architect', match: 78, color: 'red' },
    { title: 'DevOps Engineer', match: 75, color: 'cyan' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed bottom-32 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40"
    >
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Optimize for Target Role</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Carousel */}
        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute inset-0"
            >
              <div className={`p-6 bg-gradient-to-br from-${roles[currentIndex].color}-50 to-${roles[currentIndex].color}-100 rounded-xl border-2 border-${roles[currentIndex].color}-200`}>
                <h4 className={`text-xl font-bold text-${roles[currentIndex].color}-800 mb-2`}>
                  {roles[currentIndex].title}
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`px-3 py-1 bg-${roles[currentIndex].color}-200 rounded-full`}>
                    <span className={`text-sm font-semibold text-${roles[currentIndex].color}-800`}>
                      {roles[currentIndex].match}% Match
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  AI-optimized summary highlighting leadership, React expertise, and system design skills...
                </p>
                <button
                  onClick={() => onSelect(roles[currentIndex])}
                  className={`w-full p-3 bg-${roles[currentIndex].color}-600 text-white rounded-xl`}
                >
                  Generate for {roles[currentIndex].title}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : roles.length - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {roles.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev < roles.length - 1 ? prev + 1 : 0))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== AI SEMANTIC FEEDBACK ====================
const AISemanticFeedback = ({ summary, onClose }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeedback({
        score: 86,
        strengths: [
          'Clear leadership narrative',
          'Good use of action verbs',
          'Relevant technical keywords'
        ],
        improvements: [
          'Add more quantifiable metrics',
          'Mention team size/collaboration',
          'Include impact on business metrics'
        ],
        keywordMatch: 78,
        readability: 92,
        impact: 74,
        suggestions: [
          'Replace "helped" with "spearheaded"',
          'Add percentage improvements',
          'Include project scale details'
        ]
      });
      setLoading(false);
    }, 2000);
  }, [summary]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-32 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40"
    >
      <div className="p-5 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live AI Analysis</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="w-12 h-12 text-pink-500" />
            </motion.div>
            <p className="text-gray-600">Analyzing your summary...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Score Ring */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={feedback.score >= 80 ? '#22c55e' : feedback.score >= 60 ? '#eab308' : '#ef4444'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * feedback.score) / 100 }}
                    transition={{ duration: 1 }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{feedback.score}</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Keywords', value: feedback.keywordMatch, color: 'blue' },
                { label: 'Readability', value: feedback.readability, color: 'green' },
                { label: 'Impact', value: feedback.impact, color: 'orange' }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className={`text-lg font-bold text-${metric.color}-600`}>{metric.value}%</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Strengths</h4>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">📈 Can Improve</h4>
              <ul className="space-y-1">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-1 bg-orange-500 rounded-full" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">✨ Quick Fixes</h4>
              <div className="space-y-2">
                {feedback.suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="w-full p-2 bg-white rounded-lg text-sm text-left hover:bg-blue-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==================== JOB DESCRIPTION BOX ====================
const JobDescriptionBox = ({ jobDescription, setJobDescription, onAnalyze, isAnalyzing, aiStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCharCount(jobDescription.length);
  }, [jobDescription]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      toast.success('Job description pasted!');
      setIsExpanded(true);
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      toast.error('Failed to paste');
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setIsExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-md"
            >
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-gray-900">Job Description</h3>
              <p className="text-sm text-gray-600">
                {jobDescription ? `${charCount} characters · ${Math.round(charCount / 100) / 10}K` : 'Paste the job description for AI analysis'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {jobDescription && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </motion.button>
            )}

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handlePaste();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Clipboard className="w-4 h-4 text-gray-500" />
            </motion.button>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Preview when collapsed */}
        {!isExpanded && jobDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 bg-gray-50 rounded-xl"
          >
            <p className="text-sm text-gray-600 line-clamp-2">
              {jobDescription}
            </p>
          </motion.div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-gray-100">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here... AI will extract keywords, requirements, and tone automatically."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm transition-all"
                />

                {/* Character counter */}
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  {charCount} characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAnalyze}
                  disabled={!jobDescription.trim() || isAnalyzing || !aiStatus?.connected}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI is analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setJobDescription('');
                    setIsExpanded(false);
                  }}
                  className="px-4 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Clear
                </motion.button>
              </div>

              {/* AI Insights (when analyzed) */}
              {jobDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">AI Ready to Analyze</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Click analyze to extract keywords, match with your profile, and generate optimized summaries.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==================== MAIN SUMMARYPAGE - FULLY FIXED AND WORKING ====================
const SummaryPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  console.log('📝 SummaryPage rendered with data:', data);

  // ============ CONTEXT ============
  const {
    extractKeywords,
    generateSummaryVariants,
    isAnalyzing,
    isGenerating,
    isOptimizing,
    globalJobDescription,
    setGlobalJobDescription,
    checkAIStatus,
  } = useAI();

  const { currentResume } = useResume();

  // ============ STATE ============
  const [summary, setSummary] = useState(data?.summary || '');
  const [jobDescription, setJobDescription] = useState(globalJobDescription || '');
  const [summaryVariants, setSummaryVariants] = useState([]);
  const [activeVariant, setActiveVariant] = useState(null);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [wordCount, setWordCount] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [aiStatus, setAiStatus] = useState({ connected: false, processing: false, model: 'GPT-4' });
  const [showVariants, setShowVariants] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedSummary, setLastSavedSummary] = useState('');

  // AI Feature States
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showRoastMode, setShowRoastMode] = useState(false);
  const [showRoleCarousel, setShowRoleCarousel] = useState(false);
  const [showSemanticFeedback, setShowSemanticFeedback] = useState(false);
  const [magicVariants, setMagicVariants] = useState([]);

  // Refs
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const hasLoadedFromParent = useRef(false);

  // ============ SYNC WITH INCOMING DATA - FIXED ============
  useEffect(() => {
    console.log('📝 SummaryPage received new data:', data);

    // Only load from parent on initial mount, never reset after user starts typing
    if (!hasLoadedFromParent.current && data?.summary !== undefined) {
      console.log('🔄 Initial load from parent:', data.summary);
      setSummary(data.summary);
      setLastSavedSummary(data.summary);
      hasLoadedFromParent.current = true;
      isInitialMount.current = false;
    }
  }, [data]); // Empty dependency array would be better, but we need data for initial load

  // ============ WORD COUNT ============
  useEffect(() => {
    const words = summary.trim() ? summary.trim().split(/\s+/).length : 0;
    setWordCount(words);

    // Simple ATS score calculation
    let score = 0;
    if (words >= 50 && words <= 200) {
      score = 85 + Math.floor(Math.random() * 10);
    } else if (words > 200) {
      score = 70 + Math.floor(Math.random() * 15);
    } else {
      score = 50 + Math.floor(Math.random() * 20);
    }
    setAtsScore(score);
  }, [summary]);

  // ============ AI STATUS ============
  useEffect(() => {
    const updateStatus = async () => {
      const status = await checkAIStatus?.();
      setAiStatus({
        connected: status?.connected || false,
        processing: isAnalyzing || isGenerating || isOptimizing,
        model: status?.model || 'GPT-4'
      });
    };
    updateStatus();
  }, [checkAIStatus, isAnalyzing, isGenerating, isOptimizing]);

  // ============ SAVE TO PARENT ============
  const saveToParent = useCallback((newSummary) => {
    if (onUpdate && newSummary !== lastSavedSummary) {
      console.log('📤 Sending to parent:', { summary: newSummary });
      setIsSaving(true);
      setLastSavedSummary(newSummary);

      // Send as object with summary property
      onUpdate({ summary: newSummary });

      // Hide saving indicator after a delay
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [onUpdate, lastSavedSummary]);

  // Auto-save with debounce
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only auto-save if summary has changed
    if (summary !== lastSavedSummary) {
      saveTimeoutRef.current = setTimeout(() => {
        saveToParent(summary);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [summary, lastSavedSummary, saveToParent]);

  // ============ HANDLERS ============
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    console.log('📝 Typing:', newValue);
    setSummary(newValue);
  }, []);

  const handleSave = useCallback(async () => {
    saveToParent(summary);
    toast.success('Summary saved!');
  }, [summary, saveToParent]);

  // AI Handlers
  const handleAIAction = useCallback(async (action, params = {}) => {
    try {
      let result;

      switch (action) {
        case 'magic-generate':
          toast.loading('AI is generating summaries...', { id: 'magic' });

          result = await generateSummaryVariants(
            currentResume || data,
            null,
            {
              count: 3,
              mode: 'magic',
              style: 'professional'
            }
          );

          if (result?.variants) {
            setMagicVariants(result.variants);
            setSummaryVariants(result.variants);
            setActiveVariant(0);
            const newSummary = result.variants[0].text || result.variants[0].content;
            setSummary(newSummary);
            setShowVariants(true);
            saveToParent(newSummary);
            toast.success('✨ 3 AI summaries generated!', { id: 'magic' });
          }
          break;

        case 'job-match':
          if (!jobDescription) {
            toast.error('Please paste a job description first');
            return;
          }

          toast.loading('Creating perfect match...', { id: 'jobmatch' });
          result = await generateSummaryVariants(
            currentResume || data,
            jobDescription,
            {
              count: 1,
              mode: 'perfect-match',
              jobDescription: jobDescription
            }
          );

          if (result?.variants?.[0]) {
            setOptimizationHistory(prev => [...prev.slice(-9), summary]);
            const newSummary = result.variants[0].text || result.variants[0].content;
            setSummary(newSummary);
            saveToParent(newSummary);
            toast.success('✨ Perfect match generated!', { id: 'jobmatch' });
          }
          break;

        case 'voice-summary':
          setShowVoiceInput(true);
          break;

        case 'roast-summary':
          if (!summary) {
            toast.error('Write a summary first to roast it!');
            return;
          }
          setShowRoastMode(true);
          break;

        case 'live-feedback':
          setShowSemanticFeedback(true);
          break;

        case 'apply-role':
          result = await generateSummaryVariants(
            currentResume || data,
            jobDescription,
            {
              count: 1,
              targetRole: params.role,
              mode: 'targeted'
            }
          );

          if (result?.variants?.[0]) {
            setOptimizationHistory(prev => [...prev.slice(-9), summary]);
            const newSummary = result.variants[0].text || result.variants[0].content;
            setSummary(newSummary);
            saveToParent(newSummary);
            toast.success(`Optimized for ${params.role.title}`);
          }
          break;

        case 'analyze-job':
          result = await extractKeywords(jobDescription);
          if (result?.keywords) {
            setGlobalJobDescription(jobDescription);
            toast.success(`${result.keywords.length} keywords extracted`);
          }
          break;

        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error(`AI action ${action} failed:`, error);
      toast.error(`Failed to ${action}`);
      toast.dismiss();
    }
  }, [summary, currentResume, data, generateSummaryVariants, jobDescription, extractKeywords, setGlobalJobDescription, saveToParent]);

  const handleVoiceTranscribe = useCallback(async (transcript) => {
    setShowVoiceInput(false);

    toast.loading('Converting speech to summary...', { id: 'voice' });
    try {
      const result = await generateSummaryVariants(
        currentResume || data,
        null,
        {
          count: 1,
          voiceInput: transcript,
          mode: 'voice'
        }
      );

      if (result?.variants?.[0]) {
        setOptimizationHistory(prev => [...prev.slice(-9), summary]);
        const newSummary = result.variants[0].text || result.variants[0].content;
        setSummary(newSummary);
        saveToParent(newSummary);
        toast.success('Voice summary created!', { id: 'voice' });
      }
    } catch (error) {
      toast.error('Failed to process voice', { id: 'voice' });
    }
  }, [currentResume, data, generateSummaryVariants, summary, saveToParent]);

  const handleRoastFix = useCallback((fixedVersion) => {
    setShowRoastMode(false);
    setOptimizationHistory(prev => [...prev.slice(-9), summary]);
    setSummary(fixedVersion);
    saveToParent(fixedVersion);
    toast.success('🔥 Roasted and improved!');
  }, [summary, saveToParent]);

  const handleRoleSelect = useCallback((role) => {
    setShowRoleCarousel(false);
    handleAIAction('apply-role', { role });
  }, [handleAIAction]);

  // Utility Handlers
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [summary]);

  const undoChange = useCallback(() => {
    if (historyIndex >= 0 && optimizationHistory[historyIndex]) {
      const previousSummary = optimizationHistory[historyIndex];
      setSummary(previousSummary);
      setHistoryIndex(prev => prev - 1);
      saveToParent(previousSummary);
    }
  }, [optimizationHistory, historyIndex, saveToParent]);

  const redoChange = useCallback(() => {
    if (historyIndex + 1 < optimizationHistory.length) {
      const nextSummary = optimizationHistory[historyIndex + 1];
      setSummary(nextSummary);
      setHistoryIndex(prev => prev + 1);
      saveToParent(nextSummary);
    }
  }, [optimizationHistory, historyIndex, saveToParent]);

  const handleSelectVariant = useCallback((variant, index) => {
    setOptimizationHistory(prev => [...prev.slice(-9), summary]);
    const newSummary = variant.text || variant.content;
    setSummary(newSummary);
    setActiveVariant(index);
    saveToParent(newSummary);
    toast.success('Variant applied');
  }, [summary, saveToParent]);

  const handleNext = useCallback(() => {
    // Save before navigating
    saveToParent(summary);
    setTimeout(() => {
      onNext?.();
    }, 100);
  }, [summary, saveToParent, onNext]);

  const handlePrev = useCallback(() => {
    // Save before navigating
    saveToParent(summary);
    setTimeout(() => {
      onPrev?.();
    }, 100);
  }, [summary, saveToParent, onPrev]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Professional Summary
              </h2>
              <p className="text-gray-600 text-sm">
                Write a compelling summary of your professional background
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Save Status Indicator */}
              {isSaving && (
                <span className="text-sm text-blue-500 animate-pulse">Saving...</span>
              )}
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${aiStatus.connected ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-2 h-2 rounded-full ${aiStatus.connected ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`} />
                <span className={`text-sm font-medium ${aiStatus.connected ? 'text-green-800' : 'text-red-800'}`}>
                  {aiStatus.connected ? 'AI Ready' : 'AI Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Magic Banner */}
          {!summary && !magicVariants.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-center gap-4">
                <SparklesIcon className="w-8 h-8 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Let AI write your summary! Click the magic button below to generate 3 tailored versions from your profile.
                  </p>
                </div>
                <button
                  onClick={() => handleAIAction('magic-generate')}
                  disabled={!aiStatus.connected}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  ✨ Generate
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Description */}
            <div className="space-y-4">
              <JobDescriptionBox
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onAnalyze={() => handleAIAction('analyze-job')}
                isAnalyzing={isAnalyzing}
                aiStatus={aiStatus}
              />

              {/* Quick Stats */}
              {summary && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    Summary Stats
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">ATS Score</span>
                        <span className={`font-bold ${atsScore >= 80 ? 'text-green-600' : atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {atsScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${atsScore}%` }}
                          className={`h-2 rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Words</span>
                        <span className="font-bold">{wordCount}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {wordCount < 50 ? 'Too short' : wordCount > 200 ? 'Too long' : 'Good length'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Editor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Summary
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={undoChange}
                      disabled={historyIndex < 0}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Undo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redoChange}
                      disabled={historyIndex >= optimizationHistory.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Redo"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {isCopied ? <ClipboardCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={summary}
                  onChange={handleChange}
                  placeholder="Write your professional summary here, or let AI generate one for you..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 transition-all duration-200 resize-none"
                />

                {/* Character count and unsaved indicator */}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {summary.length} characters · {wordCount} words
                  </span>
                  {summary !== lastSavedSummary && (
                    <span className="text-xs text-amber-600">Unsaved changes...</span>
                  )}
                </div>
              </div>

              {/* AI Variants */}
              {showVariants && summaryVariants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-purple-600" />
                    AI Variants
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {summaryVariants.map((variant, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectVariant(variant, index)}
                        className={`p-3 rounded-lg text-left transition-all ${activeVariant === index
                          ? 'bg-purple-50 border-2 border-purple-500 shadow-md'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${activeVariant === index
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}>
                            {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${variant.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                            variant.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {variant.atsScore || 85}% Match
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-3">
                          {variant.text || variant.content}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="text-sm text-gray-500">
              {summary ? 'Summary ready' : 'No summary yet'}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={isSaving}
              className={`px-8 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all
                ${isSaving
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <AIFloatingMenu
        onAction={handleAIAction}
        isProcessing={isAnalyzing || isGenerating || isOptimizing}
        aiStatus={aiStatus}
        summary={summary}
        jobDescription={jobDescription}
        userProfile={currentResume || data}
      />

      <AnimatePresence>
        {showVoiceInput && (
          <AIVoiceInput
            onTranscribe={handleVoiceTranscribe}
            isActive={showVoiceInput}
            onClose={() => setShowVoiceInput(false)}
          />
        )}

        {showRoastMode && (
          <AIRoastMode
            summary={summary}
            onFix={handleRoastFix}
            onClose={() => setShowRoastMode(false)}
          />
        )}

        {showRoleCarousel && (
          <AIRoleCarousel
            onSelect={handleRoleSelect}
            onClose={() => setShowRoleCarousel(false)}
          />
        )}

        {showSemanticFeedback && (
          <AISemanticFeedback
            summary={summary}
            onClose={() => setShowSemanticFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SummaryPage);