// backend/src/middleware/authMiddleware.js - IMPROVED VERSION
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check cookie (for OAuth)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. If no token in production, return error
    if (!token) {
      // In development, we might want to allow mock users for testing
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_USERS === 'true') {
        console.log('⚠️ [DEV] Using mock user (no token)');
        req.user = {
          id: 'dev_user_id',
          _id: 'dev_user_id',
          role: 'user'
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        error: 'Not authorized - No token provided'
      });
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret);

    // Get user from token - try different possible ID fields
    const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized - Invalid token payload'
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized - User not found'
      });
    }

    // Check if user is active/suspended
    if (user.isSuspended === true) {
      return res.status(403).json({
        success: false,
        error: 'Account has been suspended'
      });
    }

    // Attach user to request with both id and _id for compatibility
    req.user = {
      id: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    };

    console.log(`✅ User authenticated: ${user.email} (${user._id})`);
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized - Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized - Token expired'
      });
    }

    // In development, allow mock user on error
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_USERS === 'true') {
      console.log('⚠️ [DEV] Using mock user due to auth error');
      req.user = {
        id: 'dev_user_id',
        _id: 'dev_user_id',
        role: 'user'
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      error: 'Not authorized - Authentication failed'
    });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Not authorized as admin'
    });
  }
};

export default { protect, admin };