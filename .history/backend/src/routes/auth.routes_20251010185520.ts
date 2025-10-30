 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - AUTHENTICATION ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/auth.routes
 * @description Authentication and authorization endpoints
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles user authentication, registration, password management, and SSO.
 * Integrates with JWT tokens, refresh tokens, and enterprise SSO providers.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { logger } from '../system/logging-system';

const router = Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PUBLIC ROUTES (No Authentication Required)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * User Registration
 * POST /api/v1/auth/register
 * 
 * @body {
 *   email: string,
 *   password: string,
 *   name: string,
 *   organizationName?: string
 * }
 * 
 * @returns {
 *   user: User,
 *   token: string,
 *   refreshToken: string
 * }
 */
router.post(
  '/register',
  rateLimiterMiddleware.rateLimiter({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes
  validationMiddleware.validateRegistration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authController.register(req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * User Login
 * POST /api/v1/auth/login
 * 
 * @body {
 *   email: string,
 *   password: string
 * }
 * 
 * @returns {
 *   user: User,
 *   token: string,
 *   refreshToken: string
 * }
 */
router.post(
  '/login',
  rateLimiterMiddleware.rateLimiter({ max: 10, windowMs: 15 * 60 * 1000 }), // 10 requests per 15 minutes
  validationMiddleware.validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authController.login(email, password);
      
      res.json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Refresh Access Token
 * POST /api/v1/auth/refresh
 * 
 * @body {
 *   refreshToken: string
 * }
 * 
 * @returns {
 *   token: string,
 *   refreshToken: string
 * }
 */
router.post(
  '/refresh',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 15 * 60 * 1000 }),
  validationMiddleware.validateRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await authController.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Forgot Password
 * POST /api/v1/auth/forgot-password
 * 
 * @body {
 *   email: string
 * }
 * 
 * @returns {
 *   message: string
 * }
 */
router.post(
  '/forgot-password',
  rateLimiterMiddleware.rateLimiter({ max: 3, windowMs: 60 * 60 * 1000 }), // 3 requests per hour
  validationMiddleware.validateEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await authController.forgotPassword(email);
      
      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Reset Password
 * POST /api/v1/auth/reset-password
 * 
 * @body {
 *   token: string,
 *   newPassword: string
 * }
 * 
 * @returns {
 *   message: string
 * }
 */
router.post(
  '/reset-password',
  rateLimiterMiddleware.rateLimiter({ max: 5, windowMs: 60 * 60 * 1000 }),
  validationMiddleware.validatePasswordReset,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await authController.resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SSO ROUTES (Enterprise Features)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * SSO Login Initiation
 * GET /api/v1/auth/sso/:provider
 * 
 * @param provider - SSO provider (saml, okta, azure-ad, google)
 * 
 * @returns Redirect to SSO provider
 */
router.get(
  '/sso/:provider',
  rateLimiterMiddleware.rateLimiter({ max: 10, windowMs: 15 * 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;
      const ssoUrl = await authController.initiateSSOLogin(provider);
      
      res.redirect(ssoUrl);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * SSO Callback
 * POST /api/v1/auth/sso/callback/:provider
 * 
 * @param provider - SSO provider
 * @body SSO response data
 * 
 * @returns {
 *   user: User,
 *   token: string,
 *   refreshToken: string
 * }
 */
router.post(
  '/sso/callback/:provider',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 15 * 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;
      const result = await authController.handleSSOCallback(provider, req.body);
      
      res.json({
        success: true,
        data: result,
        message: 'SSO login successful'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROTECTED ROUTES (Authentication Required)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Get Current User Profile
 * GET /api/v1/auth/me
 * 
 * @returns {
 *   user: User
 * }
 */
router.get(
  '/me',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = await authController.getCurrentUser(userId);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update User Profile
 * PATCH /api/v1/auth/profile
 * 
 * @body {
 *   name?: string,
 *   avatar?: string,
 *   preferences?: object
 * }
 * 
 * @returns {
 *   user: User
 * }
 */
router.patch(
  '/profile',
  authenticationMiddleware.authenticate,
  validationMiddleware.validateProfileUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = await authController.updateProfile(userId, req.body);
      
      res.json({
        success: true,
        data: { user },
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Change Password
 * POST /api/v1/auth/change-password
 * 
 * @body {
 *   currentPassword: string,
 *   newPassword: string
 * }
 * 
 * @returns {
 *   message: string
 * }
 */
router.post(
  '/change-password',
  authenticationMiddleware.authenticate,
  validationMiddleware.validatePasswordChange,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      
      await authController.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Logout
 * POST /api/v1/auth/logout
 * 
 * @returns {
 *   message: string
 * }
 */
router.post(
  '/logout',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const token = req.headers.authorization?.split(' ')[1];
      
      if (token) {
        await authController.logout(userId, token);
      }
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Enable 2FA
 * POST /api/v1/auth/2fa/enable
 * 
 * @returns {
 *   qrCode: string,
 *   secret: string
 * }
 */
router.post(
  '/2fa/enable',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await authController.enable2FA(userId);
      
      res.json({
        success: true,
        data: result,
        message: '2FA enabled successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Verify 2FA Token
 * POST /api/v1/auth/2fa/verify
 * 
 * @body {
 *   token: string
 * }
 * 
 * @returns {
 *   verified: boolean
 * }
 */
router.post(
  '/2fa/verify',
  authenticationMiddleware.authenticate,
  validationMiddleware.validate2FAToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { token } = req.body;
      
      const verified = await authController.verify2FA(userId, token);
      
      res.json({
        success: true,
        data: { verified },
        message: verified ? '2FA verification successful' : '2FA verification failed'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF AUTHENTICATION ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */
