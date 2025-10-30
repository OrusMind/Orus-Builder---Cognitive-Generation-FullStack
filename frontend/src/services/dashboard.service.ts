import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/dashboard';

export interface Project {
  id: string;
  name: string;
  description: string;
  files: Array<{
    name: string;
    path: string;
    content: string;
    language: string;
  }>;
  framework: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalFiles: number;
  totalLines: number;
  lastGenerated: string;
}

class DashboardService {
  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    const response = await axios.get(`${API_BASE}/projects`);
    return response.data.data;
  }

  /**
   * Get single project
   */
  async getProject(id: string): Promise<Project> {
    const response = await axios.get(`${API_BASE}/projects/${id}`);
    return response.data.data;
  }

  /**
   * Create new project
   */
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await axios.post(`${API_BASE}/projects`, project);
    return response.data.data;
  }

  /**
   * Update project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await axios.put(`${API_BASE}/projects/${id}`, updates);
    return response.data.data;
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/projects/${id}`);
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
