// src/routes/resumes.js
import express from 'express';
import { 
    getMyResumes, 
    getResumeById, 
    createResume, 
    updateResume, 
    deleteResume, 
    duplicateResume, 
    analyzeResume, 
    getStatsOverview 
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All resume routes are protected
router.use(protect);

// @route   GET /api/resumes/stats/overview
router.get('/stats/overview', getStatsOverview);

// @route   GET /api/resumes
// @route   POST /api/resumes
router.route('/')
    .get(getMyResumes)
    .post(createResume);

// @route   GET /api/resumes/:id
// @route   PUT /api/resumes/:id
// @route   DELETE /api/resumes/:id
router.route('/:id')
    .get(getResumeById)
    .put(updateResume)
    .delete(deleteResume);

// @route   POST /api/resumes/:id/duplicate
router.post('/:id/duplicate', duplicateResume);

// @route   POST /api/resumes/:id/analyze
router.post('/:id/analyze', analyzeResume);

export default router;
