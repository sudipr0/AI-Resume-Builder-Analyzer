// backend/src/ai/ai.routes.js
import express from 'express';
import {
    checkHealth,
    fullResumeAnalysis,
    generateSummary,
    optimizeSummary,
    extractKeywords,
    analyzeResume,
    generateBullets,
    suggestSkills,
    calculateATSScore,
    getStats
} from './ai.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints
router.get('/health', checkHealth);
router.get('/status', checkHealth);

// Protected endpoints (require authentication)
router.use(authenticateJWT);

// ============ RESUME ANALYSIS ============
router.post('/analyze/full', fullResumeAnalysis);
router.post('/analyze/resume', analyzeResume);
router.post('/analyze/ats', calculateATSScore);

// ============ SUMMARY ENDPOINTS ============
router.post('/generate/summary', generateSummary);
router.post('/optimize/summary', optimizeSummary);

// ============ KEYWORD ENDPOINTS ============
router.post('/extract-keywords', extractKeywords);

// ============ GENERATION ENDPOINTS ============
router.post('/generate/bullets', generateBullets);
router.post('/suggest/skills', suggestSkills);

// ============ UTILITY ============
router.get('/stats', getStats);

export default router;