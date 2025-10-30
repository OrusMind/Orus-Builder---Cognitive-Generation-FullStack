/**
 * ============================================================================
 * ORUS BUILDER - USE AUTH HOOK
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T10:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T10:00:00-03:00
 * COMPONENT_HASH: orus.frontend.hook.auth.20251010.AUT0A1B2
 * 
 * PURPOSE:
 * - Authentication hook
 * - Login/logout/register
 * - Token management
 * - User session handling
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: AuthenticationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 85
 * - TRINITY_INTEGRATED: None (Security)
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ============================================================================
// USE AUTH HOOK
// ============================================================================

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

 const apiUrl = process.env['REACT_APP_API_URL'] || 'http://localhost:3001';

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          
          // Validate token with backend
          try {
            await axios.get(`${apiUrl}/api/v1/auth/validate`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Token invalid, clear auth
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    initializeAuth();
  }, [apiUrl]);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth/login`, credentials);
      
      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful');
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Login failed';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: new Error(errorMessage),
      }));

      toast.error(errorMessage);
      throw error;
    }
  }, [apiUrl]);

  /**
   * Register
   */
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth/register`, credentials);
      
      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Registration successful');
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Registration failed';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: new Error(errorMessage),
      }));

      toast.error(errorMessage);
      throw error;
    }
  }, [apiUrl]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await axios.post(`${apiUrl}/api/v1/auth/logout`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Logged out successfully');
    }
  }, [apiUrl]);

  /**
   * Update user
   */
  const updateUser = useCallback(async (userData: Partial<User>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem('auth_token');

      const response = await axios.put(
        `${apiUrl}/api/v1/auth/user`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Update failed';
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: new Error(errorMessage),
      }));

      toast.error(errorMessage);
      throw error;
    }
  }, [apiUrl]);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await axios.post(
        `${apiUrl}/api/v1/auth/refresh`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { token: newToken } = response.data;

      // Update token
      localStorage.setItem('auth_token', newToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
    }
  }, [apiUrl, logout]);

  /**
   * Auto-refresh token every 15 minutes
   */
 useEffect(() => {
  if (state.isAuthenticated) {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }
  return undefined; // ✅ ADICIONAR ESTA LINHA
}, [state.isAuthenticated, refreshToken]);

  const actions: AuthActions = {
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return [state, actions] as const;
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useAuth (Authentication hook)
 * NAMED_EXPORTS: User, LoginCredentials, RegisterCredentials, AuthState, AuthActions
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
