// src/components/builder/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  FolderKanban, Globe, Github, ExternalLink, Calendar, Users,
  Code, Palette, Database, Smartphone, Edit, Trash2, Plus, X,
  ChevronDown, Eye, EyeOff, Brain, Sparkles, CheckCircle, Award,
  FileText, Save, Search, Grid, List, ArrowRight, ChevronLeft,
  Star, Zap, Target, Link, Building, Clock, Hash, Trophy,
  Briefcase, GraduationCap, BookOpen, Filter, RefreshCw,
  Layout, Layers, Figma, Cpu, Cloud, Wrench, Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== AI ENHANCE MODAL ====================
const AIEnhanceModal = ({ project, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('technical');
  const [enhancedVersion, setEnhancedVersion] = useState(null);

  const styles = [
    { id: 'technical', label: 'Technical', icon: Code, color: 'blue', desc: 'Focus on technical details' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'green', desc: 'Business impact' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'purple', desc: 'Creative process' },
    { id: 'leadership', label: 'Leadership', icon: Users, color: 'yellow', desc: 'Team leadership' },
    { id: 'results', label: 'Results', icon: Target, color: 'red', desc: 'Quantifiable outcomes' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEnhancedVersion({
        description: `• Led development of ${project.title || 'a full-stack web application'} serving 10,000+ daily active users
• Architected scalable microservices backend using Node.js and MongoDB, reducing response time by 40%
• Implemented real-time features using WebSocket, enhancing user engagement by 60%
• Collaborated with cross-functional team of 5 developers using Agile methodology`,
        achievements: [
          `Increased user retention by 35% through intuitive UI/UX improvements`,
          `Reduced infrastructure costs by 25% by optimizing cloud resources`,
          `Successfully delivered project 2 weeks ahead of schedule`,
          `Received "Best Project" award in internal hackathon`
        ],
        keywords: ['Full Stack', 'Microservices', 'Real-time', 'Agile', 'Scalability', 'AWS'],
        score: 96
      });
    }, 2000);
  }, [project]);

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
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Project Enhancer</h2>
                <p className="text-indigo-100">Transform your project showcase</p>
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
              Original Project
            </h3>
            <p className="text-gray-800 font-medium mb-1">{project.title || 'Project Title'}</p>
            <p className="text-gray-600 text-sm">{project.description || 'No description added yet'}</p>
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
                <Brain className="w-16 h-16 text-indigo-600" />
              </motion.div>
              <p className="text-gray-600 mt-4 font-medium">AI is enhancing your project...</p>
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

              <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{enhancedVersion.description}</p>

                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
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
                      <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
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
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
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
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
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

