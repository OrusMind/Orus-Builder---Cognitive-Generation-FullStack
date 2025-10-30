/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗂️ ORUS BUILDER - PROJECT ROUTES (VERSÃO COMPLETA COM MIDDLEWARES)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

// Global authentication + rate limiting
router.use(authenticationMiddleware.authenticate);
router.use(rateLimiterMiddleware.globalLimiter); // ✅ 200 req/min

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT CRUD
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/v1/projects - List projects
router.get('/', projectController.listProjects.bind(projectController));

// POST /api/v1/projects - Create project
router.post(
  '/',
  rateLimiterMiddleware.strictLimiter, // ✅ 5 req/15min
  validationMiddleware.validateProjectCreation,
  projectController.createProject.bind(projectController)
);

// GET /api/v1/projects/:projectId - Get project
router.get(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess, // ✅ Verify access
  projectController.getProject.bind(projectController)
);

// PATCH /api/v1/projects/:projectId - Update project
router.patch(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess,
  validationMiddleware.validateProjectUpdate,
  projectController.updateProject.bind(projectController)
);

// DELETE /api/v1/projects/:projectId - Delete project (owner only)
router.delete(
  '/:projectId',
  authorizationMiddleware.checkProjectOwnership, // ✅ Owner only
  projectController.deleteProject.bind(projectController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILES
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/v1/projects/:projectId/files
router.get(
  '/:projectId/files',
  authorizationMiddleware.checkProjectAccess,
  projectController.getProjectFiles.bind(projectController)
);

// GET /api/v1/projects/:projectId/files/:fileId
router.get(
  '/:projectId/files/:fileId',
  authorizationMiddleware.checkProjectAccess,
  projectController.getFileContent.bind(projectController)
);

// PUT /api/v1/projects/:projectId/files/:fileId
router.put(
  '/:projectId/files/:fileId',
  authorizationMiddleware.checkProjectAccess,
  validationMiddleware.validateFileUpdate,
  projectController.updateFileContent.bind(projectController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARING
 * ═══════════════════════════════════════════════════════════════════════════
 */

// POST /api/v1/projects/:projectId/share
router.post(
  '/:projectId/share',
  authorizationMiddleware.checkProjectOwnership,
  validationMiddleware.validateProjectShare,
  projectController.shareProject.bind(projectController)
);

// GET /api/v1/projects/:projectId/members
router.get(
  '/:projectId/members',
  authorizationMiddleware.checkProjectAccess,
  projectController.getProjectMembers.bind(projectController)
);

// DELETE /api/v1/projects/:projectId/members/:userId
router.delete(
  '/:projectId/members/:userId',
  authorizationMiddleware.checkProjectOwnership,
  projectController.removeMember.bind(projectController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SETTINGS
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/v1/projects/:projectId/settings
router.get(
  '/:projectId/settings',
  authorizationMiddleware.checkProjectAccess,
  projectController.getProjectSettings.bind(projectController)
);

// PATCH /api/v1/projects/:projectId/settings
router.patch(
  '/:projectId/settings',
  authorizationMiddleware.checkProjectOwnership,
  validationMiddleware.validateSettingsUpdate,
  projectController.updateProjectSettings.bind(projectController)
);

export { router as projectRoutes };
