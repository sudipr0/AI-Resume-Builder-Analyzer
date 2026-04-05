// backend/src/admin/models/Backup.js
import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['manual', 'database', 'files', 'full'],
        default: 'manual'
    },
    description: {
        type: String,
        trim: true
    },
    path: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    size: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false // Optional if created by system
    },
    completedAt: {
        type: Date
    },
    error: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

// Index for performance
backupSchema.index({ createdAt: -1 });
backupSchema.index({ status: 1 });

export default mongoose.model('Backup', backupSchema);