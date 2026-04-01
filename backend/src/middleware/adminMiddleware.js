// src/middleware/adminMiddleware.js
export const isAdmin = (req, res, next) => {
    // Check if user is authenticated and has admin role
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }

    next();
};

export const isAdminOrOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    // Allow if admin or the resource owner
    if (req.user.role === 'admin' || req.user.id === req.params.userId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        error: 'Access denied'
    });
};