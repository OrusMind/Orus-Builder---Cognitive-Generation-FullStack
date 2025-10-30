/**
 * ============================================================================
 * ORUS BUILDER - MAIN API SERVICE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:57:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:57:00-03:00
 * COMPONENT_HASH: orus.frontend.service.api.20251009.SRV6G7H8
 * 
 * PURPOSE:
 * - Centralized Axios HTTP client for ORUS Builder API
 * - Request/response interceptors for auth and error handling
 * - Token management and automatic refresh
 * - Retry logic for failed requests
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: NetworkCommunicationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 92
 * - TRINITY_INTEGRATED: Voz (Communication)
 * ============================================================================
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import toast from 'react-hot-toast';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'orus_auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_AUTH_REFRESH_KEY || 'orus_refresh_token';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Token storage utilities
 */
export const tokenStorage = {
  /**
   * Get access token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set access token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove access token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Set refresh token in localStorage
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Remove refresh token from localStorage
   */
  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all auth tokens
   */
  clearTokens(): void {
    this.removeToken();
    this.removeRefreshToken();
  },
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Add authentication token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance tracking
    (config as any).metadata = { startTime: Date.now() };

    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Handle responses and errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = Date.now() - (response.config as any).metadata.startTime;

    if (import.meta.env.DEV) {
      console.log(`[API] Response: ${response.config.url} (${duration}ms)`);
    }

    // Add duration to response metadata
    if (response.data && typeof response.data === 'object') {
      response.data._requestDuration = duration;
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens
        tokenStorage.setToken(newToken);
        tokenStorage.setRefreshToken(newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenStorage.clearTokens();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    handleAPIError(error);

    return Promise.reject(error);
  }
);

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle API errors and show appropriate messages
 */
function handleAPIError(error: AxiosError): void {
  if (!error.response) {
    // Network error
    toast.error('Network error. Please check your connection.');
    console.error('[API] Network Error:', error);
    return;
  }

  const status = error.response.status;
  const data = error.response.data as any;

  switch (status) {
    case 400:
      toast.error(data?.error?.message || 'Bad request');
      break;

    case 401:
      // Handled by interceptor
      break;

    case 403:
      toast.error('Access denied');
      break;

    case 404:
      toast.error('Resource not found');
      break;

    case 409:
      toast.error(data?.error?.message || 'Conflict error');
      break;

    case 429:
      toast.error('Too many requests. Please wait.');
      break;

    case 500:
      toast.error('Server error. Please try again later.');
      break;

    case 503:
      toast.error('Service unavailable. Please try again later.');
      break;

    default:
      toast.error(data?.error?.message || 'An error occurred');
  }

  if (import.meta.env.DEV) {
    console.error('[API] Error:', {
      status,
      url: error.config?.url,
      data,
    });
  }
}

// ============================================================================
// API SERVICE INTERFACE
// ============================================================================

/**
 * Main API Service
 * Provides typed methods for all API operations
 */
export const apiService = {
  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  /**
   * Download file
   */
  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};

/**
 * Export Axios instance for advanced use cases
 */
export default apiClient;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: apiClient (Axios instance)
 * NAMED_EXPORTS: apiService, tokenStorage
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
