import express from 'express';
import AnalyticsController from '../controllers/AnalyticsController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import { checkPermission, checkAnyPermission } from '../middlewares/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Dashboard analytics
router.get('/dashboard',
    checkPermission('dashboard.view'),
    AnalyticsController.getDashboardAnalytics
);

// User analytics
router.get('/users',
    checkPermission('users.view'),
    AnalyticsController.getUserAnalytics
);

// Resume analytics
router.get('/resumes',
    checkPermission('resumes.view'),
    AnalyticsController.getResumeAnalytics
);

// System analytics
router.get('/system',
    checkPermission('dashboard.analytics'),
    AnalyticsController.getSystemAnalytics
);

// Real-time analytics
router.get('/realtime',
    checkPermission('dashboard.analytics'),
    AnalyticsController.getRealtimeAnalytics
);

// Export analytics data
router.get('/export',
    checkAnyPermission(['export.all', 'resumes.export', 'users.export']),
    AnalyticsController.exportAnalyticsData
);

// Custom report generation
router.post('/reports',
    checkPermission('dashboard.analytics'),
    AnalyticsController.generateCustomReport
);

// Get report by ID
router.get('/reports/:id',
    checkPermission('dashboard.analytics'),
    AnalyticsController.getReportById
);

export default router;