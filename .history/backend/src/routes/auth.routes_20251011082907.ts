/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - AUTHENTICATION ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller';
 import { validationMiddleware } from '../middleware/validation.middleware'; // ✅ Comentar se não existir
 import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware'; // ✅ Comentar por enquanto
import { authenticationMiddleware } from '../middleware/authentication.middleware';

const router = Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PUBLIC ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */

// POST /api/auth/register
router.post('/register', authController.register.bind(authController));

// POST /api/auth/login  
router.post('/login', authController.login.bind(authController));

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken.bind(authController));

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword.bind(authController));

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SSO ROUTES (Enterprise)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/auth/sso/:provider
router.get(
  '/sso/:provider',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;
      
      if (!provider) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Provider is required' },
        });
        return;
      }
      
      const ssoUrl = await authController.initiateSSOLogin(provider);
      res.redirect(ssoUrl);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/sso/callback/:provider
router.post(
  '/sso/callback/:provider',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { provider } = req.params;
      
      if (!provider) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Provider is required' },
        });
        return;
      }
      
      const result = await authController.handleSSOCallback(provider, req.body);
      
      res.json({
        success: true,
        data: result,
        message: 'SSO login successful',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROTECTED ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/auth/me
router.get(
  '/me',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      
      const user = await authController.getCurrentUser(userId);
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/auth/profile
router.patch(
  '/profile',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      
      const user = await authController.updateProfile(userId, req.body);
      
      res.json({
        success: true,
        data: { user },
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Passwords required' },
        });
        return;
      }
      
      await authController.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/logout
router.post(
  '/logout',
  authenticationMiddleware.authenticate,
  authController.logout.bind(authController)
);

// POST /api/auth/2fa/enable
router.post(
  '/2fa/enable',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      
      const result = await authController.enable2FA(userId);
      
      res.json({
        success: true,
        data: result,
        message: '2FA enabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/2fa/verify
router.post(
  '/2fa/verify',
  authenticationMiddleware.authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      const { token } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        });
        return;
      }
      
      if (!token) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: '2FA token required' },
        });
        return;
      }
      
      const verified = await authController.verify2FA(userId, token);
      
      res.json({
        success: true,
        data: { verified },
        message: verified ? '2FA verified' : '2FA failed',
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRoutes };
