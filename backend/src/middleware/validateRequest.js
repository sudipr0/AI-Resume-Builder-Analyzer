// src/middleware/validateRequest.js
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Request Validation Middleware using express-validator
 * @param {Array} validations - Array of express-validator validation chains
 */
export const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Log validation errors
    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errors.array(),
      userId: req.user?._id,
      ip: req.ip
    });

    // Extract error messages
    const extractedErrors = errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  };
};

// Common validation rules
export const validationRules = {
  email: (field = 'email') => ({
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    },
    normalizeEmail: true,
    isLength: {
      options: { max: 255 },
      errorMessage: 'Email must be less than 255 characters'
    }
  }),

  password: (field = 'password') => ({
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  }),

  name: (field = 'name') => ({
    in: ['body'],
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Name must be between 2 and 100 characters'
    },
    trim: true
  }),

  objectId: (field = 'id') => ({
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid ID format'
    }
  })
};

export default validateRequest;
