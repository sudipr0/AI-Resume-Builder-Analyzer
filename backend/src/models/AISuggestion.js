// backend/src/models/AISuggestion.js
import mongoose from 'mongoose';

const aiSuggestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
        index: true
    },
    section: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['grammar', 'improvement', 'keyword', 'metric', 'summarization', 'rephrasing'],
        required: true
    },
    originalContent: {
        type: mongoose.Schema.Types.Mixed
    },
    suggestedContent: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    explanation: {
        type: String
    },
    impact: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ignored'],
        default: 'pending'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes for common queries
aiSuggestionSchema.index({ resumeId: 1, status: 1 });
aiSuggestionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('AISuggestion', aiSuggestionSchema);