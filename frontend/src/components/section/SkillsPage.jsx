// src/components/builder/SkillsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Code, Palette, Globe, Database, Wrench, Users, Cpu, Shield,
  Cloud, Smartphone, Edit, Trash2, Plus, X, ChevronDown, Eye, EyeOff,
  Brain, Sparkles, CheckCircle, FileText, Save, Search, Grid, List,
  ArrowRight, ChevronLeft, Star, Zap, Target, Award, Trophy,
  Briefcase, GraduationCap, BookOpen, Filter, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== AI ENHANCE MODAL ====================
const AIEnhanceModal = ({ skill, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('technical');
  const [enhancedVersion, setEnhancedVersion] = useState(null);

  const styles = [
    { id: 'technical', label: 'Technical', icon: Code, color: 'blue', desc: 'Focus on technical depth' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'green', desc: 'Business context' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'purple', desc: 'Creative application' },
    { id: 'leadership', label: 'Leadership', icon: Users, color: 'yellow', desc: 'Team impact' },
    { id: 'results', label: 'Results', icon: Target, color: 'red', desc: 'Quantifiable outcomes' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEnhancedVersion({
        description: `• Advanced proficiency in ${skill.name || 'this skill'} with 5+ years of hands-on experience
• Successfully implemented in 10+ production projects with measurable results
• Mentored 8 junior team members, improving team productivity by 35%
• Certified expert with advanced training and continuous learning`,
        achievements: [
          `Led migration to ${skill.name || 'new technology'} resulting in 40% performance improvement`,
          `Reduced development time by 25% through optimized ${skill.name || 'skill'} implementation`,
          `Received "Excellence in ${skill.name || 'Skill'}" award for outstanding contribution`
        ],
        keywords: ['Expert', 'Mentoring', 'Optimization', 'Best Practices', 'Innovation'],
        score: 94
      });
    }, 2000);
  }, [skill]);

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
        <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Skill Enhancer</h2>
                <p className="text-blue-100">Optimize your skill presentation</p>
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
              Original Skill
            </h3>
            <p className="text-gray-800 font-medium mb-1">{skill.name || 'Skill Name'}</p>
            <p className="text-gray-600 text-sm">{skill.description || 'No description added yet'}</p>
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
                <Brain className="w-16 h-16 text-blue-600" />
              </motion.div>
              <p className="text-gray-600 mt-4 font-medium">AI is enhancing your skill...</p>
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

              <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{enhancedVersion.description}</p>

                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
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
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
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

