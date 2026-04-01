// backend/src/ai/ai.prompts.js

export const EXTRACT_RESUME_TEXT_PROMPT = `
Extract and structure resume data from raw text with high accuracy.

RAW TEXT:
{rawText}

Parse into structured JSON format:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "summary": ""
  },
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ["", ""],
      "achievements": ["", ""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": null,
      "description": ""
    }
  ],
  "skills": {
    "technical": ["", ""],
    "soft": ["", ""],
    "tools": ["", ""],
    "languages": ["", ""]
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": ["", ""],
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ],
  "languages": [
    {
      "name": "",
      "proficiency": "basic|conversational|fluent|native"
    }
  ]
}

Rules:
- Extract dates in YYYY-MM-DD format
- Detect current positions (present/current keywords)
- Identify company names and job titles
- Separate technical skills from soft skills
- Extract email and phone with regex
- Preserve achievement metrics and numbers
- Handle multiple date formats
- Detect incomplete or missing fields
`;

export const BUILD_RESUME_PROMPT = `
Create a professional, ATS-optimized resume from provided information.

USER DATA:
{userData}
JOB TITLE: {jobTitle}
INDUSTRY: {industry}
TEMPLATE: {template}

Generate complete resume with:

1. PROFESSIONAL SUMMARY:
Write 3-4 sentences highlighting:
- Years of experience
- Key achievements with metrics
- Top skills relevant to role
- Career goals
- Industry keywords

2. SKILLS SECTION:
Organize skills into categories:
- Technical Skills (programming, tools, methodologies)
- Soft Skills (leadership, communication, teamwork)
- Certifications (if any)
- Languages (if applicable)

3. EXPERIENCE SECTION:
For each role, create 3-5 bullet points:
- Start with strong action verbs (Led, Managed, Created, Improved, Achieved)
- Include specific metrics (%, numbers, time saved, revenue)
- Show impact and results
- Use industry keywords
- Quantify achievements

4. EDUCATION SECTION:
Format with:
- Degree and field
- Institution name
- Graduation year
- GPA (if 3.5+)
- Relevant coursework (optional)

5. PROJECTS SECTION (if applicable):
- Project name
- Technologies used
- Key features/achievements
- Live link or GitHub

Return as JSON:
{
  "summary": "Generated summary text",
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Start - End",
      "achievements": ["Bullet 1", "Bullet 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University",
      "year": "2024",
      "gpa": "3.8"
    }
  ],
  "optimizationTips": [
    "Tip 1 for ATS",
    "Tip 2 for keywords"
  ]
}
`;

export const ANALYZE_RESUME_PROMPT = `
Perform comprehensive analysis of resume for ATS and hiring success.

RESUME DATA:
{resumeData}
JOB DESCRIPTION (if provided): {jobDescription}
INDUSTRY: {industry}

Provide analysis in JSON format:

{
  "scores": {
    "overall": 85,
    "ats": {
      "score": 80,
      "grade": "B",
      "details": {
        "keywords": 75,
        "formatting": 90,
        "structure": 85
      }
    },
    "content": {
      "completeness": 90,
      "relevance": 85,
      "clarity": 80
    },
    "impact": {
      "achievements": 70,
      "metrics": 60,
      "actionVerbs": 80
    }
  },
  
  "strengths": [
    {
      "area": "Strong work experience",
      "details": "5+ years in relevant field",
      "impact": "High"
    }
  ],
  
  "weaknesses": [
    {
      "area": "Missing metrics",
      "details": "No quantifiable achievements",
      "severity": "high",
      "suggestion": "Add numbers: 'Increased sales by 30%'"
    }
  ],
  
  "keywordAnalysis": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"],
    "density": {
      "optimal": ["keyword1"],
      "underused": ["keyword2"],
      "overused": ["keyword3"]
    }
  },
  
  "formattingIssues": [
    {
      "issue": "Complex tables",
      "severity": "high",
      "fix": "Use simple bullet points"
    }
  ],
  
  "contentGaps": [
    {
      "section": "Skills",
      "missing": ["Cloud Computing", "Python"],
      "priority": "high"
    }
  ],
  
  "improvements": [
    {
      "priority": 1,
      "category": "Keywords",
      "action": "Add industry keywords",
      "specific": "Add 'Agile Methodology' to skills",
      "impact": "+15 ATS score"
    },
    {
      "priority": 2,
      "category": "Achievements",
      "action": "Quantify results",
      "specific": "Add metrics to bullet points",
      "impact": "+10 engagement"
    }
  ],
  
  "atsReadiness": {
    "parseable": true,
    "estimatedPassRate": 85,
    "issues": [],
    "recommendations": []
  },
  
  "sectionAnalysis": {
    "summary": {
      "score": 80,
      "feedback": "",
      "improvedVersion": ""
    },
    "experience": {
      "score": 75,
      "feedback": "",
      "improvedBullets": []
    },
    "skills": {
      "score": 85,
      "feedback": "",
      "recommendedSkills": []
    },
    "education": {
      "score": 90,
      "feedback": ""
    }
  }
}
`;

