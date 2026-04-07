// backend/src/ai/ai.controller.js
import aiService from './ai.service.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import Resume from '../models/Resume.js';

// ==================== HEALTH CHECK ====================
export const checkHealth = async (req, res) => {
    try {
        res.json({
            success: true,
            status: 'operational',
            timestamp: new Date().toISOString(),
            aiService: {
                enabled: aiService.providers.length > 0,
                providers: aiService.providers.map(p => ({ name: p.name, model: p.model })),
                stats: aiService.getStats()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== FULL RESUME ANALYSIS ====================
export const fullResumeAnalysis = async (req, res) => {
    try {
        const { resumeData, jobDescription, options = {} } = req.body;
        if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

        const result = await aiService.analyzeResume(resumeData, jobDescription, options);
        
        // Persist if resumeId is available
        const resumeId = resumeData._id || resumeData.id;
        if (resumeId && req.user) {
            await saveAnalysisToDb(resumeId, req.user._id, jobDescription, result.data);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ANALYZE RESUME (Matches Frontend) ====================
export const analyzeResume = async (req, res) => {
    try {
        const { resumeData, jobDescription, options = {} } = req.body;
        if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

        const result = await aiService.analyzeResume(resumeData, jobDescription, options);
        
        // Persist if resumeId is available
        const resumeId = resumeData._id || resumeData.id;
        if (resumeId && req.user) {
            await saveAnalysisToDb(resumeId, req.user._id, jobDescription, result.data);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper to save analysis to DB
async function saveAnalysisToDb(resumeId, userId, jobDescription, analysisResult) {
    try {
        const updateData = {
            userId,
            jobDescription,
            atsScore: analysisResult.atsScore?.score || 0,
            matchScore: analysisResult.keywordMatch?.matchPercentage || 0,
            scores: {
                formatting: analysisResult.atsScore?.breakdown?.formatting || 0,
                keywords: analysisResult.atsScore?.breakdown?.keywordMatch || 0,
                experience: analysisResult.atsScore?.breakdown?.experience || 0,
                skills: analysisResult.atsScore?.breakdown?.skills || 0,
                achievements: analysisResult.atsScore?.breakdown?.achievements || 0
            },
            keywords: {
                matched: analysisResult.keywordMatch?.matchedKeywords || [],
                missing: analysisResult.keywordMatch?.missingKeywords || [],
                suggested: analysisResult.keywordMatch?.criticalMissing || []
            },
            suggestions: (analysisResult.suggestions || []).map(s => ({
                section: s.section || 'general',
                type: s.priority === 'high' ? 'critical' : 'tip',
                message: s.title || s.description || s,
                improvement: s.description || ''
            })),
            strengths: analysisResult.strengths || [],
            weaknesses: analysisResult.weaknesses || [],
            aiSummary: analysisResult.aiSummary || 'AI analysis completed.',
            updatedAt: new Date()
        };

        await ResumeAnalysis.findOneAndUpdate(
            { resumeId },
            { $set: updateData },
            { upsert: true, new: true }
        );

        // Also update the resume's own atsScore
        await Resume.findByIdAndUpdate(resumeId, {
            $set: { 
                atsScore: updateData.atsScore,
                lastAnalyzed: new Date()
            }
        });
    } catch (err) {
        console.error('Failed to persist AI analysis:', err);
    }
}

// ==================== CALCULATE ATS SCORE (Matches Frontend analyze-ats) ====================
export const calculateATSScore = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

        const result = await aiService.calculateATSScore(resumeData, jobDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GENERATE SUMMARY ====================
export const generateSummary = async (req, res) => {
    try {
        const { resumeData, jobDescription, options = {} } = req.body;
        if (!resumeData) return res.status(400).json({ success: false, error: 'Resume data required' });

        const result = await aiService.generateSummaryVariants(resumeData, jobDescription, options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== OPTIMIZE SUMMARY ====================
export const optimizeSummary = async (req, res) => {
    try {
        const { summary, jobDescription, options = {} } = req.body;
        if (!summary) return res.status(400).json({ success: false, error: 'Summary required' });

        const result = await aiService.optimizeSummary(summary, jobDescription, options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ENHANCE SECTION (Matches Frontend) ====================
export const enhanceSection = async (req, res) => {
    try {
        const { section, content, targetRole = '' } = req.body;
        if (!content) return res.status(400).json({ success: false, error: 'Content required' });

        // Use optimizeSummary for summary, or generateBullets for experience
        let result;
        if (section === 'summary') {
            result = await aiService.optimizeSummary(content, targetRole, { type: 'enhance' });
            // Adapt response to frontend expectation: data.enhancedContent
            res.json({
                success: true,
                data: {
                    enhancedContent: result.data.optimized,
                    suggestions: result.data.improvements
                }
            });
        } else {
            // For other sections, use a direct prompt via executeDirect if available or just wrap
            const enhanced = await aiService.executeDirect(
                `You are an expert resume writer. Enhance the following ${section} for a ${targetRole} role.`,
                `Original ${section} content:\n${content}\n\nReturn the enhanced version in JSON format with "enhancedContent" and "suggestions" array.`,
                { temperature: 0.7 }
            );
            res.json({ success: true, data: enhanced });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GENERATE GHOST TEXT ====================
export const generateGhostText = async (req, res) => {
    try {
        const { text, section } = req.body;
        const result = await aiService.executeDirect(
            `You are an expert resume assistant. Suggest the next sentence or bullet point completion for the ${section} section.`,
            `Current text:\n${text}\n\nReturn JSON with "ghostText" (the suggestion only) and "confidence" (0-1).`,
            { temperature: 0.5, maxTokens: 100 }
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ============ MAGIC RESUME ============
export const magicResume = async (req, res) => {
    try {
        const { jobDescription, targetRole, userData } = req.body;
        const result = await aiService.executeDirect(
            `You are an elite resume builder. Create a full professional resume tailored to the job description.`,
            `Job Description:\n${jobDescription}\nTarget Role: ${targetRole}\nUser Data: ${JSON.stringify(userData)}\n\nReturn a full structured resume in JSON format.`,
            { temperature: 0.7, maxTokens: 4000 }
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ============ GENERATE TEMPLATE BASED RESUME ============
export const generateTemplateBasedResume = async (req, res) => {
    try {
        const { templateId, userData, options = {} } = req.body;
        if (!templateId) return res.status(400).json({ success: false, error: 'Template ID required' });
        if (!userData) return res.status(400).json({ success: false, error: 'User data required' });

        const result = await aiService.generateTemplateBasedResume(templateId, userData, options);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== EXTRACT KEYWORDS ====================
export const extractKeywords = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, error: 'Text required' });

        const result = await aiService.extractKeywords(text);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GENERATE BULLETS ====================
export const generateBullets = async (req, res) => {
    try {
        const { context, jobDescription } = req.body;
        if (!context) return res.status(400).json({ success: false, error: 'Context required' });

        const result = await aiService.generateBullets(context, jobDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== SUGGEST SKILLS ====================
export const suggestSkills = async (req, res) => {
    try {
        const { currentSkills, jobDescription } = req.body;
        const result = await aiService.suggestSkills(currentSkills, jobDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STATS ====================
export const getStats = async (req, res) => {
    try {
        res.json({
            success: true,
            stats: aiService.getStats(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
