/**
 * ============================================================================
 * ORUS BUILDER - EDITOR STORE (ZUSTAND)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:57:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:57:00-03:00
 * COMPONENT_HASH: orus.frontend.store.editor.20251009.STR9J0K1
 * 
 * PURPOSE:
 * - Monaco editor state management
 * - Editor configuration and preferences
 * - Code formatting and linting state
 * - Editor tabs and layout management
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: EditorStateAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 85
 * - TRINITY_INTEGRATED: Cerebro (Editor Logic)
 * ============================================================================
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// EDITOR TYPES
// ============================================================================

export interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  language: string;
  content: string;
  isDirty: boolean;
  cursorPosition?: {
    line: number;
    column: number;
  };
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  theme: 'vs-dark' | 'light' | 'hc-black';
  formatOnSave: boolean;
  autoSave: boolean;
  autoSaveDelay: number; // milliseconds
}

export type EditorLayout = 'single' | 'split-vertical' | 'split-horizontal';

// ============================================================================
// EDITOR STATE INTERFACE
// ============================================================================

interface EditorState {
  // State
  tabs: EditorTab[];
  activeTabId: string | null;
  settings: EditorSettings;
  layout: EditorLayout;
  isFormatting: boolean;
  isLinting: boolean;

  // Actions
  openTab: (tab: Omit<EditorTab, 'isDirty'>) => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  markTabDirty: (tabId: string, isDirty: boolean) => void;
  updateCursorPosition: (tabId: string, line: number, column: number) => void;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  setLayout: (layout: EditorLayout) => void;
  setFormatting: (isFormatting: boolean) => void;
  setLinting: (isLinting: boolean) => void;
  saveTab: (tabId: string) => void;
  saveAllTabs: () => void;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: 'on',
  theme: 'vs-dark',
  formatOnSave: true,
  autoSave: true,
  autoSaveDelay: 2000,
};

// ============================================================================
// EDITOR STORE
// ============================================================================

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // ============================================================================
        // INITIAL STATE
        // ============================================================================

        tabs: [],
        activeTabId: null,
        settings: DEFAULT_SETTINGS,
        layout: 'single',
        isFormatting: false,
        isLinting: false,

        // ============================================================================
        // TAB ACTIONS
        // ============================================================================

        openTab: (tab: Omit<EditorTab, 'isDirty'>) => {
          set((state) => {
            // Check if tab already exists
            const existingTab = state.tabs.find((t) => t.fileId === tab.fileId);

            if (existingTab) {
              // Just activate existing tab
              return { activeTabId: existingTab.id };
            }

            // Add new tab
            const newTab: EditorTab = {
              ...tab,
              isDirty: false,
            };

            return {
              tabs: [...state.tabs, newTab],
              activeTabId: newTab.id,
            };
          });
        },

        closeTab: (tabId: string) => {
          set((state) => {
            const tabIndex = state.tabs.findIndex((t) => t.id === tabId);

            if (tabIndex === -1) return state;

            const newTabs = state.tabs.filter((t) => t.id !== tabId);

            // Determine new active tab
            let newActiveTabId = state.activeTabId;

            if (state.activeTabId === tabId && newTabs.length > 0) {
              // Activate previous tab or first tab
              const newActiveIndex = Math.max(0, tabIndex - 1);
              newActiveTabId = newTabs[newActiveIndex]?.id || null;
            } else if (newTabs.length === 0) {
              newActiveTabId = null;
            }

            return {
              tabs: newTabs,
              activeTabId: newActiveTabId,
            };
          });
        },

        closeAllTabs: () => {
          set({ tabs: [], activeTabId: null });
        },

        setActiveTab: (tabId: string) => {
          set({ activeTabId: tabId });
        },

        updateTabContent: (tabId: string, content: string) => {
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId
                ? { ...tab, content, isDirty: content !== tab.content }
                : tab
            ),
          }));
        },

        markTabDirty: (tabId: string, isDirty: boolean) => {
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, isDirty } : tab
            ),
          }));
        },

        updateCursorPosition: (tabId: string, line: number, column: number) => {
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, cursorPosition: { line, column } } : tab
            ),
          }));
        },

        // ============================================================================
        // SETTINGS ACTIONS
        // ============================================================================

        updateSettings: (settings: Partial<EditorSettings>) => {
          set((state) => ({
            settings: { ...state.settings, ...settings },
          }));
        },

        setLayout: (layout: EditorLayout) => {
          set({ layout });
        },

        setFormatting: (isFormatting: boolean) => {
          set({ isFormatting });
        },

        setLinting: (isLinting: boolean) => {
          set({ isLinting });
        },

        // ============================================================================
        // SAVE ACTIONS
        // ============================================================================

        saveTab: (tabId: string) => {
          set((state) => ({
            tabs: state.tabs.map((tab) =>
              tab.id === tabId ? { ...tab, isDirty: false } : tab
            ),
          }));

          // Trigger actual save logic (handled by parent component)
          const tab = get().tabs.find((t) => t.id === tabId);
          if (tab) {
            // Parent component should listen to this state change
            console.log('[Editor] Save tab:', tab.fileName);
          }
        },

        saveAllTabs: () => {
          set((state) => ({
            tabs: state.tabs.map((tab) => ({ ...tab, isDirty: false })),
          }));

          console.log('[Editor] Save all tabs');
        },
      }),
      {
        name: 'orus-editor-storage',
        partialize: (state) => ({
          settings: state.settings,
          layout: state.layout,
        }),
      }
    ),
    { name: 'EditorStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get active tab
 */
export const useActiveTab = (): EditorTab | null => {
  return useEditorStore((state) =>
    state.tabs.find((t) => t.id === state.activeTabId) || null
  );
};

/**
 * Get dirty tabs (unsaved changes)
 */
export const useDirtyTabs = (): EditorTab[] => {
  return useEditorStore((state) => state.tabs.filter((t) => t.isDirty));
};

/**
 * Check if any tabs have unsaved changes
 */
export const useHasUnsavedChanges = (): boolean => {
  return useEditorStore((state) => state.tabs.some((t) => t.isDirty));
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useEditorStore (Zustand hook)
 * NAMED_EXPORTS: useActiveTab, useDirtyTabs, useHasUnsavedChanges
 * NAMED_EXPORTS_TYPES: EditorTab, EditorSettings, EditorLayout
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