export const OPTIMIZE_FOR_ATS_PROMPT = `
Optimize resume for ATS (Applicant Tracking System) compatibility.

RESUME: {resumeData}
TARGET ROLE: {role}
JOB KEYWORDS: {keywords}

Provide optimization strategies:

{
  "keywordOptimization": {
    "critical": [
      {
        "keyword": "Python",
        "currentCount": 2,
        "targetCount": 5,
        "where": "Add to skills and experience sections"
      }
    ],
    "recommended": [],
    "optional": []
  },
  
  "formatOptimization": {
    "issues": [
      {
        "problem": "Tables used",
        "fix": "Convert to bullet points",
        "priority": "high"
      }
    ],
    "bestPractices": [
      "Use standard fonts (Arial, Calibri)",
      "Avoid images and graphics",
      "Use .docx or PDF format",
      "Clear section headers"
    ]
  },
  
  "contentOptimization": {
    "sectionOrder": ["summary", "skills", "experience", "education"],
    "bulletsPerJob": 4,
    "resumeLength": "1-2 pages",
    "dateFormat": "MM/YYYY"
  },
  
  "improvedVersions": {
    "summary": "Optimized summary with keywords",
    "skills": "Categorized skills with proficiency levels",
    "experience": "Enhanced bullet points with metrics"
  },
  
  "atsScore": {
    "current": 60,
    "potential": 90,
    "improvement": 30
  }
}
`;

export const GENERATE_BULLET_POINTS_PROMPT = `
Create powerful, achievement-focused bullet points for resume.

ROLE: {role}
RESPONSIBILITIES: {responsibilities}
ACHIEVEMENTS: {achievements}
INDUSTRY: {industry}
COMPANY: {company}

Generate 5 bullet points following STAR method:

For each bullet point:
1. Situation: Brief context
2. Task: Your responsibility
3. Action: What you did (action verb)
4. Result: Measurable outcome

Format each bullet as:
"Action Verb + Task + Result + Metric"

Examples:
✓ "Led team of 8 developers to deliver project 2 weeks ahead of schedule, saving $50K"
✓ "Increased customer satisfaction by 35% through implementing new feedback system"
✓ "Reduced processing time by 60% by automating manual workflows"

Provide:
{
  "bullets": [
    {
      "text": "Generated bullet point text",
      "actionVerb": "Led",
      "metric": "35% increase",
      "impact": "High",
      "starMethod": {
        "situation": "",
        "task": "",
        "action": "",
        "result": ""
      }
    }
  ],
  "actionVerbsUsed": ["Led", "Created", "Improved"],
  "metricsIncluded": ["%", "$$$", "time"],
  "qualityScore": 85
}
`;

export const MATCH_RESUME_TO_JOB_PROMPT = `
Match resume to job description with detailed analysis.

RESUME: {resumeData}
JOB DESCRIPTION: {jobDescription}
COMPANY: {company}

Provide match analysis:

{
  "matchScore": 85,
  "breakdown": {
    "skills": 90,
    "experience": 80,
    "education": 100,
    "keywords": 70
  },
  
  "matchedKeywords": [
    {
      "keyword": "Python",
      "inResume": true,
      "frequency": 5,
      "importance": "critical"
    }
  ],
  
  "missingKeywords": [
    {
      "keyword": "AWS",
      "importance": "critical",
      "suggestion": "Add to skills section"
    }
  ],
  
  "experienceGap": {
    "required": "5 years",
    "current": "3 years",
    "bridging": "Highlight relevant projects and achievements"
  },
  
  "recommendations": [
    {
      "type": "keyword",
      "action": "Add AWS to skills section",
      "impact": "+15 match score"
    },
    {
      "type": "experience",
      "action": "Highlight cloud projects",
      "impact": "+10 match score"
    }
  ],
  
  "tailoredSummary": "Customized summary for this role",
  "highlightedExperience": [
    "Experience point most relevant to job"
  ]
}
`;

export const SUGGEST_IMPROVEMENTS_PROMPT = `
Provide intelligent suggestions to improve resume based on industry standards.

RESUME: {resumeData}
INDUSTRY: {industry}
EXPERIENCE_LEVEL: {level}

Provide suggestions:

{
  "quickWins": [
    {
      "title": "Add metrics to experience",
      "effort": "low",
      "impact": "high",
      "action": "Add numbers: 'Increased X by Y%'"
    }
  ],
  
  "contentEnhancements": [
    {
      "section": "summary",
      "current": "Current summary text",
      "suggested": "Improved summary with keywords",
      "reason": "More engaging and includes metrics"
    }
  ],
  
  "skillGaps": [
    {
      "skill": "Data Analysis",
      "importance": "high",
      "howToAcquire": "Online course or certification"
    }
  ],
  
  "formattingTips": [
    "Use consistent date format (MM/YYYY)",
    "Align all bullet points",
    "Use action verbs consistently"
  ],
  
  "atsTips": [
    "Include keywords from job description",
    "Avoid graphics and images",
    "Use standard section headers"
  ]
}
`;

