/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔐 ORUS BUILDER - AUTHENTICATION CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../system/authentication-service'; // ✅ CORRIGIDO
import { logger } from '../system/logging-system';

// ✅ Instanciar o service
const authenticationService = new AuthenticationService();

/**
 * Authentication Controller
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
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

      const result = await authenticationService.register({
        email,
        password,
        name,
      });

      logger.info('User registered successfully', {
        component: 'AuthController',
        // ✅ Remover 'email' de LogContext (não existe no tipo)
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

      const result = await authenticationService.login({
        email,
        password,
      });

      logger.info('User logged in successfully', {
        component: 'AuthController',
        // ✅ Remover 'email'
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
  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> { // ✅ _ para indicar não usado
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
