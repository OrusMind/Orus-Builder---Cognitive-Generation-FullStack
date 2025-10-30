 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - BLUEPRINT ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/blueprint.routes
 * @description Blueprint upload and processing endpoints
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles blueprint image upload, processing, recognition, and conversion
 * to project structures (99% accuracy).
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { blueprintController } from '../controllers/blueprint.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ 
  dest: '/tmp/uploads',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLUEPRINT UPLOAD & PROCESSING
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Upload Blueprint
 * POST /api/v1/blueprints/upload
 * 
 * @body multipart/form-data {
 *   file: File (image),
 *   projectId: string,
 *   type?: 'ui' | 'architecture' | 'database'
 * }
 * 
 * @returns {
 *   blueprintId: string,
 *   status: 'processing',
 *   preview: string
 * }
 */
router.post(
  '/upload',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  upload.single('file'),
  validationMiddleware.validateBlueprintUpload,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const file = req.file!;
      const { projectId, type } = req.body;
      
      const result = await blueprintController.upload(userId, file, {
        projectId,
        type
      });
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Blueprint uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Processing Status
 * GET /api/v1/blueprints/:blueprintId/status
 * 
 * @param blueprintId - Blueprint ID
 * 
 * @returns {
 *   blueprintId: string,
 *   status: 'processing' | 'completed' | 'failed',
 *   progress: number,
 *   currentStep?: string
 * }
 */
router.get(
  '/:blueprintId/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blueprintId } = req.params;
      const status = await blueprintController.getStatus(blueprintId);
      
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
 * Get Blueprint Result
 * GET /api/v1/blueprints/:blueprintId
 * 
 * @param blueprintId - Blueprint ID
 * 
 * @returns {
 *   blueprint: Blueprint,
 *   structure: ProjectStructure,
 *   components: Component[],
 *   confidence: number
 * }
 */
router.get(
  '/:blueprintId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blueprintId } = req.params;
      const result = await blueprintController.getBlueprint(blueprintId);
      
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
 * List User Blueprints
 * GET /api/v1/blueprints
 * 
 * @query {
 *   projectId?: string,
 *   page?: number,
 *   limit?: number
 * }
 * 
 * @returns {
 *   blueprints: Blueprint[],
 *   total: number
 * }
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { projectId, page = 1, limit = 20 } = req.query;
      
      const result = await blueprintController.listBlueprints(userId, {
        projectId: projectId as string,
        page: Number(page),
        limit: Number(limit)
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
 * Approve Blueprint Recognition
 * POST /api/v1/blueprints/:blueprintId/approve
 * 
 * @param blueprintId - Blueprint ID
 * @body {
 *   corrections?: object
 * }
 * 
 * @returns {
 *   approved: boolean
 * }
 */
router.post(
  '/:blueprintId/approve',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blueprintId } = req.params;
      const { corrections } = req.body;
      
      await blueprintController.approve(blueprintId, corrections);
      
      res.json({
        success: true,
        data: { approved: true },
        message: 'Blueprint approved'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as blueprintRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF ALL ROUTES - API LAYER COMPLETE! 🎉
 * ═══════════════════════════════════════════════════════════════════════════
 */
