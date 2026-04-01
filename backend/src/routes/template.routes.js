import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import templateController from '../controllers/template.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'templates');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'text/html',
            'text/css',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/webp',
            'application/pdf'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only HTML, CSS, and images are allowed.'));
        }
    }
});

// ======================
// PUBLIC ROUTES
// ======================

// Initialize templates (seed data) - GET for easy access
router.get('/init', templateController.initialize);

// Get all templates with filtering
router.get('/', templateController.getAll);

// Get categories with counts
router.get('/categories', templateController.getCategories);

// Get featured templates
router.get('/featured', templateController.getFeatured);

// Get popular templates
router.get('/popular', templateController.getPopular);

// Get template styles
router.get('/styles', templateController.getStyles);

// Get template statistics
router.get('/stats', templateController.getStats);

// Get template by category
router.get('/category/:category', templateController.getByCategory);

// Get template thumbnail
router.get('/thumbnail/:id', templateController.getThumbnail);

// Get template preview
router.get('/preview/:id', templateController.getPreview);

// Get single template (by ID or slug)
router.get('/:id', templateController.getOne);

// Track template usage
router.post('/:id/track', templateController.trackUsage);

// ======================
// PROTECTED ROUTES
// ======================

// Toggle favorite (would require auth middleware)
router.post('/:id/favorite', templateController.toggleFavorite);
router.delete('/:id/favorite', templateController.toggleFavorite);

// ======================
// ADMIN ROUTES
// ======================

// Admin: Get all templates (including inactive)
router.get('/admin/all', templateController.adminGetAll);

// Admin: Create new template
router.post('/admin',
    upload.fields([
        { name: 'html', maxCount: 1 },
        { name: 'css', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'preview', maxCount: 5 }
    ]),
    templateController.create
);

// Admin: Update template
router.put('/admin/:id',
    upload.fields([
        { name: 'html', maxCount: 1 },
        { name: 'css', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'preview', maxCount: 5 }
    ]),
    templateController.update
);

// Admin: Delete template
router.delete('/admin/:id', templateController.delete);

// Admin: Duplicate template
router.post('/admin/:id/duplicate', templateController.adminDuplicate);

// Admin: Upload files
router.post('/admin/:id/files',
    upload.array('files', 10),
    templateController.uploadFiles
);

// Admin: Bulk update
router.post('/admin/bulk/update', templateController.adminBulkUpdate);

// Admin: Reorder templates
router.post('/admin/reorder', templateController.adminReorder);

// Admin: Get template usages
router.get('/admin/:id/usages', templateController.getUsages);

// Admin: Toggle active status
router.patch('/admin/:id/activate', async (req, res) => {
    req.body = { 'metadata.isActive': true };
    return templateController.update(req, res);
});

router.patch('/admin/:id/deactivate', async (req, res) => {
    req.body = { 'metadata.isActive': false };
    return templateController.update(req, res);
});

// Admin: Toggle featured status
router.patch('/admin/:id/feature', async (req, res) => {
    req.body = { 'metadata.isFeatured': true };
    return templateController.update(req, res);
});

router.patch('/admin/:id/unfeature', async (req, res) => {
    req.body = { 'metadata.isFeatured': false };
    return templateController.update(req, res);
});

// Admin: Update pricing
router.patch('/admin/:id/pricing', async (req, res) => {
    const { isPremium, price } = req.body;
    req.body = {
        'metadata.isPremium': isPremium,
        'metadata.price': price || 0
    };
    return templateController.update(req, res);
});

// ======================
// ERROR HANDLING
// ======================

// Error handler for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 10MB.'
            });
        }
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
    next(error);
});

// Log all routes (for debugging)
console.log('\n📋 Template Routes Registered:');
console.log('═══════════════════════════════════════════════════════════');
console.log('🔄 PUBLIC ROUTES:');
console.log('   • GET    /api/templates/init              - Initialize templates');
console.log('   • GET    /api/templates/                  - List all templates');
console.log('   • GET    /api/templates/categories        - Get categories');
console.log('   • GET    /api/templates/featured          - Featured templates');
console.log('   • GET    /api/templates/popular           - Popular templates');
console.log('   • GET    /api/templates/styles            - Get styles');
console.log('   • GET    /api/templates/stats             - Get statistics');
console.log('   • GET    /api/templates/category/:cat     - By category');
console.log('   • GET    /api/templates/thumbnail/:id     - Get thumbnail');
console.log('   • GET    /api/templates/preview/:id       - Get preview');
console.log('   • GET    /api/templates/:id               - Get by ID/slug');
console.log('   • POST   /api/templates/:id/track         - Track usage');
console.log('');
console.log('🔒 PROTECTED ROUTES:');
console.log('   • POST   /api/templates/:id/favorite      - Favorite');
console.log('   • DELETE /api/templates/:id/favorite      - Unfavorite');
console.log('');
console.log('⚡ ADMIN ROUTES:');
console.log('   • GET    /api/templates/admin/all         - All templates');
console.log('   • POST   /api/templates/admin             - Create template');
console.log('   • PUT    /api/templates/admin/:id         - Update template');
console.log('   • DELETE /api/templates/admin/:id         - Delete template');
console.log('   • POST   /api/templates/admin/:id/duplicate - Duplicate');
console.log('   • POST   /api/templates/admin/:id/files   - Upload files');
console.log('   • POST   /api/templates/admin/bulk/update - Bulk update');
console.log('   • POST   /api/templates/admin/reorder     - Reorder');
console.log('   • GET    /api/templates/admin/:id/usages  - Get usages');
console.log('   • PATCH  /api/templates/admin/:id/activate - Activate');
console.log('   • PATCH  /api/templates/admin/:id/deactivate - Deactivate');
console.log('   • PATCH  /api/templates/admin/:id/feature - Feature');
console.log('   • PATCH  /api/templates/admin/:id/unfeature - Unfeature');
console.log('   • PATCH  /api/templates/admin/:id/pricing - Update pricing');
console.log('═══════════════════════════════════════════════════════════\n');

export default router;