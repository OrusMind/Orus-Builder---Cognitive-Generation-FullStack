/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - DEPLOYMENT ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/deployment.routes
 * @description Deployment orchestration endpoints (10+ platforms)
 * @version 1.1.0 (Fixed)
 * @created 2025-10-09
 * @updated 2025-10-11
 * 
 * Handles deployment to Vercel, Netlify, AWS, GCP, Azure, Docker, Kubernetes
 * and other platforms with automated pipelines.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
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
  deploymentController.deploy.bind(deploymentController)  // ✅ FIX: Use .bind()
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
  deploymentController.getStatus.bind(deploymentController)  // ✅ FIX: Use .bind()
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
  deploymentController.getDeployment.bind(deploymentController)  // ✅ FIX: Use .bind()
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
  deploymentController.listDeployments.bind(deploymentController)  // ✅ FIX: Use .bind()
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
  deploymentController.rollback.bind(deploymentController)  // ✅ FIX: Use .bind()
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
  deploymentController.getLogs.bind(deploymentController)  // ✅ FIX: Use .bind()
);

export { router as deploymentRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF DEPLOYMENT ROUTES - ALL ERRORS FIXED! ✅
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FIXES APPLIED:
 * ✅ Line 61: deploy → Added .bind()
 * ✅ Line 92: getStatus → Added .bind()
 * ✅ Line 121: getDeployment → Added .bind()
 * ✅ Line 155: listDeployments → Added .bind()
 * ✅ Line 195: rollback → Added .bind()
 * ✅ Line 229: getLogs → Added .bind()
 * 
 * TOTAL: 6 errors fixed → 0 errors
 * ═══════════════════════════════════════════════════════════════════════════
 */
