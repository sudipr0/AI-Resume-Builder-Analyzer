import express from 'express';
import { 
    enhanceSummaryController, 
    improveBulletsController, 
    suggestSkillsController,
    optimizeForJobController
} from '../controllers/aiController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/enhance-summary', authenticateUser, enhanceSummaryController);
router.post('/enhance-bullets', authenticateUser, improveBulletsController);
router.post('/suggest-skills', authenticateUser, suggestSkillsController);
router.post('/match-job', authenticateUser, optimizeForJobController);

export default router;
