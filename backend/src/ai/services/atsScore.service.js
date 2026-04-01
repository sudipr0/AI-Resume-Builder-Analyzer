// backend/src/ai/services/atsScore.service.js
import aiService from '../ai.service.js';

export class ATSScoreService {
    static async calculateScore(resumeData, jobDescription) {
        const result = await aiService.calculateATSScore(resumeData, jobDescription);
        return result.data;
    }

    static async getKeywordMatch(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        const data = result.data;

        return {
            matched: data.keywordMatch?.matchedKeywords || [],
            missing: data.keywordMatch?.missingKeywords || [],
            critical: data.keywordMatch?.criticalMissing || [],
            byCategory: data.keywordMatch?.byCategory || {}
        };
    }

    static async getImprovementTips(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        return result.data?.suggestions || [];
    }

    static async getDetailedBreakdown(resumeData, jobDescription) {
        const result = await aiService.calculateATSScore(resumeData, jobDescription);
        return result.data;
    }
}

// For backward compatibility
export const calculateATSScore = ATSScoreService.calculateScore;
export const getKeywordMatchScore = ATSScoreService.getKeywordMatch;