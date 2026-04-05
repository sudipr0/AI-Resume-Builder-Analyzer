import express from 'express';
import { analyzeResumeController } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:resumeId/analyze', protect, analyzeResumeController);

export default router;
