 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - CODE GENERATION ROUTES (CORE!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/generation.routes
 * @description AI-powered code generation endpoints
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * THE CORE FUNCTIONALITY - Handles all code generation requests through
 * Cognitive Generation Engine, Trinity AI, and Template System.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { generationController } from '../controllers/generation.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';
import { logger } from '../system/logging-system';

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
 * 
 * @body {
 *   projectId: string,
 *   prompt: string,
 *   language: 'typescript' | 'javascript' | 'python',
 *   framework?: string,
 *   includeTests?: boolean,
 *   style?: 'functional' | 'oop'
 * }
 * 
 * @returns {
 *   generationId: string,
 *   files: GeneratedFile[],
 *   quality: QualityMetrics,
 *   status: 'completed' | 'processing'
 * }
 */
router.post(
  '/prompt',
  authorizationMiddleware.checkProjectAccess,
 rateLimiterMiddleware.tieredLimiter,// 50 generations per minute
  validationMiddleware.validateGenerationPrompt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await generationController.generateFromPrompt(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Code generation completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Generate from Template
 * POST /api/v1/generation/template
 * 
 * @body {
 *   projectId: string,
 *   templateId: string,
 *   variables: Record<string, any>,
 *   customization?: object
 * }
 * 
 * @returns {
 *   generationId: string,
 *   files: GeneratedFile[]
 * }
 */
router.post(
  '/template',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  validationMiddleware.validateTemplateGeneration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await generationController.generateFromTemplate(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Code generated from template successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Generate from Blueprint
 * POST /api/v1/generation/blueprint
 * 
 * @body {
 *   projectId: string,
 *   blueprintId: string,
 *   customization?: object
 * }
 * 
 * @returns {
 *   generationId: string,
 *   files: GeneratedFile[],
 *   structure: ProjectStructure
 * }
 */
router.post(
  '/blueprint',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateBlueprintGeneration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await generationController.generateFromBlueprint(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Project generated from blueprint successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENERATION MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Get Generation Status
 * GET /api/v1/generation/:generationId/status
 * 
 * @param generationId - Generation ID
 * 
 * @returns {
 *   generationId: string,
 *   status: 'pending' | 'processing' | 'completed' | 'failed',
 *   progress: number,
 *   currentStep?: string
 * }
 */
router.get(
  '/:generationId/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const status = await generationController.getGenerationStatus(generationId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Generation Result
 * GET /api/v1/generation/:generationId
 * 
 * @param generationId - Generation ID
 * 
 * @returns {
 *   generation: GenerationResult,
 *   files: GeneratedFile[],
 *   metrics: QualityMetrics
 * }
 */
router.get(
  '/:generationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const result = await generationController.getGenerationResult(generationId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * List User Generations
 * GET /api/v1/generation
 * 
 * @query {
 *   projectId?: string,
 *   page?: number,
 *   limit?: number,
 *   status?: string
 * }
 * 
 * @returns {
 *   generations: Generation[],
 *   total: number,
 *   page: number
 * }
 */
router.get(
  '/',
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { projectId, page = 1, limit = 20, status } = req.query;
      
      const result = await generationController.listGenerations(userId, {
        projectId: projectId as string,
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENERATION ENHANCEMENT & REFINEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Enhance Generated Code
 * POST /api/v1/generation/:generationId/enhance
 * 
 * @param generationId - Generation ID
 * @body {
 *   enhancements: string[],
 *   additionalPrompt?: string
 * }
 * 
 * @returns {
 *   enhancedCode: GeneratedFile[]
 * }
 */
router.post(
  '/:generationId/enhance',
  rateLimiterMiddleware.rateLimiter({ max: 30, windowMs: 60 * 1000 }),
  validationMiddleware.validateEnhancement,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const result = await generationController.enhanceGeneration(generationId, req.body);
      
      res.json({
        success: true,
        data: result,
        message: 'Code enhanced successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Regenerate with Modifications
 * POST /api/v1/generation/:generationId/regenerate
 * 
 * @param generationId - Generation ID
 * @body {
 *   modifiedPrompt?: string,
 *   keepFiles?: string[],
 *   changes?: object
 * }
 * 
 * @returns {
 *   newGenerationId: string,
 *   files: GeneratedFile[]
 * }
 */
router.post(
  '/:generationId/regenerate',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateRegeneration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const result = await generationController.regenerate(generationId, req.body);
      
      res.json({
        success: true,
        data: result,
        message: 'Code regenerated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUALITY & VALIDATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Validate Generated Code
 * POST /api/v1/generation/:generationId/validate
 * 
 * @param generationId - Generation ID
 * 
 * @returns {
 *   validation: ValidationResult,
 *   cigScore: number,
 *   issues: Issue[]
 * }
 */
router.post(
  '/:generationId/validate',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const validation = await generationController.validateGeneration(generationId);
      
      res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Quality Metrics
 * GET /api/v1/generation/:generationId/metrics
 * 
 * @param generationId - Generation ID
 * 
 * @returns {
 *   metrics: QualityMetrics,
 *   scores: {
 *     quality: number,
 *     security: number,
 *     performance: number,
 *     maintainability: number
 *   }
 * }
 */
router.get(
  '/:generationId/metrics',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const metrics = await generationController.getQualityMetrics(generationId);
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORT & DOWNLOAD
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Export Generated Code as ZIP
 * GET /api/v1/generation/:generationId/export
 * 
 * @param generationId - Generation ID
 * @query format?: 'zip' | 'tar.gz'
 * 
 * @returns Binary file download
 */
router.get(
  '/:generationId/export',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { generationId } = req.params;
      const { format = 'zip' } = req.query;
      
      const fileBuffer = await generationController.exportGeneration(generationId, format as string);
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="project-${generationId}.zip"`);
      res.send(fileBuffer);
    } catch (error) {
      next(error);
    }
  }
);

export { router as generationRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF CODE GENERATION ROUTES (CORE FUNCTIONALITY!)
 * ═══════════════════════════════════════════════════════════════════════════
 */
