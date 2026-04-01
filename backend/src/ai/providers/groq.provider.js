// backend/src/ai/providers/groq.provider.js
import Groq from 'groq-sdk';
import { AI_CONFIG } from '../config/ai.config.js';
import { PROMPTS } from '../config/prompts.js';

class GroqProvider {
    constructor() {
        this.config = AI_CONFIG.groq;
        this.client = null;
        this.isAvailable = false;
        this.init();
    }

    init() {
        try {
            if (!this.config.apiKey) {
                console.warn('⚠️ Groq API key not found');
                return;
            }

            this.client = new Groq({
                apiKey: this.config.apiKey
            });

            this.isAvailable = true;
            console.log('✅ Groq initialized with Llama 3.3 70B');
        } catch (error) {
            console.error('❌ Groq initialization failed:', error.message);
        }
    }

    async generateJSON(prompt, systemPrompt, options = {}) {
        if (!this.isAvailable) {
            throw new Error('Groq service not available');
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
                top_p: options.topP || this.config.topP,
                response_format: { type: 'json_object' }
            });

            const response = completion.choices[0]?.message?.content;
            return JSON.parse(response);
        } catch (error) {
            console.error('Groq API error:', error.message);
            throw error;
        }
    }

    // ============ RESUME SUMMARY METHODS ============
    async generateSummaryVariants(resumeData, jobDescription, options) {
        const prompt = PROMPTS.generateSummary(resumeData, jobDescription, options);
        return this.generateJSON(prompt, PROMPTS.system.resumeExpert);
    }

    async optimizeSummary(summary, jobDescription, options) {
        const prompt = PROMPTS.optimizeSummary(summary, jobDescription, options);
        return this.generateJSON(prompt, PROMPTS.system.resumeExpert);
    }

    // ============ ANALYSIS METHODS ============
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

    // ============ GENERATION METHODS ============
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
                'Return {"status": "ok"}',
                'You are a test assistant.',
                { maxTokens: 10 }
            );
            return true;
        } catch {
            return false;
        }
    }
}

export default GroqProvider;