// backend/src/routes/resumeAnalyzer.routes.js - COMPLETE FIXED VERSION
import express from 'express';
import { analyzeResume } from '../controllers/resumeAnalyzer.controller.js';
import { authenticate } from '../middleware/auth.js'; // ✅ Now correctly imports from auth.js

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate); // ✅ Now this works!

/**
 * @route   POST /api/resumes/:id/analyze
 * @desc    Analyze a resume with optional job description
 * @access  Private
 * @param   {string} id - Resume ID
 * @body    {object} options - Analysis options
 * @body    {string} options.jobDescription - Optional job description for targeted analysis
 * @returns {object} Analysis results including ATS score, keywords, suggestions
 */
router.post('/:id/analyze', analyzeResume);

/**
 * @route   POST /api/resumes/:id/keywords
 * @desc    Extract keywords from a resume
 * @access  Private
 * @param   {string} id - Resume ID
 * @returns {object} Extracted keywords and key phrases
 */
router.post('/:id/keywords', async (req, res) => {
    try {
        const { id } = req.params;
        // This would call your keyword extraction service
        // For now, return mock data
        res.json({
            success: true,
            data: {
                keywords: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                skills: ['Frontend Development', 'Backend Development', 'Database Design'],
                actionVerbs: ['Developed', 'Led', 'Implemented', 'Optimized']
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/resumes/:id/suggestions
 * @desc    Get AI-powered suggestions for resume improvement
 * @access  Private
 * @param   {string} id - Resume ID
 * @returns {object} Suggestions for improvement
 */
router.post('/:id/suggestions', async (req, res) => {
    try {
        const { id } = req.params;
        // This would call your AI suggestion service
        // For now, return mock data
        res.json({
            success: true,
            data: {
                suggestions: [
                    {
                        section: 'summary',
                        original: 'Experienced developer',
                        suggested: 'Senior Full-Stack Developer with 5+ years of experience building scalable web applications',
                        reason: 'More specific and quantifiable'
                    },
                    {
                        section: 'experience',
                        original: 'Worked on various projects',
                        suggested: 'Led development of 3 major projects from conception to deployment',
                        reason: 'Shows leadership and initiative'
                    }
                ],
                atsScore: 78,
                improvements: [
                    'Add more keywords from job description',
                    'Quantify achievements with numbers',
                    'Include relevant certifications'
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/resumes/:id/ats-score
 * @desc    Get ATS compatibility score for a resume
 * @access  Private
 * @param   {string} id - Resume ID
 * @returns {object} ATS score and analysis
 */
router.get('/:id/ats-score', async (req, res) => {
    try {
        const { id } = req.params;
        // Mock ATS score calculation
        res.json({
            success: true,
            data: {
                score: 85,
                breakdown: {
                    format: 90,
                    keywords: 82,
                    readability: 88,
                    structure: 80
                },
                recommendations: [
                    'Use standard section headers',
                    'Add more industry keywords',
                    'Avoid complex formatting'
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/resumes/:id/compare-with-job
 * @desc    Compare resume with job description
 * @access  Private
 * @param   {string} id - Resume ID
 * @body    {string} jobDescription - Job description text
 * @returns {object} Comparison results
 */
router.post('/:id/compare-with-job', async (req, res) => {
    try {
        const { id } = req.params;
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                error: 'Job description is required'
            });
        }

        // Mock comparison results
        res.json({
            success: true,
            data: {
                matchScore: 72,
                matchingKeywords: ['JavaScript', 'React', 'Team Leadership'],
                missingKeywords: ['TypeScript', 'AWS', 'CI/CD'],
                suggestions: [
                    'Add TypeScript to your skills section',
                    'Include cloud experience with AWS',
                    'Mention CI/CD pipeline experience'
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/resumes/:id/analysis/history
 * @desc    Get analysis history for a resume
 * @access  Private
 * @param   {string} id - Resume ID
 * @returns {array} Analysis history
 */
router.get('/:id/analysis/history', async (req, res) => {
    try {
        const { id } = req.params;
        // Mock history data
        res.json({
            success: true,
            data: [
                {
                    date: new Date().toISOString(),
                    atsScore: 85,
                    changes: ['Added keywords', 'Improved formatting']
                },
                {
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    atsScore: 72,
                    changes: ['Initial analysis']
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;