// ==================== SKILL CARD ====================
const SkillCard = ({ skill, index, onUpdate, onDelete, onEnhance, isEditing, setEditingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedSkill, setEditedSkill] = useState(skill);

  const categories = [
    { id: 'technical', name: 'Technical Skills', icon: Code, color: 'bg-blue-100' },
    { id: 'design', name: 'Design & Creative', icon: Palette, color: 'bg-purple-100' },
    { id: 'language', name: 'Languages', icon: Globe, color: 'bg-green-100' },
    { id: 'business', name: 'Business & Management', icon: Briefcase, color: 'bg-amber-100' },
    { id: 'soft', name: 'Soft Skills', icon: Users, color: 'bg-pink-100' },
    { id: 'technical2', name: 'IT & Technical', icon: Cpu, color: 'bg-indigo-100' }
  ];

  const proficiencyLevels = [
    { id: 'beginner', name: 'Beginner', color: 'bg-gray-100 text-gray-700' },
    { id: 'intermediate', name: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
    { id: 'advanced', name: 'Advanced', color: 'bg-green-100 text-green-700' },
    { id: 'expert', name: 'Expert', color: 'bg-purple-100 text-purple-700' }
  ];

  const CategoryIcon = categories.find(c => c.id === skill.category)?.icon || Code;

  const handleSave = () => {
    onUpdate(index, editedSkill);
    setEditingId(null);
    toast.success('Skill updated successfully');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-xl border-2 transition-all duration-300 ${isHovered ? 'border-blue-300 shadow-xl' : 'border-gray-200 shadow-sm'
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
            className={`w-14 h-14 ${categories.find(c => c.id === skill.category)?.color || 'bg-gray-100'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <CategoryIcon className="w-7 h-7 text-gray-700" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {skill.name || 'Skill Name'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">
                    {categories.find(c => c.id === skill.category)?.name || 'Category'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">
                    {skill.proficiency || 'Level'}
                  </span>
                </div>
              </div>

              {/* Expand */}
              <div className="flex items-center gap-2">
                {skill.years && (
                  <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    <span className="font-medium">{skill.years} years</span>
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

            {/* Quick Info */}
            {skill.description && !isExpanded && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{skill.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(index, { isVisible: !skill.isVisible })}
              className={`p-2 rounded-lg transition-colors ${skill.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                }`}
              title={skill.isVisible ? 'Visible on resume' : 'Hidden from resume'}
            >
              {skill.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditingId(skill.id)}
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
                {skill.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{skill.description}</p>
                  </div>
                )}

                {/* AI Enhance Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(skill)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance this Skill with AI
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
                Edit Skill
              </h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    value={editedSkill.name}
                    onChange={(e) => setEditedSkill({ ...editedSkill, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    placeholder="e.g., React, Python, Project Management"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editedSkill.category}
                      onChange={(e) => setEditedSkill({ ...editedSkill, category: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                    <select
                      value={editedSkill.proficiency}
                      onChange={(e) => setEditedSkill({ ...editedSkill, proficiency: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    >
                      {proficiencyLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={editedSkill.years}
                    onChange={(e) => setEditedSkill({ ...editedSkill, years: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    placeholder="e.g., 5"
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedSkill.description}
                    onChange={(e) => setEditedSkill({ ...editedSkill, description: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
                    placeholder="Describe your experience with this skill, certifications, achievements..."
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
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
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

// ==================== MAIN SKILLS PAGE ====================
const SkillsPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  const [skills, setSkills] = useState(data?.items || []);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [enhancingSkill, setEnhancingSkill] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ items: skills });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [skills, onUpdate]);

  const categories = [
    { id: 'technical', name: 'Technical Skills' },
    { id: 'design', name: 'Design & Creative' },
    { id: 'language', name: 'Languages' },
    { id: 'business', name: 'Business & Management' },
    { id: 'soft', name: 'Soft Skills' },
    { id: 'technical2', name: 'IT & Technical' }
  ];

  const emptySkill = {
    id: Date.now().toString(),
    name: '',
    category: 'technical',
    proficiency: 'intermediate',
    years: '',
    description: '',
    isVisible: true
  };

  const handleReorder = (newOrder) => {
    setSkills(newOrder);
    toast.success('Skills reordered');
  };

  const addSkill = () => {
    const newSkill = { ...emptySkill, id: Date.now().toString() };
    setSkills([newSkill, ...skills]);
    setEditingId(newSkill.id);
    setShowAddForm(false);
    toast.success('New skill added');
  };

  const updateSkill = (index, updates) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], ...updates };
    setSkills(updated);
  };

  const deleteSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
    toast.success('Skill deleted');
  };

  const handleEnhance = (skill) => {
    setEnhancingSkill(skill);
  };

  const handleApplyEnhancement = (enhanced) => {
    const index = skills.findIndex(s => s.id === enhancingSkill.id);
    if (index !== -1) {
      updateSkill(index, {
        description: enhanced.description
      });
      toast.success('Skill enhanced with AI! ✨');
    }
    setEnhancingSkill(null);
  };

  const filteredSkills = skills.filter(skill =>
    (skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || skill.category === filterCategory)
  );

  const stats = {
    total: skills.length,
    technical: skills.filter(s => s.category === 'technical' || s.category === 'technical2').length,
    visible: skills.filter(s => s.isVisible).length
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
              <h1 className="text-4xl font-bold text-gray-900">Skills & Expertise</h1>
              <p className="text-gray-600 mt-2">Showcase your professional skills and proficiencies</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Skills', value: stats.total, icon: Code, color: 'blue' },
              { label: 'Technical', value: stats.technical, icon: Cpu, color: 'green' },
              { label: 'Visible', value: stats.visible, icon: Eye, color: 'purple' }
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
              placeholder="Search skills by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Skills List */}
        {viewMode === 'grid' ? (
          <Reorder.Group
            axis="y"
            values={filteredSkills}
            onReorder={handleReorder}
            className="space-y-4"
            as="div"
          >
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <Reorder.Item key={skill.id} value={skill} whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
                  <SkillCard
                    skill={skill}
                    index={index}
                    onUpdate={updateSkill}
                    onDelete={deleteSkill}
                    onEnhance={handleEnhance}
                    isEditing={editingId === skill.id}
                    setEditingId={setEditingId}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{skill.name || 'Skill'}</h4>
                      <p className="text-sm text-gray-600">{skill.category} • {skill.proficiency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(skill.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSkill(index)}
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
        {skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Code className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No skills added yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add your professional skills to showcase your expertise and qualifications.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSkill}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:opacity-90 inline-flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Skill
            </motion.button>
          </motion.div>
        )}

        {/* Add Button */}
        {skills.length > 0 && !showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Skill
          </motion.button>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            Next: Projects
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingSkill && (
          <AIEnhanceModal
            skill={enhancingSkill}
            onClose={() => setEnhancingSkill(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SkillsPage);