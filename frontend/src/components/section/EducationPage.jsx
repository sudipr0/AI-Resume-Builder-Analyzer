// src/components/builder/EducationPage.jsx - UPDATED WITH BLACK TEXT
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  GraduationCap, Calendar, MapPin, BookOpen, Edit, Trash2,
  Plus, X, ChevronUp, ChevronDown, Users, Star, Eye, EyeOff,
  Globe, Building, CheckCircle, Award, Trophy, Target,
  Brain, Sparkles, FileText, Save, Download, Upload,
  Clock, Hash, Medal, Crown, Diamond, Flame, Heart,
  Zap, Rocket, TrendingUp, BarChart, PieChart,
  Layers, Palette, Code, Coffee, Compass, Wind,
  Moon, Sun, Volume2, VolumeX, Mic, MicOff,
  Briefcase, MessageSquare, Wrench, Cpu, Shield,
  Cloud, Smartphone, Filter, Search, List,
  Grid, Maximize2, Minimize2, RefreshCw,
  ArrowRight, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== AI ENHANCE MODAL ====================
const AIEnhanceModal = ({ education, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('academic');
  const [enhancedVersion, setEnhancedVersion] = useState(null);

  const styles = [
    { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'green', desc: 'Formal academic tone' },
    { id: 'achievement', label: 'Achievement', icon: Award, color: 'blue', desc: 'Highlight accomplishments' },
    { id: 'technical', label: 'Technical', icon: Code, color: 'purple', desc: 'Focus on technical skills' },
    { id: 'research', label: 'Research', icon: Target, color: 'red', desc: 'Emphasize research work' },
    { id: 'leadership', label: 'Leadership', icon: Crown, color: 'yellow', desc: 'Showcase leadership' }
  ];

  useEffect(() => {
    // Simulate AI enhancement
    setTimeout(() => {
      setEnhancedVersion({
        description: `• Graduated with Distinction in ${education.degree || 'Computer Science'}, achieving a ${education.gpa || '3.8'} GPA
• Completed thesis on "Machine Learning Applications in Healthcare" with published research paper
• Led team of 5 students to win Inter-College Project Competition 2023
• Actively participated in technical workshops and coding competitions`,
        achievements: [
          `Dean's List Award for Academic Excellence (${education.graduationYear || '2023'})`,
          'Published research paper in International Journal of Computer Applications',
          'First Prize in National Level Hackathon - 2023',
          'Organized Technical Symposium with 200+ participants'
        ],
        keywords: ['Research', 'Leadership', 'Academic Excellence', 'Publication', 'Project Management'],
        score: 92
      });
    }, 2000);
  }, [education]);

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
        <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold text-white">AI Education Enhancer</h2>
                <p className="text-green-100">Transform your academic profile</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Original */}
          <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-700" />
              Original Entry
            </h3>
            <p className="text-gray-900 font-medium mb-1">
              {education.school || 'School/College'} - {education.degree || 'Degree'}
            </p>
            <p className="text-gray-700 text-sm">{education.description || 'No description added yet'}</p>
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
                  <span className={`text-xs font-medium block text-center ${selectedStyle === style.id ? `text-${style.color}-700` : 'text-gray-900'
                    }`}>
                    {style.label}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1 block">{style.desc}</span>
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
                <Brain className="w-16 h-16 text-green-600" />
              </motion.div>
              <p className="text-gray-900 mt-4 font-medium">AI is enhancing your education...</p>
              <p className="text-sm text-gray-600">This will take just a moment</p>
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
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                <p className="text-gray-900 whitespace-pre-line mb-4 leading-relaxed">{enhancedVersion.description}</p>

                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
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
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{ach}</span>
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
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
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
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                  Apply Enhanced Version
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-900"
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

// ==================== EDUCATION CARD ====================
const EducationCard = ({ education, index, onUpdate, onDelete, onEnhance, isEditing, setEditingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedEdu, setEditedEdu] = useState(education);
  const [gpaFormat, setGpaFormat] = useState('4.0');

  const nepaliDegreeTypes = [
    'SEE/SLC',
    '+2/Intermediate',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'M.Phil.',
    'PhD',
    'Postgraduate Diploma',
    'Certificate Level',
    'Technical School'
  ];

  const nepaliBoards = [
    'Tribhuvan University (TU)',
    'Kathmandu University (KU)',
    'Pokhara University (PU)',
    'Purbanchal University',
    'Nepal Sanskrit University',
    'Mid-Western University',
    'Far-Western University',
    'Lumbini Buddhist University',
    'National Examination Board (NEB)',
    'CTEVT',
    'Other'
  ];

  const nepaliFaculties = [
    'Science & Technology',
    'Management',
    'Humanities & Social Sciences',
    'Education',
    'Engineering',
    'Medicine',
    'Law',
    'Agriculture',
    'Forestry',
    'Fine Arts',
    'Nursing'
  ];

  const handleSave = () => {
    onUpdate(index, editedEdu);
    setEditingId(null);
    toast.success('Education updated successfully');
  };

  const calculateGPA = (gpa, maxGpa) => {
    if (!gpa || !maxGpa) return null;
    const numericGpa = parseFloat(gpa);
    const numericMax = parseFloat(maxGpa);

    if (numericMax === 4.0) {
      if (numericGpa >= 3.7) return { text: 'Distinction', color: 'purple' };
      if (numericGpa >= 3.3) return { text: 'First Division', color: 'green' };
      if (numericGpa >= 2.7) return { text: 'Second Division', color: 'blue' };
      if (numericGpa >= 2.0) return { text: 'Pass', color: 'yellow' };
      return { text: 'Below Pass', color: 'red' };
    } else {
      const percentage = (numericGpa / numericMax) * 100;
      if (percentage >= 90) return { text: 'Distinction', color: 'purple' };
      if (percentage >= 80) return { text: 'First Division', color: 'green' };
      if (percentage >= 65) return { text: 'Second Division', color: 'blue' };
      if (percentage >= 50) return { text: 'Pass', color: 'yellow' };
      return { text: 'Below Pass', color: 'red' };
    }
  };

  const gpaRating = calculateGPA(education.gpa, education.maxGpa);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-xl border-2 transition-all duration-300 ${isHovered ? 'border-green-300 shadow-xl' : 'border-gray-200 shadow-sm'
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
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
          >
            <GraduationCap className="w-7 h-7 text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {education.degree || 'Degree Program'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-600" />
                    {education.school || 'Institution'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-600" />
                    {education.boardUniversity || 'Board/University'}
                  </span>
                  {education.location && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-600" />
                        {education.location}, Nepal
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Date and Expand */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-600" />
                  <span className="font-medium text-gray-900">{education.graduationYear || education.endDate?.split('-')[0] || 'Year'}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {education.faculty && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800">{education.faculty}</span>
                </div>
              )}
              {education.program && (
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-800">{education.program}</span>
                </div>
              )}
              {education.gpa && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-gray-900">{education.gpa}/{education.maxGpa}</span>
                  {gpaRating && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${gpaRating.color}-100 text-${gpaRating.color}-800`}>
                      {gpaRating.text}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(index, { isVisible: !education.isVisible })}
              className={`p-2 rounded-lg transition-colors ${education.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-100'
                }`}
              title={education.isVisible ? 'Visible on resume' : 'Hidden from resume'}
            >
              {education.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditingId(education.id)}
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
                {education.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-700" />
                      Description
                    </h4>
                    <p className="text-gray-800 whitespace-pre-line leading-relaxed">{education.description}</p>
                  </div>
                )}

                {education.courses?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-700" />
                      Key Courses
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {education.courses.map((course, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
                        >
                          {course}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Enhance Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(education)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Enhance this Education with AI
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
                <Edit className="w-4 h-4 text-gray-700" />
                Edit Education
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Degree Level *</label>
                  <select
                    value={editedEdu.degree}
                    onChange={(e) => setEditedEdu({ ...editedEdu, degree: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                  >
                    <option value="">Select degree</option>
                    {nepaliDegreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Program/Specialization</label>
                  <input
                    type="text"
                    value={editedEdu.program}
                    onChange={(e) => setEditedEdu({ ...editedEdu, program: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">School/College *</label>
                  <input
                    type="text"
                    value={editedEdu.school}
                    onChange={(e) => setEditedEdu({ ...editedEdu, school: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    placeholder="e.g., St. Xavier's College"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Board/University</label>
                  <select
                    value={editedEdu.boardUniversity}
                    onChange={(e) => setEditedEdu({ ...editedEdu, boardUniversity: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                  >
                    <option value="">Select board</option>
                    {nepaliBoards.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Faculty</label>
                  <select
                    value={editedEdu.faculty}
                    onChange={(e) => setEditedEdu({ ...editedEdu, faculty: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                  >
                    <option value="">Select faculty</option>
                    {nepaliFaculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Location</label>
                  <input
                    type="text"
                    value={editedEdu.location}
                    onChange={(e) => setEditedEdu({ ...editedEdu, location: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    placeholder="e.g., Kathmandu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Graduation Year *</label>
                  <input
                    type="number"
                    value={editedEdu.graduationYear}
                    onChange={(e) => setEditedEdu({ ...editedEdu, graduationYear: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    min="1950"
                    max="2030"
                    placeholder="2023"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">GPA/Percentage</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={editedEdu.gpa}
                      onChange={(e) => setEditedEdu({ ...editedEdu, gpa: e.target.value })}
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                      placeholder="3.8"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={gpaFormat}
                        onChange={(e) => {
                          setGpaFormat(e.target.value);
                          setEditedEdu({ ...editedEdu, maxGpa: e.target.value === '4.0' ? '4.0' : '100' });
                        }}
                        className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                      >
                        <option value="4.0">/4.0</option>
                        <option value="100">/100</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                  <textarea
                    value={editedEdu.description}
                    onChange={(e) => setEditedEdu({ ...editedEdu, description: e.target.value })}
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none text-gray-900"
                    placeholder="Describe your academic achievements, thesis, research, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-1">Relevant Courses (comma separated)</label>
                  <input
                    type="text"
                    value={editedEdu.courses?.join(', ') || ''}
                    onChange={(e) => setEditedEdu({
                      ...editedEdu,
                      courses: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    placeholder="Data Structures, Algorithms, Web Development"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingId(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium text-gray-900"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-white" />
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

// ==================== MAIN EDUCATION PAGE ====================
const EducationPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  const [educations, setEducations] = useState(data?.items || []);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [enhancingEdu, setEnhancingEdu] = useState(null);
  const [gpaFormat, setGpaFormat] = useState('4.0');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ items: educations });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [educations, onUpdate]);

  const emptyEducation = {
    id: Date.now().toString(),
    degree: '',
    school: '',
    location: '',
    startDate: '',
    endDate: '',
    graduationYear: '',
    gpa: '',
    maxGpa: gpaFormat === '4.0' ? '4.0' : '100',
    description: '',
    courses: [],
    isVisible: true,
    boardUniversity: '',
    faculty: '',
    program: ''
  };

  const handleReorder = (newOrder) => {
    setEducations(newOrder);
    toast.success('Education reordered');
  };

  const addEducation = () => {
    const newEdu = {
      ...emptyEducation,
      id: Date.now().toString(),
      maxGpa: gpaFormat === '4.0' ? '4.0' : '100'
    };
    setEducations([newEdu, ...educations]);
    setEditingId(newEdu.id);
    setShowAddForm(false);
    toast.success('New education added');
  };

  const updateEducation = (index, updates) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], ...updates };
    setEducations(updated);
  };

  const deleteEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
    toast.success('Education deleted');
  };

  const handleEnhance = (edu) => {
    setEnhancingEdu(edu);
  };

  const handleApplyEnhancement = (enhanced) => {
    const index = educations.findIndex(e => e.id === enhancingEdu.id);
    if (index !== -1) {
      updateEducation(index, {
        description: enhanced.description,
        courses: [...(educations[index].courses || []), ...enhanced.keywords]
      });
      toast.success('Education enhanced with AI! ✨');
    }
    setEnhancingEdu(null);
  };

  const filteredEducations = educations.filter(edu =>
    edu.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.program?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: educations.length,
    bachelor: educations.filter(e => e.degree?.includes('Bachelor')).length,
    master: educations.filter(e => e.degree?.includes('Master')).length,
    phd: educations.filter(e => e.degree === 'PhD').length,
    visible: educations.filter(e => e.isVisible).length
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
              <h1 className="text-4xl font-bold text-gray-900">Education</h1>
              <p className="text-gray-700 mt-2">Add your academic background - Nepal Education System</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'
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
              { label: 'Total', value: stats.total, icon: GraduationCap, color: 'blue' },
              { label: 'Bachelor', value: stats.bachelor, icon: BookOpen, color: 'green' },
              { label: 'Master', value: stats.master, icon: Award, color: 'purple' },
              { label: 'PhD', value: stats.phd, icon: Trophy, color: 'yellow' },
              { label: 'Visible', value: stats.visible, icon: Eye, color: 'teal' }
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
                    <p className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-20`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and GPA Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search education by degree, school, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-800">GPA Format:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={gpaFormat === '4.0'}
                onChange={() => setGpaFormat('4.0')}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-800">4.0 Scale</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={gpaFormat === '100'}
                onChange={() => setGpaFormat('100')}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-gray-800">Percentage</span>
            </label>
          </div>
        </div>

        {/* Education List */}
        {viewMode === 'grid' ? (
          <Reorder.Group
            axis="y"
            values={filteredEducations}
            onReorder={handleReorder}
            className="space-y-4"
            as="div"
          >
            <AnimatePresence>
              {filteredEducations.map((edu, index) => (
                <Reorder.Item key={edu.id} value={edu} whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
                  <EducationCard
                    education={edu}
                    index={index}
                    onUpdate={updateEducation}
                    onDelete={deleteEducation}
                    onEnhance={handleEnhance}
                    isEditing={editingId === edu.id}
                    setEditingId={setEditingId}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredEducations.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h4>
                      <p className="text-sm text-gray-700">{edu.school} • {edu.graduationYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(edu.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEducation(index)}
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
        {educations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No education added yet</h3>
            <p className="text-gray-700 mb-8 max-w-md mx-auto">
              Add your academic background to showcase your qualifications. Include degrees, institutions, and achievements.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addEducation}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:opacity-90 inline-flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" />
              Add Your First Education
            </motion.button>
          </motion.div>
        )}

        {/* Add Button */}
        {educations.length > 0 && !showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Education
          </motion.button>
        )}
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingEdu && (
          <AIEnhanceModal
            education={enhancingEdu}
            onClose={() => setEnhancingEdu(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(EducationPage);