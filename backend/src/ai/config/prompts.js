// backend/src/ai/config/prompts.js
export const PROMPTS = {
    system: {
        resumeParser: `You are a resume parser. Extract structured data from the resume text and return ONLY valid JSON, no markdown, no explanation.`,
        resumeExpert: `You are an expert resume writer. Always respond with only what is requested, no explanation.`,
        resumeOptimizer: `You are an expert resume optimizer. Always respond with valid JSON.`,
        atsExpert: `You are an ATS (Applicant Tracking System) expert. Analyze how well this resume matches the job description. Return ONLY valid JSON.`,
        careerCoach: `You are an expert career coach.`,
        resumeEditor: `You are an expert resume editor. Improve the following resume section. Return ONLY the improved content in the same format as input (plain text or JSON array).`,
        // Legacy system prompts to prevent breaking changes while transitioning
        analyzerExpert: `You are an expert ATS analyst who understands exactly how applicant tracking systems score resumes. You provide actionable feedback to improve resume scores. Always respond with valid JSON.`,
        keywordExpert: `You are an expert at extracting keywords and requirements from job descriptions. You understand which skills are critical for ATS systems. Always respond with valid JSON.`
    },

    // 1. Resume Text Extraction Prompt
    extractText: (text) => {
        return `Return this exact structure:
{
  "personal": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "duration": "", "location": "", "bullets": [] }],
  "education": [{ "degree": "", "school": "", "year": "", "gpa": "", "details": "" }],
  "skills": { "technical": [], "soft": [], "languages": [] },
  "projects": [{ "name": "", "tech": "", "description": "", "link": "" }]
}

Rules:
- Extract only what exists in the resume, leave fields empty string if not found
- bullets must be an array of strings, one per achievement
- skills must be arrays of strings
- Return ONLY the JSON object, nothing else

Resume text:
${text}`;
    },

    // 2. Bullet Point Enhancer Prompt (Replacing generateBullets / enhanceBullet)
    enhanceBullet: (jobTitle, bulletText) => {
        return `Rewrite the following resume bullet point to be stronger and more impactful.

Rules:
- Start with a powerful action verb (Led, Built, Increased, Reduced, Designed, Launched, etc.)
- Add specific numbers or percentages if the original hints at scale
- Keep it to 1-2 lines maximum
- Use past tense for past roles, present tense for current role
- Remove weak phrases like "responsible for" or "helped with"
- Return ONLY the improved bullet, no explanation, no quotes

Job Title: ${jobTitle}
Original Bullet: ${bulletText}`;
    },
    
    // Legacy support for generateBullets using the new enhancer conceptually
    generateBullets: (context) => {
        // Fallback for previous implementation
        return `Rewrite the following resume bullet point to be stronger and more impactful.
Rules:
- Start with a powerful action verb (Led, Built, Increased, Reduced, Designed, Launched, etc.)
- Add specific numbers or percentages if the original hints at scale
- Keep it to 1-2 lines maximum
- Remove weak phrases like "responsible for" or "helped with"
- Return ONLY the improved bullet in JSON format {"bullets": [{"text": "...", "impact": "high", "metrics": [], "keywords": []}]}

Context or Original Bullet: ${JSON.stringify(context, null, 2)}`;
    },

    // 3. Professional Summary Generator Prompt
    generateProfessionalSummary: (resumeData) => {
        return `Write a compelling 3-sentence professional summary for this candidate.

Rules:
- Sentence 1: Who they are + years of experience + core expertise
- Sentence 2: Their biggest achievement or key strength
- Sentence 3: What they bring to their next role / career goal
- Keep it under 80 words total
- Do NOT use "I" — write in third-person omitted style (e.g. "Experienced engineer who...")
- Return ONLY the summary paragraph, no labels, no quotes

Candidate data:
${JSON.stringify(resumeData, null, 2)}`;
    },
    
    // Legacy support for generateSummary
    generateSummary: (resumeData, jobDescription, options) => {
        return PROMPTS.generateProfessionalSummary(resumeData);
    },

    // 4. Job Description Tailoring Prompt
    tailorResume: (resumeData, jobDescription) => {
        return `Tailor the candidate's resume to better match the target job description.

Your task:
1. Identify the top 10 keywords and skills from the job description
2. Rewrite the experience bullets to naturally incorporate matching keywords
3. Suggest 3 skills to add to the skills section
4. Rewrite the summary to align with the job title and requirements

Return ONLY valid JSON in this structure:
{
  "summary": "rewritten summary",
  "experience": [{ "index": 0, "bullets": ["rewritten bullet 1", "rewritten bullet 2"] }],
  "skills_to_add": ["skill1", "skill2", "skill3"],
  "match_score": 85,
  "missing_keywords": ["keyword1", "keyword2"]
}

Job Description:
${jobDescription}

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}`;
    },

    // 5. ATS Score Checker Prompt
    checkATSScore: (resumeData, jobDescription) => {
        return `Evaluate on these criteria:
- Keyword match rate (how many JD keywords appear in resume)
- Skills alignment (required vs candidate skills)
- Job title relevance
- Experience level match
- Education match

Return ONLY valid JSON:
{
  "overall_score": 78,
  "keyword_score": 80,
  "skills_score": 75,
  "experience_score": 85,
  "education_score": 70,
  "matched_keywords": ["python", "agile", "leadership"],
  "missing_keywords": ["kubernetes", "terraform"],
  "recommendations": [
    "Add 'Kubernetes' to your skills section",
    "Mention agile methodology in your bullets",
    "Quantify your team leadership experience"
  ]
}

Job Description:
${jobDescription}

Resume:
${JSON.stringify(resumeData, null, 2)}`;
    },
    
    // Legacy ATS support
    atsScore: (resumeData, jobDescription) => {
        return PROMPTS.checkATSScore(resumeData, jobDescription);
    },
    analyzeResume: (resumeData, jobDescription) => {
        return PROMPTS.checkATSScore(resumeData, jobDescription);
    },

    // 6. Cover Letter Generator Prompt
    generateCoverLetter: (name, jobTitle, companyName, resumeData, jobDescription) => {
        return `Write a professional cover letter for this candidate applying to the job below.

Structure:
- Paragraph 1: Hook — why this company, why this role (use company name)
- Paragraph 2: Top 2 achievements from their resume that directly match the JD
- Paragraph 3: Cultural fit + what they will bring to the team
- Paragraph 4: Call to action — confident closing

Rules:
- Tone: confident, human, not robotic or generic
- Length: 250–300 words maximum
- Do NOT start with "I am writing to apply..."
- Use the candidate's actual achievements with numbers where available
- Return ONLY the cover letter text, no subject line, no labels

Candidate Name: ${name}
Job Title: ${jobTitle}
Company Name: ${companyName}
Resume: ${JSON.stringify(resumeData, null, 2)}
Job Description: ${jobDescription}`;
    },

    // 7. Section-Specific Improver Prompt
    improveSection: (sectionType, sectionContent) => {
        return `Improve the following resume section.

Section Type: ${sectionType}

Rules:
- Fix grammar and spelling
- Improve word choice and clarity
- Make it more professional and impactful
- Keep the same facts — do not invent new information
- Return ONLY the improved content in the same format as input (plain text or JSON array)

Original Content:
${typeof sectionContent === 'object' ? JSON.stringify(sectionContent, null, 2) : sectionContent}`;
    },
    
    // Legacy optimizeSummary support
    optimizeSummary: (summary, jobDescription, options) => {
        return PROMPTS.improveSection('summary', summary);
    },

    // Legacy support for extracts and skills
    extractKeywords: (text) => {
        return `Extract all key skills, technologies, and qualifications from this job description.
TEXT:
${text}
RESPONSE FORMAT (JSON):
{
  "keywords": ["skill1", "skill2"],
  "categories": { "technical": [], "soft": [], "tools": [], "methodology": [] },
  "suggestedRole": "Role Title",
  "criticalKeywords": []
}`;
    },
    suggestSkills: (currentSkills, jobDescription) => {
        return `Suggest relevant skills based on current skills and job description.
CURRENT SKILLS:
${currentSkills.join(', ')}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}
RESPONSE FORMAT (JSON):
{
  "suggested": [{ "name": "Skill", "relevance": 95, "category": "technical", "isCritical": true, "reason": "reason" }],
  "missingCritical": [],
  "categories": { "technical": [], "tools": [] }
}`;
    },

    // 1. Resume Completion Checker Prompt
    checkResumeCompletion: (resumeData, jobTitle, industry, jobRequirements) => {
        return `Analyze resume completion status and determine if it's ready for submission.

RESUME DATA:
${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}
JOB_TITLE: ${jobTitle || 'Not specified'}
INDUSTRY: ${industry || 'Not specified'}
REQUIREMENTS: ${jobRequirements || 'Not specified'}

Evaluate each section and provide completion status:

{
  "overallStatus": {
    "status": "complete|incomplete|draft",
    "completionPercentage": <number 0-100>,
    "readinessScore": <number 0-100>,
    "verdict": "Ready for submission|Needs improvement|Draft only",
    "reason": "Overall assessment"
  },
  
  "sections": {
    "personalInfo": {
      "required": ["fullName", "email", "phone", "location"],
      "completed": ["fullName", "email"],
      "missing": ["phone", "location"],
      "completionRate": 50,
      "status": "incomplete",
      "priority": "critical",
      "action": "Add contact information"
    },
    ...
  },
  
  "criticalIssues": [],
  "optionalEnhancements": [],
  "recommendations": { "critical": [], "important": [], "niceToHave": [] },
  "estimatedTimeToComplete": { "critical": "15 minutes", "all": "45 minutes" }
}`;
    },

    // 2. Draft VS Complete Classification Prompt
    classifyResumeStatus: (resumeData, userActivity) => {
        return `Determine if resume is a draft or complete based on quality thresholds.

RESUME DATA:
${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}
USER_ACTIVITY: ${JSON.stringify(userActivity)}

Classification criteria:

{
  "status": "draft|complete|ready_for_review",
  
  "draftIndicators": [
    {
      "indicator": "Missing contact information",
      "present": true,
      "weight": 10
    }
  ],
  
  "completeIndicators": [
    {
      "indicator": "All required sections filled",
      "present": true,
      "weight": 30
    }
  ],
  
  "score": {
    "draftScore": 45,
    "completeScore": 72,
    "threshold": 70,
    "classification": "draft|complete"
  },
  
  "nextSteps": {
    "ifDraft": {
      "priority": ["Add contact information"],
      "estimatedTime": "30 minutes"
    },
    "ifComplete": {
      "nextActions": ["Run ATS optimization"]
    }
  },
  
  "autoSave": {
    "lastSaved": "{timestamp}",
    "changesSinceSave": 3,
    "recommendSave": true
  }
}`;
    },

    // 3. Progress Tracking Prompt
    trackResumeProgress: (currentResume, previousResume, requirements) => {
        return `Track resume completion progress and provide actionable insights.

CURRENT STATE: ${JSON.stringify(currentResume)}
PREVIOUS STATE: ${JSON.stringify(previousResume)}
JOB_REQUIREMENTS: ${requirements || 'Not specified'}

Generate progress report:

{
  "progress": {
    "overall": {
      "previous": 45,
      "current": 78,
      "improvement": 33,
      "target": 100,
      "remaining": 22
    },
    "sections": []
  },
  "milestones": {
    "reached": [],
    "upcoming": []
  },
  "insights": {
    "strengths": [],
    "weaknesses": [],
    "opportunities": []
  },
  "nextSteps": [],
  "estimatedCompletion": {
    "date": "2024-01-20",
    "confidence": "high",
    "requiredActions": 3
  }
}`;
    },

    // 4. Smart Completion Prediction Prompt
    predictCompletion: (resumeData, userBehavior) => {
        return `Predict resume completion timeline and suggest optimal workflow.

RESUME_DATA: ${JSON.stringify(resumeData)}
USER_BEHAVIOR: ${JSON.stringify(userBehavior)}

Provide prediction:

{
  "completionPrediction": {
    "estimatedTimeToComplete": { "minimum": "20 minutes", "average": "45 minutes", "maximum": "90 minutes" },
    "confidence": 85,
    "factors": { "positive": [], "negative": [] }
  },
  "optimalWorkflow": [],
  "smartSuggestions": [],
  "blockers": [],
  "reward": {
    "nextMilestone": "85% complete",
    "reward": "Unlock advanced ATS analysis",
    "progressToReward": 75
  }
}`;
    },

    // 5. Intelligent Draft Saving Prompt
    intelligentDraftSaving: (resumeData, editHistory, changes) => {
        return `Determine when to auto-save and what version to keep.

RESUME_DATA: ${JSON.stringify(resumeData)}
EDIT_HISTORY: ${JSON.stringify(editHistory)}
CHANGES: ${JSON.stringify(changes)}

Provide saving strategy:

{
  "shouldSave": true|false,
  "reason": "Significant changes detected in experience section",
  "saveType": "auto|manual|version",
  "version": { "major": 2, "minor": 1, "patch": 0 },
  "changesDetected": [],
  "draftMetadata": {},
  "suggestions": { "beforeNextSave": [] },
  "backup": { "createBackup": true, "backupReason": "Major changes detected", "restorePoint": "before_experience_update" }
}`;
    },

    // 6. Completion Validation Prompt
    validateCompletion: (resumeData, requirements) => {
        return `Validate if resume meets all completion criteria.

RESUME: ${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}
REQUIREMENTS: ${JSON.stringify(requirements)}

Validation result:

{
  "isComplete": true|false,
  "validationScore": 85,
  "criteria": [],
  "warnings": [],
  "recommendations": [],
  "certification": {
    "isReady": true|false,
    "certifiedAt": "{timestamp}",
    "verifiedBy": "AI System",
    "certificateId": "RES-2024-001"
  }
}`;
    },

    // 7. Resume Readiness Scorecard Prompt
    readinessScorecard: (resumeData, role, standards) => {
        return `Generate comprehensive readiness scorecard for resume submission.

RESUME: ${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}
TARGET_ROLE: ${role || 'Not specified'}
INDUSTRY_STANDARDS: ${JSON.stringify(standards || {})}

Scorecard:

{
  "totalScore": 84,
  "grade": "B+",
  "status": "Ready for submission with minor improvements",
  "categories": {
    "content": { "score": 88, "weight": 30, "items": [] },
    "formatting": { "score": 90, "weight": 20, "items": [] },
    "ATS": { "score": 78, "weight": 35, "items": [] },
    "impact": { "score": 82, "weight": 15, "items": [] }
  },
  "verdict": {
    "ready": true,
    "confidence": 85,
    "recommendation": "Submit with minor improvements",
    "nextActions": []
  },
  "comparison": {
    "vsIndustryAverage": "+12",
    "vsTopCandidates": "-5",
    "percentile": "85th"
  }
}`;
    },

    // 8. Auto-Complete & Suggest Prompt
    autoCompleteSuggest: (sectionName, content, completedData, requirements) => {
        return `Generate intelligent auto-complete suggestions for incomplete sections.

INCOMPLETE_SECTION: ${sectionName}
CURRENT_CONTENT: ${JSON.stringify(content)}
COMPLETED_SECTIONS: ${JSON.stringify(completedData)}
JOB_REQUIREMENTS: ${JSON.stringify(requirements || {})}

Provide suggestions:

{
  "suggestions": [
    {
      "type": "template",
      "title": "Professional Summary Template",
      "template": "Results-driven {role} with {years}+ years of experience in {industry}...",
      "filledTemplate": "Results-driven Software Engineer...",
      "confidence": 95
    }
  ],
  "autoComplete": {
    "enabled": true,
    "sections": ["summary", "skills", "experience"],
    "preview": {}
  },
  "improvementScore": {
    "current": 65,
    "withSuggestions": 92,
    "potentialGain": 27
  }
}`;
    },

    // 9. Section Quality Assessment Prompt
    assessSectionQuality: (sectionName, content, standard) => {
        return `Assess quality of each resume section and provide detailed feedback.

SECTION: ${sectionName}
CONTENT: ${JSON.stringify(content)}
INDUSTRY_STANDARD: ${JSON.stringify(standard || {})}

Quality assessment:

{
  "sectionName": "${sectionName}",
  "overallQuality": 82,
  "metrics": {
    "actionVerbs": { "score": 85, "found": [], "missing": [], "recommendations": "" },
    "metricsInclusion": { "score": 78, "hasMetrics": true, "metricsFound": [], "missingMetrics": [], "recommendations": "" },
    "relevance": { "score": 88, "matchWithRole": "85%", "relevantBullets": 4, "irrelevantBullets": 1, "recommendations": "" },
    "length": { "score": 90, "bulletsPerJob": 4, "recommended": "3-5 bullets", "status": "optimal" },
    "grammar": { "score": 85, "errors": 2, "suggestions": [] }
  },
  "improvedVersion": {
    "original": "...",
    "improved": "...",
    "scoreImprovement": "+15"
  },
  "benchmark": {
    "top10": "95+",
    "top25": "85+",
    "current": 82,
    "gap": 3
  }
}`;
    },

    // 10. Final Verification Prompt
    finalVerification: (resumeData, checklist) => {
        return `Perform final verification before marking resume as complete.

RESUME: ${typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData)}
COMPLETION_CHECKLIST: ${JSON.stringify(checklist || {})}

Verification result:

{
  "verificationStatus": "pass|fail|conditional",
  "checks": [
    {
      "check": "All required fields present",
      "status": "pass",
      "details": "Email, phone, name present"
    }
  ],
  "finalScore": 88,
  "recommendations": [],
  "certification": {
    "isComplete": true|false,
    "completedAt": "{timestamp}",
    "version": "final_v1",
    "signature": "AI_VERIFIED"
  },
  "nextSteps": {
    "ifComplete": "Proceed to download/export",
    "ifIncomplete": "Complete recommended fixes",
    "ifDraft": "Continue editing"
  }
}`;
    }
};