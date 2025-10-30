/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔐 ORUS BUILDER - AUTHENTICATION CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../system/authentication-service';
import { logger } from '../system/logging-system';

const authenticationService = AuthenticationService.getInstance();

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   * 
   * TODO: Implement register method in AuthenticationService
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;

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

      // TODO: Implement authenticationService.register()
      // For now, return not implemented
      res.status(501).json({
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Registration not yet implemented',
        },
      });

      logger.info('Register endpoint called', {
        component: 'AuthController',
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
   * 
   * TODO: Implement login method in AuthenticationService
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

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

      // TODO: Implement authenticationService.login()
      // For now, return not implemented
      res.status(501).json({
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Login not yet implemented',
        },
      });

      logger.info('Login endpoint called', {
        component: 'AuthController',
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
  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
   * 
   * Uses existing refreshTokens method from AuthenticationService
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

      // ✅ Usar refreshTokens (plural) ao invés de refreshToken
      const result = await authenticationService.refreshTokens(refreshToken);

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
   * 
   * TODO: Implement in AuthenticationService
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

      // TODO: Implement authenticationService.requestPasswordReset()
      res.status(501).json({
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Password reset not yet implemented',
        },
      });

      logger.info('Forgot password endpoint called', {
        component: 'AuthController',
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
   * 
   * TODO: Implement in AuthenticationService
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

      // TODO: Implement authenticationService.resetPassword()
      res.status(501).json({
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Password reset not yet implemented',
        },
      });

      logger.info('Reset password endpoint called', {
        component: 'AuthController',
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
