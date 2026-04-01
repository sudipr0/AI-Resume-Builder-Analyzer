import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { analyzeResume } from '../utils/aiService.js';
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
        fullText += `${exp.position} at ${exp.company}\n`;
        fullText += `${exp.description || ''}\n`;
        exp.bullets?.forEach(b => fullText += `- ${b}\n`);
    });

    resume.education?.forEach(ed => {
        fullText += `${ed.degree} in ${ed.field} from ${ed.institution}\n`;
    });

    resume.skills?.forEach(cat => {
        fullText += `${cat.category}:\n`;
        cat.items?.forEach(item => fullText += `${item.name}\n`);
    });

    // Determine assumed file format or default
    const assumedFormat = resume.sourceFile?.fileType || 'application/pdf';
    
    // Call the local rule-based ATS checker
    const localAtsResult = ATSChecker.checkCompatibility(resume, assumedFormat, fullText);

    // Call the AI Service
    const analysisResult = await analyzeResume(fullText, jobDescription);
    
    // Blend the scores for a more robust ATS score
    const finalAtsScore = Math.round((localAtsResult.score + analysisResult.atsScore) / 2);

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
    analysis.matchScore = analysisResult.matchScore;
    analysis.scores = analysisResult.scores;
    analysis.keywords = analysisResult.keywords;
    analysis.suggestions = [...analysisResult.suggestions, ...localAtsResult.warnings.map(w => ({
        section: 'general',
        type: 'warning',
        message: w.message,
        improvement: w.suggestion
    }))];
    analysis.strengths = analysisResult.strengths;
    analysis.weaknesses = [...analysisResult.weaknesses, ...localAtsResult.issues.map(i => i.message)];
    analysis.aiSummary = analysisResult.aiSummary;

    await analysis.save();

    // Update the main resume with the latest ats score and analysis date
    resume.atsScore = finalAtsScore;
    resume.lastAnalyzed = new Date();
    await resume.save();

    res.status(200).json({
        success: true,
        data: analysis
    });
});
