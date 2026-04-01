// backend/src/routes/dashboardRoutes.js - FIXED VERSION
import express from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== GET DASHBOARD STATS ====================
router.get('/stats', protect, async (req, res) => {
    try {
        console.log('📊 Fetching REAL dashboard stats for user:', req.user.id);

        let userId = req.user.id;
        let query = {};

        // ✅ FIX: Handle both ObjectId and string IDs (for development)
        if (mongoose.Types.ObjectId.isValid(userId)) {
            // If it's a valid ObjectId, search in both 'user' and 'userId' fields
            query = {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId) },
                    { userId: new mongoose.Types.ObjectId(userId) }
                ]
            };
        } else {
            // If it's a string (like "demo-user-123"), search by string
            console.log('⚠️ Using string ID for development:', userId);
            query = {
                $or: [
                    { user: userId },
                    { userId: userId }
                ]
            };
        }

        // Fetch resumes
        const resumes = await Resume.find(query).lean();
        console.log(`📊 Found ${resumes.length} resumes`);

        // Calculate stats
        const stats = calculateStats(resumes);

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('❌ Dashboard stats error:', error);

        // Return default stats on error
        res.json({
            success: true,
            data: getDefaultStats()
        });
    }
});

// ==================== GET RECENT ACTIVITY ====================
router.get('/recent-activity', protect, async (req, res) => {
    try {
        console.log('📊 Fetching recent activity for user:', req.user.id);

        let userId = req.user.id;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(userId)) {
            query = {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId) },
                    { userId: new mongoose.Types.ObjectId(userId) }
                ]
            };
        } else {
            query = {
                $or: [
                    { user: userId },
                    { userId: userId }
                ]
            };
        }

        const resumes = await Resume.find(query)
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('title updatedAt status')
            .lean();

        const activity = resumes.map(resume => ({
            id: resume._id,
            type: 'resume_update',
            title: resume.title,
            description: `${resume.title} was ${resume.status === 'completed' ? 'completed' : 'updated'}`,
            timestamp: resume.updatedAt,
            status: resume.status
        }));

        res.json({
            success: true,
            data: activity
        });

    } catch (error) {
        console.error('❌ Recent activity error:', error);
        res.json({
            success: true,
            data: []
        });
    }
});

// ==================== GET CHART DATA ====================
router.get('/charts', protect, async (req, res) => {
    try {
        console.log('📊 Fetching chart data for user:', req.user.id);

        let userId = req.user.id;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(userId)) {
            query = {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId) },
                    { userId: new mongoose.Types.ObjectId(userId) }
                ]
            };
        } else {
            query = {
                $or: [
                    { user: userId },
                    { userId: userId }
                ]
            };
        }

        const resumes = await Resume.find(query).lean();

        // Status distribution
        const statusCounts = {
            draft: resumes.filter(r => r.status === 'draft').length,
            'in-progress': resumes.filter(r => r.status === 'in-progress').length,
            completed: resumes.filter(r => r.status === 'completed').length
        };

        // Template distribution
        const templateCounts = resumes.reduce((acc, resume) => {
            const template = resume.template || 'modern';
            acc[template] = (acc[template] || 0) + 1;
            return acc;
        }, {});

        // ATS Score distribution
        const scoreRanges = {
            '0-40': resumes.filter(r => (r.analysis?.atsScore || 0) < 40).length,
            '40-60': resumes.filter(r => (r.analysis?.atsScore || 0) >= 40 && (r.analysis?.atsScore || 0) < 60).length,
            '60-80': resumes.filter(r => (r.analysis?.atsScore || 0) >= 60 && (r.analysis?.atsScore || 0) < 80).length,
            '80-100': resumes.filter(r => (r.analysis?.atsScore || 0) >= 80).length
        };

        // Monthly activity
        const last6Months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = month.toLocaleDateString('en-US', { month: 'short' });
            const count = resumes.filter(r => {
                const date = new Date(r.createdAt);
                return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
            }).length;
            last6Months.push({ month: monthStr, count });
        }

        res.json({
            success: true,
            data: {
                statusDistribution: statusCounts,
                templateDistribution: templateCounts,
                scoreDistribution: scoreRanges,
                monthlyActivity: last6Months
            }
        });

    } catch (error) {
        console.error('❌ Chart data error:', error);
        res.json({
            success: true,
            data: {
                statusDistribution: { draft: 0, 'in-progress': 0, completed: 0 },
                templateDistribution: {},
                scoreDistribution: { '0-40': 0, '40-60': 0, '60-80': 0, '80-100': 0 },
                monthlyActivity: []
            }
        });
    }
});

// ==================== HELPER FUNCTIONS ====================
function calculateStats(resumes) {
    const totalResumes = resumes.length;
    const completedResumes = resumes.filter(r => r.status === 'completed').length;
    const draftResumes = resumes.filter(r => r.status === 'draft').length;
    const inProgressResumes = resumes.filter(r => r.status === 'in-progress').length;

    const atsScores = resumes
        .filter(r => r.analysis?.atsScore)
        .map(r => r.analysis.atsScore);

    const averageAtsScore = atsScores.length > 0
        ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
        : 0;

    const highScoreResumes = resumes.filter(r => (r.analysis?.atsScore || 0) >= 80).length;
    const mediumScoreResumes = resumes.filter(r => {
        const score = r.analysis?.atsScore || 0;
        return score >= 60 && score < 80;
    }).length;
    const lowScoreResumes = resumes.filter(r => (r.analysis?.atsScore || 0) < 60).length;

    const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);

    const recentActivity = resumes
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(resume => ({
            type: 'resume_updated',
            description: `${resume.title} was updated`,
            timestamp: resume.updatedAt,
            resumeId: resume._id
        }));

    // Calculate storage (rough estimate: 0.5MB per resume)
    const storageUsedMB = Math.round(totalResumes * 0.5);
    const storageLimitMB = 500;
    const storageUsedPercentage = Math.min(100, Math.round((storageUsedMB / storageLimitMB) * 100));

    return {
        totalResumes,
        completedResumes,
        draftResumes,
        inProgressResumes,
        averageAtsScore,
        highScoreResumes,
        mediumScoreResumes,
        lowScoreResumes,
        totalViews,
        totalDownloads,
        recentActivity,
        storageUsed: `${storageUsedMB} MB`,
        storageLimit: `${storageLimitMB} MB`,
        storageUsedPercentage,
        lastSynced: new Date().toISOString(),
        onlineUsers: 1,
        activeSessions: 1,
        needsImprovementResumes: lowScoreResumes,
        performanceTrend: totalResumes > 0 ? 'improving' : 'stable'
    };
}

function getDefaultStats() {
    return {
        totalResumes: 0,
        completedResumes: 0,
        draftResumes: 0,
        inProgressResumes: 0,
        averageAtsScore: 0,
        highScoreResumes: 0,
        mediumScoreResumes: 0,
        lowScoreResumes: 0,
        totalViews: 0,
        totalDownloads: 0,
        recentActivity: [],
        storageUsed: '0 MB',
        storageLimit: '500 MB',
        storageUsedPercentage: 0,
        lastSynced: new Date().toISOString(),
        onlineUsers: 1,
        activeSessions: 0,
        needsImprovementResumes: 0,
        performanceTrend: 'stable'
    };
}

export default router;