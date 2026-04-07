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
    getStats,
    enhanceSection,
    generateGhostText,
    magicResume,
    generateTemplateBasedResume
} from './ai.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply AI rate limiter to generation/analysis endpoints
router.use('/analyze', aiLimiter);
router.use('/generate', aiLimiter);
router.use('/suggest', aiLimiter);
router.use('/enhance', aiLimiter);
router.use('/magic', aiLimiter);
// Public endpoints
router.get('/health', checkHealth);
router.get('/status', checkHealth);

// Protected endpoints (require authentication)
router.use(protect);

// ============ RESUME ANALYSIS ============
router.post('/analyze/full', fullResumeAnalysis);
router.post('/analyze-resume', analyzeResume); // Match frontend
router.post('/analyze-ats', calculateATSScore); // Match frontend

// ============ SUMMARY ENDPOINTS ============
router.post('/generate/summary', generateSummary);
router.post('/optimize/summary', optimizeSummary);

// ============ KEYWORD ENDPOINTS ============
router.post('/extract-keywords', extractKeywords);

// ============ GENERATION ENDPOINTS ============
router.post('/generate/bullets', generateBullets);
router.post('/suggest/skills', suggestSkills);
router.post('/enhance-section', enhanceSection); // Match frontend
router.post('/generate-ghost-text', generateGhostText); // Match frontend
router.post('/magic-resume', magicResume); // Match frontend
router.post('/generate-template-resume', generateTemplateBasedResume); // New endpoint

// ============ UTILITY ============
router.get('/stats', getStats);

export default router;
