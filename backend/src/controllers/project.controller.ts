/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗂️ ORUS BUILDER - PROJECT CONTROLLER WITH ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../system/logging-system';
import { v4 as uuidv4 } from 'uuid';

// ✅ Import Orchestrator
import { orchestrationEngine } from '../engines/orchestrator-engine';
import { WorkflowType } from '../engines/orchestrator-engine';

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

const projects: Project[] = [];

class ProjectController {
  async listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || 'anonymous';

      logger.info(`📋 Listing projects for user: ${userId}`, {
        component: 'ProjectController'
      } as any);

      res.status(200).json({
        success: true,
        data: {
          projects: projects,
          total: projects.length,
        },
      });
    } catch (error) {
      logger.error('❌ Error listing projects', { error, component: 'ProjectController' } as any);
      next(error);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;

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

  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || 'anonymous';
      const { name, description, framework, prompt, language } = req.body;

      if (!name || !prompt) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Name and prompt are required' },
        });
        return;
      }

      logger.info(`✨ Creating project: ${name}`, {
        component: 'ProjectController',
        prompt: prompt.substring(0, 100),
        framework,
        language
      } as any);

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

      res.status(201).json({
        success: true,
        data: {
          project: newProject,
          message: 'Project created, generating code...',
        },
      });

      // ✅ Generate code asynchronously
      this.generateCodeAsync(projectId, {
        prompt,
        framework: framework || 'react',
        language: language || 'pt-BR',
        userId,
      }).catch(error => {
        logger.error('❌ Async code generation failed', {
          error,
          projectId,
          component: 'ProjectController'
        } as any);
        
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

  private async generateCodeAsync(
    projectId: string,
    params: { prompt: string; framework: string; language: string; userId: string; }
  ): Promise<void> {
    try {
      logger.info(`🔄 Starting code generation for: ${projectId}`, {
        component: 'ProjectController'
      } as any);

      // ✅ CALL ORCHESTRATOR (formato CORRETO baseado na interface real)
      const workflowResult = await orchestrationEngine.executeWorkflow({
        // ✅ Campos obrigatórios de BaseEntity
        id: uuidv4(),
        version: 1,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // ✅ Campos de WorkflowExecutionRequest
        requestId: uuidv4(),
        userId: params.userId,
        workflowType: WorkflowType.PROMPT_TO_DEPLOY,
        
        // ✅ Input com os dados necessários
        input: {
          prompt: params.prompt,
          projectId: projectId,
          options: {
            framework: params.framework,
            language: params.language,
            complexity: 'standard',
            includeTests: false,
            style: 'modern'
          }
        },
        
        // ✅ Options (OPCIONAL, não config)
        parallel: false,
        rollbackOnError: false,
        continueOnError: true
      });

      logger.info(`✅ Code generated for: ${projectId}`, {
        component: 'ProjectController',
        success: workflowResult.success
      } as any);

      // ✅ Processar resultado (workflowResult.data contém WorkflowExecutionResult)
      const project = projects.find(p => p.id === projectId);
      if (project && workflowResult.success && workflowResult.data) {
        // ✅ Extrair código gerado do output
        const executionResult = workflowResult.data;
const generatedFiles = (executionResult.output?.['files'] as any[]) || [];        
        project.status = 'ready';
        project.updatedAt = new Date().toISOString();

        // ✅ Adicionar arquivos gerados
        if (generatedFiles.length > 0) {
          generatedFiles.forEach((file: any) => {
            project.files.push({
              id: uuidv4(),
              name: file.name || `${project.name.replace(/\s/g, '')}.tsx`,
              path: file.path || `src/components/${project.name.replace(/\s/g, '')}.tsx`,
              content: file.content,
              language: 'typescript',
              framework: project.framework,
              createdAt: new Date().toISOString(),
            });
          });
          
          // ✅ Salvar código do primeiro arquivo como generatedCode
          project.generatedCode = generatedFiles[0].content;
        }

        logger.info(`✅ Project ready: ${projectId}`, {
          component: 'ProjectController',
          filesCount: project.files.length,
          stepsCompleted: executionResult.stepsCompleted
        } as any);
        
      } else {
        if (project) {
          project.status = 'error';
          project.updatedAt = new Date().toISOString();
        }
        
        logger.error(`❌ Workflow failed for: ${projectId}`, {
          component: 'ProjectController',
          error: workflowResult.error
        } as any);
      }

    } catch (error) {
      logger.error(`❌ Code generation failed for: ${projectId}`, {
        error,
        component: 'ProjectController'
      } as any);
      
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.status = 'error';
        project.updatedAt = new Date().toISOString();
      }
      
      throw error;
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const updates = req.body;

      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        });
        return;
      }

      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        id: projectId,
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

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;

      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Project not found' },
        });
        return;
      }

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
