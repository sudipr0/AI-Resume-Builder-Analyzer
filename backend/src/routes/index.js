// backend/src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumes.js';
import aiRoutes from '../ai/ai.routes.js';
import userRoutes from './userRoutes.js';
import exportRoutes from './export.routes.js';
import templateRoutes from './template.routes.js';
import adminRoutes from '../admin/routes/adminRoutes.js';
import analyzeRoutes from './analyze.routes.js';
import resumeExtractionRoutes from './resumeExtraction.routes.js';

const router = express.Router();

// Mount Routes
router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/export', exportRoutes);
router.use('/templates', templateRoutes);
router.use('/extract', resumeExtractionRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/admin', adminRoutes);

// Root API route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to AI Resume Builder API',
        version: '1.0.0'
    });
});

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});


export default router;
