/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗂️ ORUS BUILDER - PROJECT CONTROLLER WITH CODE GENERATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../system/logging-system';
import { v4 as uuidv4 } from 'uuid';

import { OrchestrationEngine } from '../engines/orchestrator-engine';

// Criar instância local
const orchestrationEngine = OrchestrationEngine.getInstance();

interface Project {
  id: string;
  name: string;
  description: string;
  files: any[];
  framework: string;
  prompt: string;
  generatedCode?: string;
  specification?: any;
  status: 'creating' | 'ready' | 'error';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with database later)
const projects: Project[] = [];

class ProjectController {
  /**
   * List all projects for a user
   */
  async listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { page = 1, limit = 20 } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      logger.info(`📋 Listing projects for user: ${userId}`, {
        component: 'ProjectController'
      } as any);

      // TODO: Filter by userId when database is connected
      const userProjects = projects;

      res.status(200).json({
        success: true,
        data: {
          projects: userProjects,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: userProjects.length,
          },
        },
      });
    } catch (error) {
      logger.error('❌ Error listing projects', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }

  /**
   * Get a single project by ID
   */
  async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const project = projects.find(p => p.id === projectId);

      if (!project) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { project },
      });
    } catch (error) {
      logger.error('❌ Error getting project', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }

  /**
   * Create a new project with CODE GENERATION
   */
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { name, description, framework, prompt, language } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      if (!name || !prompt) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Name and prompt are required' },
        });
        return;
      }

      logger.info(`✨ Creating project with code generation: ${name}`, {
        component: 'ProjectController',
        prompt: prompt.substring(0, 100),
        framework,
        language
      } as any);

      // Create project entry
      const projectId = uuidv4();
      const newProject: Project = {
        id: projectId,
        name,
        description: description || '',
        files: [],
        framework: framework || 'react',
        prompt,
        status: 'creating',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projects.push(newProject);

      // Return immediately with project ID
      res.status(201).json({
        success: true,
        data: {
          project: newProject,
          message: 'Project created, generating code...',
        },
      });

      // ✅ GENERATE CODE ASYNCHRONOUSLY using Orchestrator
      this.generateCodeAsync(projectId, {
        prompt,
        framework: framework || 'react',
        language: language || 'pt-BR',
        userId,
      }).catch(error => {
        logger.error('❌ Error in async code generation', {
          error,
          projectId,
          component: 'ProjectController'
        } as any);
        
        // Update project status to error
        const project = projects.find(p => p.id === projectId);
        if (project) {
          project.status = 'error';
          project.updatedAt = new Date().toISOString();
        }
      });

    } catch (error) {
      logger.error('❌ Error creating project', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }

  /**
   * Generate code asynchronously using Orchestrator Engine
   */
  private async generateCodeAsync(
    projectId: string,
    params: {
      prompt: string;
      framework: string;
      language: string;
      userId: string;
    }
  ): Promise<void> {
    try {
      logger.info(`🔄 Starting async code generation for project: ${projectId}`, {
        component: 'ProjectController'
      } as any);

      // ✅ CALL ORCHESTRATOR ENGINE
      const workflowResult = await orchestrationEngine.executeWorkflow({
        requestId: uuidv4(),
        userId: params.userId,
        workflowType: 'PROMPT_TO_CODE' as any,
        input: {
          prompt: params.prompt,
          options: {
            framework: params.framework,
            language: params.language,
            includeTests: false,
            includeDocs: false,
          },
        },
        config: {
          engines: ['prompt', 'cognitive', 'template'],
          parallel: false,
          retryOnFailure: true,
          maxRetries: 2,
        },
      });

      logger.info(`✅ Code generation completed for project: ${projectId}`, {
        component: 'ProjectController',
        success: workflowResult.success
      } as any);

      // Update project with generated code
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.generatedCode = workflowResult.output?.generatedCode?.code;
        project.specification = workflowResult.output?.specification;
        project.status = 'ready';
        project.updatedAt = new Date().toISOString();

        // Add generated file to project
        if (workflowResult.output?.generatedCode?.code) {
          project.files.push({
            id: uuidv4(),
            name: `${project.name}.tsx`,
            path: `src/components/${project.name}.tsx`,
            content: workflowResult.output.generatedCode.code,
            language: 'typescript',
            framework: project.framework,
            createdAt: new Date().toISOString(),
          });
        }
      }

    } catch (error) {
      logger.error(`❌ Async code generation failed for project: ${projectId}`, {
        error,
        component: 'ProjectController'
      } as any);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.userId;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        });
        return;
      }

      // Update project
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        id: projectId, // Don't allow ID change
        updatedAt: new Date().toISOString(),
      };

      logger.info(`✏️ Project updated: ${projectId}`, {
        component: 'ProjectController'
      } as any);

      res.status(200).json({
        success: true,
        data: { project: projects[projectIndex] },
      });
    } catch (error) {
      logger.error('❌ Error updating project', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        });
        return;
      }

      // Delete project
      projects.splice(projectIndex, 1);

      logger.info(`🗑️ Project deleted: ${projectId}`, {
        component: 'ProjectController'
      } as any);

      res.status(204).send();
    } catch (error) {
      logger.error('❌ Error deleting project', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }
}

export const projectController = new ProjectController();
