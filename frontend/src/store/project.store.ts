/**
 * ============================================================================
 * ORUS BUILDER - PROJECT STORE (ZUSTAND)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:57:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:57:00-03:00
 * COMPONENT_HASH: orus.frontend.store.project.20251009.STR8I9J0
 * 
 * PURPOSE:
 * - Global project state management with Zustand
 * - Active project and project list management
 * - Project CRUD operations state
 * - File tree state management
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProjectManagementStateAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 88
 * - TRINITY_INTEGRATED: Cerebro (Organization Logic)
 * ============================================================================
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Project, FileNode } from '@/types/api.types';

// ============================================================================
// PROJECT STATE INTERFACE
// ============================================================================

interface ProjectState {
  // State
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
  selectedFileId: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setActiveProject: (project: Project | null) => void;
  selectFile: (fileId: string | null) => void;
  updateFileContent: (fileId: string, content: string) => void;
  addFile: (parentId: string, file: FileNode) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
// PROJECT STORE
// ============================================================================

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      // ============================================================================
      // INITIAL STATE
      // ============================================================================

      projects: [],
      activeProject: null,
      isLoading: false,
      error: null,
      selectedFileId: null,

      // ============================================================================
      // PROJECT ACTIONS
      // ============================================================================

      setProjects: (projects: Project[]) => {
        set({ projects });
      },

      addProject: (project: Project) => {
        set((state) => ({
          projects: [...state.projects, project],
        }));
      },

      updateProject: (projectId: string, updates: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, ...updates } : p
          ),
          activeProject:
            state.activeProject?.id === projectId
              ? { ...state.activeProject, ...updates }
              : state.activeProject,
        }));
      },

      deleteProject: (projectId: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          activeProject:
            state.activeProject?.id === projectId ? null : state.activeProject,
        }));
      },

      setActiveProject: (project: Project | null) => {
        set({ activeProject: project, selectedFileId: null });
      },

      // ============================================================================
      // FILE ACTIONS
      // ============================================================================

      selectFile: (fileId: string | null) => {
        set({ selectedFileId: fileId });
      },

      updateFileContent: (fileId: string, content: string) => {
        set((state) => {
          if (!state.activeProject) return state;

          const updateFileInTree = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
              if (node.id === fileId) {
                return { ...node, content };
              }
              if (node.children) {
                return { ...node, children: updateFileInTree(node.children) };
              }
              return node;
            });
          };

          return {
            activeProject: {
              ...state.activeProject,
              files: updateFileInTree(state.activeProject.files),
            },
          };
        });
      },

      addFile: (parentId: string, file: FileNode) => {
        set((state) => {
          if (!state.activeProject) return state;

          const addFileToTree = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
              if (node.id === parentId) {
                return {
                  ...node,
                  children: [...(node.children || []), file],
                };
              }
              if (node.children) {
                return { ...node, children: addFileToTree(node.children) };
              }
              return node;
            });
          };

          return {
            activeProject: {
              ...state.activeProject,
              files: addFileToTree(state.activeProject.files),
            },
          };
        });
      },

      deleteFile: (fileId: string) => {
        set((state) => {
          if (!state.activeProject) return state;

          const deleteFileFromTree = (nodes: FileNode[]): FileNode[] => {
            return nodes
              .filter((node) => node.id !== fileId)
              .map((node) => {
                if (node.children) {
                  return { ...node, children: deleteFileFromTree(node.children) };
                }
                return node;
              });
          };

          return {
            activeProject: {
              ...state.activeProject,
              files: deleteFileFromTree(state.activeProject.files),
            },
            selectedFileId:
              state.selectedFileId === fileId ? null : state.selectedFileId,
          };
        });
      },

      renameFile: (fileId: string, newName: string) => {
        set((state) => {
          if (!state.activeProject) return state;

          const renameFileInTree = (nodes: FileNode[]): FileNode[] => {
            return nodes.map((node) => {
              if (node.id === fileId) {
                return { ...node, name: newName };
              }
              if (node.children) {
                return { ...node, children: renameFileInTree(node.children) };
              }
              return node;
            });
          };

          return {
            activeProject: {
              ...state.activeProject,
              files: renameFileInTree(state.activeProject.files),
            },
          };
        });
      },

      // ============================================================================
      // UTILITY ACTIONS
      // ============================================================================

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'ProjectStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get selected file from active project
 */
export const useSelectedFile = (): FileNode | null => {
  return useProjectStore((state) => {
    if (!state.activeProject || !state.selectedFileId) {
      return null;
    }

    const findFile = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === state.selectedFileId) {
          return node;
        }
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findFile(state.activeProject.files);
  });
};

/**
 * Get project by ID
 */
export const useProject = (projectId: string): Project | undefined => {
  return useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useProjectStore (Zustand hook)
 * NAMED_EXPORTS: useSelectedFile, useProject
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
