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
        .select('-files.content') // Não enviar content completo na listagem
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
      
      logger.info('Projects listed', { component: 'DashboardController' });
    } catch (error: any) {
      logger.error('Failed to list projects', { component: 'DashboardController' });
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
      
      logger.info('Project retrieved', { component: 'DashboardController' });
    } catch (error: any) {
      logger.error('Failed to get project', { component: 'DashboardController' });
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
      
      logger.info('Project created', { component: 'DashboardController' });
    } catch (error: any) {
      logger.error('Failed to create project', { component: 'DashboardController' });
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
      
      logger.info('Project updated', { component: 'DashboardController' });
    } catch (error: any) {
      logger.error('Failed to update project', { component: 'DashboardController' });
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
      
      logger.info('Project deleted', { component: 'DashboardController' });
    } catch (error: any) {
      logger.error('Failed to delete project', { component: 'DashboardController' });
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // GET /api/dashboard/stats - Estatísticas do usuário
async getStats(req: Request, res: Response): Promise<void> {
  try {
    console.log('📊 Dashboard: Getting stats...');
    
    // ✅ MOCK de estatísticas (sem banco de dados)
    const stats = {
      totalProjects: projects.length || 0,
      activeGenerations: 0,
      totalGenerations: projects.length || 0,
      successRate: projects.length > 0 ? 95 : 0,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Stats retrieved successfully'
    });
    
  } catch (error: any) {
    console.error('❌ Dashboard: Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      message: 'Failed to retrieve stats'
    });
  }
}

export const dashboardController = new DashboardController();
