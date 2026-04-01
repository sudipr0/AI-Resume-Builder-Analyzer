// backend/src/ai/config/ai.config.js
export const AI_CONFIG = {
    // Primary: Groq + Llama 3.3 70B (FAST)
    groq: {
        enabled: true,
        apiKey: process.env.GROQ_API_KEY,
        model: 'llama-3.3-70b-versatile', // Fastest Llama 3.3 70B
        maxTokens: 32768,
        temperature: 0.7,
        topP: 0.9,
        timeout: 30000
    },

    // Fallback: OpenAI GPT (already working)
    openai: {
        enabled: true,
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
        timeout: 30000
    },

    // Cache settings (optional but recommended)
    cache: {
        enabled: true,
        expiry: 300000 // 5 minutes
    }
};