import Anthropic from '@anthropic-ai/sdk';
import logger from './logger.js'; // Assuming logger exists or console

// Initialize Claude client
// We allow passing the key here or relying on env var automatically
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key-for-init', // will throw later if really needed and missing
});

const DEFAULT_MODEL = 'claude-3-5-sonnet-20240620';

/**
 * Extracts structured resume data from raw document text
 */
export async function extractResumeData(rawText) {
  try {
    const prompt = `Extract all resume information from the following text and return ONLY a valid JSON object with this exact structure:
{
  "extractedSections": ["Personal Info", "Summary", "Experience", "Skills", "Education", "Projects"],
  "confidenceScore": 95,
  "personalInfo": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "jobTitle": "", "company": "", "location": "", "startDate": "", "endDate": "", "description": "", "bullets": [] }],
  "education": [{ "degree": "", "institution": "", "field": "", "startDate": "", "endDate": "", "location": "", "gpa": "" }],
  "skills": ["skill1", "skill2"],
  "projects": [{ "name": "", "description": "", "technologies": [] }],
  "certifications": [{ "name": "", "issuer": "", "date": "" }]
}
Return ONLY JSON. No explanation. No markdown formatting wrap.

Raw Text:
"""
${rawText.substring(0, 50000)}
"""`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4000,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }]
    });

    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI Extraction Error:', error);
    throw new Error('Failed to extract resume data via AI');
  }
}

/**
 * Enhances a professional summary with 3 variations
 */
export async function enhanceSummary(currentSummary, context = {}) {
  const { jobTitle = '', experience = [], skills = [] } = context;
  
  const prompt = `Write a powerful 3-sentence professional summary for a ${jobTitle} with experience in ${skills.join(', ')}.
Current summary: ${currentSummary}
Experience context: ${JSON.stringify(experience).substring(0, 1000)}

Provide exactly 3 variations of the summary with different tones: Professional, Creative, and Technical.
Return ONLY a valid JSON object with this exact structure:
{
  "professional": "summary text here...",
  "creative": "summary text here...",
  "technical": "summary text here..."
}
Return ONLY JSON. No explanation. No markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });
    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI Enhance Summary Error:', error);
    throw new Error('Failed to enhance summary');
  }
}

/**
 * Enhances a single bullet point with 3 variations (Results, Process, Impact)
 */
export async function improveBullets(bullet, context = {}) {
  const { jobTitle = '', industry = '', level = '' } = context;
  
  const prompt = `Enhance this resume bullet point to make it more impactful.
      
Original: "${bullet}"

Context:
- Job Title: ${jobTitle}
- Industry: ${industry}
- Experience Level: ${level}

Requirements:
- Use strong action verbs
- Add quantifiable metrics (estimate generic placeholders if not provided, like [X]%)
- Use XYZ format: Accomplished [X] as measured by [Y] by doing [Z]
- Keep under 25 words
- Professional tone

Provide exactly 3 variations with different emphasis:
1. Results-focused
2. Process-focused
3. Impact-focused

Return ONLY a valid JSON object matching this structure:
{
  "resultsFocused": { "text": "...", "rationale": "..." },
  "processFocused": { "text": "...", "rationale": "..." },
  "impactFocused": { "text": "...", "rationale": "..." }
}
Return ONLY JSON. No explanation. No markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });
    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI Enhance Bullet Error:', error);
    throw new Error('Failed to enhance bullet point');
  }
}

/**
 * Optimizes a resume against a specific job description
 */
export async function optimizeForJob(resumeData, jobDescription) {
  const prompt = `Optimize this resume for the following job posting.
      
Current Resume Data:
${JSON.stringify(resumeData).substring(0, 30000)}

Job Posting:
${jobDescription}

Tasks:
1. Extract key requirements from job posting
2. Identify matching and missing skills
3. Calculate match percentage
4. Suggest specific improvements to: summary, skills, experience bullets
5. Reorder content/prioritize

Return ONLY a valid JSON object matching this structure:
{
  "matchScore": 0,
  "requiredSkills": [{ "skill": "", "status": "matching|missing" }],
  "recommendations": {
    "critical": [{ "type": "", "message": "", "action": "" }],
    "important": [{ "type": "", "message": "", "action": "" }],
    "optional": [{ "type": "", "message": "", "action": "" }]
  },
  "optimizedContent": {
    "summary": "...",
    "addedSkills": ["..."],
    "bulletEnhancements": [{ "original": "...", "suggested": "..." }]
  }
}
Return ONLY JSON. No explanation. No markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 3000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });
    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI optimizeForJob Error:', error);
    throw new Error('Failed to optimize resume for job');
  }
}

/**
 * Performs complete ATS analysis on a resume against an optional job description
 */
export async function analyzeResume(resumeText, jobDescription = '') {
  const prompt = `Analyze this resume for ATS compatibility and provide a structured JSON response.
${jobDescription ? `Compare it against this Job Description:\n${jobDescription}\n` : ''}

Resume Text:
"""
${resumeText.substring(0, 30000)}
"""

Provide the analysis as a JSON object matching this structure:
{
  "atsScore": 0, // 0-100 overall score
  "matchScore": 0, // 0-100 job description match percentage (if JD provided, else leave 0)
  "scores": {
    "formatting": 0,
    "keywords": 0,
    "experience": 0,
    "education": 0,
    "skills": 0,
    "readability": 0
  },
  "keywords": {
    "matched": ["keyword1"],
    "missing": ["keyword2"],
    "suggested": ["keyword3"]
  },
  "suggestions": [
    {
      "section": "experience",
      "type": "critical", // or "warning" or "tip"
      "message": "Add metrics to recent role",
      "improvement": "Increased sales by 20%"
    }
  ],
  "strengths": ["string1", "string2", "string3"],
  "weaknesses": ["string1", "string2", "string3"],
  "aiSummary": "A short 2-3 sentence overview of the resume's quality."
}
Return ONLY JSON. No explanation. No markdown.`;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 3000,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });
    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI Analyze Resume Error:', error);
    throw new Error('Failed to analyze resume');
  }
}

/**
 * Suggests skills based on job title and existing skills
 */
export async function suggestSkills(jobTitle, experience = [], existingSkills = []) {
  const prompt = `Suggest exactly 15 highly relevant skills for a ${jobTitle} based on standard industry requirements.
Exclude these existing skills: ${existingSkills.join(', ')}

Return ONLY a JSON array of strings. No markdown. No explanation.
Example: ["Skill 1", "Skill 2"]`;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 500,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }]
    });
    return sanitizeAndParseJSON(response.content[0].text);
  } catch (error) {
    logger.error('AI Suggest Skills Error:', error);
    throw new Error('Failed to suggest skills');
  }
}

/**
 * Helper to strip markdown formatting from LLM JSON responses
 */
function sanitizeAndParseJSON(rawString) {
  try {
    let cleanStr = rawString.trim();
    if (cleanStr.startsWith('\`\`\`json')) {
      cleanStr = cleanStr.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (cleanStr.startsWith('\`\`\`')) {
      cleanStr = cleanStr.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }
    return JSON.parse(cleanStr);
  } catch (e) {
    console.error('Failed to parse AI JSON response:', rawString.substring(0, 200));
    throw new Error('AI returned malformed JSON');
  }
}
