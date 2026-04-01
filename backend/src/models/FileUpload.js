import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  originalFilename: {
    type: String,
    required: true
  },
  storedFilename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
  },
  fileSize: {
    type: Number,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  extractionStatus: {
    type: String,
    enum: ['pending', 'extracting', 'completed', 'failed'],
    default: 'pending'
  },
  extractionData: {
    type: mongoose.Schema.Types.Mixed, // Stores the parsed JSON from AI before it's saved to a Resume
  },
  rawText: {
    type: String, // Store parsed raw text for debugging or fallback
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for quicker lookups
fileUploadSchema.index({ userId: 1, extractionStatus: 1 });
fileUploadSchema.index({ createdAt: -1 });

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

export default FileUpload;
