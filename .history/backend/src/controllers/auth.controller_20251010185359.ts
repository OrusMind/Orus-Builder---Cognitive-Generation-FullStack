/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔐 ORUS BUILDER - AUTHENTICATION CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module AuthController
 * @description HTTP request handlers for authentication endpoints
 * @version 1.0.0
 * @created 2025-10-10
 * 
 * PURPOSE:
 * - Handle HTTP requests for auth endpoints
 * - Delegate business logic to AuthenticationService
 * - Return standardized API responses
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { authenticationService } from '../system/authentication-service';
import { logger } from '../system/logging-system';

/**
 * Authentication Controller
 * Handles all authentication HTTP requests
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email, password, and name are required',
          },
        });
        return;
      }

      // Register user via authentication service
      const result = await authenticationService.register({
        email,
        password,
        name,
      });

      logger.info('User registered successfully', {
        component: 'AuthController',
        email,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Registration failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        });
        return;
      }

      // Login via authentication service
      const result = await authenticationService.login({
        email,
        password,
      });

      logger.info('User logged in successfully', {
        component: 'AuthController',
        email,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Login failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is already attached to req by authentication middleware
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Get user profile failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In JWT-based auth, logout is handled client-side by removing token
      // Optionally, we can blacklist the token here

      logger.info('User logged out', {
        component: 'AuthController',
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Refresh JWT token
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required',
          },
        });
        return;
      }

      const result = await authenticationService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Token refresh failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email is required',
          },
        });
        return;
      }

      await authenticationService.requestPasswordReset(email);

      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset email has been sent',
      });
    } catch (error) {
      logger.error('Forgot password failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Token and new password are required',
          },
        });
        return;
      }

      await authenticationService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Password reset failed', error as Error, {
        component: 'AuthController',
      });
      next(error);
    }
  }
}

// Export singleton instance
export const authController = new AuthController();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT MANIFEST
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMARY_EXPORT: authController (singleton)
 * METHODS:
 *   - register (POST /api/auth/register)
 *   - login (POST /api/auth/login)
 *   - getMe (GET /api/auth/me)
 *   - logout (POST /api/auth/logout)
 *   - refreshToken (POST /api/auth/refresh)
 *   - forgotPassword (POST /api/auth/forgot-password)
 *   - resetPassword (POST /api/auth/reset-password)
 * ═══════════════════════════════════════════════════════════════════════════
 */
