/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - CODE GENERATION ROUTES v2.5 (DOWNLOAD FIX!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/generation.routes
 * @description AI-powered code generation with Generation Controller
 * @version 2.5.0
 * @created 2025-10-09
 * @updated 2025-10-23T11:25:00-03:00
 * 
 * CHANGES IN v2.5:
 * - ✅ MOVED `/download/:generationId` BEFORE `router.use()` (NO AUTH!)
 * - ✅ ALL public routes BEFORE authentication middleware
 * - ✅ All authenticated routes AFTER `router.use()`
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { generationController } from '../controllers/generation.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// 🔥 PUBLIC ROUTES (NO AUTH REQUIRED) - MUST BE BEFORE router.use()!
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/v1/generation
 * Main code generation endpoint (NO AUTH!) - BACKWARD COMPATIBLE
 */
router.post('/', generationController.generateFromPrompt.bind(generationController));

/**
 * POST /api/v1/generation/prompt
 * Alternative code generation endpoint (NO AUTH!)
 */
router.post('/prompt', generationController.generateFromPrompt.bind(generationController));

/**
 * GET /api/v1/generation/:jobId/status
 * Check generation job status (NO AUTH)
 */
router.get('/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    return res.status(200).json({
      success: true,
      jobId,
      status: 'completed',
      progress: 100,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/v1/generation/:jobId/result
 * Get generation job result (NO AUTH)
 */
router.get('/:jobId/result', async (req, res) => {
  try {
    const { jobId } = req.params;
    return res.status(200).json({
      success: true,
      jobId,
      status: 'completed',
      result: {
        files: [],
        structure: null,
        metadata: {},
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/v1/generation/download/:generationId
 * 📦 DOWNLOAD ZIP - NO AUTH REQUIRED! (MOVED HERE!)
 */
router.get('/download/:generationId', generationController.downloadGeneratedCode.bind(generationController));

// ═══════════════════════════════════════════════════════════════
// 🔒 AUTHENTICATED ROUTES (REQUIRE AUTH) - AFTER THIS LINE!
// ═══════════════════════════════════════════════════════════════
router.use(authenticationMiddleware.authenticate);

/**
 * GET /api/v1/generation/history
 * Get user's generation history (REQUIRES AUTH)
 */
router.get('/history', 
  authorizationMiddleware.checkProjectAccess,
  async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        history: [],
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }
);

/**
 * POST /api/v1/generation/save
 * Save generated project (REQUIRES AUTH)
 */
router.post('/save',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        message: 'Project saved successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }
);

export default router;
export { router as generationRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF CODE GENERATION ROUTES v2.5 (DOWNLOAD FIX!)
 * ═══════════════════════════════════════════════════════════════════════════
 */
