// backend/src/controllers/dashboard.controller.ts

import { Request, Response } from 'express';

// Mock de projetos (substituir por banco depois)
const projects: any[] = [];

export class DashboardController {
  
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      console.log('📊 Dashboard: Getting stats...');
      
      const stats = {
        totalProjects: projects.length || 0,
        activeGenerations: 0,
        totalGenerations: projects.length || 0,
        successRate: 95,
        timestamp: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        data: stats
      });
      
    } catch (error: any) {
      console.error('❌ Error getting stats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      console.log('📂 Dashboard: Getting projects...');
      
      res.status(200).json({
        success: true,
        data: projects,
        total: projects.length
      });
      
    } catch (error: any) {
      console.error('❌ Error getting projects:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new DashboardController();
