 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - AUTHENTICATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/authentication.middleware
 * @description JWT token authentication and user context injection
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Validates JWT tokens, extracts user information, and injects it into
 * request context for downstream route handlers.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../system/logging-system';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        username: string;
        role: string;
        organizationId?: string;
        permissions?: string[];
      };
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  organizationId?: string;
  permissions?: string[];
  iat: number;
  exp: number;
}

class AuthenticationMiddleware {
  private readonly JWT_SECRET = process.env['JWT_SECRET'] || 'orus-builder-secret-key-change-in-production';
  private readonly JWT_ALGORITHM = 'HS256';
  
  /**
   * Authenticate request using JWT token
   * Expects: Authorization: Bearer <token>
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication required',
            details: 'No authorization header provided'
          }
        });
        return;
      }
      
      // Validate Bearer format
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_AUTH_HEADER',
            message: 'Invalid authorization header format',
            details: 'Expected format: Bearer <token>'
          }
        });
        return;
      }
      
      const token = parts[1];
      
      // Verify and decode JWT token
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        algorithms: [this.JWT_ALGORITHM]
      }) as JWTPayload;
      
      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired',
            details: 'Please refresh your token or login again'
          }
        });
        return;
      }
      
      // Inject user context into request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
        organizationId: decoded.organizationId,
        permissions: decoded.permissions || []
      };
      
      logger.debug('User authenticated', {
        component: 'AuthenticationMiddleware',
        userId: decoded.userId,
        endpoint: req.path
      });
      
      next();
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid authentication token',
            details: error.message
          }
        });
        return;
      }
      
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired',
            details: 'Please refresh your token or login again'
          }
        });
        return;
      }
      
      logger.error('Authentication error', error as Error, {
        component: 'AuthenticationMiddleware'
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication failed',
          details: 'An error occurred during authentication'
        }
      });
    }
  };
  
  /**
   * Optional authentication - doesn't fail if no token provided
   * Used for routes that have different behavior for authenticated vs anonymous users
   */
  optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        // No token provided, continue as anonymous
        next();
        return;
      }
      
      // If token is provided, validate it
      await this.authenticate(req, res, next);
      
    } catch (error) {
      // If validation fails, continue as anonymous (don't block request)
      logger.warn('Optional authentication failed, continuing as anonymous', {
        component: 'AuthenticationMiddleware',
        error: (error as Error).message
      });
      next();
    }
  };
  
  /**
   * Generate JWT token for user
   */
  generateToken(user: {
    userId: string;
    email: string;
    username: string;
    role: string;
    organizationId?: string;
    permissions?: string[];
  }, expiresIn: string = '7d'): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
      permissions: user.permissions
    };
    
    return jwt.sign(payload, this.JWT_SECRET, {
      algorithm: this.JWT_ALGORITHM,
      expiresIn
    });
  }
  
  /**
   * Generate refresh token (longer expiration)
   */
  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.JWT_SECRET,
      { algorithm: this.JWT_ALGORITHM, expiresIn: '30d' }
    );
  }
  
  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        algorithms: [this.JWT_ALGORITHM]
      }) as { userId: string; type: string };
      
      if (decoded.type !== 'refresh') {
        return null;
      }
      
      return { userId: decoded.userId };
    } catch {
      return null;
    }
  }
}

export const authenticationMiddleware = new AuthenticationMiddleware();
