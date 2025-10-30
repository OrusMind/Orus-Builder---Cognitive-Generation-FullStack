/**
 * ============================================================================
 * ORUS BUILDER - GENERATION SERVICE ⭐
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:17:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:17:00-03:00
 * COMPONENT_HASH: orus.frontend.service.generation.20251009.GEN5A6B7
 * 
 * PURPOSE:
 * - API service for generation operations
 * - POST /api/v1/generation endpoint integration
 * - Real-time generation status updates
 * - Trinity AI integration layer
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: APIServiceAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 85
 * - TRINITY_INTEGRATED: Full (Alma, Cerebro, Voz)
 * ============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import { 
  GenerationRequest, 
  GenerationResponse, 
  GenerationStatusUpdate,
  ValidationResult,
  ProjectMetadata 
} from '@/types/generation.types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GenerationServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  enableWebSocket?: boolean;
}

export interface GenerationStartResponse {
  jobId: string;
  estimatedTime: number;
  message: string;
}

export interface GenerationProgressUpdate {
  jobId: string;
  stage: string;
  progress: number;
  message: string;
  timestamp: Date;
}

export interface GenerationCompleteData {
  jobId: string;
  projectId: string;
  files: GeneratedFile[];
  validation: ValidationResult;
  metadata: ProjectMetadata;
}

export interface GeneratedFile {
  path: string;
  name: string;
  content: string;
  language: string;
  size: number;
}

// ============================================================================
// GENERATION SERVICE
// ============================================================================

class GenerationService {
  private api: AxiosInstance;
  private socket: Socket | null = null;
  private config: GenerationServiceConfig;

  constructor(config: GenerationServiceConfig) {
    this.config = config;

    // Configure Axios instance
    this.api = axios.create({
      baseURL: config.baseURL || process.env['REACT_APP_API_URL'] || 'http://localhost:3001',
      timeout: config.timeout || 300000, // 5 minutes default
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
          // Handle unauthorized
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );

    // Initialize WebSocket if enabled
    if (config.enableWebSocket !== false) {
      this.initializeWebSocket();
    }
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  private initializeWebSocket(): void {
    const wsUrl = process.env['REACT_APP_WS_URL'] || 'http://localhost:3001';
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('auth_token'),
      },
    });

    this.socket.on('connect', () => {
      console.log('[GenerationService] WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('[GenerationService] WebSocket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('[GenerationService] WebSocket error:', error);
    });
  }

  /**
   * Start generation process
   */
  public async startGeneration(request: GenerationRequest): Promise<GenerationStartResponse> {
    try {
      const response = await this.api.post<GenerationStartResponse>(
        '/api/v1/generation',
        request
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get generation status
   */
  public async getGenerationStatus(jobId: string): Promise<GenerationStatusUpdate> {
    try {
      const response = await this.api.get<GenerationStatusUpdate>(
        `/api/v1/generation/${jobId}/status`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get generation result
   */
  public async getGenerationResult(jobId: string): Promise<GenerationCompleteData> {
    try {
      const response = await this.api.get<GenerationCompleteData>(
        `/api/v1/generation/${jobId}/result`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Cancel generation
   */
  public async cancelGeneration(jobId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.post<{ success: boolean; message: string }>(
        `/api/v1/generation/${jobId}/cancel`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Subscribe to generation updates via WebSocket
   */
  public subscribeToGenerationUpdates(
    jobId: string,
    onUpdate: (update: GenerationProgressUpdate) => void,
    onComplete: (data: GenerationCompleteData) => void,
    onError: (error: Error) => void
  ): () => void {
    if (!this.socket) {
      throw new Error('WebSocket not initialized');
    }

    // Join room for this generation job
    this.socket.emit('generation:subscribe', { jobId });

    // Listen for progress updates
    const progressHandler = (update: GenerationProgressUpdate) => {
      if (update.jobId === jobId) {
        onUpdate(update);
      }
    };

    // Listen for completion
    const completeHandler = (data: GenerationCompleteData) => {
      if (data.jobId === jobId) {
        onComplete(data);
        this.socket?.emit('generation:unsubscribe', { jobId });
      }
    };

    // Listen for errors
    const errorHandler = (error: { jobId: string; error: Error }) => {
      if (error.jobId === jobId) {
        onError(error.error);
        this.socket?.emit('generation:unsubscribe', { jobId });
      }
    };

    this.socket.on('generation:progress', progressHandler);
    this.socket.on('generation:complete', completeHandler);
    this.socket.on('generation:error', errorHandler);

    // Return cleanup function
    return () => {
      if (this.socket) {
        this.socket.off('generation:progress', progressHandler);
        this.socket.off('generation:complete', completeHandler);
        this.socket.off('generation:error', errorHandler);
        this.socket.emit('generation:unsubscribe', { jobId });
      }
    };
  }

  /**
   * Validate prompt before generation
   */
  public async validatePrompt(prompt: string): Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
    suggestions?: string[];
    quality: number;
  }> {
    try {
      const response = await this.api.post('/api/v1/generation/validate-prompt', {
        prompt,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get generation history
   */
  public async getGenerationHistory(limit: number = 20): Promise<GenerationResponse[]> {
    try {
      const response = await this.api.get<GenerationResponse[]>(
        `/api/v1/generation/history`,
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
   * Trinity AI health check
   */
  public async checkTrinityHealth(): Promise<{
    alma: { status: 'online' | 'offline'; latency: number };
    cerebro: { status: 'online' | 'offline'; latency: number };
    voz: { status: 'online' | 'offline'; latency: number };
  }> {
    try {
      const response = await this.api.get('/api/v1/trinity/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Download generated project
   */
  public async downloadProject(projectId: string, format: 'zip' | 'tar'): Promise<Blob> {
    try {
      const response = await this.api.get(
        `/api/v1/generation/${projectId}/download`,
        {
          params: { format },
          responseType: 'blob',
        }
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
      // Server responded with error
      const message = (error.response.data as any)?.message || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Error setting up request
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const generationService = new GenerationService({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  enableWebSocket: true,
});

export default generationService;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: generationService (Singleton instance)
 * NAMED_EXPORTS: GenerationService, GenerationServiceConfig
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
