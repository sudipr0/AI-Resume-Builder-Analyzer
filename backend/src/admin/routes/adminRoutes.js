// backend/src/admin/routes/adminRoutes.js
import express from 'express';
const router = express.Router();

import * as authController from '../controllers/authController.js';
import * as adminController from '../controllers/adminController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as resumeController from '../controllers/resumeController.js';
import * as settingController from '../controllers/settingController.js';
import * as logController from '../controllers/logController.js';
import * as userController from '../controllers/userController.js';

import {
    authenticateAdmin,
    checkRole,
    checkPermission
} from '../middlewares/adminAuth.js';

import { checkRoleHierarchy, checkSelfAction } from '../middlewares/roleCheck.js';

// ======================
// ✅ TEST ROUTE - Check if admin API is working
// ======================
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Admin API is operational',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/admin/auth/*',
            dashboard: '/api/admin/dashboard/*',
            admins: '/api/admin/admins/*',
            users: '/api/admin/users/*',
            resumes: '/api/admin/resumes/*',
            settings: '/api/admin/settings/*',
            logs: '/api/admin/logs/*'
        }
    });
});

// ======================
// PUBLIC ROUTES
// ======================
router.post('/auth/login', authController.login);
router.post('/auth/verify-2fa', authController.verify2FA);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// ======================
// PROTECTED ROUTES (Require Authentication)
// ======================
router.use(authenticateAdmin);

// ======================
// AUTH ROUTES
// ======================
router.get('/auth/profile', authController.getProfile);
router.put('/auth/profile', authController.updateProfile);
router.post('/auth/change-password', authController.changePassword);
router.post('/auth/logout', authController.logout);

// 2FA Routes
router.get('/auth/2fa/setup', authController.setup2FA);
router.post('/auth/2fa/enable', authController.enable2FA);
router.post('/auth/2fa/disable', authController.disable2FA);

// ======================
// DASHBOARD ROUTES
// ======================
router.get('/dashboard/stats',
    checkPermission('dashboard.view'),
    dashboardController.getStats
);

router.get('/dashboard/analytics',
    checkPermission('dashboard.analytics'),
    dashboardController.getAnalytics
);

router.get('/dashboard/recent-activities',
    checkPermission('dashboard.view'),
    dashboardController.getRecentActivities
);

router.get('/dashboard/system-health',
    checkRole(['super_admin', 'admin']),
    dashboardController.getSystemHealth
);

// ======================
// ADMIN MANAGEMENT ROUTES
// ======================
router.get('/admins',
    checkPermission('admins.view'),
    adminController.getAllAdmins
);

router.get('/admins/:id',
    checkPermission('admins.view'),
    adminController.getAdminById
);

router.post('/admins',
    checkRole(['super_admin']),
    checkRoleHierarchy,
    adminController.createAdmin
);

router.put('/admins/:id',
    checkRole(['super_admin']),
    checkSelfAction,
    checkRoleHierarchy,
    adminController.updateAdmin
);

router.delete('/admins/:id',
    checkRole(['super_admin']),
    checkSelfAction,
    adminController.deleteAdmin
);

router.put('/admins/:id/status',
    checkRole(['super_admin']),
    checkSelfAction,
    adminController.updateAdminStatus
);

router.get('/admins/stats',
    checkPermission('admins.view'),
    adminController.getAdminStats
);

// ======================
// USER MANAGEMENT ROUTES
// ======================
router.get('/users',
    checkPermission('users.view'),
    userController.getAllUsers
);

router.get('/users/:id',
    checkPermission('users.view'),
    userController.getUserById
);

router.put('/users/:id',
    checkPermission('users.edit'),
    userController.updateUser
);

router.delete('/users/:id',
    checkPermission('users.delete'),
    userController.deleteUser
);

router.put('/users/:id/status',
    checkPermission('users.edit'),
    userController.updateUserStatus
);

router.get('/users/stats',
    checkPermission('users.view'),
    userController.getUserStats
);

// ======================
// ✅ RESUME MANAGEMENT ROUTES (CRITICAL - REAL RESUME CRUD)
// ======================
// Test route for resumes - MUST be before /:id routes
router.get('/resumes/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Admin Resume API is working!',
        timestamp: new Date().toISOString(),
        endpoints: {
            getAll: 'GET /api/admin/resumes',
            getOne: 'GET /api/admin/resumes/:id',
            update: 'PUT /api/admin/resumes/:id',
            delete: 'DELETE /api/admin/resumes/:id',
            export: 'GET /api/admin/resumes/export',
            stats: 'GET /api/admin/resumes/stats'
        }
    });
});

router.get('/resumes',
    checkPermission('resumes.view'),
    resumeController.getAllResumes
);

router.get('/resumes/:id',
    checkPermission('resumes.view'),
    resumeController.getResumeById
);

router.put('/resumes/:id',
    checkPermission('resumes.edit'),
    resumeController.updateResume
);

router.delete('/resumes/:id',
    checkPermission('resumes.delete'),
    resumeController.deleteResume
);

router.get('/resumes/export',
    checkPermission('resumes.export'),
    resumeController.exportResumes
);

router.get('/resumes/stats',
    checkPermission('resumes.view'),
    resumeController.getResumeStats
);

// ======================
// SETTINGS ROUTES
// ======================
router.get('/settings',
    checkPermission('settings.view'),
    settingController.getSettings
);

router.get('/settings/:key',
    checkPermission('settings.view'),
    settingController.getSettingByKey
);

router.put('/settings',
    checkPermission('settings.edit'),
    settingController.updateSettings
);

router.put('/settings/:key',
    checkPermission('settings.edit'),
    settingController.updateSetting
);

router.get('/settings/system/info',
    checkRole(['super_admin']),
    settingController.getSystemInfo
);

// ======================
// LOGS ROUTES
// ======================
router.get('/logs',
    checkPermission('logs.view'),
    logController.getLogs
);

router.get('/logs/statistics',
    checkPermission('logs.view'),
    logController.getLogStatistics
);

router.get('/logs/export',
    checkPermission('logs.view'),
    logController.exportLogs
);

router.delete('/logs/clear-old',
    checkRole(['super_admin']),
    logController.clearOldLogs
);

// ======================
// HEALTH CHECK
// ======================
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Admin service is healthy',
        timestamp: new Date().toISOString(),
        user: {
            id: req.user?._id,
            role: req.user?.role,
            email: req.user?.email
        }
    });
});

export default router;