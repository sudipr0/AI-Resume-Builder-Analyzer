// src/components/builder/LanguagesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Globe, Mic, Headphones, BookOpen, PenTool, Edit, Trash2,
  Plus, X, ChevronDown, Eye, EyeOff, Brain, Sparkles, CheckCircle,
  FileText, Save, Search, Grid, List, ArrowRight, ChevronLeft,
  Star, Zap, Target, Award, Trophy, Medal, Crown,
  Briefcase, GraduationCap, Filter, RefreshCw, Users,
  Flag, Languages as LanguagesIcon, Volume2, MessageSquare,
  Coffee, Compass, Wind, Heart, Diamond, Flame
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== AI ENHANCE MODAL ====================
const AIEnhanceModal = ({ language, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [enhancedVersion, setEnhancedVersion] = useState(null);

  const styles = [
    { id: 'professional', label: 'Professional', icon: Briefcase, color: 'blue', desc: 'Business context' },
    { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'green', desc: 'Formal proficiency' },
    { id: 'conversational', label: 'Conversational', icon: MessageSquare, color: 'purple', desc: 'Natural fluency' },
    { id: 'technical', label: 'Technical', icon: Code, color: 'red', desc: 'Technical terminology' },
    { id: 'cultural', label: 'Cultural', icon: Globe, color: 'yellow', desc: 'Cultural context' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEnhancedVersion({
        description: `• Native-level fluency in ${language.language || 'Nepali'} with complete mastery of speaking, reading, and writing
• Professional working proficiency in ${language.language2 || 'English'} (CEFR Level C1) with experience in international business communication
• Completed Advanced Language Certification from recognized institution
• Served as translator/interpreter for international delegations and business meetings`,
        achievements: [
          `Certified Professional Translator (${language.language || 'Nepali'} ↔ English)`,
          `Conducted language training workshops for 50+ professionals`,
          `Published articles in both ${language.language || 'Nepali'} and English publications`,
          `Volunteer interpreter for international NGOs and conferences`
        ],
        keywords: ['Translation', 'Interpretation', 'Business Communication', 'Cross-cultural', 'Bilingual'],
        score: 96,
        cefrLevel: language.cefrLevel || 'C1'
      });
    }, 2000);
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Language Enhancer</h2>
                <p className="text-purple-100">Showcase your multilingual abilities</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Original */}
          <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Original Language
            </h3>
            <p className="text-gray-800 font-medium mb-1">{language.language || 'Language'}</p>
            <p className="text-gray-600 text-sm">Proficiency: {language.proficiency || 'Intermediate'}</p>
            {language.description && (
              <p className="text-gray-600 text-sm mt-2">{language.description}</p>
            )}
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Enhancement Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedStyle === style.id
                      ? `border-${style.color}-500 bg-${style.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <style.icon className={`w-6 h-6 mx-auto mb-2 text-${style.color}-600`} />
                  <span className={`text-xs font-medium block text-center ${selectedStyle === style.id ? `text-${style.color}-700` : 'text-gray-700'
                    }`}>
                    {style.label}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 block">{style.desc}</span>
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
              >
                <Brain className="w-16 h-16 text-purple-600" />
              </motion.div>
              <p className="text-gray-600 mt-4 font-medium">AI is enhancing your language...</p>
              <p className="text-sm text-gray-500">This will take just a moment</p>
            </div>
          ) : enhancedVersion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg">Enhanced Version</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Score: {enhancedVersion.score}%
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                {enhancedVersion.cefrLevel && (
                  <div className="mb-4 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    CEFR Level: {enhancedVersion.cefrLevel}
                  </div>
                )}

                <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{enhancedVersion.description}</p>

                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Key Achievements
                </h4>
                <ul className="space-y-2 mb-5">
                  {enhancedVersion.achievements.map((ach, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{ach}</span>
                    </motion.li>
                  ))}
                </ul>

                <h4 className="font-medium text-gray-900 mb-2">Keywords Added</h4>
                <div className="flex flex-wrap gap-2">
                  {enhancedVersion.keywords.map((kw, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(enhancedVersion)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Apply Enhanced Version
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
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

// ==================== LANGUAGE CARD ====================
const LanguageCard = ({ language, index, onUpdate, onDelete, onEnhance, isEditing, setEditingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedLang, setEditedLang] = useState(language);

  const languageList = [
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
    { code: 'thr', name: 'Tharu', native: 'थारु' },
    { code: 'taj', name: 'Tamang', native: 'तामाङ' },
    { code: 'new', name: 'Newari', native: 'नेवारी' },
    { code: 'mag', name: 'Magar', native: 'मगर' },
    { code: 'awa', name: 'Awadhi', native: 'अवधी' },
    { code: 'gur', name: 'Gurung', native: 'तमु गुरुङ' },
    { code: 'lim', name: 'Limbu', native: 'यक्थुङ' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'ru', name: 'Russian', native: 'Русский' }
  ];

  const proficiencyLevels = [
    { id: 'beginner', name: 'Beginner', short: 'A1', description: 'Basic words and phrases', color: 'bg-gray-100 text-gray-700' },
    { id: 'elementary', name: 'Elementary', short: 'A2', description: 'Simple conversations', color: 'bg-blue-100 text-blue-700' },
    { id: 'intermediate', name: 'Intermediate', short: 'B1', description: 'Daily conversations', color: 'bg-green-100 text-green-700' },
    { id: 'upper-intermediate', name: 'Upper Intermediate', short: 'B2', description: 'Complex topics', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'advanced', name: 'Advanced', short: 'C1', description: 'Professional fluency', color: 'bg-orange-100 text-orange-700' },
    { id: 'proficient', name: 'Proficient', short: 'C2', description: 'Near-native fluency', color: 'bg-red-100 text-red-700' },
    { id: 'native', name: 'Native', short: 'N', description: 'Mother tongue', color: 'bg-purple-100 text-purple-700' }
  ];

  const skillCategories = [
    { id: 'speaking', name: 'Speaking', icon: Mic, color: 'bg-blue-100' },
    { id: 'listening', name: 'Listening', icon: Headphones, color: 'bg-green-100' },
    { id: 'reading', name: 'Reading', icon: BookOpen, color: 'bg-purple-100' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'bg-amber-100' }
  ];

  const handleSave = () => {
    onUpdate(index, editedLang);
    setEditingId(null);
    toast.success('Language updated successfully');
  };

  const getOverallProficiency = () => {
    const scores = {
      'beginner': 1,
      'elementary': 2,
      'intermediate': 3,
      'upper-intermediate': 4,
      'advanced': 5,
      'proficient': 6,
      'native': 7
    };

    const avg = (
      scores[language.speaking] +
      scores[language.listening] +
      scores[language.reading] +
      scores[language.writing]
    ) / 4;

    if (avg >= 6.5) return proficiencyLevels[6]; // Native
    if (avg >= 5.5) return proficiencyLevels[5]; // Proficient
    if (avg >= 4.5) return proficiencyLevels[4]; // Advanced
    if (avg >= 3.5) return proficiencyLevels[3]; // Upper Intermediate
    if (avg >= 2.5) return proficiencyLevels[2]; // Intermediate
    if (avg >= 1.5) return proficiencyLevels[1]; // Elementary
    return proficiencyLevels[0]; // Beginner
  };

  const overallLevel = getOverallProficiency();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-xl border-2 transition-all duration-300 ${isHovered ? 'border-purple-300 shadow-xl' : 'border-gray-200 shadow-sm'
        }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
          >
            <Globe className="w-7 h-7" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language.language || 'Language'}
                  </h3>
                  {language.nativeName && (
                    <span className="text-sm text-gray-500">({language.nativeName})</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${overallLevel.color}`}>
                    {overallLevel.name} ({overallLevel.short})
                  </span>
                  {language.certification && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {language.certification}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Expand */}
              <div className="flex items-center gap-2">
                {language.yearsOfExperience && (
                  <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{language.yearsOfExperience} years</span>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Skill Levels */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {skillCategories.map(skill => {
                const level = proficiencyLevels.find(l => l.id === language[skill.id]);
                return (
                  <div key={skill.id} className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 ${skill.color} rounded-lg flex items-center justify-center`}>
                      {React.createElement(skill.icon, { className: 'w-3 h-3 text-gray-700' })}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {level?.short || 'A1'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(index, { isVisible: !language.isVisible })}
              className={`p-2 rounded-lg transition-colors ${language.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                }`}
              title={language.isVisible ? 'Visible on resume' : 'Hidden from resume'}
            >
              {language.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditingId(language.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
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
              <div className="pt-5 mt-4 border-t border-gray-200">
                {language.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{language.description}</p>
                  </div>
                )}

                {/* Proficiency Guide */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Proficiency Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {skillCategories.map(skill => {
                      const level = proficiencyLevels.find(l => l.id === language[skill.id]);
                      return (
                        <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 ${skill.color} rounded-lg flex items-center justify-center`}>
                              {React.createElement(skill.icon, { className: 'w-3 h-3 text-gray-700' })}
                            </div>
                            <span className="text-sm text-gray-700">{skill.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${level?.color}`}>
                            {level?.name || 'Beginner'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Enhance Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(language)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance this Language with AI
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Language
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
                  <select
                    value={editedLang.language}
                    onChange={(e) => {
                      const selected = languageList.find(l => l.name === e.target.value);
                      setEditedLang({
                        ...editedLang,
                        language: e.target.value,
                        nativeName: selected?.native || ''
                      });
                    }}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
                  >
                    <option value="">Select language</option>
                    {languageList.map(lang => (
                      <option key={lang.code} value={lang.name}>
                        {lang.name} ({lang.native})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Native Name</label>
                  <input
                    type="text"
                    value={editedLang.nativeName}
                    onChange={(e) => setEditedLang({ ...editedLang, nativeName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
                    placeholder="e.g., नेपाली"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={editedLang.yearsOfExperience}
                    onChange={(e) => setEditedLang({ ...editedLang, yearsOfExperience: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
                    placeholder="e.g., 10"
                    min="0"
                    max="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                  <input
                    type="text"
                    value={editedLang.certification}
                    onChange={(e) => setEditedLang({ ...editedLang, certification: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
                    placeholder="e.g., IELTS 8.0, DELF B2, JLPT N2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Skill Levels *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skillCategories.map(skill => (
                      <div key={skill.id}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 ${skill.color} rounded-lg flex items-center justify-center`}>
                            {React.createElement(skill.icon, { className: 'w-3 h-3 text-gray-700' })}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        </div>
                        <select
                          value={editedLang[skill.id]}
                          onChange={(e) => setEditedLang({ ...editedLang, [skill.id]: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
                        >
                          {proficiencyLevels.map(level => (
                            <option key={level.id} value={level.id}>
                              {level.name} ({level.short})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedLang.description}
                    onChange={(e) => setEditedLang({ ...editedLang, description: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-gray-900"
                    placeholder="Describe your language proficiency, usage context, achievements, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingId(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium text-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==================== MAIN LANGUAGES PAGE ====================
const LanguagesPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  const [languages, setLanguages] = useState(data?.items || []);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [enhancingLang, setEnhancingLang] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ items: languages });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [languages, onUpdate]);

  const proficiencyLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'elementary', name: 'Elementary' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper-intermediate', name: 'Upper Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'proficient', name: 'Proficient' },
    { id: 'native', name: 'Native' }
  ];

  const emptyLanguage = {
    id: Date.now().toString(),
    language: '',
    nativeName: '',
    proficiency: 'intermediate',
    speaking: 'intermediate',
    listening: 'intermediate',
    reading: 'intermediate',
    writing: 'intermediate',
    yearsOfExperience: '',
    certification: '',
    description: '',
    isVisible: true
  };

  const handleReorder = (newOrder) => {
    setLanguages(newOrder);
    toast.success('Languages reordered');
  };

  const addLanguage = () => {
    const newLang = { ...emptyLanguage, id: Date.now().toString() };
    setLanguages([newLang, ...languages]);
    setEditingId(newLang.id);
    setShowAddForm(false);
    toast.success('New language added');
  };

  const updateLanguage = (index, updates) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], ...updates };
    setLanguages(updated);
  };

  const deleteLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
    toast.success('Language deleted');
  };

  const handleEnhance = (lang) => {
    setEnhancingLang(lang);
  };

  const handleApplyEnhancement = (enhanced) => {
    const index = languages.findIndex(l => l.id === enhancingLang.id);
    if (index !== -1) {
      updateLanguage(index, {
        description: enhanced.description
      });
      toast.success('Language enhanced with AI! ✨');
    }
    setEnhancingLang(null);
  };

  const getOverallLevel = (lang) => {
    const scores = {
      'beginner': 1,
      'elementary': 2,
      'intermediate': 3,
      'upper-intermediate': 4,
      'advanced': 5,
      'proficient': 6,
      'native': 7
    };

    const avg = (
      scores[lang.speaking] +
      scores[lang.listening] +
      scores[lang.reading] +
      scores[lang.writing]
    ) / 4;

    if (avg >= 6.5) return 'native';
    if (avg >= 5.5) return 'proficient';
    if (avg >= 4.5) return 'advanced';
    if (avg >= 3.5) return 'upper-intermediate';
    if (avg >= 2.5) return 'intermediate';
    if (avg >= 1.5) return 'elementary';
    return 'beginner';
  };

  const filteredLanguages = languages.filter(lang => {
    const matchesSearch = lang.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || getOverallLevel(lang) === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: languages.length,
    native: languages.filter(l => getOverallLevel(l) === 'native').length,
    fluent: languages.filter(l => ['advanced', 'proficient'].includes(getOverallLevel(l))).length,
    learning: languages.filter(l => ['beginner', 'elementary', 'intermediate'].includes(getOverallLevel(l))).length,
    certified: languages.filter(l => l.certification).length,
    visible: languages.filter(l => l.isVisible).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Languages</h1>
              <p className="text-gray-600 mt-2">Showcase your multilingual abilities and proficiency levels</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Languages', value: stats.total, icon: Globe, color: 'purple' },
              { label: 'Native', value: stats.native, icon: Crown, color: 'yellow' },
              { label: 'Fluent', value: stats.fluent, icon: Zap, color: 'green' },
              { label: 'Learning', value: stats.learning, icon: BookOpen, color: 'blue' },
              { label: 'Certified', value: stats.certified, icon: Award, color: 'red' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-20`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search languages by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
            >
              <option value="all">All Levels</option>
              {proficiencyLevels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Languages List */}
        {viewMode === 'grid' ? (
          <Reorder.Group
            axis="y"
            values={filteredLanguages}
            onReorder={handleReorder}
            className="space-y-4"
            as="div"
          >
            <AnimatePresence>
              {filteredLanguages.map((lang, index) => (
                <Reorder.Item key={lang.id} value={lang} whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
                  <LanguageCard
                    language={lang}
                    index={index}
                    onUpdate={updateLanguage}
                    onDelete={deleteLanguage}
                    onEnhance={handleEnhance}
                    isEditing={editingId === lang.id}
                    setEditingId={setEditingId}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredLanguages.map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lang.language || 'Language'}</h4>
                      <p className="text-sm text-gray-600">
                        {proficiencyLevels.find(l => l.id === getOverallLevel(lang))?.name || 'Beginner'}
                        {lang.certification && ` • ${lang.certification}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(lang.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLanguage(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {languages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Globe className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No languages added yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add the languages you speak to showcase your multilingual abilities and cross-cultural communication skills.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addLanguage}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 inline-flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Language
            </motion.button>
          </motion.div>
        )}

        {/* Add Button */}
        {languages.length > 0 && !showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 text-gray-600 hover:text-purple-600 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Language
          </motion.button>
        )}
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingLang && (
          <AIEnhanceModal
            language={enhancingLang}
            onClose={() => setEnhancingLang(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(LanguagesPage);