// src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// Skip rate limiting in development for easier testing
const devSkip = () => isDev;

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 500 : 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

/**
 * Auth endpoints rate limiter (register, login, etc.)
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 50 : 10,
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

/**
 * Admin endpoints rate limiter
 */
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 200 : 30,
    message: {
        success: false,
        error: 'Too many admin requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

/**
 * AI endpoints rate limiter
 */
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: isDev ? 100 : 20,
    message: {
        success: false,
        error: 'AI request limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }
});

const rateLimiters = {
    apiLimiter,
    authLimiter,
    adminLimiter,
    aiLimiter
};

export default rateLimiters;
