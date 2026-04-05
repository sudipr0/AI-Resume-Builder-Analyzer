// src/utils/appError.js

class AppError extends Error {
    constructor(message, statusCode, code = 'INTERNAL_ERROR', details = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.code = code;
        this.details = details;
        this.isOperational = true;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message, details) {
        super(message || 'Validation failed', 400, 'VALIDATION_ERROR', details);
    }
}

export class AuthenticationError extends AppError {
    constructor(message) {
        super(message || 'Not authenticated', 401, 'AUTH_ERROR');
    }
}

export class AuthorizationError extends AppError {
    constructor(message) {
        super(message || 'Not authorized', 403, 'FORBIDDEN_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message || 'Resource not found', 404, 'NOT_FOUND_ERROR');
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message || 'Resource conflict', 409, 'CONFLICT_ERROR');
    }
}

export class RateLimitError extends AppError {
    constructor(message) {
        super(message || 'Too many requests', 429, 'RATE_LIMIT_ERROR');
    }
}

export class AIServiceError extends AppError {
    constructor(message, details) {
        super(message || 'AI Service error', 503, 'AI_SERVICE_ERROR', details);
    }
}

export default AppError;
