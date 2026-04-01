import asyncHandler from 'express-async-handler';
import { 
    enhanceSummary, 
    improveBullets, 
    suggestSkills,
    optimizeForJob 
} from '../utils/aiService.js';

export const enhanceSummaryController = asyncHandler(async (req, res) => {
    const { currentSummary, jobTitle, experience, skills } = req.body;
    
    if (!jobTitle) {
        return res.status(400).json({ success: false, message: 'jobTitle is required' });
    }

    const enhanced = await enhanceSummary(currentSummary, { jobTitle, experience, skills });
    
    res.status(200).json({
        success: true,
        data: enhanced
    });
});

export const improveBulletsController = asyncHandler(async (req, res) => {
    const { bullet, jobTitle, industry, level } = req.body;
    
    if (!bullet) {
        return res.status(400).json({ success: false, message: 'bullet is required' });
    }

    const improved = await improveBullets(bullet, { jobTitle, industry, level });
    
    res.status(200).json({
        success: true,
        data: improved
    });
});

export const suggestSkillsController = asyncHandler(async (req, res) => {
    const { jobTitle, experience, existingSkills } = req.body;
    
    if (!jobTitle) {
        return res.status(400).json({ success: false, message: 'jobTitle is required' });
    }

    const suggestions = await suggestSkills(jobTitle, experience, existingSkills);
    
    res.status(200).json({
        success: true,
        data: suggestions
    });
});

export const optimizeForJobController = asyncHandler(async (req, res) => {
    const { resumeData, jobDescription } = req.body;
    
    if (!resumeData || !jobDescription) {
        return res.status(400).json({ success: false, message: 'resumeData and jobDescription are required' });
    }

    const optimizedData = await optimizeForJob(resumeData, jobDescription);
    
    res.status(200).json({
        success: true,
        data: optimizedData
    });
});
