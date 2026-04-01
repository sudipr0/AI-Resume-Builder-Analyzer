// backend/src/routes/resumes.js - PRODUCTION READY VERSION (FIXED 409)
import express from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ======================
// HELPER FUNCTIONS
// ======================

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const getUserId = (req) => {
    return req.user?.id || req.user?._id;
};

const ensurePersonalInfo = (personalInfo = {}) => {
    return {
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
    };
};

// ======================
// GET ALL RESUMES
// ======================
router.get('/', protect, async (req, res) => {
    console.log('📋 GET /api/resumes - Fetching all resumes');

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const {
            page = 1,
            limit = 20,
            status,
            search,
            sort = '-updatedAt'
        } = req.query;

        const query = { userId: userId };
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
            Resume.find(query)
                .select('-__v')
                .sort(sort)
                .limit(parseInt(limit))
                .skip(skip)
                .lean(),
            Resume.countDocuments(query)
        ]);

        console.log(`✅ Found ${resumes.length} resumes`);

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

    } catch (error) {
        console.error('❌ GET /api/resumes error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resumes'
        });
    }
});

// ======================
// GET SINGLE RESUME
// ======================
router.get('/:id', protect, async (req, res) => {
    const { id } = req.params;

    console.log(`📋 GET /api/resumes/${id} - Fetching single resume`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const resume = await Resume.findOne({ _id: id, userId: userId })
            .select('-__v')
            .lean();

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        // Increment view count
        await Resume.findByIdAndUpdate(id, { $inc: { views: 1 } });

        res.json({
            success: true,
            data: resume
        });

    } catch (error) {
        console.error(`❌ GET /api/resumes/${id} error:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resume'
        });
    }
});

// In your resumes.js POST route

router.post('/', protect, async (req, res) => {
    console.log('📝 POST /api/resumes - Creating new resume');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const personalInfo = ensurePersonalInfo(req.body.personalInfo);
        const title = req.body.title?.trim() || `Resume ${new Date().toLocaleDateString()}`;

        const resumeData = {
            title,
            template: req.body.template || 'modern',
            status: req.body.status || 'draft',
            summary: req.body.summary || '',
            personalInfo,
            experience: Array.isArray(req.body.experience) ? req.body.experience : [],
            education: Array.isArray(req.body.education) ? req.body.education : [],
            skills: Array.isArray(req.body.skills) ? req.body.skills : [],
            projects: Array.isArray(req.body.projects) ? req.body.projects : [],
            certifications: Array.isArray(req.body.certifications) ? req.body.certifications : [],
            languages: Array.isArray(req.body.languages) ? req.body.languages : [],
            templateSettings: req.body.templateSettings || {
                templateName: req.body.template || 'modern',
                colors: {
                    primary: '#3b82f6',
                    secondary: '#6b7280',
                    accent: '#10b981',
                    background: '#ffffff',
                    text: '#000000',
                    header: '#1e40af'
                },
                font: req.body.font || 'inter',
                fontSize: 'medium',
                spacing: 'normal',
                showPhoto: false,
                layout: 'single-column'
            },
            tags: Array.isArray(req.body.tags) ? req.body.tags : [],
            userId: userId,
            analysis: req.body.analysis || {
                atsScore: 0,
                completeness: 0,
                suggestions: ['Add more details to improve your resume'],
                lastAnalyzed: null
            },
            views: 0,
            downloads: 0,
            isPublic: req.body.isPublic || false,
            shareToken: null,
            color: req.body.color || '#3b82f6',
            font: req.body.font || 'inter',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log('Creating resume with data:', JSON.stringify(resumeData, null, 2));

        const resume = new Resume(resumeData);
        console.log('Resume instance created, about to save...');
        console.log('Slug before save:', resume.slug);

        await resume.save();

        console.log('✅ Resume saved successfully with ID:', resume._id);
        console.log('Slug after save:', resume.slug);

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: resume
        });

    } catch (error) {
        console.error('❌❌❌ Resume creation error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);

        if (error.name === 'ValidationError') {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message,
                    value: error.errors[key].value
                }))
            });
        }

        if (error.code === 11000) {
            console.error('🔴 DUPLICATE KEY ERROR:');
            console.error('Error keyPattern:', error.keyPattern);
            console.error('Error keyValue:', error.keyValue);

            return res.status(409).json({
                success: false,
                error: 'A resume with this title already exists',
                details: error.keyValue,
                field: Object.keys(error.keyPattern || {})[0]
            });
        }

        console.error('Full error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to create resume',
            message: error.message
        });
    }
});


// ======================
// UPDATE RESUME - NO TITLE UNIQUENESS
// ======================
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;

    console.log('📝 PUT /api/resumes/:id - Updating resume');
    console.log('Resume ID:', id);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const existingResume = await Resume.findOne({ _id: id, userId: userId });

        if (!existingResume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        const finalTitle = req.body.title?.trim() || existingResume.title;
        const personalInfo = ensurePersonalInfo(req.body.personalInfo || existingResume.personalInfo);

        const updateData = {
            title: finalTitle,
            template: req.body.template || existingResume.template,
            status: req.body.status || existingResume.status,
            summary: req.body.summary !== undefined ? req.body.summary : existingResume.summary,
            personalInfo,
            experience: Array.isArray(req.body.experience) ? req.body.experience : existingResume.experience,
            education: Array.isArray(req.body.education) ? req.body.education : existingResume.education,
            skills: Array.isArray(req.body.skills) ? req.body.skills : existingResume.skills,
            projects: Array.isArray(req.body.projects) ? req.body.projects : existingResume.projects,
            certifications: Array.isArray(req.body.certifications) ? req.body.certifications : existingResume.certifications,
            languages: Array.isArray(req.body.languages) ? req.body.languages : existingResume.languages,
            templateSettings: req.body.templateSettings || existingResume.templateSettings,
            tags: Array.isArray(req.body.tags) ? req.body.tags : existingResume.tags,
            analysis: req.body.analysis || existingResume.analysis,
            views: req.body.views !== undefined ? req.body.views : existingResume.views,
            downloads: req.body.downloads !== undefined ? req.body.downloads : existingResume.downloads,
            isPublic: req.body.isPublic !== undefined ? req.body.isPublic : existingResume.isPublic,
            shareToken: req.body.shareToken !== undefined ? req.body.shareToken : existingResume.shareToken,
            color: req.body.color || existingResume.color,
            font: req.body.font || existingResume.font,
            updatedAt: new Date()
        };

        // Preserve the user
        updateData.user = existingResume.user;

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log('✅ Resume updated successfully');

        res.json({
            success: true,
            message: 'Resume updated successfully',
            data: updatedResume
        });

    } catch (error) {
        console.error('❌ Update error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }

        // Handle slug uniqueness error
        if (error.code === 11000 && error.keyPattern?.slug) {
            return res.status(400).json({
                success: false,
                error: 'Slug conflict. Please try again.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update resume'
        });
    }
});

// ======================
// DELETE RESUME
// ======================
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;

    console.log(`🗑️ DELETE /api/resumes/${id} - Deleting resume`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const deletedResume = await Resume.findOneAndDelete({ _id: id, userId: userId });

        if (!deletedResume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        console.log(`✅ Resume ${id} deleted successfully`);

        res.json({
            success: true,
            message: 'Resume deleted successfully',
            data: { id: deletedResume._id }
        });

    } catch (error) {
        console.error(`❌ DELETE /api/resumes/${id} error:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete resume'
        });
    }
});

