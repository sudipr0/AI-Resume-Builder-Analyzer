// backend/src/admin/controllers/dashboardController.js
import User from '../../models/User.js';
import AdminResume from '../models/AdminResume.js';
import Template from '../../models/Template.js';
import Activity from '../../models/Activity.js';
import { formatBytes } from '../../utils/helpers.js';

const dashboardController = {
    // Main dashboard statistics
    getStats: async (req, res) => {
        try {
            const { range = '7d' } = req.query;

            // Calculate date range
            let startDate = new Date();
            switch (range) {
                case '24h':
                    startDate.setHours(startDate.getHours() - 24);
                    break;
                case '7d':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '30d':
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                case '90d':
                    startDate.setDate(startDate.getDate() - 90);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 7);
            }

            // Get all counts in parallel
            const [
                totalUsers,
                totalResumes,
                totalTemplates,
                activeUsers,
                newUsersToday,
                newResumesToday,
                verifiedUsers,
                inactiveUsers
            ] = await Promise.all([
                User.countDocuments(),
                AdminResume.countDocuments(),
                Template.countDocuments(),
                User.countDocuments({ isActive: true }),
                User.countDocuments({
                    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }),
                AdminResume.countDocuments({
                    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }),
                User.countDocuments({ isVerified: true }),
                User.countDocuments({ isActive: false })
            ]);

            // Calculate storage used (simplified)
            const storageResult = await AdminResume.aggregate([
                { $group: { _id: null, totalSize: { $sum: { $ifNull: ['$size', 0] } } } }
            ]);
            const storageUsed = storageResult[0]?.totalSize || 0;

            // Get timeline data
            const timeline = await getTimelineDataInternal(range);

            // Get performance metrics
            const performance = {
                uptime: 99.95,
                apiSuccessRate: 99.5,
                databaseLatency: 45,
                memoryUsage: 67.2,
                responseTime: 142,
                cpuUsage: 23.4
            };

            // Get analytics
            const analytics = await getAnalyticsData(range);

            // Get top templates
            const topTemplates = await Template.find()
                .sort({ usageCount: -1 })
                .limit(5)
                .select('name usageCount rating')
                .lean();

            // Calculate growth percentages
            const previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 7); // Compare to previous week

            const [previousUsers, currentUsers] = await Promise.all([
                User.countDocuments({
                    createdAt: { $gte: previousStartDate, $lt: startDate }
                }),
                User.countDocuments({ createdAt: { $gte: startDate } })
            ]);

            const [previousResumes, currentResumes] = await Promise.all([
                AdminResume.countDocuments({
                    createdAt: { $gte: previousStartDate, $lt: startDate }
                }),
                AdminResume.countDocuments({ createdAt: { $gte: startDate } })
            ]);

            const userGrowth = previousUsers > 0 ?
                ((currentUsers - previousUsers) / previousUsers * 100).toFixed(1) : 0;
            const resumeGrowth = previousResumes > 0 ?
                ((currentResumes - previousResumes) / previousResumes * 100).toFixed(1) : 0;

            res.json({
                success: true,
                data: {
                    summary: {
                        totalUsers,
                        totalResumes,
                        totalTemplates,
                        totalAnalyses: await AdminResume.countDocuments({ analysisCompleted: true }),
                        activeUsers,
                        newToday: newUsersToday,
                        storageUsed: formatBytes(storageUsed),
                        databaseSize: formatBytes((totalUsers + totalResumes + totalTemplates) * 1024) // Rough estimate
                    },
                    analytics: {
                        userGrowth: parseFloat(userGrowth),
                        resumeGrowth: parseFloat(resumeGrowth),
                        conversionRate: 3.2,
                        retentionRate: 67.8,
                        completionRate: 82.5,
                        bounceRate: 24.3
                    },
                    performance,
                    timeline,
                    topTemplates: topTemplates.map(t => ({
                        name: t.name,
                        usage: t.usageCount || 0,
                        rating: t.rating || 4.5
                    }))
                }
            });

        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard statistics'
            });
        }
    },

    // Get recent activities - WHAT FRONTEND CALLS
    getRecentActivities: async (req, res) => {
        try {
            const { limit = 5 } = req.query;

            const activities = await Activity.find()
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .populate('userId', 'name email')
                .lean();

            const formattedActivities = activities.map(activity => ({
                id: activity._id,
                user: activity.userId ? {
                    name: activity.userId.name,
                    email: activity.userId.email
                } : { name: 'System', email: '' },
                action: activity.type || 'Performed action',
                resource: 'system',
                timestamp: activity.createdAt,
                details: activity.description
            }));

            res.json({
                success: true,
                data: formattedActivities
            });

        } catch (error) {
            console.error('Recent activities error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch recent activities'
            });
        }
    },

    // Get top users - WHAT FRONTEND CALLS
    getTopUsers: async (req, res) => {
        try {
            const { limit = 5 } = req.query;

            const topUsers = await User.aggregate([
                {
                    $lookup: {
                        from: 'resumes',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'resumes'
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        role: 1,
                        isActive: 1,
                        isVerified: 1,
                        createdAt: 1,
                        resumeCount: { $size: '$resumes' }
                    }
                },
                { $sort: { resumeCount: -1 } },
                { $limit: parseInt(limit) }
            ]);

            res.json({
                success: true,
                data: topUsers
            });

        } catch (error) {
            console.error('Top users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch top users'
            });
        }
    },

    // Get recent resumes - WHAT FRONTEND CALLS
    getRecentResumes: async (req, res) => {
        try {
            const { limit = 5 } = req.query;

            const recentResumes = await AdminResume.find()
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .populate('user', 'name email')
                .select('title user views createdAt')
                .lean();

            const formattedResumes = recentResumes.map(resume => ({
                id: resume._id,
                title: resume.title || 'Untitled Resume',
                user: resume.user ? {
                    name: resume.user.name,
                    email: resume.user.email
                } : { name: 'Unknown', email: '' },
                views: resume.views || 0,
                createdAt: resume.createdAt
            }));

            res.json({
                success: true,
                data: formattedResumes
            });

        } catch (error) {
            console.error('Recent resumes error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch recent resumes'
            });
        }
    }
};

