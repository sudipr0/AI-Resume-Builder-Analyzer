// backend/src/admin/routes/resumeRoutes.js
import express from 'express';
const router = express.Router();

import * as resumeController from '../controllers/resumeController.js';
import { authenticateAdmin, checkPermission } from '../middlewares/adminAuth.js';

// ======================
// ✅ TEST ROUTE - MUST BE BEFORE /:id ROUTES
// ======================
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Resume CRUD API is working!',
        timestamp: new Date().toISOString(),
        endpoints: {
            getAll: 'GET /api/resumes',
            getOne: 'GET /api/resumes/:id',
            create: 'POST /api/resumes',
            update: 'PUT /api/resumes/:id',
            delete: 'DELETE /api/resumes/:id',
            analyze: 'POST /api/resumes/:id/analyze',
            stats: 'GET /api/resumes/stats'
        }
    });
});

// ======================
// PROTECTED ROUTES
// ======================
router.use(authenticateAdmin);
router.use(checkPermission('resumes.manage'));

// ======================
// RESUME CRUD OPERATIONS
// ======================
router.get('/', resumeController.getAllResumes);
router.get('/stats', resumeController.getResumeStats);
router.get('/export', resumeController.exportResumes);
router.get('/:id', resumeController.getResumeById);
router.post('/', resumeController.createResume);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/:id/analyze', resumeController.analyzeResume);

export default router;