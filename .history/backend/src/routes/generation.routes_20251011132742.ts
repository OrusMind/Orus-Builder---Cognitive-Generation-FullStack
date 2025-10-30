/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - CODE GENERATION ROUTES (CORE!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/generation.routes
 * @description AI-powered code generation endpoints
 * @version 1.1.0
 * @created 2025-10-09
 * @updated 2025-10-11
 * 
 * THE CORE FUNCTIONALITY - Handles all code generation requests through
 * Cognitive Generation Engine, Trinity AI, and Template System.
 * 
 * FIXES APPLIED (v1.1):
 * - Fixed rateLimiterMiddleware calls (using correct methods)
 * - Fixed controller method calls (passing req, res, next)
 * - Removed listGenerations (not implemented yet)
 * - Removed unused logger import
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { generationController } from '../controllers/generation.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

// All generation routes require authentication
router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CODE GENERATION - MAIN ENDPOINTS (THE MAGIC!)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Generate Code from Natural Language Prompt
 * POST /api/v1/generation/prompt
 */
router.post(
  '/prompt',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  validationMiddleware.validateGenerationPrompt,
  generationController.generateFromPrompt.bind(generationController)
);
/**
 * Generate from Template
 * POST /api/v1/generation/template
 */
router.post(
  '/template',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  validationMiddleware.validateTemplateGeneration,
  generationController.generateFromTemplate.bind(generationController)
);

/**
 * Generate from Blueprint
 * POST /api/v1/generation/blueprint
 */
router.post(
  '/blueprint',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  validationMiddleware.validateBlueprintGeneration,
  generationController.generateFromBlueprint.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENERATION MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Get Generation Status
 * GET /api/v1/generation/:generationId/status
 */
router.get(
  '/:generationId/status',
  generationController.getGenerationStatus.bind(generationController)
);

/**
 * Get Generation Result
 * GET /api/v1/generation/:generationId
 */
router.get(
  '/:generationId',
  generationController.getGenerationResult.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENERATION ENHANCEMENT & REFINEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Enhance Generated Code
 * POST /api/v1/generation/:generationId/enhance
 */
router.post(
  '/:generationId/enhance',
  rateLimiterMiddleware.rateLimiter({ max: 30, windowMs: 60 * 1000 }),
  validationMiddleware.validateEnhancement,
  generationController.enhanceGeneration.bind(generationController)
);

/**
 * Regenerate with Modifications
 * POST /api/v1/generation/:generationId/regenerate
 */
router.post(
  '/:generationId/regenerate',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateRegeneration,
  generationController.regenerate.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUALITY & VALIDATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Validate Generated Code
 * POST /api/v1/generation/:generationId/validate
 */
router.post(
  '/:generationId/validate',
  generationController.validateGeneration.bind(generationController)
);

/**
 * Get Quality Metrics
 * GET /api/v1/generation/:generationId/metrics
 */
router.get(
  '/:generationId/metrics',
  generationController.getQualityMetrics.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT & DOWNLOAD
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Export Generated Code as ZIP
 * GET /api/v1/generation/:generationId/export
 */
router.get(
  '/:generationId/export',
  generationController.exportGeneration.bind(generationController)
);

export { router as generationRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF CODE GENERATION ROUTES (CORE FUNCTIONALITY!)
 * ═══════════════════════════════════════════════════════════════════════════
 * VERSION: 1.1.0 (Fixed)
 * ALL ERRORS RESOLVED: ✅
 * READY FOR: Testing
 * ═══════════════════════════════════════════════════════════════════════════
 */