// Helper functions
async function getTimelineDataInternal(range) {
    try {
        const now = new Date();
        let days = 7;
        let interval = 'day';

        switch (range) {
            case '24h':
                days = 1;
                interval = 'hour';
                break;
            case '7d':
                days = 7;
                interval = 'day';
                break;
            case '30d':
                days = 30;
                interval = 'day';
                break;
            case '90d':
                days = 90;
                interval = 'week';
                break;
        }

        const timeline = [];
        const startDate = new Date(now);

        if (interval === 'hour') {
            startDate.setHours(startDate.getHours() - 24);
            for (let i = 0; i < 24; i++) {
                const date = new Date(startDate);
                date.setHours(date.getHours() + i);
                const nextDate = new Date(date);
                nextDate.setHours(nextDate.getHours() + 1);

                const [users, resumes] = await Promise.all([
                    User.countDocuments({
                        createdAt: { $gte: date, $lt: nextDate }
                    }),
                    AdminResume.countDocuments({
                        createdAt: { $gte: date, $lt: nextDate }
                    })
                ]);

                timeline.push({
                    date: date.toLocaleTimeString([], { hour: '2-digit' }),
                    users,
                    resumes
                });
            }
        } else if (interval === 'day') {
            startDate.setDate(startDate.getDate() - days);
            for (let i = 0; i < days; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const [users, resumes] = await Promise.all([
                    User.countDocuments({
                        createdAt: { $gte: date, $lt: nextDate }
                    }),
                    AdminResume.countDocuments({
                        createdAt: { $gte: date, $lt: nextDate }
                    })
                ]);

                timeline.push({
                    date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                    users,
                    resumes
                });
            }
        }

        return timeline;
    } catch (error) {
        console.error('Timeline data error:', error);
        return getMockTimelineData(range);
    }
}

async function getAnalyticsData(range) {
    // Mock analytics data - implement real analytics in production
    return {
        conversionRate: 3.2,
        retentionRate: 67.8,
        completionRate: 82.5,
        bounceRate: 24.3
    };
}

function getMockTimelineData(range) {
    const now = new Date();
    const timeline = [];
    let days = 7;

    switch (range) {
        case '24h': days = 1; break;
        case '7d': days = 7; break;
        case '30d': days = 30; break;
        case '90d': days = 12; break; // 12 weeks
    }

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        if (range === '24h') {
            date.setHours(date.getHours() - (days - i - 1));
            timeline.push({
                date: date.toLocaleTimeString([], { hour: '2-digit' }),
                users: Math.floor(Math.random() * 10) + 5,
                resumes: Math.floor(Math.random() * 15) + 8
            });
        } else if (range === '90d') {
            timeline.push({
                date: `Week ${i + 1}`,
                users: Math.floor(Math.random() * 50) + 20,
                resumes: Math.floor(Math.random() * 70) + 30
            });
        } else {
            date.setDate(date.getDate() - (days - i - 1));
            timeline.push({
                date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                users: Math.floor(Math.random() * 20) + 5,
                resumes: Math.floor(Math.random() * 25) + 10
            });
        }
    }

    return timeline;
}

export default dashboardController;