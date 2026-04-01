import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema({
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
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    default: ''
  },
  jobDescription: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  
  // Breakdown of match
  skillsMatch: {
    score: Number,
    matching: [String],
    missing: [String]
  },
  experienceMatch: {
    score: Number,
    yearsRequired: Number,
    yearsUserHas: Number
  },
  keywordDensity: {
    score: Number,
    found: [String],
    missing: [String]
  },
  
  // Recommendations provided by AI
  suggestions: {
    critical: [{
      type: { type: String }, // e.g., 'skill_missing', 'summary_optimization'
      message: String,
      action: String
    }],
    important: [{
      type: { type: String },
      message: String,
      action: String
    }],
    optional: [{
      type: { type: String },
      message: String,
      action: String
    }]
  },
  
  // Suggested changes based on the job
  optimizedContent: mongoose.Schema.Types.Mixed,

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const JobMatch = mongoose.model('JobMatch', jobMatchSchema);

export default JobMatch;
