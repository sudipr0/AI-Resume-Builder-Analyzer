import express from 'express';
import settingController from '../controllers/settingController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import { checkPermission, checkModuleAccess } from '../middlewares/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all settings
router.get('/',
    checkPermission('settings.view'),
    settingController.getSettings
);

// Get setting by key
router.get('/:key',
    checkPermission('settings.view'),
    settingController.getSettingByKey
);

// Update settings (bulk)
router.put('/',
    checkPermission('settings.edit'),
    settingController.updateSettings
);

// Update specific setting
router.put('/:key',
    checkPermission('settings.edit'),
    settingController.updateSetting
);

// System information
router.get('/system/info',
    checkModuleAccess('system'),
    settingController.getSystemInfo
);

// Cache management
router.get('/cache/status',
    checkModuleAccess('system'),
    settingController.getCacheStatus
);

router.delete('/cache/clear',
    checkModuleAccess('system'),
    settingController.clearCache
);

// Backup management
router.get('/backups',
    checkPermission('system.maintenance'),
    settingController.getBackupStatus
);

router.post('/backups',
    checkPermission('system.maintenance'),
    settingController.createBackup
);

router.post('/backups/:backupId/restore',
    checkPermission('system.maintenance'),
    settingController.restoreBackup
);

router.delete('/backups/:backupId',
    checkPermission('system.maintenance'),
    settingController.deleteBackup
);

// System logs
router.get('/logs/system',
    checkPermission('logs.view'),
    settingController.getSystemLogs
);

// Maintenance mode
router.get('/maintenance',
    checkPermission('system.maintenance'),
    settingController.getMaintenanceStatus
);

router.put('/maintenance',
    checkPermission('system.maintenance'),
    settingController.updateMaintenanceMode
);

// Email settings
router.get('/email/templates',
    checkPermission('settings.view'),
    settingController.getEmailTemplates
);

router.put('/email/templates/:templateId',
    checkPermission('settings.edit'),
    settingController.updateEmailTemplate
);

// Notification settings
router.get('/notifications',
    checkPermission('settings.view'),
    settingController.getNotificationSettings
);

router.put('/notifications',
    checkPermission('settings.edit'),
    settingController.updateNotificationSettings
);

// API settings
router.get('/api/keys',
    checkPermission('settings.manage'),
    settingController.getApiKeys
);

router.post('/api/keys',
    checkPermission('settings.manage'),
    settingController.createApiKey
);

router.delete('/api/keys/:keyId',
    checkPermission('settings.manage'),
    settingController.deleteApiKey
);

// Security settings
router.get('/security',
    checkPermission('settings.manage'),
    settingController.getSecuritySettings
);

router.put('/security',
    checkPermission('settings.manage'),
    settingController.updateSecuritySettings
);

// Import/Export settings
router.get('/export/settings',
    checkPermission('export.all'),
    settingController.exportSettings
);

router.post('/import/settings',
    checkPermission('import.all'),
    settingController.importSettings
);

export default router;