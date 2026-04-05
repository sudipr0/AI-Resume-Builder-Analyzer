// src/routes/export.routes.js
import express from 'express';
import { exportPdfController } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/export/:resumeId/pdf
router.post('/:resumeId/pdf', protect, exportPdfController);

export default router;
