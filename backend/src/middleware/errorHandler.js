// src/middleware/errorHandler.js
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the full error for internal tracking
    logger.error('💥 ERROR:', {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode || 500,
        code: err.code || 'INTERNAL_ERROR',
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = { message, statusCode: 404, code: 'RESOURCE_NOT_FOUND' };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400, code: 'DUPLICATE_FIELD' };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400, code: 'VALIDATION_ERROR', details: message };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = { message, statusCode: 401, code: 'INVALID_TOKEN' };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = { message, statusCode: 401, code: 'TOKEN_EXPIRED' };
    }

    // Set defaults if not already set
    const statusCode = error.statusCode || 500;
    const responseBody = {
        success: false,
        error: error.message || 'Internal Server Error',
        code: error.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
    };

    // Add details if available (like validation errors)
    if (error.details) {
        responseBody.details = error.details;
    }

    // Add stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        responseBody.stack = err.stack;
    }

    res.status(statusCode).json(responseBody);
};

export { errorHandler };
export default errorHandler;

