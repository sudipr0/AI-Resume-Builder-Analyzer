import express from 'express';
import { analyzeResumeController } from '../controllers/analyzeController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:resumeId/analyze', authenticateUser, analyzeResumeController);

export default router;
