 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - MAIN API ROUTER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/api.routes
 * @description Main API router - aggregates all sub-routes
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Central router that combines all API endpoints into a cohesive REST API
 * following RESTful best practices and consistent response patterns.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { generationRoutes } from './generation.routes';
import { collaborationRoutes } from './collaboration.routes';
import { deploymentRoutes } from './deployment.routes';
import { marketplaceRoutes } from './marketplace.routes';
import { blueprintRoutes } from './blueprint.routes';
import { logger } from '../system/logging-system';

const router = Router();

/**
 * API Health Check
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  environment: process.env['NODE_ENV'] || 'development'
  });
});

/**
 * API Info
 * GET /api/info
 */
router.get('/info', (req: Request, res: Response) => {
  res.json({
    name: 'ORUS Builder API',
    version: '1.0.0',
    description: 'AI-Powered Code Generation Platform',
    endpoints: {
      auth: '/api/v1/auth',
      projects: '/api/v1/projects',
      generation: '/api/v1/generation',
      collaboration: '/api/v1/collaboration',
      deployment: '/api/v1/deployment',
      marketplace: '/api/v1/marketplace',
      blueprints: '/api/v1/blueprints'
    },
    documentation: '/api/docs',
    support: 'https://orus.builder/support'
  });
});

/**
 * Mount API v1 Routes
 */
const apiV1Router = Router();

// Authentication routes
apiV1Router.use('/auth', authRoutes);
logger.debug('Auth routes mounted at /api/v1/auth');

// Project routes
apiV1Router.use('/projects', projectRoutes);
logger.debug('Project routes mounted at /api/v1/projects');

// Code generation routes
apiV1Router.use('/generation', generationRoutes);
logger.debug('Generation routes mounted at /api/v1/generation');

// Collaboration routes
apiV1Router.use('/collaboration', collaborationRoutes);
logger.debug('Collaboration routes mounted at /api/v1/collaboration');

// Deployment routes
apiV1Router.use('/deployment', deploymentRoutes);
logger.debug('Deployment routes mounted at /api/v1/deployment');

// Marketplace routes
apiV1Router.use('/marketplace', marketplaceRoutes);
logger.debug('Marketplace routes mounted at /api/v1/marketplace');

// Blueprint routes
apiV1Router.use('/blueprints', blueprintRoutes);
logger.debug('Blueprint routes mounted at /api/v1/blueprints');

// Mount v1 router
router.use('/v1', apiV1Router);

/**
 * API Version Not Found Handler
 */
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    message: 'Please check the API documentation at /api/info'
  });
});

export { router as apiRouter };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF MAIN API ROUTER
 * ═══════════════════════════════════════════════════════════════════════════
 */
