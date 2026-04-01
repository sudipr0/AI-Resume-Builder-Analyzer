import express from 'express';
import { exportPdfController } from '../controllers/exportController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:resumeId/pdf', authenticateUser, exportPdfController);

export default router;
