import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import aiService from '../ai/ai.service.js';
import ATSChecker from '../services/atsChecker.js';

export const analyzeResumeController = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { jobDescription, jobTitle, company } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

    if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Combine all text from the resume to send to the analyzer
    let fullText = `${resume.personalInfo?.fullName || ''}\n${resume.personalInfo?.jobTitle || ''}\n`;
    fullText += `${resume.summary || ''}\n\n`;

    resume.experience?.forEach(exp => {
        fullText += `${exp.position || exp.jobTitle || ''} at ${exp.company}\n`;
        fullText += `${exp.description || ''}\n`;
        exp.bullets?.forEach(b => fullText += `- ${b}\n`);
    });

    resume.education?.forEach(ed => {
        fullText += `${ed.degree} in ${ed.field} from ${ed.institution}\n`;
    });

    resume.skills?.forEach(cat => {
        if (typeof cat === 'string') {
            fullText += `${cat}\n`;
        } else {
            fullText += `${cat.category || ''}:\n`;
            cat.items?.forEach(item => fullText += `${item.name || item}\n`);
        }
    });

    // Determine assumed file format or default
    const assumedFormat = resume.sourceFile?.fileType || 'application/pdf';
    
    // Call the local rule-based ATS checker
    const localAtsResult = ATSChecker.checkCompatibility(resume, assumedFormat, fullText);

    // Call the AI Service
    const aiResponse = await aiService.analyzeResume(resume, jobDescription);
    const analysisResult = aiResponse.data;
    
    // Blend the scores for a more robust ATS score
    const aiScore = analysisResult.atsScore?.score || analysisResult.score || 0;
    const finalAtsScore = Math.round((localAtsResult.score + aiScore) / 2);

    // Create or update the analysis record
    let analysis = await ResumeAnalysis.findOne({ resumeId: resume._id });
    if (!analysis) {
        analysis = new ResumeAnalysis({
            resumeId: resume._id,
            userId: req.user._id,
            jobDescription,
            jobTitle,
            company
        });
    } else {
        analysis.jobDescription = jobDescription;
        analysis.jobTitle = jobTitle;
        analysis.company = company;
    }

    // Map AI results and local ATS rules to DB schema
    analysis.atsScore = finalAtsScore;
    analysis.matchScore = analysisResult.keywordMatch?.matchPercentage || analysisResult.matchScore || 0;
    analysis.scores = {
        formatting: analysisResult.atsScore?.breakdown?.formatting || 0,
        keywords: analysisResult.atsScore?.breakdown?.keywordMatch || 0,
        experience: analysisResult.atsScore?.breakdown?.experience || 0,
        skills: analysisResult.atsScore?.breakdown?.skills || 0,
        achievements: analysisResult.atsScore?.breakdown?.achievements || 0
    };
    analysis.keywords = {
        matched: analysisResult.keywordMatch?.matchedKeywords || [],
        missing: analysisResult.keywordMatch?.missingKeywords || [],
        suggested: analysisResult.keywordMatch?.criticalMissing || []
    };
    
    const aiSuggestions = (analysisResult.suggestions || []).map(s => ({
        section: s.section || 'general',
        type: s.priority === 'high' ? 'critical' : 'tip',
        message: s.title || s.description || s,
        improvement: s.description || ''
    }));

    analysis.suggestions = [...aiSuggestions, ...localAtsResult.warnings.map(w => ({
        section: 'general',
        type: 'warning',
        message: w.message,
        improvement: w.suggestion
    }))];
    
    analysis.strengths = analysisResult.strengths || [];
    analysis.weaknesses = [...(analysisResult.weaknesses || []), ...localAtsResult.issues.map(i => i.message)];
    analysis.aiSummary = analysisResult.aiSummary || `Resume analysis completed with a score of ${finalAtsScore}%.`;

    await analysis.save();

    // Update the main resume with the latest ats score and analysis date
    resume.atsScore = finalAtsScore;
    resume.lastAnalyzed = new Date();
    await resume.save();

    res.status(200).json({
        success: true,
        data: analysis,
        provider: aiResponse.provider
    });
});
