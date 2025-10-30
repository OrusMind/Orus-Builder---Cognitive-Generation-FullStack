 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - DEPLOYMENT ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/deployment.routes
 * @description Deployment orchestration endpoints (10+ platforms)
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles deployment to Vercel, Netlify, AWS, GCP, Azure, Docker, Kubernetes
 * and other platforms with automated pipelines.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { deploymentController } from '../controllers/deployment.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEPLOYMENT OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Deploy Project
 * POST /api/v1/deployment/deploy
 * 
 * @body {
 *   projectId: string,
 *   platform: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | ...,
 *   environment: 'development' | 'staging' | 'production',
 *   strategy?: 'standard' | 'blue-green' | 'canary',
 *   envVars?: Record<string, string>
 * }
 * 
 * @returns {
 *   deploymentId: string,
 *   status: 'pending' | 'building' | 'deploying',
 *   platform: string
 * }
 */
router.post(
  '/deploy',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.rateLimiter({ max: 10, windowMs: 60 * 1000 }),
  validationMiddleware.validateDeployment,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await deploymentController.deploy(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Deployment initiated'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Deployment Status
 * GET /api/v1/deployment/:deploymentId/status
 * 
 * @param deploymentId - Deployment ID
 * 
 * @returns {
 *   deploymentId: string,
 *   status: string,
 *   progress: number,
 *   logs: LogEntry[]
 * }
 */
router.get(
  '/:deploymentId/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deploymentId } = req.params;
      const status = await deploymentController.getStatus(deploymentId);
      
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
 * Get Deployment Details
 * GET /api/v1/deployment/:deploymentId
 * 
 * @param deploymentId - Deployment ID
 * 
 * @returns {
 *   deployment: Deployment,
 *   url?: string,
 *   metrics: DeploymentMetrics
 * }
 */
router.get(
  '/:deploymentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deploymentId } = req.params;
      const deployment = await deploymentController.getDeployment(deploymentId);
      
      res.json({
        success: true,
        data: deployment
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * List Project Deployments
 * GET /api/v1/deployment
 * 
 * @query {
 *   projectId: string,
 *   environment?: string,
 *   page?: number,
 *   limit?: number
 * }
 * 
 * @returns {
 *   deployments: Deployment[],
 *   total: number
 * }
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, environment, page = 1, limit = 20 } = req.query;
      
      const result = await deploymentController.listDeployments({
        projectId: projectId as string,
        environment: environment as string,
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
 * Rollback Deployment
 * POST /api/v1/deployment/:deploymentId/rollback
 * 
 * @param deploymentId - Deployment ID
 * @body {
 *   reason?: string
 * }
 * 
 * @returns {
 *   rollbackId: string,
 *   status: string
 * }
 */
router.post(
  '/:deploymentId/rollback',
  authorizationMiddleware.checkProjectOwnership,
  rateLimiterMiddleware.rateLimiter({ max: 5, windowMs: 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deploymentId } = req.params;
      const { reason } = req.body;
      
      const result = await deploymentController.rollback(deploymentId, reason);
      
      res.json({
        success: true,
        data: result,
        message: 'Rollback initiated'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Deployment Logs
 * GET /api/v1/deployment/:deploymentId/logs
 * 
 * @param deploymentId - Deployment ID
 * @query {
 *   follow?: boolean,
 *   tail?: number
 * }
 * 
 * @returns {
 *   logs: LogEntry[]
 * }
 */
router.get(
  '/:deploymentId/logs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deploymentId } = req.params;
      const { tail = 100 } = req.query;
      
      const logs = await deploymentController.getLogs(deploymentId, Number(tail));
      
      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as deploymentRoutes };
