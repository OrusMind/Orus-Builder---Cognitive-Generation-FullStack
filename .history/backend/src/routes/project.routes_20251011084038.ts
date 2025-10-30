 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - PROJECT ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/project.routes
 * @description Project management endpoints (CRUD + Settings)
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles all project-related operations: creation, retrieval, updates,
 * deletion, sharing, and settings management.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';
import { logger } from '../system/logging-system';

const router = Router();

// All project routes require authentication
router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT CRUD OPERATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * List All Projects
 * GET /api/v1/projects
 * 
 * @query {
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 *   status?: 'active' | 'archived',
 *   sortBy?: 'name' | 'createdAt' | 'updatedAt'
 * }
 * 
 * @returns {
 *   projects: Project[],
 *   total: number,
 *   page: number,
 *   totalPages: number
 * }
 */
router.get(
  '/',
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { page = 1, limit = 20, search, status, sortBy } = req.query;
      
      const result = await projectController.listProjects(userId, {
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        status: status as string,
        sortBy: sortBy as string
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
 * Create New Project
 * POST /api/v1/projects
 * 
 * @body {
 *   name: string,
 *   description?: string,
 *   type: 'web' | 'mobile' | 'api' | 'fullstack',
 *   template?: string,
 *   settings?: ProjectSettings
 * }
 * 
 * @returns {
 *   project: Project
 * }
 */
router.post(
  '/',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateProjectCreation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const project = await projectController.createProject(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: { project },
        message: 'Project created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Project Details
 * GET /api/v1/projects/:projectId
 * 
 * @param projectId - Project ID
 * 
 * @returns {
 *   project: Project,
 *   stats: ProjectStats
 * }
 */
router.get(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const result = await projectController.getProject(projectId);
      
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
 * Update Project
 * PATCH /api/v1/projects/:projectId
 * 
 * @param projectId - Project ID
 * @body {
 *   name?: string,
 *   description?: string,
 *   status?: 'active' | 'archived'
 * }
 * 
 * @returns {
 *   project: Project
 * }
 */
router.patch(
  '/:projectId',
  authorizationMiddleware.checkProjectAccess,
  validationMiddleware.validateProjectUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const project = await projectController.updateProject(projectId, req.body);
      
      res.json({
        success: true,
        data: { project },
        message: 'Project updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete Project
 * DELETE /api/v1/projects/:projectId
 * 
 * @param projectId - Project ID
 * 
 * @returns {
 *   message: string
 * }
 */
router.delete(
  '/:projectId',
  authorizationMiddleware.checkProjectOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      await projectController.deleteProject(projectId);
      
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT FILES & STRUCTURE
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Get Project Files
 * GET /api/v1/projects/:projectId/files
 * 
 * @param projectId - Project ID
 * @query path?: string
 * 
 * @returns {
 *   files: File[],
 *   structure: FileTree
 * }
 */
router.get(
  '/:projectId/files',
  authorizationMiddleware.checkProjectAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const { path } = req.query;
      
      const result = await projectController.getProjectFiles(projectId, path as string);
      
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
 * Get File Content
 * GET /api/v1/projects/:projectId/files/:fileId
 * 
 * @param projectId - Project ID
 * @param fileId - File ID
 * 
 * @returns {
 *   file: File,
 *   content: string
 * }
 */
router.get(
  '/:projectId/files/:fileId',
  authorizationMiddleware.checkProjectAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, fileId } = req.params;
      const result = await projectController.getFileContent(projectId, fileId);
      
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
 * Update File Content
 * PUT /api/v1/projects/:projectId/files/:fileId
 * 
 * @param projectId - Project ID
 * @param fileId - File ID
 * @body {
 *   content: string
 * }
 * 
 * @returns {
 *   file: File
 * }
 */
router.put(
  '/:projectId/files/:fileId',
  authorizationMiddleware.checkProjectAccess,
  validationMiddleware.validateFileUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, fileId } = req.params;
      const { content } = req.body;
      
      const file = await projectController.updateFileContent(projectId, fileId, content);
      
      res.json({
        success: true,
        data: { file },
        message: 'File updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT SHARING & COLLABORATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Share Project
 * POST /api/v1/projects/:projectId/share
 * 
 * @param projectId - Project ID
 * @body {
 *   email: string,
 *   role: 'viewer' | 'editor' | 'admin'
 * }
 * 
 * @returns {
 *   invitation: Invitation
 * }
 */
router.post(
  '/:projectId/share',
  authorizationMiddleware.checkProjectOwnership,
  validationMiddleware.validateProjectShare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const { email, role } = req.body;
      
      const invitation = await projectController.shareProject(projectId, email, role);
      
      res.json({
        success: true,
        data: { invitation },
        message: 'Project shared successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Project Members
 * GET /api/v1/projects/:projectId/members
 * 
 * @param projectId - Project ID
 * 
 * @returns {
 *   members: ProjectMember[]
 * }
 */
router.get(
  '/:projectId/members',
  authorizationMiddleware.checkProjectAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const members = await projectController.getProjectMembers(projectId);
      
      res.json({
        success: true,
        data: { members }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Remove Project Member
 * DELETE /api/v1/projects/:projectId/members/:userId
 * 
 * @param projectId - Project ID
 * @param userId - User ID to remove
 * 
 * @returns {
 *   message: string
 * }
 */
router.delete(
  '/:projectId/members/:userId',
  authorizationMiddleware.checkProjectOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, userId } = req.params;
      await projectController.removeMember(projectId, userId);
      
      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT SETTINGS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Get Project Settings
 * GET /api/v1/projects/:projectId/settings
 * 
 * @param projectId - Project ID
 * 
 * @returns {
 *   settings: ProjectSettings
 * }
 */
router.get(
  '/:projectId/settings',
  authorizationMiddleware.checkProjectAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const settings = await projectController.getSettings(projectId);
      
      res.json({
        success: true,
        data: { settings }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update Project Settings
 * PATCH /api/v1/projects/:projectId/settings
 * 
 * @param projectId - Project ID
 * @body Partial<ProjectSettings>
 * 
 * @returns {
 *   settings: ProjectSettings
 * }
 */
router.patch(
  '/:projectId/settings',
  authorizationMiddleware.checkProjectOwnership,
  validationMiddleware.validateSettingsUpdate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const settings = await projectController.updateSettings(projectId, req.body);
      
      res.json({
        success: true,
        data: { settings },
        message: 'Settings updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as projectRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF PROJECT ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */
