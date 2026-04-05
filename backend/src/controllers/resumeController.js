// src/controllers/resumeController.js
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import aiService from '../ai/ai.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const getUserId = (req) => req.user?.id || req.user?._id;

const ensurePersonalInfo = (personalInfo = {}) => ({
    firstName: personalInfo.firstName || '',
    lastName: personalInfo.lastName || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    location: personalInfo.location || '',
    address: personalInfo.address || '',
    city: personalInfo.city || '',
    state: personalInfo.state || '',
    country: personalInfo.country || '',
    zipCode: personalInfo.zipCode || '',
    linkedin: personalInfo.linkedin || '',
    github: personalInfo.github || '',
    portfolio: personalInfo.portfolio || '',
    website: personalInfo.website || '',
    jobTitle: personalInfo.jobTitle || '',
    photoUrl: personalInfo.photoUrl || ''
});

/**
 * @desc    Get all resumes for logged in user
 * @route   GET /api/resumes
 * @access  Private
 */
export const getMyResumes = asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const { page = 1, limit = 20, status, search, sort = '-updatedAt' } = req.query;

    const query = { userId };
    if (status) query.status = status;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
            { 'personalInfo.lastName': { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [resumes, total] = await Promise.all([
        Resume.find(query).select('-__v').sort(sort).limit(parseInt(limit)).skip(skip).lean(),
        Resume.countDocuments(query)
    ]);

    res.json({
        success: true,
        data: resumes,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * @desc    Get a specific resume
 * @route   GET /api/resumes/:id
 * @access  Private
 */
export const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'Invalid resume ID format' });
    }

    const resume = await Resume.findOne({ _id: id, userId }).select('-__v').lean();

    if (!resume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    await Resume.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({ success: true, data: resume });
});

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 * @access  Private
 */
export const createResume = asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const personalInfo = ensurePersonalInfo(req.body.personalInfo);
    const title = req.body.title?.trim() || `Resume ${new Date().toLocaleDateString()}`;

    const resumeData = {
        ...req.body,
        title,
        personalInfo,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
        success: true,
        message: 'Resume created successfully',
        data: resume
    });
});

/**
 * @desc    Update a resume
 * @route   PUT /api/resumes/:id
 * @access  Private
 */
export const updateResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'Invalid resume ID format' });
    }

    const existingResume = await Resume.findOne({ _id: id, userId });
    if (!existingResume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const updateData = {
        ...req.body,
        updatedAt: new Date()
    };

    const updatedResume = await Resume.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        message: 'Resume updated successfully',
        data: updatedResume
    });
});

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
export const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'Invalid resume ID format' });
    }

    const deletedResume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!deletedResume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
});

/**
 * @desc    Duplicate a resume
 * @route   POST /api/resumes/:id/duplicate
 * @access  Private
 */
export const duplicateResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'Invalid resume ID format' });
    }

    const originalResume = await Resume.findOne({ _id: id, userId });
    if (!originalResume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const newResume = await originalResume.duplicate(userId);
    res.status(201).json({
        success: true,
        message: 'Resume duplicated successfully',
        data: newResume
    });
});

/**
 * @desc    Analyze resume using AI
 * @route   POST /api/resumes/:id/analyze
 * @access  Private
 */
export const analyzeResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { jobDescription = '' } = req.body;
    const userId = getUserId(req);

    if (!isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'Invalid resume ID format' });
    }

    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    const aiResult = await aiService.analyzeResume(resume, jobDescription);
    if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI analysis failed');
    }

    const analysis = {
        atsScore: aiResult.data.atsScore?.score || 0,
        completeness: aiResult.data.atsScore?.breakdown?.completeness || 0,
        suggestions: aiResult.data.suggestions?.map(s => s.description || s) || [],
        lastAnalyzed: new Date(),
        fullReport: aiResult.data
    };

    resume.analysis = analysis;
    await resume.save();

    res.json({ success: true, data: analysis, provider: aiResult.provider });
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/resumes/stats/overview
 * @access  Private
 */
export const getStatsOverview = asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const stats = await Resume.getDashboardStats(userId);
    const recentActivity = await Resume.find({ userId })
        .select('title status updatedAt')
        .sort('-updatedAt')
        .limit(5)
        .lean();

    res.json({ success: true, data: { ...stats, recentActivity } });
});
