import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  section: { type: String, required: true },
  type: { type: String, enum: ['critical', 'warning', 'tip'], required: true },
  message: { type: String, required: true },
  improvement: { type: String }
}, { _id: false });

const resumeAnalysisSchema = new mongoose.Schema({
  resumeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume',
    required: true,
    index: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  jobDescription: { type: String },
  jobTitle: { type: String },
  company: { type: String },

  atsScore: { type: Number, default: 0 }, // 0-100
  matchScore: { type: Number, default: 0 }, // job description match %

  scores: {
    formatting: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    readability: { type: Number, default: 0 }
  },

  keywords: {
    matched: [{ type: String }],
    missing: [{ type: String }],
    suggested: [{ type: String }]
  },

  suggestions: [suggestionSchema],

  aiSummary: { type: String },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }]

}, {
  timestamps: true
});

resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
