/**
 * ============================================================================
 * ORUS BUILDER - GENERATION SERVICE ⭐ (UPDATED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator) + Minerva Omega
 * LAST_MODIFIED: 2025-10-12T10:07:00-03:00
 * 
 * CHANGES:
 * - Updated baseURL to localhost:5000
 * - Fixed endpoints to match backend routes
 * - Added direct Groq generation method
 * - Simplified for MVP (WebSocket optional for now)
 * ============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GenerateCodeRequest {
  prompt: string;
  mode?: string;
  target?: string;
  language?: string;
  framework?: string;
}

export interface GeneratedFile {
  path: string;
  fileName: string;
  content: string;
  language: string;
  type: string;
  lines: number;
}

export interface GenerateCodeResponse {
  success: boolean;
  engine: string;
  generationId: string;
  files: GeneratedFile[];
  totalFiles: number;
  totalLines: number;
  tokensUsed: number;
  generationTime: number;
  confidence?: number;
  qualityScore?: number;
  cigScore?: number;
  validated?: boolean;
  timestamp: string;
}

export interface GenerationServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  enableWebSocket?: boolean;
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

    // ✅ FIXED: Configure Axios with correct port
    this.api = axios.create({
      baseURL: config.baseURL || 'http://localhost:5000',
      timeout: config.timeout || 300000, // 5 minutes
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

    // Initialize WebSocket if enabled (optional for MVP)
    if (config.enableWebSocket) {
      this.initializeWebSocket();
    }
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  private initializeWebSocket(): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
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

  // ============================================================================
  // ✅ NEW: DIRECT GROQ GENERATION (WORKING NOW)
  // ============================================================================

  /**
   * Generate code using direct Groq endpoint (TESTED & WORKING)
   */
  public async generateCodeDirect(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    try {
      const response = await this.api.post<GenerateCodeResponse>(
        '/api/generate/direct',
        request
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Generate code using full engine with specification
   */
  public async generateCodeWithEngine(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    try {
      const response = await this.api.post<GenerateCodeResponse>(
        '/api/generate',
        request
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // ============================================================================
  // LEGACY METHODS (Keep for future use)
  // ============================================================================

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
      const response = await this.api.post('/api/generation/validate-prompt', {
        prompt,
      });

      return response.data;
    } catch (error) {
      // Return basic validation for MVP
      return {
        valid: prompt.trim().length > 0,
        quality: prompt.trim().length > 10 ? 80 : 50,
        warnings: prompt.trim().length < 10 ? ['Prompt is too short'] : [],
      };
    }
  }

  /**
   * Check backend health
   */
  public async checkHealth(): Promise<any> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Download generated project as ZIP
   */
  public async downloadProject(files: GeneratedFile[], projectName: string = 'project'): Promise<void> {
    try {
      // For MVP: Create client-side ZIP
      const { saveAs } = await import('file-saver');
      const JSZip = (await import('jszip')).default;
      
      const zip = new JSZip();

      // Add all files to ZIP
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate ZIP and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${projectName}.zip`);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download project');
    }
  }

  /**
   * Error handler
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      const message = (error.response.data as any)?.error || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
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
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  enableWebSocket: false, // ✅ Disabled for MVP (backend doesn't have WS yet)
});

export default generationService;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: generationService (Singleton instance)
 * NAMED_EXPORTS: GenerationService, GenerationServiceConfig, 
 *                GenerateCodeRequest, GenerateCodeResponse, GeneratedFile
 * DEFAULT_AVAILABLE: true
 * ============================================================================
 */
