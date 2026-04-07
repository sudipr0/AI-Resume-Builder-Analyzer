import express from 'express';
import { analyzeResumeController } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:resumeId/analyze', protect, analyzeResumeController);
router.get('/extract-url', protect, async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL parameter is required'
            });
        }

        // For now, return mock data - in production you'd implement actual URL scraping
        // This would require libraries like puppeteer, cheerio, or similar
        const mockContent = {
            content: `Mock extracted content from URL: ${url}\n\nThis is placeholder content. In production, this would scrape the actual webpage content and extract resume-relevant information.`,
            title: 'Extracted Resume Content',
            source: url,
            extractedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            data: mockContent
        });
    } catch (error) {
        console.error('URL extraction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to extract content from URL'
        });
    }
});

export default router;