// ==================== PROJECT CARD ====================
const ProjectCard = ({ project, index, onUpdate, onDelete, onEnhance, isEditing, setEditingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const categories = [
    { id: 'web', name: 'Web Development', icon: Globe, color: 'bg-blue-100' },
    { id: 'mobile', name: 'Mobile App', icon: Smartphone, color: 'bg-purple-100' },
    { id: 'design', name: 'UI/UX Design', icon: Palette, color: 'bg-pink-100' },
    { id: 'backend', name: 'Backend/API', icon: Database, color: 'bg-green-100' },
    { id: 'fullstack', name: 'Full Stack', icon: Code, color: 'bg-indigo-100' },
    { id: 'other', name: 'Other', icon: FolderKanban, color: 'bg-gray-100' }
  ];

  const CategoryIcon = categories.find(c => c.id === project.category)?.icon || FolderKanban;

  const handleSave = () => {
    onUpdate(index, editedProject);
    setEditingId(null);
    toast.success('Project updated successfully');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-xl border-2 transition-all duration-300 ${isHovered ? 'border-indigo-300 shadow-xl' : 'border-gray-200 shadow-sm'
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
            className={`w-14 h-14 ${categories.find(c => c.id === project.category)?.color || 'bg-gray-100'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <CategoryIcon className="w-7 h-7 text-gray-700" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {project.title || 'Project Title'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">
                    {categories.find(c => c.id === project.category)?.name || 'Category'}
                  </span>
                  {project.technologies && project.technologies.length > 0 && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Code className="w-3.5 h-3.5" />
                        {project.technologies.slice(0, 2).join(', ')}
                        {project.technologies.length > 2 && ` +${project.technologies.length - 2}`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Expand */}
              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
            {project.description && !isExpanded && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(index, { isVisible: !project.isVisible })}
              className={`p-2 rounded-lg transition-colors ${project.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                }`}
              title={project.isVisible ? 'Visible on resume' : 'Hidden from resume'}
            >
              {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditingId(project.id)}
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
                {project.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.description}</p>
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Enhance Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(project)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance this Project with AI
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
                Edit Project
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={editedProject.title}
                    onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="e.g., E-commerce Platform, Mobile Banking App"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editedProject.category}
                    onChange={(e) => setEditedProject({ ...editedProject, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input
                    type="text"
                    value={editedProject.timeline}
                    onChange={(e) => setEditedProject({ ...editedProject, timeline: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="e.g., Jan 2023 - Present"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedProject.description}
                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-gray-900"
                    placeholder="Describe the project, its purpose, key features, and your role..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={editedProject.technologies?.join(', ') || ''}
                    onChange={(e) => setEditedProject({
                      ...editedProject,
                      technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="e.g., React, Node.js, MongoDB, AWS"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editedProject.githubUrl}
                    onChange={(e) => setEditedProject({ ...editedProject, githubUrl: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={editedProject.liveUrl}
                    onChange={(e) => setEditedProject({ ...editedProject, liveUrl: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="https://project-demo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements (one per line)</label>
                  <textarea
                    value={editedProject.achievements?.join('\n') || ''}
                    onChange={(e) => setEditedProject({
                      ...editedProject,
                      achievements: e.target.value.split('\n').filter(a => a.trim())
                    })}
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-gray-900"
                    placeholder="Increased user engagement by 40%&#10;Reduced load time by 60%&#10;Won best project award"
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
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
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

// ==================== MAIN PROJECTS PAGE ====================
const ProjectsPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  const [projects, setProjects] = useState(data?.items || []);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [enhancingProject, setEnhancingProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ items: projects });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [projects, onUpdate]);

  const categories = [
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile App' },
    { id: 'design', name: 'UI/UX Design' },
    { id: 'backend', name: 'Backend/API' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'other', name: 'Other' }
  ];

  const emptyProject = {
    id: Date.now().toString(),
    title: '',
    category: 'web',
    description: '',
    technologies: [],
    timeline: '',
    githubUrl: '',
    liveUrl: '',
    achievements: [],
    isVisible: true
  };

  const handleReorder = (newOrder) => {
    setProjects(newOrder);
    toast.success('Projects reordered');
  };

  const addProject = () => {
    const newProject = { ...emptyProject, id: Date.now().toString() };
    setProjects([newProject, ...projects]);
    setEditingId(newProject.id);
    setShowAddForm(false);
    toast.success('New project added');
  };

  const updateProject = (index, updates) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], ...updates };
    setProjects(updated);
  };

  const deleteProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
    toast.success('Project deleted');
  };

  const handleEnhance = (project) => {
    setEnhancingProject(project);
  };

  const handleApplyEnhancement = (enhanced) => {
    const index = projects.findIndex(p => p.id === enhancingProject.id);
    if (index !== -1) {
      updateProject(index, {
        description: enhanced.description,
        achievements: enhanced.achievements
      });
      toast.success('Project enhanced with AI! ✨');
    }
    setEnhancingProject(null);
  };

  const filteredProjects = projects.filter(project =>
    (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || project.category === filterCategory)
  );

  const stats = {
    total: projects.length,
    web: projects.filter(p => p.category === 'web' || p.category === 'fullstack').length,
    mobile: projects.filter(p => p.category === 'mobile').length,
    visible: projects.filter(p => p.isVisible).length
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
              <h1 className="text-4xl font-bold text-gray-900">Projects Portfolio</h1>
              <p className="text-gray-600 mt-2">Showcase your technical projects and accomplishments</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Projects', value: stats.total, icon: FolderKanban, color: 'indigo' },
              { label: 'Web/Full Stack', value: stats.web, icon: Globe, color: 'blue' },
              { label: 'Mobile Apps', value: stats.mobile, icon: Smartphone, color: 'purple' },
              { label: 'Visible', value: stats.visible, icon: Eye, color: 'green' }
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
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Projects List */}
        {viewMode === 'grid' ? (
          <Reorder.Group
            axis="y"
            values={filteredProjects}
            onReorder={handleReorder}
            className="space-y-4"
            as="div"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <Reorder.Item key={project.id} value={project} whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
                  <ProjectCard
                    project={project}
                    index={index}
                    onUpdate={updateProject}
                    onDelete={deleteProject}
                    onEnhance={handleEnhance}
                    isEditing={editingId === project.id}
                    setEditingId={setEditingId}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.title || 'Project'}</h4>
                      <p className="text-sm text-gray-600">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingId(project.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(index)}
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
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <FolderKanban className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No projects added yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add your projects to showcase your technical skills and real-world experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addProject}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 inline-flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Project
            </motion.button>
          </motion.div>
        )}

        {/* Add Button */}
        {projects.length > 0 && !showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Project
          </motion.button>
        )}
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingProject && (
          <AIEnhanceModal
            project={enhancingProject}
            onClose={() => setEnhancingProject(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ProjectsPage);