/**
 * ============================================================================
 * ORUS BUILDER - COLLABORATION STORE (ZUSTAND)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:57:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:57:00-03:00
 * COMPONENT_HASH: orus.frontend.store.collaboration.20251009.STR0K1L2
 * 
 * PURPOSE:
 * - Real-time collaboration state management
 * - Active users and presence tracking
 * - Chat messages and comments state
 * - Cursor positions and selections
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CollaborationSyncStateAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 90
 * - TRINITY_INTEGRATED: Voz (Communication)
 * ============================================================================
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserPresence, ChatMessage, CodeComment } from '@/types/collaboration.types';

// ============================================================================
// COLLABORATION STATE INTERFACE
// ============================================================================

interface CollaborationState {
  // State
  isConnected: boolean;
  sessionId: string | null;
  activeUsers: UserPresence[];
  chatMessages: ChatMessage[];
  comments: CodeComment[];
  isTyping: Set<string>; // User IDs who are typing

  // Actions
  setConnected: (isConnected: boolean) => void;
  setSessionId: (sessionId: string | null) => void;
  addUser: (user: UserPresence) => void;
  removeUser: (userId: string) => void;
  updateUserPresence: (userId: string, updates: Partial<UserPresence>) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  addComment: (comment: CodeComment) => void;
  removeComment: (commentId: string) => void;
  resolveComment: (commentId: string, resolvedBy: string) => void;
  setUserTyping: (userId: string, isTyping: boolean) => void;
  clearAll: () => void;
}

// ============================================================================
// COLLABORATION STORE
// ============================================================================

export const useCollaborationStore = create<CollaborationState>()(
  devtools(
    (set, get) => ({
      // ============================================================================
      // INITIAL STATE
      // ============================================================================

      isConnected: false,
      sessionId: null,
      activeUsers: [],
      chatMessages: [],
      comments: [],
      isTyping: new Set<string>(),

      // ============================================================================
      // CONNECTION ACTIONS
      // ============================================================================

      setConnected: (isConnected: boolean) => {
        set({ isConnected });

        if (!isConnected) {
          // Clear state on disconnect
          set({
            sessionId: null,
            activeUsers: [],
            isTyping: new Set<string>(),
          });
        }
      },

      setSessionId: (sessionId: string | null) => {
        set({ sessionId });
      },

      // ============================================================================
      // USER PRESENCE ACTIONS
      // ============================================================================

      addUser: (user: UserPresence) => {
        set((state) => {
          // Check if user already exists
          const exists = state.activeUsers.some((u) => u.userId === user.userId);

          if (exists) {
            return {
              activeUsers: state.activeUsers.map((u) =>
                u.userId === user.userId ? user : u
              ),
            };
          }

          return {
            activeUsers: [...state.activeUsers, user],
          };
        });
      },

      removeUser: (userId: string) => {
        set((state) => ({
          activeUsers: state.activeUsers.filter((u) => u.userId !== userId),
        }));

        // Remove from typing set
        const isTypingSet = new Set(get().isTyping);
        isTypingSet.delete(userId);
        set({ isTyping: isTypingSet });
      },

      updateUserPresence: (userId: string, updates: Partial<UserPresence>) => {
        set((state) => ({
          activeUsers: state.activeUsers.map((user) =>
            user.userId === userId ? { ...user, ...updates } : user
          ),
        }));
      },

      // ============================================================================
      // CHAT ACTIONS
      // ============================================================================

      addChatMessage: (message: ChatMessage) => {
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        }));

        // Limit to last 100 messages
        if (get().chatMessages.length > 100) {
          set((state) => ({
            chatMessages: state.chatMessages.slice(-100),
          }));
        }
      },

      clearChatMessages: () => {
        set({ chatMessages: [] });
      },

      // ============================================================================
      // COMMENT ACTIONS
      // ============================================================================

      addComment: (comment: CodeComment) => {
        set((state) => ({
          comments: [...state.comments, comment],
        }));
      },

      removeComment: (commentId: string) => {
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        }));
      },

      resolveComment: (commentId: string, resolvedBy: string) => {
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  resolved: true,
                  resolvedBy,
                  resolvedAt: new Date().toISOString(),
                }
              : comment
          ),
        }));
      },

      // ============================================================================
      // TYPING INDICATOR ACTIONS
      // ============================================================================

      setUserTyping: (userId: string, isTyping: boolean) => {
        const isTypingSet = new Set(get().isTyping);

        if (isTyping) {
          isTypingSet.add(userId);
        } else {
          isTypingSet.delete(userId);
        }

        set({ isTyping: isTypingSet });
      },

      // ============================================================================
      // UTILITY ACTIONS
      // ============================================================================

      clearAll: () => {
        set({
          isConnected: false,
          sessionId: null,
          activeUsers: [],
          chatMessages: [],
          comments: [],
          isTyping: new Set<string>(),
        });
      },
    }),
    { name: 'CollaborationStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get user by ID
 */
export const useUserPresence = (userId: string): UserPresence | undefined => {
  return useCollaborationStore((state) =>
    state.activeUsers.find((u) => u.userId === userId)
  );
};

/**
 * Get comments for specific file
 */
export const useFileComments = (fileId: string): CodeComment[] => {
  return useCollaborationStore((state) =>
    state.comments.filter((c) => c.fileId === fileId && !c.resolved)
  );
};

/**
 * Get comments for specific line
 */
export const useLineComments = (fileId: string, line: number): CodeComment[] => {
  return useCollaborationStore((state) =>
    state.comments.filter(
      (c) => c.fileId === fileId && c.line === line && !c.resolved
    )
  );
};

/**
 * Get typing users
 */
export const useTypingUsers = (): UserPresence[] => {
  return useCollaborationStore((state) => {
    const typingUserIds = Array.from(state.isTyping);
    return state.activeUsers.filter((u) => typingUserIds.includes(u.userId));
  });
};

/**
 * Get online users count
 */
export const useOnlineUsersCount = (): number => {
  return useCollaborationStore((state) => state.activeUsers.length);
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useCollaborationStore (Zustand hook)
 * NAMED_EXPORTS: useUserPresence, useFileComments, useLineComments, useTypingUsers, useOnlineUsersCount
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
