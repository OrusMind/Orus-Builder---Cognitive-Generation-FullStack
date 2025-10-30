/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗂️ ORUS BUILDER - PROJECT ROUTES (TEMP FIX - COMENTAR MÉTODOS FALTANTES)
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
router.use(rateLimiterMiddleware.globalLimiter);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT CRUD (APENAS MÉTODOS QUE EXISTEM)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// GET /api/v1/projects - List projects
router.get('/', projectController.listProjects.bind(projectController));

// POST /api/v1/projects - Create project
router.post(
  '/',
  rateLimiterMiddleware.strictLimiter,
  validationMiddleware.validateProjectCreation,
  projectController.createProject.bind(projectController)
);

// GET /api/v1/projects/:projectId - Get project
router.get(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess,
  projectController.getProject.bind(projectController)
);

// PATCH /api/v1/projects/:projectId - Update project
router.patch(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess,
  validationMiddleware.validateProjectUpdate,
  projectController.updateProject.bind(projectController)
);

// DELETE /api/v1/projects/:projectId - Delete project
router.delete(
  '/:projectId',
  authorizationMiddleware.checkProjectOwnership,
  projectController.deleteProject.bind(projectController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ ROTAS COMENTADAS TEMPORARIAMENTE (MÉTODOS NÃO IMPLEMENTADOS)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
// FILES (COMENTADO - NÃO IMPLEMENTADO AINDA)
router.get('/:projectId/files', authorizationMiddleware.checkProjectAccess, projectController.getProjectFiles.bind(projectController));
router.get('/:projectId/files/:fileId', authorizationMiddleware.checkProjectAccess, projectController.getFileContent.bind(projectController));
router.put('/:projectId/files/:fileId', authorizationMiddleware.checkProjectAccess, validationMiddleware.validateFileUpdate, projectController.updateFileContent.bind(projectController));

// SHARING (COMENTADO - NÃO IMPLEMENTADO AINDA)
router.post('/:projectId/share', authorizationMiddleware.checkProjectOwnership, validationMiddleware.validateProjectShare, projectController.shareProject.bind(projectController));
router.get('/:projectId/members', authorizationMiddleware.checkProjectAccess, projectController.getProjectMembers.bind(projectController));
router.delete('/:projectId/members/:userId', authorizationMiddleware.checkProjectOwnership, projectController.removeMember.bind(projectController));

// SETTINGS (COMENTADO - NÃO IMPLEMENTADO AINDA)
router.get('/:projectId/settings', authorizationMiddleware.checkProjectAccess, projectController.getProjectSettings.bind(projectController));
router.patch('/:projectId/settings', authorizationMiddleware.checkProjectOwnership, validationMiddleware.validateSettingsUpdate, projectController.updateProjectSettings.bind(projectController));
*/

export { router as projectRoutes };
