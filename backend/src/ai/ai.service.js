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
  GENERATE_FINAL_RESUME_PROMPT
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
        system: `You are an expert resume writer with 15+ years of experience. 
Create compelling, ATS-optimized professional summaries. Always respond in valid JSON.`,

        user: `Generate ${options.count || 3} professional summary variants.

RESUME DATA:
${JSON.stringify(params.resumeData, null, 2)}

${params.jobDescription ? `JOB DESCRIPTION:\n${params.jobDescription}` : ''}

REQUIREMENTS:
- Tone: ${options.tone || 'professional'}
- Each variant: 3-4 sentences
- Include key skills and achievements
- Use strong action verbs
- Include quantifiable metrics
- Optimize for ATS

Return JSON:
{
  "variants": [
    {
      "text": "summary text",
      "tone": "${options.tone || 'professional'}",
      "keywords": ["keyword1", "keyword2"],
      "atsScore": 85,
      "highlights": ["achievement1", "achievement2"]
    }
  ],
  "bestMatchIndex": 0
}`
      },

      // ============ OPTIMIZE SUMMARY ============
      optimizeSummary: {
        system: `You are an expert resume optimizer. Improve summaries for maximum impact.`,

        user: `Optimize this summary:

ORIGINAL: "${params.summary}"

${params.jobDescription ? `JOB DESCRIPTION:\n${params.jobDescription}` : ''}

Type: ${options.type || 'enhance'}

Return JSON:
{
  "optimized": "optimized text",
  "improvements": ["improvement1", "improvement2"],
  "keywordsAdded": ["keyword1", "keyword2"],
  "confidence": 0.95
}`
      },

      // ============ EXTRACT KEYWORDS ============
      extractKeywords: {
        system: `You are an expert at extracting keywords from job descriptions.`,

        user: `Extract keywords from this text:

${params.text}

Return JSON:
{
  "keywords": ["skill1", "skill2"],
  "categories": {
    "technical": ["tech1", "tech2"],
    "soft": ["soft1", "soft2"],
    "tools": ["tool1", "tool2"]
  },
  "suggestedRole": "detected role",
  "criticalKeywords": ["critical1", "critical2"]
}`
      },

      // ============ ANALYZE RESUME ============
      analyzeResume: {
        system: `You are an expert ATS analyst. Provide detailed resume analysis.`,

        user: `Analyze this resume:

RESUME:
${JSON.stringify(params.resumeData, null, 2)}

${params.jobDescription ? `JOB DESCRIPTION:\n${params.jobDescription}` : ''}

Return JSON:
{
  "atsScore": {
    "score": 85,
    "breakdown": {
      "keywordMatch": 80,
      "formatting": 90,
      "experience": 85,
      "skills": 88,
      "achievements": 75
    }
  },
  "keywordMatch": {
    "matchPercentage": 80,
    "matchedKeywords": ["keyword1", "keyword2"],
    "missingKeywords": ["keyword3", "keyword4"],
    "criticalMissing": ["critical1"]
  },
  "sectionAnalysis": {
    "summary": { "score": 85, "suggestions": [] },
    "experience": { "score": 80, "suggestions": [] }
  },
  "suggestions": [
    {
      "title": "Add metrics",
      "description": "Quantify achievements",
      "priority": "high",
      "section": "experience"
    }
  ]
}`
      },

      // ============ GENERATE BULLETS ============
      generateBullets: {
        system: `You are an expert at creating powerful resume bullet points.`,

        user: `Generate bullet points for this experience:

CONTEXT:
${JSON.stringify(params.context, null, 2)}

${params.jobDescription ? `JOB DESCRIPTION:\n${params.jobDescription}` : ''}

Return JSON:
{
  "bullets": [
    {
      "text": "Led development...",
      "impact": "high",
      "metrics": ["10K users"],
      "keywords": ["leadership", "development"]
    }
  ]
}`
      },

      // ============ SUGGEST SKILLS ============
      suggestSkills: {
        system: `You are an expert at suggesting relevant skills for roles.`,

        user: `Suggest skills based on:

Current Skills: ${params.currentSkills?.join(', ') || 'None'}
${params.jobDescription ? `Job Description: ${params.jobDescription}` : ''}

Return JSON:
{
  "suggested": [
    {
      "name": "TypeScript",
      "relevance": 95,
      "category": "technical",
      "isCritical": true,
      "reason": "Industry standard"
    }
  ],
  "missingCritical": ["TypeScript", "Docker"],
  "categories": {
    "technical": ["TypeScript", "React"],
    "tools": ["Docker", "AWS"]
  }
}`
      },

      // ============ ATS SCORE ============
      calculateATSScore: {
        system: `You are an ATS scoring expert. Calculate accurate ATS compatibility scores.`,

        user: `Calculate ATS score for this resume:

RESUME:
${JSON.stringify(params.resumeData, null, 2)}

${params.jobDescription ? `JOB DESCRIPTION:\n${params.jobDescription}` : ''}

Return JSON:
{
  "score": 85,
  "factors": {
    "keywordDensity": 35,
    "format": 18,
    "experience": 17,
    "achievements": 8,
    "education": 4,
    "skills": 3
  },
  "recommendations": ["Add more keywords"]
}`
      }
    };

    return prompts[method] || {
      system: 'You are a helpful AI assistant.',
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

  getStats() {
    return this.stats;
  }
}

export default new AIService();