/**
 * ============================================================================
 * ORUS BUILDER - BLUEPRINT SERVICE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:00:00-03:00
 * COMPONENT_HASH: orus.frontend.service.blueprint.20251010.BLS9O0P1
 * 
 * PURPOSE:
 * - API service for blueprint operations
 * - POST /api/v1/blueprints endpoint
 * - Blueprint parsing and validation
 * - Project generation from blueprint
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: BlueprintAPIAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 82
 * - TRINITY_INTEGRATED: Full (Blueprint Intelligence)
 * ============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlueprintServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface UploadBlueprintRequest {
  content: string;
  fileName: string;
  fileType: 'docx' | 'md' | 'txt' | 'pdf';
}

export interface ParseBlueprintResponse {
  blueprintId: string;
  metadata: BlueprintMetadata;
  structure: ProjectStructure;
  components: ComponentDefinition[];
  patterns: DetectedPattern[];
  isOrusBlueprint: boolean;
  confidence: number;
}

export interface BlueprintMetadata {
  title: string;
  hash: string;
  version: string;
  framework?: string;
  language?: string;
  author?: string;
  createdDate?: Date;
}

export interface ProjectStructure {
  folders: TreeNode[];
  totalFiles: number;
  totalFolders: number;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

export interface ComponentDefinition {
  name: string;
  type: string;
  purpose: string;
  hash: string;
  dependencies: string[];
}

export interface DetectedPattern {
  type: 'ORUS' | 'CIG' | 'COGNITIVE' | 'TRINITY';
  confidence: number;
  location: string;
  data: Record<string, unknown>;
}

export interface GenerateFromBlueprintRequest {
  blueprintId: string;
  options?: {
    includeTests?: boolean;
    includeDocs?: boolean;
    framework?: string;
    language?: string;
  };
}

export interface GenerateFromBlueprintResponse {
  projectId: string;
  jobId: string;
  estimatedTime: number;
  message: string;
}

// ============================================================================
// BLUEPRINT SERVICE
// ============================================================================

class BlueprintService {
  private api: AxiosInstance;
  private config: BlueprintServiceConfig;

  constructor(config: BlueprintServiceConfig) {
    this.config = config;

    this.api = axios.create({
      baseURL: config.baseURL || process.env['REACT_APP_API_URL'] || 'http://localhost:3001',
      timeout: config.timeout || 60000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor
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

    // Response interceptor
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
   * Upload and parse blueprint
   */
  public async uploadBlueprint(request: UploadBlueprintRequest): Promise<ParseBlueprintResponse> {
    try {
      const response = await this.api.post<ParseBlueprintResponse>(
        '/api/v1/blueprints',
        request
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get blueprint by ID
   */
  public async getBlueprint(blueprintId: string): Promise<ParseBlueprintResponse> {
    try {
      const response = await this.api.get<ParseBlueprintResponse>(
        `/api/v1/blueprints/${blueprintId}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generate project from blueprint
   */
  public async generateFromBlueprint(
    request: GenerateFromBlueprintRequest
  ): Promise<GenerateFromBlueprintResponse> {
    try {
      const response = await this.api.post<GenerateFromBlueprintResponse>(
        `/api/v1/blueprints/${request.blueprintId}/generate`,
        request.options
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Validate blueprint
   */
  public async validateBlueprint(content: string): Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
    isOrus: boolean;
    confidence: number;
  }> {
    try {
      const response = await this.api.post('/api/v1/blueprints/validate', {
        content,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get blueprint history
   */
  public async getBlueprintHistory(limit: number = 20): Promise<ParseBlueprintResponse[]> {
    try {
      const response = await this.api.get<ParseBlueprintResponse[]>(
        '/api/v1/blueprints/history',
        {
          params: { limit },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Delete blueprint
   */
  public async deleteBlueprint(blueprintId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.delete<{ success: boolean; message: string }>(
        `/api/v1/blueprints/${blueprintId}`
      );

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

const blueprintService = new BlueprintService({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export default blueprintService;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: blueprintService (Singleton instance)
 * NAMED_EXPORTS: BlueprintService, BlueprintServiceConfig
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
