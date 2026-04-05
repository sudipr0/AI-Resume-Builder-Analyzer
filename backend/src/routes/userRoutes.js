// src/routes/userRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { 
    getUserProfile, 
    updateUserProfile, 
    updateUserPreferences, 
    getUserStats, 
    deleteAccount,
    uploadAvatar
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

// @route   GET /api/users/profile
// @route   PUT /api/users/profile
router.route('/profile')
    .get(getUserProfile)
    .put([
        body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
        body('phone').optional().matches(/^[\+]?[\d\s\-\(\)]{7,20}$/).withMessage('Invalid phone number format'),
        validateRequest
    ], updateUserProfile);

// @route   PUT /api/users/preferences
router.put('/preferences', [
    body('preferences').isObject().withMessage('Preferences object is required'),
    validateRequest
], updateUserPreferences);

// @route   GET /api/users/stats
router.get('/stats', getUserStats);

// @route   POST /api/users/avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// @route   DELETE /api/users
router.delete('/', deleteAccount);

export default router;
