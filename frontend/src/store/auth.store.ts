/**
 * ============================================================================
 * ORUS BUILDER - AUTH STORE (ZUSTAND)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:57:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:57:00-03:00
 * COMPONENT_HASH: orus.frontend.store.auth.20251009.STR7H8I9
 * 
 * PURPOSE:
 * - Global authentication state management with Zustand
 * - User session management and persistence
 * - Login/logout/register actions
 * - Token refresh and expiration handling
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: AuthenticationStateAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 90
 * - TRINITY_INTEGRATED: Cerebro (State Logic)
 * ============================================================================
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '@/types/api.types';
import { tokenStorage } from '@services/api.service';

// ============================================================================
// AUTH STATE INTERFACE
// ============================================================================

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null; // Unix timestamp

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  checkSession: () => boolean;
}

// ============================================================================
// AUTH STORE
// ============================================================================

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // ============================================================================
        // INITIAL STATE
        // ============================================================================

        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiry: null,

        // ============================================================================
        // LOGIN ACTION
        // ============================================================================

        login: async (credentials: LoginRequest) => {
          set({ isLoading: true, error: null });

          try {
            // Import dynamically to avoid circular dependency
            const { apiService } = await import('@services/api.service');

            const response = await apiService.post<{ data: LoginResponse }>(
              '/auth/login',
              credentials
            );

            const { user, token, refreshToken, expiresIn } = response.data;

            // Store tokens
            tokenStorage.setToken(token);
            tokenStorage.setRefreshToken(refreshToken);

            // Calculate session expiry
            const sessionExpiry = Date.now() + expiresIn * 1000;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              sessionExpiry,
            });

            // Schedule session check
            scheduleSessionCheck(expiresIn);
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.error?.message || 'Login failed',
            });
            throw error;
          }
        },

        // ============================================================================
        // REGISTER ACTION
        // ============================================================================

        register: async (data: RegisterRequest) => {
          set({ isLoading: true, error: null });

          try {
            const { apiService } = await import('@services/api.service');

            const response = await apiService.post<{ data: LoginResponse }>(
              '/auth/register',
              data
            );

            const { user, token, refreshToken, expiresIn } = response.data;

            // Store tokens
            tokenStorage.setToken(token);
            tokenStorage.setRefreshToken(refreshToken);

            // Calculate session expiry
            const sessionExpiry = Date.now() + expiresIn * 1000;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              sessionExpiry,
            });

            // Schedule session check
            scheduleSessionCheck(expiresIn);
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.response?.data?.error?.message || 'Registration failed',
            });
            throw error;
          }
        },

        // ============================================================================
        // LOGOUT ACTION
        // ============================================================================

        logout: () => {
          // Clear tokens
          tokenStorage.clearTokens();

          // Reset state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            sessionExpiry: null,
          });

          // Clear session check timeout
          if (sessionCheckTimeout) {
            clearTimeout(sessionCheckTimeout);
            sessionCheckTimeout = null;
          }
        },

        // ============================================================================
        // REFRESH SESSION ACTION
        // ============================================================================

        refreshSession: async () => {
          try {
            const { apiService } = await import('@services/api.service');
            const refreshToken = tokenStorage.getRefreshToken();

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await apiService.post<{ data: LoginResponse }>(
              '/auth/refresh',
              { refreshToken }
            );

            const { user, token, refreshToken: newRefreshToken, expiresIn } = response.data;

            // Update tokens
            tokenStorage.setToken(token);
            tokenStorage.setRefreshToken(newRefreshToken);

            // Calculate new session expiry
            const sessionExpiry = Date.now() + expiresIn * 1000;

            set({
              user,
              isAuthenticated: true,
              sessionExpiry,
            });

            // Schedule session check
            scheduleSessionCheck(expiresIn);
          } catch (error) {
            // Refresh failed - logout
            get().logout();
            throw error;
          }
        },

        // ============================================================================
        // UPDATE USER ACTION
        // ============================================================================

        updateUser: (userData: Partial<User>) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        },

        // ============================================================================
        // CLEAR ERROR ACTION
        // ============================================================================

        clearError: () => {
          set({ error: null });
        },

        // ============================================================================
        // CHECK SESSION ACTION
        // ============================================================================

        checkSession: () => {
          const state = get();

          if (!state.isAuthenticated || !state.sessionExpiry) {
            return false;
          }

          const isExpired = Date.now() > state.sessionExpiry;

          if (isExpired) {
            get().logout();
            return false;
          }

          return true;
        },
      }),
      {
        name: 'orus-auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sessionExpiry: state.sessionExpiry,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// ============================================================================
// SESSION CHECK UTILITIES
// ============================================================================

let sessionCheckTimeout: NodeJS.Timeout | null = null;

/**
 * Schedule session expiry check
 * Automatically refresh token before expiration
 */
function scheduleSessionCheck(expiresIn: number): void {
  // Clear existing timeout
  if (sessionCheckTimeout) {
    clearTimeout(sessionCheckTimeout);
  }

  // Refresh token 5 minutes before expiration
  const refreshTime = (expiresIn - 300) * 1000; // 5 minutes before expiry

  sessionCheckTimeout = setTimeout(async () => {
    try {
      await useAuthStore.getState().refreshSession();
    } catch (error) {
      console.error('[Auth] Auto-refresh failed:', error);
    }
  }, refreshTime);
}

/**
 * Initialize session check on app load
 */
if (typeof window !== 'undefined') {
  const state = useAuthStore.getState();
  
  if (state.isAuthenticated && state.sessionExpiry) {
    const timeUntilExpiry = state.sessionExpiry - Date.now();
    
    if (timeUntilExpiry > 0) {
      scheduleSessionCheck(Math.floor(timeUntilExpiry / 1000));
    } else {
      state.logout();
    }
  }
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useAuthStore (Zustand hook)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