// ======================
// DUPLICATE RESUME - IMPROVED
// ======================
router.post('/:id/duplicate', protect, async (req, res) => {
    const { id } = req.params;

    console.log(`📋 POST /api/resumes/${id}/duplicate - Duplicating resume`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const originalResume = await Resume.findOne({ _id: id, userId: userId });

        if (!originalResume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        // Use the model's duplicate method
        const newResume = await originalResume.duplicate(userId);

        console.log('✅ Resume duplicated successfully, new ID:', newResume._id);

        res.status(201).json({
            success: true,
            message: 'Resume duplicated successfully',
            data: newResume
        });

    } catch (error) {
        console.error(`❌ POST /api/resumes/${id}/duplicate error:`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to duplicate resume'
        });
    }
});

// ======================
// GET RESUME STATS
// ======================
router.get('/stats/overview', protect, async (req, res) => {
    console.log('📊 GET /api/resumes/stats/overview - Fetching resume stats');

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const stats = await Resume.getDashboardStats(userId);

        // Get recent activity
        const recentActivity = await Resume.find({ userId: userId })
            .select('title status updatedAt')
            .sort('-updatedAt')
            .limit(5)
            .lean();

        res.json({
            success: true,
            data: {
                ...stats,
                recentActivity
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats'
        });
    }
});

// ======================
// UPDATE RESUME STATUS
// ======================
router.patch('/:id/status', protect, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`🔄 Updating resume ${id} status to ${status}`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const validStatuses = ['draft', 'published', 'archived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const updated = await Resume.findOneAndUpdate(
            { _id: id, userId: userId },
            {
                $set: {
                    status,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        console.log(`✅ Resume ${id} status updated to ${status}`);

        res.json({
            success: true,
            message: 'Status updated',
            data: updated
        });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update status'
        });
    }
});

