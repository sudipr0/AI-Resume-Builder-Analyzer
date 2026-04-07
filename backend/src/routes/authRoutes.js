// src/routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { 
    registerUser, 
    authUser, 
    verifyToken, 
    healthCheck, 
    changePassword, 
    googleAuth 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import googleAuthRouter from './googleAuth.js';

const router = express.Router();

// Mount Google OAuth routes BEFORE rate limiter
router.use('/', googleAuthRouter);

// Apply auth rate limiter to remaining routes
router.use(authLimiter);

// @route   POST /api/auth/register
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], registerUser);

// @route   POST /api/auth/login
router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], authUser);

// @route   GET /api/auth/verify
router.get('/verify', protect, verifyToken);

// @route   GET /api/auth/me (Legacy alias for verify)
router.get('/me', protect, verifyToken);

// @route   GET /api/auth/health
router.get('/health', healthCheck);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

// @route   POST /api/auth/google
router.post('/google', googleAuth);

export default router;
