// src/components/builder/CertificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Award, Calendar, Building, Edit, Trash2, Plus, X,
  ChevronDown, Eye, EyeOff, Brain, Sparkles, CheckCircle,
  FileText, Save, Search, Grid, List, ArrowRight, ChevronLeft,
  Star, Zap, Target, Link, Hash, Trophy, Medal, Crown,
  Briefcase, GraduationCap, BookOpen, Filter, RefreshCw,
  Globe, Download, Upload, Clock, Users, Code, Palette
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== AI ENHANCE MODAL ====================
const AIEnhanceModal = ({ certification, onClose, onEnhance, isProcessing }) => {
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [enhancedVersion, setEnhancedVersion] = useState(null);

  const styles = [
    { id: 'professional', label: 'Professional', icon: Briefcase, color: 'blue', desc: 'Formal certification tone' },
    { id: 'technical', label: 'Technical', icon: Code, color: 'green', desc: 'Technical focus' },
    { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'purple', desc: 'Academic achievement' },
    { id: 'leadership', label: 'Leadership', icon: Users, color: 'yellow', desc: 'Leadership context' },
    { id: 'results', label: 'Results', icon: Target, color: 'red', desc: 'Impact & outcomes' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEnhancedVersion({
        description: `• Earned prestigious ${certification.name || 'Professional Certification'} from ${certification.issuer || 'recognized institution'}
• Demonstrated advanced expertise through rigorous examination and practical application
• Completed 120+ hours of comprehensive training and hands-on projects
• Maintained certification through continuous professional development`,
        achievements: [
          `Achieved score in top 10% of all candidates worldwide`,
          `Applied certification knowledge to improve team productivity by 35%`,
          `Mentored 5 colleagues who also obtained certification`,
          `Featured as case study for certification excellence`
        ],
        keywords: ['Certified', 'Expert', 'Verified', 'Professional Development', 'Industry Standard'],
        score: 95,
        expiryInfo: certification.expiryDate ? `Valid until ${certification.expiryDate}` : 'No expiry'
      });
    }, 2000);
  }, [certification]);

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
        <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Certification Enhancer</h2>
                <p className="text-amber-100">Elevate your professional credentials</p>
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
              Original Certification
            </h3>
            <p className="text-gray-800 font-medium mb-1">{certification.name || 'Certification Name'}</p>
            <p className="text-gray-600 text-sm">{certification.issuer || 'Issuing Organization'} • {certification.year || 'Year'}</p>
            {certification.description && (
              <p className="text-gray-600 text-sm mt-2">{certification.description}</p>
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
                <Brain className="w-16 h-16 text-amber-600" />
              </motion.div>
              <p className="text-gray-600 mt-4 font-medium">AI is enhancing your certification...</p>
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

              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{enhancedVersion.description}</p>

                {enhancedVersion.expiryInfo && (
                  <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {enhancedVersion.expiryInfo}
                  </div>
                )}

                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
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
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
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
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
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

// ==================== CERTIFICATION CARD ====================
const CertificationCard = ({ certification, index, onUpdate, onDelete, onEnhance, isEditing, setEditingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedCert, setEditedCert] = useState(certification);

  const issuers = [
    'Microsoft',
    'Google',
    'Amazon (AWS)',
    'Cisco',
    'Oracle',
    'IBM',
    'CompTIA',
    'PMI',
    'ISACA',
    'Salesforce',
    'Adobe',
    'Autodesk',
    'HubSpot',
    'Google Analytics',
    'Facebook Blueprint',
    'LinkedIn Learning',
    'Coursera',
    'edX',
    'Udemy',
    'Nepal Engineering Council',
    'Tribhuvan University',
    'Kathmandu University',
    'Pokhara University',
    'CTEVT',
    'Other'
  ];

  const handleSave = () => {
    onUpdate(index, editedCert);
    setEditingId(null);
    toast.success('Certification updated successfully');
  };

  const isExpired = () => {
    if (!certification.expiryDate) return false;
    const expiry = new Date(certification.expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const isExpiringSoon = () => {
    if (!certification.expiryDate) return false;
    const expiry = new Date(certification.expiryDate);
    const today = new Date();
    const threeMonths = new Date();
    threeMonths.setMonth(today.getMonth() + 3);
    return expiry > today && expiry < threeMonths;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-white rounded-xl border-2 transition-all duration-300 ${isHovered ? 'border-amber-300 shadow-xl' : 'border-gray-200 shadow-sm'
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
            className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
          >
            <Award className="w-7 h-7" />
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {certification.name || 'Certification Name'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {certification.issuer || 'Issuing Organization'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {certification.year || 'Year'}
                  </span>
                  {certification.credentialId && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5" />
                        ID: {certification.credentialId}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badges and Expand */}
              <div className="flex items-center gap-2">
                {isExpired() && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                    Expired
                  </span>
                )}
                {isExpiringSoon() && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                    Expiring Soon
                  </span>
                )}
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link className="w-4 h-4" />
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
            {certification.description && !isExpanded && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{certification.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(index, { isVisible: !certification.isVisible })}
              className={`p-2 rounded-lg transition-colors ${certification.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                }`}
              title={certification.isVisible ? 'Visible on resume' : 'Hidden from resume'}
            >
              {certification.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditingId(certification.id)}
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
                {certification.description && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{certification.description}</p>
                  </div>
                )}

                {certification.skills && certification.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Skills Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {certification.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Enhance Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnhance(certification)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance this Certification with AI
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
                Edit Certification
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                  <input
                    type="text"
                    value={editedCert.name}
                    onChange={(e) => setEditedCert({ ...editedCert, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                  <select
                    value={editedCert.issuer}
                    onChange={(e) => setEditedCert({ ...editedCert, issuer: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                  >
                    <option value="">Select issuer</option>
                    {issuers.map(issuer => <option key={issuer} value={issuer}>{issuer}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Obtained *</label>
                  <input
                    type="number"
                    value={editedCert.year}
                    onChange={(e) => setEditedCert({ ...editedCert, year: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                    placeholder="2023"
                    min="1980"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (if applicable)</label>
                  <input
                    type="month"
                    value={editedCert.expiryDate}
                    onChange={(e) => setEditedCert({ ...editedCert, expiryDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={editedCert.credentialId}
                    onChange={(e) => setEditedCert({ ...editedCert, credentialId: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                    placeholder="e.g., ABC123XYZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                  <input
                    type="url"
                    value={editedCert.credentialUrl}
                    onChange={(e) => setEditedCert({ ...editedCert, credentialUrl: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                    placeholder="https://www.credential.net/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedCert.description}
                    onChange={(e) => setEditedCert({ ...editedCert, description: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none text-gray-900"
                    placeholder="Describe what you learned, skills acquired, and how you've applied this certification..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills Covered (comma separated)</label>
                  <input
                    type="text"
                    value={editedCert.skills?.join(', ') || ''}
                    onChange={(e) => setEditedCert({
                      ...editedCert,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900"
                    placeholder="e.g., Cloud Architecture, AWS, DevOps, Security"
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
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center gap-2"
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

// ==================== MAIN CERTIFICATIONS PAGE ====================
const CertificationsPage = ({ data = {}, onUpdate, onNext, onPrev }) => {
  const [certifications, setCertifications] = useState(data?.items || []);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [enhancingCert, setEnhancingCert] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIssuer, setFilterIssuer] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onUpdate) {
        onUpdate({ items: certifications });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [certifications, onUpdate]);

  const issuers = [
    'Microsoft',
    'Google',
    'Amazon (AWS)',
    'Cisco',
    'CompTIA',
    'PMI',
    'Oracle',
    'Other'
  ];

  const emptyCertification = {
    id: Date.now().toString(),
    name: '',
    issuer: '',
    year: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: [],
    isVisible: true
  };

  const handleReorder = (newOrder) => {
    setCertifications(newOrder);
    toast.success('Certifications reordered');
  };

  const addCertification = () => {
    const newCert = { ...emptyCertification, id: Date.now().toString() };
    setCertifications([newCert, ...certifications]);
    setEditingId(newCert.id);
    setShowAddForm(false);
    toast.success('New certification added');
  };

  const updateCertification = (index, updates) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], ...updates };
    setCertifications(updated);
  };

  const deleteCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
    toast.success('Certification deleted');
  };

  const handleEnhance = (cert) => {
    setEnhancingCert(cert);
  };

  const handleApplyEnhancement = (enhanced) => {
    const index = certifications.findIndex(c => c.id === enhancingCert.id);
    if (index !== -1) {
      updateCertification(index, {
        description: enhanced.description
      });
      toast.success('Certification enhanced with AI! ✨');
    }
    setEnhancingCert(null);
  };

  const filteredCertifications = certifications.filter(cert =>
    (cert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterIssuer === 'all' || cert.issuer === filterIssuer)
  );

  const stats = {
    total: certifications.length,
    active: certifications.filter(c => {
      if (!c.expiryDate) return true;
      const expiry = new Date(c.expiryDate);
      const today = new Date();
      return expiry >= today;
    }).length,
    expiring: certifications.filter(c => {
      if (!c.expiryDate) return false;
      const expiry = new Date(c.expiryDate);
      const today = new Date();
      const threeMonths = new Date();
      threeMonths.setMonth(today.getMonth() + 3);
      return expiry > today && expiry < threeMonths;
    }).length,
    visible: certifications.filter(c => c.isVisible).length
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
              <h1 className="text-4xl font-bold text-gray-900">Certifications</h1>
              <p className="text-gray-600 mt-2">Showcase your professional certifications and credentials</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-100'
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
              { label: 'Total Certifications', value: stats.total, icon: Award, color: 'amber' },
              { label: 'Active', value: stats.active, icon: CheckCircle, color: 'green' },
              { label: 'Expiring Soon', value: stats.expiring, icon: Clock, color: 'yellow' },
              { label: 'Visible', value: stats.visible, icon: Eye, color: 'blue' }
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
              placeholder="Search certifications by name, issuer, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterIssuer}
              onChange={(e) => setFilterIssuer(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-900"
            >
              <option value="all">All Issuers</option>
              {issuers.map(issuer => <option key={issuer} value={issuer}>{issuer}</option>)}
            </select>
          </div>
        </div>

        {/* Certifications List */}
        {viewMode === 'grid' ? (
          <Reorder.Group
            axis="y"
            values={filteredCertifications}
            onReorder={handleReorder}
            className="space-y-4"
            as="div"
          >
            <AnimatePresence>
              {filteredCertifications.map((cert, index) => (
                <Reorder.Item key={cert.id} value={cert} whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
                  <CertificationCard
                    certification={cert}
                    index={index}
                    onUpdate={updateCertification}
                    onDelete={deleteCertification}
                    onEnhance={handleEnhance}
                    isEditing={editingId === cert.id}
                    setEditingId={setEditingId}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredCertifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name || 'Certification'}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Link className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingId(cert.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCertification(index)}
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
        {certifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Award className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No certifications added yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add your professional certifications to showcase your expertise and credentials.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCertification}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:opacity-90 inline-flex items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your First Certification
            </motion.button>
          </motion.div>
        )}

        {/* Add Button */}
        {certifications.length > 0 && !showAddForm && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 hover:bg-amber-50 text-gray-600 hover:text-amber-600 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Certification
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
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            Next: Languages
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhancingCert && (
          <AIEnhanceModal
            certification={enhancingCert}
            onClose={() => setEnhancingCert(null)}
            onEnhance={handleApplyEnhancement}
            isProcessing={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(CertificationsPage);