import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';
import Resume from '../models/Resume.js';

// @desc    Create a new resume
// @route   POST /api/resume
// @access  Private
export const createResume = asyncHandler(async (req, res) => {
    const { 
        title, templateId, colorScheme, fontFamily, 
        personalInfo, experience, education, skills, 
        projects, certifications, languages, awards, volunteer, customSections,
        sourceFile
    } = req.body;

    const resume = await Resume.create({
        userId: req.user._id,
        title: title || 'Untitled Resume',
        templateId,
        colorScheme,
        fontFamily,
        personalInfo: personalInfo || {},
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
        languages: languages || [],
        awards: awards || [],
        volunteer: volunteer || [],
        customSections: customSections || [],
        sourceFile,
        shareToken: nanoid(12)
    });

    res.status(201).json({
        success: true,
        data: resume
    });
});

// @desc    Get all resumes for logged in user
// @route   GET /api/resume
// @access  Private
export const getMyResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        count: resumes.length,
        data: resumes
    });
});

// @desc    Get a specific resume (owner or public shareToken)
// @route   GET /api/resume/:id
// @access  Public (if public) / Private (if owner)
export const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId or a share token
    let query = {};
    if (id.length === 24) {
        query = { _id: id };
    } else {
        query = { shareToken: id };
    }

    const resume = await Resume.findOne(query);

    if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Access control: if it has an ObjectId and the user is requesting it
    // Or if it's public.
    const isOwner = req.user && resume.userId.toString() === req.user._id.toString();
    const isPublic = resume.isPublic || query.shareToken;

    if (!isOwner && !isPublic) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
        success: true,
        data: resume
    });
});

// @desc    Update partial or full resume data
// @route   PUT /api/resume/:id
// @access  Private
export const updateResume = asyncHandler(async (req, res) => {
    let resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: resume
    });
});

// @desc    Delete a resume
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.status(200).json({
        success: true,
        message: 'Resume deleted successfully'
    });
});

// @desc    Duplicate a resume
// @route   POST /api/resume/:id/duplicate
// @access  Private
export const duplicateResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const resumeObj = resume.toObject();
    delete resumeObj._id;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;
    resumeObj.title = `Copy of ${resumeObj.title}`;
    resumeObj.shareToken = nanoid(12);
    
    // reset deep objects that might contain unique _ids deeply nested
    // nanoid takes care of standard ids in subschemas on creation

    const newResume = await Resume.create(resumeObj);

    res.status(201).json({
        success: true,
        data: newResume
    });
});