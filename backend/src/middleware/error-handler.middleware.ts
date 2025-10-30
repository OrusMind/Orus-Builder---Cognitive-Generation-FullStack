/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - ERROR HANDLER MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/error-handler.middleware
 * @description Centralized error handling and response formatting
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Catches all errors, formats them consistently, logs them appropriately,
 * and sends user-friendly responses while hiding sensitive details in production.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../system/logging-system';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  requestId?: string;
  timestamp: string;
}

class CustomError extends Error {
  statusCode: number;
  code: string;
  details?: any;
  
  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends CustomError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

class ErrorHandlerMiddleware {
  
  /**
   * Main error handler
   * Must be the last middleware in the chain
   */
  handle = (error: Error, req: Request, res: Response, _next: NextFunction): void => {
    const isDevelopment = process.env['NODE_ENV'] === 'development';
    
    // Extract error properties
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: any = undefined;
    
    if (error instanceof CustomError) {
      statusCode = error.statusCode;
      errorCode = error.code;
      message = error.message;
      details = error.details;
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      message = error.message;
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401;
      errorCode = 'UNAUTHORIZED';
      message = 'Invalid or expired token';
    } else if (error.name === 'CastError') {
      statusCode = 400;
      errorCode = 'INVALID_ID';
      message = 'Invalid ID format';
    } else if (error.name === 'MongoError' && (error as any).code === 11000) {
      statusCode = 409;
      errorCode = 'DUPLICATE_KEY';
      message = 'Resource already exists';
    }
    
    // Log error
    if (statusCode >= 500) {
      logger.error('Server error', error, {
        component: 'ErrorHandler',
        action: 'handle',
        metadata: {
          statusCode,
          path: req.path,
          method: req.method,
          userId: req.user?.userId
        }
      });
    } else if (statusCode >= 400) {
      logger.warn('Client error', {
        component: 'ErrorHandler',
        action: 'handle',
        metadata: {
          error: message,
          statusCode,
          path: req.path,
          method: req.method,
          userId: req.user?.userId
        }
      });
    }
    
    // Build error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: message,
        details: isDevelopment ? details : undefined,
        stack: isDevelopment ? error.stack : undefined
      },
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString()
    };
    
    // Send response
    res.status(statusCode).json(errorResponse);
  };
  
  /**
   * 404 Not Found handler
   */
  notFound = (req: Request, res: Response): void => {
    logger.warn('Route not found', {
      component: 'ErrorHandler',
      action: 'notFound',
      metadata: {
        path: req.path,
        method: req.method
      }
    });
    
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
        details: {
          path: req.path,
          method: req.method
        }
      },
      timestamp: new Date().toISOString()
    });
  };
  
  /**
   * Async error wrapper
   * Wraps async route handlers to catch rejected promises
   */
  asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  /**
   * Generate unique request ID for error tracking
   */
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const errorHandlerMiddleware = new ErrorHandlerMiddleware();

// Export custom error classes
export {
  CustomError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
