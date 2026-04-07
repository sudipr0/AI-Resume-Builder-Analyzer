// backend/src/ai/ai.service.js
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import {
  EXTRACT_RESUME_TEXT_PROMPT,
  BUILD_RESUME_PROMPT,
  ANALYZE_RESUME_PROMPT,
  OPTIMIZE_FOR_ATS_PROMPT,
  GENERATE_BULLET_POINTS_PROMPT,
  MATCH_RESUME_TO_JOB_PROMPT,
  SUGGEST_IMPROVEMENTS_PROMPT,
  SMART_EXTRACT_PROMPT,
  SCORE_RESUME_PROMPT,
  GENERATE_FINAL_RESUME_PROMPT,
  RESUME_AI_SYSTEM_PROMPT,
  RESUME_TEMPLATES_PROMPTS
} from './ai.prompts.js';
import { PROMPTS } from './config/prompts.js';

class AIService {
  constructor() {
    this.providers = [];
    this.stats = {
      totalRequests: 0,
      groqSuccess: 0,
      openaiSuccess: 0,
      failures: 0,
      avgResponseTime: 0
    };

    this.init();
  }

  init() {
    // Initialize Groq (Primary)
    try {
      if (process.env.GROQ_API_KEY) {
        this.groq = new Groq({
          apiKey: process.env.GROQ_API_KEY
        });
        this.providers.push({
          name: 'groq',
          instance: this.groq,
          model: 'llama-3.3-70b-versatile',
          priority: 1,
          available: true
        });
        console.log('✅ Groq initialized with Llama 3.3 70B');
      }
    } catch (error) {
      console.error('❌ Groq init failed:', error.message);
    }

    // Initialize OpenAI (Fallback)
    try {
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.providers.push({
          name: 'openai',
          instance: this.openai,
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          priority: 2,
          available: true
        });
        console.log('✅ OpenAI initialized with', process.env.OPENAI_MODEL || 'gpt-4o-mini');
      }
    } catch (error) {
      console.error('❌ OpenAI init failed:', error.message);
    }

