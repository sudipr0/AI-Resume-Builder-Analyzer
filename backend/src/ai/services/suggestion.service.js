// backend/src/ai/services/suggestion.service.js
import aiService from '../ai.service.js';

export class SuggestionService {
    static async getSummarySuggestions(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        const data = result.data;

        return data.suggestions?.filter(s => s.section === 'summary') || [];
    }

    static async getSkillSuggestions(currentSkills, jobDescription) {
        const result = await aiService.suggestSkills(currentSkills, jobDescription);
        return result.data;
    }

    static async getBulletPointSuggestions(context, jobDescription) {
        const result = await aiService.generateBullets(context, jobDescription);
        return result.data?.bullets || [];
    }

    static async getImprovementPlan(resumeData, jobDescription) {
        const result = await aiService.analyzeResume(resumeData, jobDescription);
        const data = result.data;

        return {
            highPriority: data.suggestions?.filter(s => s.priority === 'high') || [],
            mediumPriority: data.suggestions?.filter(s => s.priority === 'medium') || [],
            lowPriority: data.suggestions?.filter(s => s.priority === 'low') || [],
            score: data.atsScore?.score || 0,
            keywordMatch: data.keywordMatch?.matchPercentage || 0,
            nextSteps: [
                'Add missing critical keywords',
                'Quantify achievements with metrics',
                'Use stronger action verbs',
                'Optimize summary for ATS'
            ]
        };
    }

    static async getPersonalizedTips(item, jobDescription) {
        // Generate bullets first, then extract tips
        const bullets = await aiService.generateBullets(item, jobDescription);
        return bullets.data?.bullets?.map(b => ({
            text: b.text,
            tip: `Use this bullet point: ${b.text}`,
            impact: b.impact || 'medium'
        })) || [];
    }
}

// For backward compatibility
export const generateSuggestions = SuggestionService.getImprovementPlan;
export const getPersonalizedTips = SuggestionService.getPersonalizedTips;