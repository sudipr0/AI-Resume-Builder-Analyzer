// backend/src/middleware/auth.js
// This file re-exports all authentication middleware from authMiddleware.js
// for backward compatibility with routes that expect to import from 'auth.js'

import {
    protect,
    authMiddleware,
    optionalAuth,
    adminMiddleware,
    superAdminMiddleware,
    hasRole
} from './authMiddleware.js';

// Re-export all named exports
export {
    protect,
    authMiddleware,
    optionalAuth,
    adminMiddleware,
    superAdminMiddleware,
    hasRole
};

// Create an authenticate alias for backward compatibility
// This is what your resumeAnalyzer.routes.js is trying to import
export const authenticate = protect;

// Export a default object with all middleware
export default {
    protect,
    authMiddleware,
    optionalAuth,
    adminMiddleware,
    superAdminMiddleware,
    hasRole,
    authenticate
};