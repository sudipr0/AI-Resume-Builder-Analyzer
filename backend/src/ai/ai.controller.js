// backend/src/ai/ai.controller.js
import aiService from './ai.service.js';

// ==================== HEALTH CHECK ====================
export const checkHealth = async (req, res) => {
    try {
        res.json({
            success: true,
            status: 'operational',
            timestamp: new Date().toISOString(),
            services: {
                groq: {
                    enabled: !!process.env.GROQ_API_KEY,
                    model: 'llama-3.3-70b-versatile',
                    status: process.env.GROQ_API_KEY ? 'configured' : 'missing'
                },
                openai: {
                    enabled: !!process.env.OPENAI_API_KEY,
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    status: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
                }
            },
            endpoints: [
                'GET /health',
                'POST /analyze/full',
                'POST /analyze/resume',
                'POST /analyze/ats',
                'POST /generate/summary',
                'POST /optimize/summary',
                'POST /extract-keywords',
                'POST /generate/bullets',
                'POST /suggest/skills',
                'GET /stats'
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== FULL RESUME ANALYSIS ====================
export const fullResumeAnalysis = async (req, res) => {
    try {
        const { resumeData, jobDescription, options = {} } = req.body;

        if (!resumeData) {
            return res.status(400).json({ success: false, error: 'Resume data required' });
        }

        console.log('📊 Full resume analysis started...');

        // Mock response for now (will be replaced with actual AI)
        const result = {
            atsScore: {
                score: 85,
                breakdown: {
                    keywordMatch: 80,
                    formatting: 90,
                    experience: 85,
                    skills: 88,
                    achievements: 75
                }
            },
            keywordMatch: {
                matchPercentage: 75,
                matchedKeywords: resumeData.skills?.slice(0, 4) || ['JavaScript', 'React'],
                missingKeywords: ['TypeScript', 'Docker', 'AWS'],
                criticalMissing: ['TypeScript']
            },
            sectionAnalysis: {
                summary: { score: 85, suggestions: ['Add more metrics'] },
                experience: { score: 80, suggestions: ['Quantify achievements'] },
                skills: { score: 88, suggestions: ['Add TypeScript'] },
                education: { score: 90, suggestions: [] }
            },
            suggestions: [
                {
                    title: 'Add TypeScript',
                    description: 'TypeScript is a critical missing skill',
                    priority: 'high',
                    section: 'skills'
                },
                {
                    title: 'Add metrics to experience',
                    description: 'Quantify your achievements with numbers',
                    priority: 'high',
                    section: 'experience'
                }
            ],
            generatedContent: {
                summaryVariants: [
                    {
                        text: `Experienced professional with expertise in ${resumeData.skills?.slice(0, 3).join(', ') || 'relevant technologies'}. Proven track record of delivering high-quality results.`,
                        tone: 'professional',
                        keywords: resumeData.skills || [],
                        atsScore: 85
                    }
                ],
                bestMatchIndex: 0
            }
        };

        res.json({
            success: true,
            data: result,
            provider: 'ai-service',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Full analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GENERATE SUMMARY ====================
export const generateSummary = async (req, res) => {
    try {
        const { resumeData, jobDescription, options = {} } = req.body;

        if (!resumeData) {
            return res.status(400).json({ success: false, error: 'Resume data required' });
        }

        console.log('📝 Generating summary variants...');

        // Try AI service first, fallback to mock
        let result;
        try {
            result = await aiService.generateSummaryVariants(resumeData, jobDescription, {
                count: options.count || 3,
                tone: options.tone || 'professional'
            });
        } catch (aiError) {
            console.log('Using mock summary generation:', aiError.message);

            // Mock response
            result = {
                data: {
                    variants: [
                        {
                            text: `Experienced professional with expertise in ${resumeData.skills?.slice(0, 3).join(', ') || 'relevant technologies'}. Proven track record of delivering high-quality results and driving innovation.`,
                            tone: 'professional',
                            keywords: resumeData.skills?.slice(0, 5) || ['JavaScript', 'React'],
                            atsScore: 85,
                            highlights: ['5+ years experience', 'Team leadership']
                        },
                        {
                            text: `Results-driven developer passionate about creating innovative solutions. Skilled in ${resumeData.skills?.slice(0, 2).join(', ') || 'modern technologies'} with a focus on scalable applications.`,
                            tone: 'enthusiastic',
                            keywords: ['innovation', 'scalability', ...(resumeData.skills?.slice(0, 3) || [])],
                            atsScore: 82,
                            highlights: ['Full-stack development', 'Agile methodology']
                        },
                        {
                            text: `Technical leader specializing in modern web technologies. Successfully delivered enterprise-scale applications with measurable business impact.`,
                            tone: 'executive',
                            keywords: ['technical leadership', 'enterprise', 'scalability'],
                            atsScore: 88,
                            highlights: ['Team management', 'Strategic planning']
                        }
                    ],
                    bestMatchIndex: 0
                },
                provider: 'mock'
            };
        }

        res.json({
            success: true,
            data: result.data,
            provider: result.provider || 'mock',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Summary generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== OPTIMIZE SUMMARY ====================
export const optimizeSummary = async (req, res) => {
    try {
        const { summary, jobDescription, options = {} } = req.body;

        if (!summary) {
            return res.status(400).json({ success: false, error: 'Summary required' });
        }

        console.log('✨ Optimizing summary...');

        let optimized = summary;
        const improvements = [];

        // Simple mock optimization
        if (options.type === 'enhance') {
            optimized = optimized
                .replace(/developed/gi, 'engineered')
                .replace(/helped/gi, 'spearheaded')
                .replace(/worked on/gi, 'led');
            improvements.push('Enhanced with powerful action verbs');
        }

        if (options.type === 'metrics' && !/\d+/.test(optimized)) {
            optimized += ' Achieved 30% efficiency improvement and reduced costs by $100K.';
            improvements.push('Added quantifiable metrics');
        }

        res.json({
            success: true,
            data: {
                original: summary,
                optimized,
                improvements,
                keywordsAdded: ['leadership', 'innovation'],
                confidence: 0.95
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Optimization error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== EXTRACT KEYWORDS ====================
export const extractKeywords = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.length < 20) {
            return res.status(400).json({ success: false, error: 'Text required (min 20 chars)' });
        }

        console.log('🔑 Extracting keywords...');

        // Try AI service first
        let result;
        try {
            result = await aiService.extractKeywords(text);
        } catch (aiError) {
            console.log('Using mock keyword extraction:', aiError.message);

            // Mock keyword extraction
            const commonKeywords = [
                'JavaScript', 'React', 'Node.js', 'Python', 'Java',
                'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
                'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
                'Agile', 'Scrum', 'CI/CD', 'Git', 'TypeScript', 'GraphQL'
            ];

            const detected = commonKeywords.filter(k =>
                text.toLowerCase().includes(k.toLowerCase())
            );

            result = {
                data: {
                    keywords: detected.length ? detected : commonKeywords.slice(0, 10),
                    categories: {
                        technical: detected.slice(0, 5),
                        soft: ['Leadership', 'Communication', 'Problem Solving'],
                        tools: ['Git', 'Docker', 'AWS'],
                        methodology: ['Agile', 'Scrum']
                    },
                    suggestedRole: text.match(/(?:Senior|Lead)?\s*(?:Software|Full[-\s]Stack|Frontend|Backend)?\s*(?:Engineer|Developer|Architect)/i)?.[0] || 'Software Engineer',
                    criticalKeywords: detected.slice(0, 3)
                },
                provider: 'mock'
            };
        }

        res.json({
            success: true,
            data: result.data,
            provider: result.provider || 'mock',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Keyword extraction error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ANALYZE RESUME ====================
export const analyzeResume = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!resumeData) {
            return res.status(400).json({ success: false, error: 'Resume data required' });
        }

        console.log('🔍 Analyzing resume...');

        // Try AI service first
        let result;
        try {
            result = await aiService.analyzeResume(resumeData, jobDescription);
        } catch (aiError) {
            console.log('Using mock analysis:', aiError.message);

            // Mock analysis
            result = {
                data: {
                    atsScore: {
                        score: 85,
                        breakdown: {
                            keywordMatch: 80,
                            formatting: 90,
                            experience: 85,
                            skills: 88,
                            achievements: 75
                        }
                    },
                    keywordMatch: {
                        matchPercentage: 75,
                        matchedKeywords: resumeData.skills?.slice(0, 4) || ['JavaScript', 'React'],
                        missingKeywords: ['TypeScript', 'Docker', 'AWS'],
                        criticalMissing: ['TypeScript']
                    },
                    sectionAnalysis: {
                        summary: { score: 85, suggestions: ['Add more metrics'] },
                        experience: { score: 80, suggestions: ['Quantify achievements'] },
                        skills: { score: 88, suggestions: ['Add TypeScript'] },
                        education: { score: 90, suggestions: [] }
                    },
                    suggestions: [
                        {
                            title: 'Add TypeScript',
                            description: 'TypeScript is a critical missing skill',
                            priority: 'high',
                            section: 'skills'
                        },
                        {
                            title: 'Add metrics to experience',
                            description: 'Quantify your achievements with numbers',
                            priority: 'high',
                            section: 'experience'
                        }
                    ]
                },
                provider: 'mock'
            };
        }

        res.json({
            success: true,
            data: result.data,
            provider: result.provider || 'mock',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GENERATE BULLETS ====================
export const generateBullets = async (req, res) => {
    try {
        const { context, jobDescription } = req.body;

        if (!context) {
            return res.status(400).json({ success: false, error: 'Context required' });
        }

        console.log('🎯 Generating bullet points...');

        // Mock bullet points
        const bullets = [
            {
                text: 'Led development of microservices architecture serving 10K+ daily users',
                impact: 'high',
                metrics: ['10K+ users'],
                keywords: ['microservices', 'architecture', 'scaling']
            },
            {
                text: 'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
                impact: 'high',
                metrics: ['87% reduction'],
                keywords: ['CI/CD', 'deployment', 'automation']
            },
            {
                text: 'Optimized database queries resulting in 50% faster API response times',
                impact: 'medium',
                metrics: ['50% faster'],
                keywords: ['optimization', 'database', 'performance']
            },
            {
                text: 'Mentored 5 junior developers, improving team productivity by 30%',
                impact: 'high',
                metrics: ['30% improvement'],
                keywords: ['mentoring', 'leadership', 'team development']
            },
            {
                text: 'Reduced technical debt by 40% through code refactoring and best practices',
                impact: 'medium',
                metrics: ['40% reduction'],
                keywords: ['refactoring', 'technical debt', 'code quality']
            }
        ];

        res.json({
            success: true,
            data: { bullets },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Bullet generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== SUGGEST SKILLS ====================
export const suggestSkills = async (req, res) => {
    try {
        const { currentSkills, jobDescription } = req.body;

        console.log('💡 Suggesting skills...');

        // Mock skill suggestions
        const allSkills = [
            { name: 'TypeScript', relevance: 95, category: 'technical', isCritical: true },
            { name: 'React', relevance: 98, category: 'technical', isCritical: true },
            { name: 'Node.js', relevance: 94, category: 'technical', isCritical: true },
            { name: 'Python', relevance: 88, category: 'technical', isCritical: false },
            { name: 'Docker', relevance: 92, category: 'tools', isCritical: true },
            { name: 'AWS', relevance: 90, category: 'tools', isCritical: true },
            { name: 'Kubernetes', relevance: 85, category: 'tools', isCritical: false },
            { name: 'GraphQL', relevance: 87, category: 'technical', isCritical: false },
            { name: 'Leadership', relevance: 89, category: 'soft', isCritical: true },
            { name: 'Communication', relevance: 92, category: 'soft', isCritical: true }
        ];

        const currentSet = new Set(currentSkills?.map(s => s.toLowerCase()) || []);

        const suggested = allSkills.filter(s =>
            !currentSet.has(s.name.toLowerCase())
        ).sort((a, b) => b.relevance - a.relevance);

        const missingCritical = suggested
            .filter(s => s.isCritical)
            .map(s => s.name);

        res.json({
            success: true,
            data: {
                suggested: suggested.slice(0, 10),
                missingCritical: missingCritical.slice(0, 5),
                categories: {
                    technical: suggested.filter(s => s.category === 'technical').map(s => s.name),
                    tools: suggested.filter(s => s.category === 'tools').map(s => s.name),
                    soft: suggested.filter(s => s.category === 'soft').map(s => s.name)
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Skill suggestion error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== CALCULATE ATS SCORE ====================
export const calculateATSScore = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!resumeData) {
            return res.status(400).json({ success: false, error: 'Resume data required' });
        }

        console.log('📊 Calculating ATS score...');

        // Mock ATS score
        const result = {
            score: 85,
            factors: {
                keywordDensity: 35,
                format: 18,
                experience: 17,
                achievements: 8,
                education: 4,
                skills: 3
            },
            recommendations: [
                'Add more industry-specific keywords',
                'Use standard section headings',
                'Include more metrics in achievements',
                'Add missing critical skills like TypeScript'
            ]
        };

        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ ATS score error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== GET STATS ====================
export const getStats = async (req, res) => {
    try {
        res.json({
            success: true,
            stats: {
                totalRequests: 0,
                groqSuccess: 0,
                openaiSuccess: 0,
                failures: 0,
                avgResponseTime: 0
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};