// ======================
// TOGGLE PUBLIC STATUS
// ======================
router.patch('/:id/toggle-public', protect, async (req, res) => {
    const { id } = req.params;

    console.log(`🔄 Toggling public status for resume ${id}`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const resume = await Resume.findOne({ _id: id, userId: userId });

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        resume.isPublic = !resume.isPublic;

        // Generate share token if making public and no token exists
        if (resume.isPublic && !resume.shareToken) {
            resume.shareToken = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
        }

        await resume.save();

        console.log(`✅ Resume ${id} public status: ${resume.isPublic}`);

        res.json({
            success: true,
            message: `Resume is now ${resume.isPublic ? 'public' : 'private'}`,
            data: {
                isPublic: resume.isPublic,
                shareToken: resume.shareToken
            }
        });

    } catch (error) {
        console.error('Error toggling public status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle public status'
        });
    }
});

// ======================
// GET PUBLIC RESUME (No Auth Required)
// ======================
router.get('/public/:token', async (req, res) => {
    const { token } = req.params;

    console.log(`🌐 Fetching public resume with token: ${token}`);

    try {
        const resume = await Resume.findOne({
            shareToken: token,
            isPublic: true
        })
            .select('-__v -user')
            .lean();

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found or not public'
            });
        }

        // Increment view count
        await Resume.findByIdAndUpdate(resume._id, {
            $inc: { views: 1 }
        });

        res.json({
            success: true,
            data: resume
        });

    } catch (error) {
        console.error('Error fetching public resume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resume'
        });
    }
});

// ======================
// ANALYZE RESUME
// ======================
router.post('/:id/analyze', protect, async (req, res) => {
    const { id } = req.params;

    console.log(`🔍 Analyzing resume ${id}`);

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid resume ID format'
            });
        }

        const resume = await Resume.findOne({ _id: id, userId: userId });

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        // Perform analysis (mock for now - replace with actual AI service)
        const analysis = {
            atsScore: Math.floor(Math.random() * 30) + 70,
            completeness: Math.floor(Math.random() * 30) + 70,
            suggestions: [
                'Add more quantifiable achievements',
                'Include relevant keywords',
                'Strengthen your summary section'
            ],
            lastAnalyzed: new Date()
        };

        // Update resume with analysis
        resume.analysis = analysis;
        await resume.save();

        console.log(`✅ Resume ${id} analyzed`);

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze resume'
        });
    }
});

// ======================
// BULK UPDATE RESUMES
// ======================
router.post('/bulk/update', protect, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const { ids, updates } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Resume IDs required'
            });
        }

        // Validate all IDs
        for (const id of ids) {
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid resume ID: ${id}`
                });
            }
        }

        const result = await Resume.updateMany(
            {
                _id: { $in: ids },
                userId: userId
            },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );

        console.log(`✅ Bulk updated ${result.modifiedCount} resumes`);

        res.json({
            success: true,
            message: 'Resumes updated',
            modified: result.modifiedCount
        });

    } catch (error) {
        console.error('Error bulk updating resumes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to bulk update resumes'
        });
    }
});

// ======================
// BULK DELETE RESUMES
// ======================
router.post('/bulk/delete', protect, async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Resume IDs required'
            });
        }

        // Validate all IDs
        for (const id of ids) {
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid resume ID: ${id}`
                });
            }
        }

        const result = await Resume.deleteMany({
            _id: { $in: ids },
            userId: userId
        });

        console.log(`✅ Bulk deleted ${result.deletedCount} resumes`);

        res.json({
            success: true,
            message: 'Resumes deleted',
            deleted: result.deletedCount
        });

    } catch (error) {
        console.error('Error bulk deleting resumes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to bulk delete resumes'
        });
    }
});

// ======================
// DEBUG ENDPOINTS (Development Only)
// ======================
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/indexes', protect, async (req, res) => {
        try {
            const indexes = await Resume.collection.indexes();
            res.json({
                success: true,
                indexes: indexes
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/debug/check-title/:title', protect, async (req, res) => {
        try {
            const userId = getUserId(req);
            const { title } = req.params;

            const existing = await Resume.findOne({
                userId: userId,
                title: decodeURIComponent(title)
            });

            res.json({
                success: true,
                exists: !!existing,
                resume: existing ? {
                    id: existing._id,
                    title: existing.title
                } : null
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

export default router;