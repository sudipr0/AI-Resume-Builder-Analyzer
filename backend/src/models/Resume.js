import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

// ==================== SUB-SCHEMAS ====================

const contactSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  website: { type: String, default: '' }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => nanoid(10) },
  company: { type: String, default: '' },
  title: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  bullets: [{ type: String }],
  technologies: [{ type: String }]
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String, default: () => nanoid(10) },
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  honors: { type: String, default: '' }
}, { _id: false });

const skillItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  level: { type: Number, min: 1, max: 5, default: 3 }
}, { _id: false });

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, default: '' },
  items: [skillItemSchema]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  technologies: [{ type: String }]
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: false });

const languageSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  proficiency: { type: String, default: '' }
}, { _id: false });

const awardSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const volunteerSchema = new mongoose.Schema({
  organization: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

// ==================== MAIN SCHEMA ====================

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { type: String, required: true },
  template: { type: String, default: 'modern' },
  status: { type: String, enum: ['draft', 'complete', 'archived'], default: 'draft' },
  
  // Flattened content fields
  personalInfo: { type: contactSchema, default: () => ({}) },
  summary: { type: String, default: '' },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  skills: { type: [skillCategorySchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  languages: { type: [languageSchema], default: [] },
  awards: { type: [awardSchema], default: [] },
  volunteer: { type: [volunteerSchema], default: [] },
  
  // AI and Meta
  analysis: {
    atsScore: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    suggestions: [{ type: String }],
    lastAnalyzed: Date
  },
  
  templateSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      templateName: 'modern',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#10b981',
        background: '#ffffff',
        text: '#000000',
        header: '#1e40af'
      },
      font: 'inter',
      fontSize: 'medium',
      spacing: 'normal',
      showPhoto: false,
      layout: 'single-column'
    })
  },

  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, sparse: true },
  color: { type: String, default: '#3b82f6' },
  font: { type: String, default: 'inter' },
  tags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

resumeSchema.index({ userId: 1, updatedAt: -1 });

// Methods
resumeSchema.methods.duplicate = async function(userId) {
    const resumeObj = this.toObject();
    delete resumeObj._id;
    delete resumeObj.id;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;
    delete resumeObj.shareToken;
    
    resumeObj.userId = userId || this.userId;
    resumeObj.title = `${resumeObj.title} (Copy)`;
    resumeObj.views = 0;
    resumeObj.downloads = 0;
    resumeObj.status = 'draft';
    
    const newResume = new mongoose.model('Resume')(resumeObj);
    await newResume.save();
    return newResume;
};

// Statics
resumeSchema.statics.getDashboardStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { 
            $group: {
                _id: null,
                totalResumes: { $sum: 1 },
                completedCount: { 
                    $sum: { $cond: [{ $eq: ["$status", "complete"] }, 1, 0] } 
                },
                draftCount: { 
                    $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } 
                },
                totalViews: { $sum: "$views" },
                avgAtsScore: { $avg: "$analysis.atsScore" }
            }
        }
    ]);
    
    return stats[0] || {
        totalResumes: 0,
        completedCount: 0,
        draftCount: 0,
        totalViews: 0,
        avgAtsScore: 0
    };
};

resumeSchema.pre('save', function (next) {
  if (this.isPublic && !this.shareToken) {
    this.shareToken = nanoid(12);
  }
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;