/**
 * ============================================================================
 * ORUS BUILDER - PROJECT SERVICE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:27:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:27:00-03:00
 * COMPONENT_HASH: orus.frontend.service.project.20251009.PRJ0F1G2
 * 
 * PURPOSE:
 * - API service for project CRUD operations
 * - GET, POST, PUT, DELETE /api/v1/projects endpoints
 * - Project listing with filters and pagination
 * - File management within projects
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CRUDServiceAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: None (API only)
 * ============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types/api.types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ProjectServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'archived' | 'draft';
  framework?: 'react' | 'vue' | 'angular' | 'nextjs';
  sortBy?: 'name' | 'updatedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  path: string;
  name: string;
  content: string;
  language: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PROJECT SERVICE
// ============================================================================

class ProjectService {
  private api: AxiosInstance;
  private config: ProjectServiceConfig;

  constructor(config: ProjectServiceConfig) {
    this.config = config;

    // Configure Axios instance
    this.api = axios.create({
      baseURL: config.baseURL || process.env['REACT_APP_API_URL'] || 'http://localhost:3001',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Get all projects with optional filters
   */
  public async getProjects(params?: ProjectListParams): Promise<ProjectListResponse> {
    try {
      const response = await this.api.get<ProjectListResponse>('/api/v1/projects', {
        params,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get single project by ID
   */
  public async getProject(projectId: string): Promise<Project> {
    try {
      const response = await this.api.get<Project>(`/api/v1/projects/${projectId}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Create new project
   */
  public async createProject(data: CreateProjectRequest): Promise<Project> {
    try {
      const response = await this.api.post<Project>('/api/v1/projects', data);

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update existing project
   */
  public async updateProject(
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<Project> {
    try {
      const response = await this.api.put<Project>(
        `/api/v1/projects/${projectId}`,
        data
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Delete project
   */
  public async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.delete<{ success: boolean; message: string }>(
        `/api/v1/projects/${projectId}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Duplicate project
   */
  public async duplicateProject(projectId: string, newName?: string): Promise<Project> {
    try {
      const response = await this.api.post<Project>(
        `/api/v1/projects/${projectId}/duplicate`,
        { name: newName }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get project files
   */
  public async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    try {
      const response = await this.api.get<ProjectFile[]>(
        `/api/v1/projects/${projectId}/files`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get single file content
   */
  public async getFile(projectId: string, fileId: string): Promise<ProjectFile> {
    try {
      const response = await this.api.get<ProjectFile>(
        `/api/v1/projects/${projectId}/files/${fileId}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update file content
   */
  public async updateFile(
    projectId: string,
    fileId: string,
    content: string
  ): Promise<ProjectFile> {
    try {
      const response = await this.api.put<ProjectFile>(
        `/api/v1/projects/${projectId}/files/${fileId}`,
        { content }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Archive project
   */
  public async archiveProject(projectId: string): Promise<Project> {
    try {
      const response = await this.api.post<Project>(
        `/api/v1/projects/${projectId}/archive`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Restore archived project
   */
  public async restoreProject(projectId: string): Promise<Project> {
    try {
      const response = await this.api.post<Project>(
        `/api/v1/projects/${projectId}/restore`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Export project
   */
  public async exportProject(projectId: string, format: 'zip' | 'tar'): Promise<Blob> {
    try {
      const response = await this.api.get(`/api/v1/projects/${projectId}/export`, {
        params: { format },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get project statistics
   */
  public async getProjectStats(projectId: string): Promise<{
    totalFiles: number;
    totalLines: number;
    languages: Record<string, number>;
    lastModified: Date;
    size: number;
  }> {
    try {
      const response = await this.api.get(`/api/v1/projects/${projectId}/stats`);

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Error handler
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      const message = (error.response.data as any)?.message || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const projectService = new ProjectService({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});
// ══════════════════════════════════════════════════════════════════════
// 🎯 DASHBOARD METHODS - BACKEND INTEGRATION
// ══════════════════════════════════════════════════════════════════════

/**
 * Get all projects from dashboard
 */
export async function getDashboardProjects() {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/projects');
    const data = await response.json();
    return data.data; // Array of projects
  } catch (error) {
    console.error('Error fetching dashboard projects:', error);
    throw error;
  }
}

/**
 * Get single project by ID
 */
export async function getDashboardProject(id: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/dashboard/projects/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Create new project in dashboard
 */
export async function createDashboardProject(project: {
  name: string;
  description: string;
  files: any[];
  framework: string;
  prompt: string;
}) {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Delete project from dashboard
 */
export async function deleteDashboardProject(id: string) {
  try {
    await fetch(`http://localhost:5000/api/dashboard/projects/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/stats');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

export default projectService;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: projectService (Singleton instance)
 * NAMED_EXPORTS: ProjectService, ProjectServiceConfig
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
