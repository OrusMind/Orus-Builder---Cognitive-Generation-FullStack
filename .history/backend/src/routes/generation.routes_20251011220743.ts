/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - CODE GENERATION ROUTES (CORE!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/generation.routes
 * @description AI-powered code generation endpoints
 * @version 1.4.0
 * @created 2025-10-09
 * @updated 2025-10-11T22:12:00-03:00
 * 
 * FIXES APPLIED (v1.4):
 * - Import ComponentStatus from cig-engine (correct source)
 * - Added 'enabled' property to engine config
 * - Fixed process.env access with bracket notation
 * - Test endpoint with engine initialization
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { generationController } from '../controllers/generation.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';
import { cognitiveGenerationEngine, GenerationMode, GenerationTarget } from '../engines/cognitive-generation-engine';
import { ComponentStatus } from '../engines/cig-engine'; // ✅ Import do lugar correto

const router = Router();

// ═══════════════════════════════════════════════════════════════
// 🧪 TEST ENDPOINT - NO AUTH REQUIRED (MUST BE FIRST!)
// ═══════════════════════════════════════════════════════════════

router.post('/test', async (req, res) => {
  try {
    // ✅ Initialize engine if not ready
    if (cognitiveGenerationEngine.getStatus() === ComponentStatus.STOPPED) {
      await cognitiveGenerationEngine.initialize({
        enabled: true, // ✅ Required by EngineConfig
        enableTrinity: false,
        enableCIG: false,
        enableLearning: false,
        aiProvider: 'claude',
        aiModel: process.env['GROQ_MODEL'] || 'llama-3.3-70b-versatile', // ✅ Bracket notation
        temperature: 0.3,
        maxTokens: 4096,
        minConfidence: 70,
        requireValidation: false,
        enableCaching: false,
        parallelGeneration: false,
        maxRetries: 2
      });
      
      await cognitiveGenerationEngine.start();
      console.log('✅ Engine initialized for test');
    }
    
    const { prompt, language, framework } = req.body;
    
    const result = await cognitiveGenerationEngine.generate({
      id: 'test-' + Date.now(),
      requestId: 'test-' + Date.now(),
      userId: 'test-user',
      mode: GenerationMode.FROM_PROMPT,
      target: GenerationTarget.COMPONENT,
      prompt: prompt || 'Create a simple TypeScript User class',
      language: language || 'typescript',
      framework: framework || 'none',
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Generation error:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
      stack: process.env['NODE_ENV'] === 'development' ? (error as Error).stack : undefined
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🔒 AUTHENTICATION MIDDLEWARE - All routes below require auth
// ═══════════════════════════════════════════════════════════════

router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CODE GENERATION - MAIN ENDPOINTS (AUTHENTICATED)
 * ═══════════════════════════════════════════════════════════════════════════
 */

router.post(
  '/prompt',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  validationMiddleware.validateGenerationPrompt,
  generationController.generateFromPrompt.bind(generationController)
);

router.post(
  '/template',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.tieredLimiter,
  validationMiddleware.validateTemplateGeneration,
  generationController.generateFromTemplate.bind(generationController)
);

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

router.get(
  '/:generationId/status',
  generationController.getGenerationStatus.bind(generationController)
);

router.get(
  '/:generationId',
  generationController.getGenerationResult.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENERATION ENHANCEMENT & REFINEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

router.post(
  '/:generationId/enhance',
  rateLimiterMiddleware.rateLimiter({ max: 30, windowMs: 60 * 1000 }),
  validationMiddleware.validateEnhancement,
  generationController.enhanceGeneration.bind(generationController)
);

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

router.post(
  '/:generationId/validate',
  generationController.validateGeneration.bind(generationController)
);

router.get(
  '/:generationId/metrics',
  generationController.getQualityMetrics.bind(generationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT & DOWNLOAD
 * ═══════════════════════════════════════════════════════════════════════════
 */

router.get(
  '/:generationId/export',
  generationController.exportGeneration.bind(generationController)
);

export default router;
export { router as generationRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF CODE GENERATION ROUTES (CORE FUNCTIONALITY!)
 * ═══════════════════════════════════════════════════════════════════════════
 * VERSION: 1.4.0 (FIXED - All errors resolved)
 * ALL ERRORS RESOLVED: ✅
 * READY FOR: Production Testing with Groq
 * ═══════════════════════════════════════════════════════════════════════════
 */