    console.log(`\n🤖 AI Service Ready:`);
    console.log(`   Primary: ${this.providers.find(p => p.priority === 1)?.name || 'None'} ✅`);
    console.log(`   Fallback: ${this.providers.find(p => p.priority === 2)?.name || 'None'} ✅\n`);
  }

  async executeWithProvider(method, params, options = {}) {
    const startTime = Date.now();
    this.stats.totalRequests++;

    // Sort providers by priority
    const sortedProviders = [...this.providers].sort((a, b) => a.priority - b.priority);

    for (const provider of sortedProviders) {
      try {
        console.log(`🤖 Trying ${provider.name} for ${method}...`);

        let result;
        if (provider.name === 'groq') {
          result = await this.executeGroq(method, params, options, provider.model);
        } else {
          result = await this.executeOpenAI(method, params, options, provider.model);
        }

        const timeTaken = Date.now() - startTime;

        // Update stats
        if (provider.name === 'groq') {
          this.stats.groqSuccess++;
        } else {
          this.stats.openaiSuccess++;
        }

        console.log(`✅ ${provider.name} success (${timeTaken}ms)`);

        return {
          success: true,
          data: result,
          provider: provider.name,
          timeTaken
        };

      } catch (error) {
        console.log(`⚠️ ${provider.name} failed:`, error.message);
        provider.available = false;

        // Re-enable after 1 minute
        setTimeout(() => { provider.available = true; }, 60000);
      }
    }

    this.stats.failures++;
    throw new Error('All AI providers failed');
  }

  async executeGroq(method, params, options, model) {
    const prompts = this.getPrompt(method, params, options);

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompts.system },
        { role: 'user', content: prompts.user }
      ],
      model: model,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  async executeOpenAI(method, params, options, model) {
    const prompts = this.getPrompt(method, params, options);

    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompts.system },
        { role: 'user', content: prompts.user }
      ],
      model: model,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  getPrompt(method, params, options) {
    const prompts = {
      // ============ SUMMARY GENERATION ============
      generateSummaryVariants: {
        system: RESUME_AI_SYSTEM_PROMPT,
        user: this._replaceVariables(GENERATE_SUMMARY_PROMPT, {
          resumeData: params.resumeData,
          targetRole: params.jobDescription || 'Professional'
        })
      },

      // ============ ANALYZE RESUME ============
      analyzeResume: {
        system: RESUME_AI_SYSTEM_PROMPT,
        user: this._replaceVariables(ANALYZE_RESUME_PROMPT, {
          resumeData: params.resumeData,
          jobDescription: params.jobDescription
        })
      },

      // ============ ATS SCORE ============
      calculateATSScore: {
        system: RESUME_AI_SYSTEM_PROMPT,
        user: this._replaceVariables(SCORE_RESUME_PROMPT, {
          resumeData: params.resumeData
        })
      },
      
      // ... keep others or update them as needed
    };

    if (prompts[method]) return prompts[method];

    // Default fallback logic
    return {
      system: RESUME_AI_SYSTEM_PROMPT,
      user: JSON.stringify(params)
    };
  }

  _replaceVariables(promptTemplate, variables) {
    let userPrompt = promptTemplate;

    if (typeof variables === 'string') {
        const match = promptTemplate.match(/\{(\w+)\}/);
        if (match) {
            userPrompt = promptTemplate.replace(new RegExp(`\\{${match[1]}\\}`, 'g'), variables);
        }
    } else if (typeof variables === 'object' && variables !== null) {
        for (const [key, value] of Object.entries(variables)) {
            const valStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
            userPrompt = userPrompt.replace(new RegExp(`\\{${key}\\}`, 'g'), valStr);
        }
    }
    return userPrompt;
  }

  async executeDirect(systemPrompt, userPrompt, options = {}) {
    this.stats.totalRequests++;
    const startTime = Date.now();
    const sortedProviders = [...this.providers].sort((a, b) => a.priority - b.priority);

    for (const provider of sortedProviders) {
      try {
        console.log(`🤖 Trying ${provider.name} for direct prompt...`);

        const completion = await provider.instance.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: provider.model,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
          response_format: { type: "json_object" }
        });

        const resultStr = completion.choices[0]?.message?.content || '{}';
        const result = JSON.parse(resultStr);

        const timeTaken = Date.now() - startTime;

        if (provider.name === 'groq') this.stats.groqSuccess++;
        else this.stats.openaiSuccess++;

        console.log(`✅ ${provider.name} success (${timeTaken}ms)`);
        return result;
      } catch (error) {
        console.log(`⚠️ ${provider.name} failed:`, error.message);
        provider.available = false;

        // Re-enable after 1 minute
        setTimeout(() => { provider.available = true; }, 60000);
      }
    }

    this.stats.failures++;
    throw new Error('All AI providers failed');
  }

  // ============ PUBLIC METHODS ============
  async generateSummaryVariants(resumeData, jobDescription, options = {}) {
    return this.executeWithProvider('generateSummaryVariants', { resumeData, jobDescription }, options);
  }

  async optimizeSummary(summary, jobDescription, options = {}) {
    return this.executeWithProvider('optimizeSummary', { summary, jobDescription }, options);
  }

  async extractKeywords(text, options = {}) {
    return this.executeWithProvider('extractKeywords', { text }, options);
  }

  async analyzeResume(resumeData, jobDescription = '', options = {}) {
    return this.executeWithProvider('analyzeResume', { resumeData, jobDescription }, options);
  }

  async generateBullets(context, jobDescription = '', options = {}) {
    return this.executeWithProvider('generateBullets', { context, jobDescription }, options);
  }

  async suggestSkills(currentSkills, jobDescription = '', options = {}) {
    return this.executeWithProvider('suggestSkills', { currentSkills, jobDescription }, options);
  }

  async calculateATSScore(resumeData, jobDescription = '', options = {}) {
    return this.executeWithProvider('calculateATSScore', { resumeData, jobDescription }, options);
  }

  // ============ NEW PROMPT SYSTEM METHODS ============

  async extract(data, promptTemplate = EXTRACT_RESUME_TEXT_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert AI data extractor. Extract and structure resume data from text.', userPrompt, options);
  }

  async build(data, promptTemplate = BUILD_RESUME_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert AI resume builder. Create professional, ATS-optimized resumes.', userPrompt, options);
  }

  async analyze(data, promptTemplate = ANALYZE_RESUME_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert ATS analyst. Provide detailed resume analysis against industry standards.', userPrompt, options);
  }

  async optimize(data, promptTemplate = OPTIMIZE_FOR_ATS_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert ATS optimization AI. Improve resumes for maximum ATS compatibility.', userPrompt, options);
  }

  async generate(data, promptTemplate = GENERATE_FINAL_RESUME_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert AI resume generator. Create final polished resumes.', userPrompt, options);
  }

  async generateBulletsAdvanced(data, promptTemplate = GENERATE_BULLET_POINTS_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert at creating powerful, STAR-method resume bullet points.', userPrompt, options);
  }

  async matchJob(data, promptTemplate = MATCH_RESUME_TO_JOB_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert AI recruiter matching resumes to jobs. Provide detailed matching analysis.', userPrompt, options);
  }

  async suggestImprovements(data, promptTemplate = SUGGEST_IMPROVEMENTS_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert career counselor. Provide intelligent suggestions to improve resumes.', userPrompt, options);
  }

  async smartExtract(data, promptTemplate = SMART_EXTRACT_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are a highly intelligent AI data extractor reading raw resumes.', userPrompt, options);
  }

  async scoreResume(data, promptTemplate = SCORE_RESUME_PROMPT, options = {}) {
    const userPrompt = this._replaceVariables(promptTemplate, data);
    return this.executeDirect('You are an expert ATS scoring algorithm. Provide accurate and rigorous scoring.', userPrompt, options);
  }

  // ============ ADVANCED COMPLETION & STATUS METHODS ============

  async checkCompletion(resumeData, jobTitle, industry, jobRequirements, options = {}) {
    const userPrompt = PROMPTS.checkResumeCompletion(resumeData, jobTitle, industry, jobRequirements);
    return this.executeDirect('You are an expert AI resume completion evaluator.', userPrompt, options);
  }

  async classifyResumeStatus(resumeData, userActivity, options = {}) {
    const userPrompt = PROMPTS.classifyResumeStatus(resumeData, userActivity);
    return this.executeDirect('You are an expert AI workflow analyzer characterizing resume completion.', userPrompt, options);
  }

  async trackResumeProgress(currentResume, previousResume, requirements, options = {}) {
    const userPrompt = PROMPTS.trackResumeProgress(currentResume, previousResume, requirements);
    return this.executeDirect('You are an expert AI resume progress tracker.', userPrompt, options);
  }

  async predictCompletion(resumeData, userBehavior, options = {}) {
    const userPrompt = PROMPTS.predictCompletion(resumeData, userBehavior);
    return this.executeDirect('You are an expert AI resume workflow predictor.', userPrompt, options);
  }

  async intelligentDraftSaving(resumeData, editHistory, changes, options = {}) {
    const userPrompt = PROMPTS.intelligentDraftSaving(resumeData, editHistory, changes);
    return this.executeDirect('You are an expert AI auto-save supervisor tracking draft versions.', userPrompt, options);
  }

  async validateCompletion(resumeData, requirements, options = {}) {
    const userPrompt = PROMPTS.validateCompletion(resumeData, requirements);
    return this.executeDirect('You are a stringent AI resume completeness validator.', userPrompt, options);
  }

  async readinessScorecard(resumeData, role, standards, options = {}) {
    const userPrompt = PROMPTS.readinessScorecard(resumeData, role, standards);
    return this.executeDirect('You are an expert AI scoring resumes for final readiness.', userPrompt, options);
  }

  async autoCompleteSuggest(sectionName, content, completedData, requirements, options = {}) {
    const userPrompt = PROMPTS.autoCompleteSuggest(sectionName, content, completedData, requirements);
    return this.executeDirect('You are an expert AI creative assistant mapping out resume section completion.', userPrompt, options);
  }

  async assessSectionQuality(sectionName, content, standard, options = {}) {
    const userPrompt = PROMPTS.assessSectionQuality(sectionName, content, standard);
    return this.executeDirect('You are an expert AI assessing resume section quality individually.', userPrompt, options);
  }

  async finalVerification(resumeData, checklist, options = {}) {
    const userPrompt = PROMPTS.finalVerification(resumeData, checklist);
    return this.executeDirect('You are a final AI verifier ensuring resumes are 100% complete.', userPrompt, options);
  }

  async generateTemplateBasedResume(templateId, userData, options = {}) {
    const templatePrompt = RESUME_TEMPLATES_PROMPTS[templateId];
    if (!templatePrompt) {
      throw new Error(`Invalid template ID: ${templateId}`);
    }

    const systemPrompt = `${RESUME_AI_SYSTEM_PROMPT}\n\nTEMPLATE SPECIFIC INSTRUCTIONS:\n${templatePrompt}`;
    const userPrompt = `USER DATA:\n${JSON.stringify(userData, null, 2)}\n\nPlease generate an enhanced resume based on the template instructions. Return JSON format with "summary", "experience", and "skills" keys.`;

    return this.executeDirect(systemPrompt, userPrompt, options);
  }

  getStats() {
    return this.stats;
  }
}

export default new AIService();