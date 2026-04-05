// backend/src/models/AILog.js
import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    action: {
        type: String,
        required: true,
        index: true
    },
    provider: {
        type: String,
        enum: ['openai', 'groq', 'anthropic', 'other'],
        required: true
    },
    model: {
        type: String,
        required: true
    },
    promptTokens: {
        type: Number,
        default: 0
    },
    completionTokens: {
        type: Number,
        default: 0
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number, // ms
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'error'],
        required: true,
        index: true
    },
    error: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Indexes for common queries
aiLogSchema.index({ createdAt: -1 });
aiLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('AILog', aiLogSchema);