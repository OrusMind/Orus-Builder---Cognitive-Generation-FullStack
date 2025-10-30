/**
 * ============================================================================
 * ORUS BUILDER - COLLABORATION SERVICE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:56:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:56:00-03:00
 * COMPONENT_HASH: orus.frontend.service.collaboration.20251010.CLS6W7X8
 * 
 * PURPOSE:
 * - API service for collaboration operations
 * - /api/v1/collaboration endpoints
 * - Real-time messaging and presence
 * - Comment and activity management
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CollaborationAPIAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 78
 * - TRINITY_INTEGRATED: Full (Real-time sync)
 * ============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CollaborationServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface CreateCommentRequest {
  threadId?: string;
  fileId: string;
  lineNumber?: number;
  content: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  threadId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  editedAt?: Date;
  parentId?: string;
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface ThreadResponse {
  id: string;
  fileId: string;
  lineNumber?: number;
  comments: CommentResponse[];
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityResponse {
  id: string;
  type: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetName?: string;
  targetType?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface PresenceResponse {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentFile?: string;
}

// ============================================================================
// COLLABORATION SERVICE
// ============================================================================

class CollaborationService {
  private api: AxiosInstance;
  private config: CollaborationServiceConfig;

  constructor(config: CollaborationServiceConfig) {
    this.config = config;

    this.api = axios.create({
      baseURL: config.baseURL || process.env['REACT_APP_API_URL'] || 'http://localhost:3001',
      timeout: config.timeout || 30000,
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

  // ============================================================================
  // COMMENTS
  // ============================================================================

  /**
   * Create comment
   */
  public async createComment(request: CreateCommentRequest): Promise<CommentResponse> {
    try {
      const response = await this.api.post<CommentResponse>(
        '/api/v1/collaboration/comments',
        request
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get comments for file
   */
  public async getComments(fileId: string): Promise<CommentResponse[]> {
    try {
      const response = await this.api.get<CommentResponse[]>(
        `/api/v1/collaboration/comments`,
        { params: { fileId } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update comment
   */
  public async updateComment(
    commentId: string,
    request: UpdateCommentRequest
  ): Promise<CommentResponse> {
    try {
      const response = await this.api.put<CommentResponse>(
        `/api/v1/collaboration/comments/${commentId}`,
        request
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Delete comment
   */
  public async deleteComment(commentId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.api.delete<{ success: boolean }>(
        `/api/v1/collaboration/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Add reaction to comment
   */
  public async addReaction(commentId: string, emoji: string): Promise<CommentResponse> {
    try {
      const response = await this.api.post<CommentResponse>(
        `/api/v1/collaboration/comments/${commentId}/reactions`,
        { emoji }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // ============================================================================
  // THREADS
  // ============================================================================

  /**
   * Get threads for file
   */
  public async getThreads(fileId: string): Promise<ThreadResponse[]> {
    try {
      const response = await this.api.get<ThreadResponse[]>(
        `/api/v1/collaboration/threads`,
        { params: { fileId } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Resolve thread
   */
  public async resolveThread(threadId: string): Promise<ThreadResponse> {
    try {
      const response = await this.api.post<ThreadResponse>(
        `/api/v1/collaboration/threads/${threadId}/resolve`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Unresolve thread
   */
  public async unresolveThread(threadId: string): Promise<ThreadResponse> {
    try {
      const response = await this.api.post<ThreadResponse>(
        `/api/v1/collaboration/threads/${threadId}/unresolve`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // ============================================================================
  // ACTIVITY
  // ============================================================================

  /**
   * Get activity feed
   */
  public async getActivity(
    projectId: string,
    limit: number = 50
  ): Promise<ActivityResponse[]> {
    try {
      const response = await this.api.get<ActivityResponse[]>(
        `/api/v1/collaboration/activity`,
        { params: { projectId, limit } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Log activity
   */
  public async logActivity(
    projectId: string,
    type: string,
    action: string,
    metadata?: Record<string, any>
  ): Promise<ActivityResponse> {
    try {
      const response = await this.api.post<ActivityResponse>(
        `/api/v1/collaboration/activity`,
        { projectId, type, action, metadata }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // ============================================================================
  // PRESENCE
  // ============================================================================

  /**
   * Get online users
   */
  public async getOnlineUsers(projectId: string): Promise<PresenceResponse[]> {
    try {
      const response = await this.api.get<PresenceResponse[]>(
        `/api/v1/collaboration/presence`,
        { params: { projectId } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update user presence
   */
  public async updatePresence(
    projectId: string,
    status: 'online' | 'away' | 'busy',
    currentFile?: string
  ): Promise<PresenceResponse> {
    try {
      const response = await this.api.post<PresenceResponse>(
        `/api/v1/collaboration/presence`,
        { projectId, status, currentFile }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

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

const collaborationService = new CollaborationService({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export default collaborationService;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: collaborationService (Singleton instance)
 * NAMED_EXPORTS: CollaborationService, CollaborationServiceConfig
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