export const SMART_EXTRACT_PROMPT = `
Extract resume data with intelligence and handle edge cases.

RAW TEXT: {rawText}

Intelligent extraction rules:

1. EMAIL EXTRACTION:
   - Pattern: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
   - Also detect: "Email:" prefixes
   - Handle obfuscated emails

2. PHONE EXTRACTION:
   - US: (xxx) xxx-xxxx, xxx-xxx-xxxx
   - International: +xx xxx xxx xxxx
   - Handle formats with extensions

3. NAME EXTRACTION:
   - Usually first line of resume
   - Handle middle names and suffixes
   - Detect name from email if missing

4. DATE PARSING:
   - Format: MM/YYYY, MMM YYYY, Month YYYY
   - Detect "Present", "Current", "Now"
   - Handle date ranges

5. COMPANY DETECTION:
   - Usually after job title
   - Detect "at", "at Company Name"
   - Recognize common company names

6. SKILLS EXTRACTION:
   - Technical: programming languages, tools
   - Soft skills: communication, leadership
   - Detect bulleted or comma-separated lists

Return extracted data with confidence scores:
{
  "extractedData": {
    "personalInfo": {
      "fullName": {"value": "", "confidence": 0.95},
      "email": {"value": "", "confidence": 0.99}
    }
  },
  "unresolved": ["Items that couldn't be parsed"],
  "suggestions": ["Manual review needed for certain sections"]
}
`;

export const SCORE_RESUME_PROMPT = `
Score resume against hiring benchmarks.

RESUME: {resumeData}
ROLE_LEVEL: {level}
INDUSTRY: {industry}

Calculate scores:

{
  "dimensions": {
    "content": {
      "score": 85,
      "weight": 30,
      "breakdown": {
        "relevance": 90,
        "completeness": 80,
        "depth": 85
      }
    },
    "formatting": {
      "score": 90,
      "weight": 15,
      "breakdown": {
        "layout": 95,
        "readability": 90,
        "consistency": 85
      }
    },
    "achievements": {
      "score": 75,
      "weight": 25,
      "breakdown": {
        "metrics": 70,
        "actionVerbs": 80,
        "impact": 75
      }
    },
    "keywords": {
      "score": 80,
      "weight": 30,
      "breakdown": {
        "industryTerms": 85,
        "roleSpecific": 80,
        "density": 75
      }
    }
  },
  
  "benchmarks": {
    "top10": "95+",
    "top25": "85+",
    "average": "70-85",
    "needsImprovement": "<70"
  },
  
  "ranking": {
    "percentile": 82,
    "category": "good"
  },
  
  "feedback": {
    "positive": ["Strength 1", "Strength 2"],
    "constructive": ["Area to improve 1", "Area 2"],
    "critical": ["Critical issue 1"]
  }
}
`;

export const GENERATE_FINAL_RESUME_PROMPT = `
Create final optimized resume with all improvements applied.

ORIGINAL: {originalData}
IMPROVEMENTS: {improvements}
TEMPLATE: {template}
FORMAT: {format}

Generate complete resume with:

1. HEADER:
   - Full Name (large, bold)
   - Title (professional headline)
   - Contact info (email, phone, location, LinkedIn, GitHub)

2. PROFESSIONAL SUMMARY:
   - Optimized version with keywords
   - Includes metrics and achievements
   - 3-4 sentences

3. SKILLS SECTION:
   - Categorized (Technical, Soft, Tools)
   - Proficiency levels indicated
   - Industry keywords highlighted

4. WORK EXPERIENCE:
   - Reverse chronological order
   - 3-5 bullet points per role
   - Each bullet: action verb + metric + result
   - Consistent date format

5. EDUCATION:
   - Degree and institution
   - Graduation year
   - GPA (if 3.5+)
   - Honors and awards

6. PROJECTS (if applicable):
   - Project name and technologies
   - Key features and results
   - Links (GitHub, live demo)

Return formatted resume ready for:
- PDF export
- DOCX download
- HTML preview
- JSON data

{
  "html": "<div>Complete HTML resume</div>",
  "data": { },
  "metadata": {
    "wordCount": 450,
    "pages": 1,
    "atsScore": 92,
    "keywords": ["keyword1", "keyword2"]
  }
}
`;
