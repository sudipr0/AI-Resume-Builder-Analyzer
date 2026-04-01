// backend/src/ai/providers/openai.provider.js
import OpenAI from 'openai';
import { AI_CONFIG } from '../config/ai.config.js';
import { PROMPTS } from '../config/prompts.js';

class OpenAIProvider {
    constructor() {
        this.config = AI_CONFIG.openai;
        this.client = null;
        this.isAvailable = false;
        this.init();
    }

    init() {
        try {
            if (!this.config.apiKey) {
                console.warn('⚠️ OpenAI API key not found');
                return;
            }

            this.client = new OpenAI({
                apiKey: this.config.apiKey
            });

            this.isAvailable = true;
            console.log('✅ OpenAI initialized with', this.config.model);
        } catch (error) {
            console.error('❌ OpenAI initialization failed:', error.message);
        }
    }

    async generateJSON(prompt, systemPrompt, options = {}) {
        if (!this.isAvailable) {
            throw new Error('OpenAI service not available');
        }

        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                model: options.model || this.config.model,
                temperature: options.temperature || this.config.temperature,
                max_tokens: options.maxTokens || this.config.maxTokens,
                response_format: { type: 'json_object' }
            });

            const response = completion.choices[0]?.message?.content;
            return JSON.parse(response);
        } catch (error) {
            console.error('OpenAI API error:', error.message);
            throw error;
        }
    }

    // Same interface as GroqProvider
    async generateSummaryVariants(resumeData, jobDescription, options) {
        const prompt = PROMPTS.generateSummary(resumeData, jobDescription, options);
        return this.generateJSON(prompt, PROMPTS.system.resumeExpert);
    }

    async optimizeSummary(summary, jobDescription, options) {
        const prompt = PROMPTS.optimizeSummary(summary, jobDescription, options);
        return this.generateJSON(prompt, PROMPTS.system.resumeExpert);
    }

    async extractKeywords(text) {
        const prompt = PROMPTS.extractKeywords(text);
        return this.generateJSON(prompt, PROMPTS.system.keywordExpert);
    }

    async analyzeResume(resumeData, jobDescription) {
        const prompt = PROMPTS.analyzeResume(resumeData, jobDescription);
        return this.generateJSON(prompt, PROMPTS.system.analyzerExpert);
    }

    async calculateATSScore(resumeData, jobDescription) {
        const prompt = PROMPTS.atsScore(resumeData, jobDescription);
        return this.generateJSON(prompt, PROMPTS.system.analyzerExpert);
    }

    async generateBullets(context) {
        const prompt = PROMPTS.generateBullets(context);
        return this.generateJSON(prompt, PROMPTS.system.resumeExpert);
    }

    async suggestSkills(currentSkills, jobDescription) {
        const prompt = PROMPTS.suggestSkills(currentSkills, jobDescription);
        return this.generateJSON(prompt, PROMPTS.system.keywordExpert);
    }

    async testConnection() {
        try {
            await this.generateJSON(
                '{"status": "ok"}',
                'Return JSON with status ok',
                { maxTokens: 10 }
            );
            return true;
        } catch {
            return false;
        }
    }
}

export default OpenAIProvider;