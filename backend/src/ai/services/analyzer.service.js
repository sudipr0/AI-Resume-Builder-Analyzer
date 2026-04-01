// backend/src/ai/services/analyzer.service.js
import aiService from '../ai.service.js';

export class AnalyzerService {
    static async analyzeResumeWithJD(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        return result.data;
    }

    static async extractKeywordsFromJD(jobDescription) {
        const result = await aiService.extractKeywords(jobDescription);
        return result.data;
    }

    static async calculateMatchScore(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        const data = result.data;

        return {
            score: data.atsScore?.score || 0,
            matchPercentage: data.keywordMatch?.matchPercentage || 0,
            matchedKeywords: data.keywordMatch?.matchedKeywords || [],
            missingKeywords: data.keywordMatch?.missingKeywords || [],
            criticalMissing: data.keywordMatch?.criticalMissing || []
        };
    }

    static async getFullAnalysis(resumeData, jobDescription) {
        const [analysis, atsScore] = await Promise.all([
            aiService.analyzeResume(resumeData, jobDescription),
            aiService.calculateATSScore(resumeData, jobDescription)
        ]);

        return {
            analysis: analysis.data,
            atsScore: atsScore.data
        };
    }
}

// For backward compatibility with existing imports
export const analyzeResumeFull = AnalyzerService.analyzeResumeWithJD;
export const extractKeywords = AnalyzerService.extractKeywordsFromJD;
export const calculateMatchScore = AnalyzerService.calculateMatchScore;