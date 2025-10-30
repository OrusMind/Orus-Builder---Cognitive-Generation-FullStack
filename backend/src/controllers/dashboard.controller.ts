/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 DASHBOARD CONTROLLER - ORUS BUILDER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response } from 'express';
import { Project, IProject } from '../models/Project';
import { logger } from '../system/logging-system';

export class DashboardController {
  
  // GET /api/dashboard/projects - Lista todos os projetos do usuário
  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId || 'demo-user';
      const { status, limit = 20, skip = 0 } = req.query;
      
      const query: any = { userId, isDeleted: false };
      if (status) query.status = status;
      
      const projects = await Project
        .find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip))
        .select('-files.content')
        .lean();
      
      const total = await Project.countDocuments(query);
      
      res.json({
        success: true,
        projects,
        pagination: {
          total,
          limit: Number(limit),
          skip: Number(skip),
          hasMore: total > Number(skip) + Number(limit)
        }
      });
      
      logger.info('Projects listed', { userId, total } as any);
    } catch (error: any) {
      logger.error('Failed to list projects', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // GET /api/dashboard/projects/:id - Obtém projeto específico
  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 'demo-user';
      
      const project = await Project.findOne({
        projectId: id,
        userId,
        isDeleted: false
      }).lean();
      
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      
      res.json({ success: true, project });
      
      logger.info('Project retrieved', { projectId: id, userId } as any);
    } catch (error: any) {
      logger.error('Failed to get project', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // POST /api/dashboard/projects - Cria novo projeto
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        framework,
        language,
        generationData,
        files,
        metadata
      } = req.body;
      
      const userId = req.body.userId || 'demo-user';
      
      const project = new Project({
        projectId: 'proj-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        name,
        description,
        userId,
        framework: framework || 'react',
        language: language || 'typescript',
        generationData,
        files: files || [],
        metadata: metadata || {},
        status: 'generated',
        version: 1,
        isDeleted: false
      });
      
      await project.save();
      
      res.json({
        success: true,
        projectId: project.projectId,
        project: project.toObject()
      });
      
      logger.info('Project created', { projectId: project.projectId, userId, name } as any);
    } catch (error: any) {
      logger.error('Failed to create project', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // PUT /api/dashboard/projects/:id - Atualiza projeto
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 'demo-user';
      const updates = req.body;
      
      delete updates.userId;
      delete updates.projectId;
      
      const project = await Project.findOneAndUpdate(
        { projectId: id, userId, isDeleted: false },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      
      res.json({ success: true, project });
      
      logger.info('Project updated', { projectId: id, userId } as any);
    } catch (error: any) {
      logger.error('Failed to update project', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // DELETE /api/dashboard/projects/:id - Deleta projeto (soft delete)
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 'demo-user';
      
      const project = await Project.findOneAndUpdate(
        { projectId: id, userId, isDeleted: false },
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      );
      
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      
      res.json({ success: true, message: 'Project deleted' });
      
      logger.info('Project deleted', { projectId: id, userId } as any);
    } catch (error: any) {
      logger.error('Failed to delete project', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // GET /api/dashboard/stats - Estatísticas do usuário
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId || 'demo-user';
      
      const [totalProjects, draftProjects, generatedProjects, deployedProjects] = await Promise.all([
        Project.countDocuments({ userId, isDeleted: false }),
        Project.countDocuments({ userId, status: 'draft', isDeleted: false }),
        Project.countDocuments({ userId, status: 'generated', isDeleted: false }),
        Project.countDocuments({ userId, status: 'deployed', isDeleted: false })
      ]);
      
      const recentProjects = await Project
        .find({ userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('projectId name status createdAt')
        .lean();
      
      res.json({
        success: true,
        stats: {
          totalProjects,
          byStatus: {
            draft: draftProjects,
            generated: generatedProjects,
            deployed: deployedProjects
          },
          recentProjects
        }
      });
      
      logger.info('Stats retrieved', { userId, totalProjects } as any);
    } catch (error: any) {
      logger.error('Failed to get stats', { error: error.message } as any);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const dashboardController = new DashboardController();
