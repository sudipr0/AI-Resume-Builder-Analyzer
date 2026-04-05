import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import { checkPermission, checkAnyPermission } from '../middlewares/permission.js';

const router = express.Router();

/* =====================================================
   MIDDLEWARE
===================================================== */
router.use(authenticateAdmin);

/* =====================================================
   COLLECTION LEVEL ROUTES
===================================================== */

// Get all users (pagination + filters)
router.get('/',
    checkPermission('users.view'),
    UserController.getAllUsers
);

// Search users
router.get('/search',
    checkPermission('users.view'),
    UserController.searchUsers
);

// User statistics (overview)
router.get('/stats/overview',
    checkPermission('users.view'),
    UserController.getUserStats
);

// User analytics
router.get('/analytics/overview',
    checkPermission('users.view'),
    UserController.getUserAnalytics
);

// Export users
router.get('/export/data',
    checkAnyPermission(['export.all', 'users.export']),
    UserController.exportUsers
);

// Import users
router.post('/import',
    checkPermission('import.all'),
    UserController.importUsers
);

// Bulk user action
router.post('/bulk/action',
    checkPermission('users.manage'),
    UserController.bulkUserAction
);

// Merge duplicate users
router.post('/merge',
    checkPermission('users.manage'),
    UserController.mergeUsers
);

// User tags (global)
router.get('/tags/all',
    checkPermission('users.view'),
    UserController.getUserTags
);

/* =====================================================
   USER CREATION
===================================================== */

// Create new user
router.post('/',
    checkPermission('users.create'),
    UserController.createUser
);

/* =====================================================
   USER-SPECIFIC ROUTES (ID BASED)
===================================================== */

// Get user by ID
router.get('/:id',
    checkPermission('users.view'),
    UserController.getUserById
);

// Update user
router.put('/:id',
    checkPermission('users.edit'),
    UserController.updateUser
);

// Delete user
router.delete('/:id',
    checkPermission('users.delete'),
    UserController.deleteUser
);

// Update user status
router.put('/:id/status',
    checkPermission('users.edit'),
    UserController.updateUserStatus
);

// Update user role
router.put('/:id/role',
    checkPermission('users.manage'),
    UserController.updateUserRole
);

// Reset user password
router.post('/:id/reset-password',
    checkPermission('users.manage'),
    UserController.resetUserPassword
);

// Verify user
router.post('/:id/verify',
    checkPermission('users.manage'),
    UserController.verifyUser
);

// Get user activity
router.get('/:id/activity',
    checkPermission('users.view'),
    UserController.getUserActivity
);

// Get user resumes
router.get('/:id/resumes',
    checkPermission('users.view'),
    UserController.getUserResumes
);

// Get user sessions
router.get('/:id/sessions',
    checkPermission('users.view'),
    UserController.getUserSessions
);

// Revoke user session
router.delete('/:id/sessions/:sessionId',
    checkPermission('users.manage'),
    UserController.revokeUserSession
);

// User subscriptions
router.get('/:id/subscriptions',
    checkPermission('users.view'),
    UserController.getUserSubscriptions
);

// User payments
router.get('/:id/payments',
    checkPermission('users.view'),
    UserController.getUserPayments
);

// User preferences
router.get('/:id/preferences',
    checkPermission('users.view'),
    UserController.getUserPreferences
);

router.put('/:id/preferences',
    checkPermission('users.edit'),
    UserController.updateUserPreferences
);

/* =====================================================
   USER NOTES
===================================================== */

router.post('/:id/notes',
    checkPermission('users.edit'),
    UserController.addUserNote
);

router.get('/:id/notes',
    checkPermission('users.view'),
    UserController.getUserNotes
);

router.delete('/:id/notes/:noteId',
    checkPermission('users.edit'),
    UserController.deleteUserNote
);

/* =====================================================
   USER TAGS
===================================================== */

router.post('/:id/tags',
    checkPermission('users.edit'),
    UserController.addUserTag
);

router.delete('/:id/tags/:tag',
    checkPermission('users.edit'),
    UserController.removeUserTag
);

/* =====================================================
   ADMIN ADVANCED ACTIONS
===================================================== */

// Impersonate user (super admin)
router.post('/:id/impersonate',
    checkPermission('users.manage'),
    UserController.impersonateUser
);

// Stop impersonation
router.post('/impersonate/stop',
    checkPermission('users.manage'),
    UserController.stopImpersonation
);

// Send email to user
router.post('/:id/send-email',
    checkPermission('users.manage'),
    UserController.sendEmailToUser
);

export default router;

