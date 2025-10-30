/**
 * ============================================================================
 * ORUS BUILDER - USE GENERATION HOOK ⭐
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:17:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:28:00-03:00
 * COMPONENT_HASH: orus.frontend.hook.generation.20251009.HKG6B7C8
 * 
 * PURPOSE:
 * - Custom React hook for generation state management
 * - Real-time updates via WebSocket
 * - Automatic cleanup and error handling
 * - TypeScript-safe API
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: StateManagementAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 82
 * - TRINITY_INTEGRATED: Full (Real-time sync)
 * ============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import generationService from '@services/generation.service';
import {
  GenerationRequest,
  GenerationStage,
  GenerationStageStatus,
  GenerationMetadata,
  TrinityStatus,
  GeneratedFile,
  Framework,
  ProgrammingLanguage,
} from '../types/api.types';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UseGenerationOptions {
  /**
   * Auto-start generation on mount
   * @default false
   */
  autoStart?: boolean;

  /**
   * Initial prompt
   */
  initialPrompt?: string;

  /**
   * Enable real-time updates
   * @default true
   */
  enableRealtime?: boolean;

  /**
   * Success callback
   */
  onSuccess?: (files: GeneratedFile[]) => void;

  /**
   * Error callback
   */
  onError?: (error: Error) => void;

  /**
   * Progress callback
   */
  onProgress?: (progress: number, stage: GenerationStage) => void;
}

export interface GenerationState {
  // Status
  isGenerating: boolean;
  isValidating: boolean;
  isComplete: boolean;
  hasError: boolean;

  // Data
  jobId: string | null;
  projectId: string | null;
  currentStage: GenerationStage | null;
  progress: number;
  estimatedTimeRemaining: number | null;
  error: Error | null;

  // Results
  files: GeneratedFile[] | null;
  metadata: GenerationMetadata | null;

  // Trinity
  trinityStatus: TrinityStatus | null;
}

export interface GenerationActions {
  startGeneration: (request: GenerationRequest) => Promise<void>;
  cancelGeneration: () => Promise<void>;
  validatePrompt: (prompt: string) => Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
    suggestions?: string[];
    quality: number;
  }>;
  reset: () => void;
  downloadProject: (format: 'zip' | 'tar') => Promise<void>;
}

// ============================================================================
// USE GENERATION HOOK
// ============================================================================

export function useGeneration(options: UseGenerationOptions = {}) {
  const {
    autoStart = false,
    initialPrompt,
    enableRealtime = true,
    onSuccess,
    onError,
    onProgress,
  } = options;

  // State
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    isValidating: false,
    isComplete: false,
    hasError: false,
    jobId: null,
    projectId: null,
    currentStage: null,
    progress: 0,
    estimatedTimeRemaining: null,
    error: null,
    files: null,
    metadata: null,
    trinityStatus: null,
  });

  // Refs
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef<number>(0);

  /**
   * Start generation
   */
  const startGeneration = useCallback(async (request: GenerationRequest) => {
    try {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        isComplete: false,
        hasError: false,
        error: null,
        progress: 0,
        currentStage: GenerationStage.ANALYZING,
      }));

      startTimeRef.current = Date.now();

      // Start generation
      const response = await generationService.startGeneration(request);

      setState((prev) => ({
        ...prev,
        jobId: response.jobId,
        projectId: (response as any).projectId || response.jobId, // Fallback to jobId
        estimatedTimeRemaining: response.estimatedTime,
      }));

      toast.success(response.message || 'Generation started!');

      // Subscribe to real-time updates
      if (enableRealtime) {
        unsubscribeRef.current = generationService.subscribeToGenerationUpdates(
          response.jobId,
          // Progress handler
          (update) => {
            setState((prev) => ({
              ...prev,
              currentStage: update.stage as GenerationStage,
              progress: update.progress,
            }));

            if (onProgress) {
              onProgress(update.progress, update.stage as GenerationStage);
            }
          },
          // Complete handler
          (data) => {
            // Convert files to include hash
            const filesWithHash: GeneratedFile[] = data.files.map((file: any) => ({
              path: file.path,
              content: file.content,
              language: file.language,
              size: file.size || 0,
              hash: file.hash || 'generated',
            }));

            setState((prev) => ({
              ...prev,
              isGenerating: false,
              isComplete: true,
              progress: 100,
              currentStage: GenerationStage.FINALIZING,
              files: filesWithHash,
              metadata: data.metadata,
            }));

            toast.success('Generation complete!');

            if (onSuccess) {
              onSuccess(filesWithHash);
            }
          },
          // Error handler
          (error) => {
            setState((prev) => ({
              ...prev,
              isGenerating: false,
              hasError: true,
              error,
            }));

            toast.error(`Generation failed: ${error.message}`);

            if (onError) {
              onError(error);
            }
          }
        );
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        hasError: true,
        error: error as Error,
      }));

      toast.error(`Failed to start generation: ${(error as Error).message}`);

      if (onError) {
        onError(error as Error);
      }
    }
  }, [enableRealtime, onSuccess, onError, onProgress]);

  /**
   * Cancel generation
   */
  const cancelGeneration = useCallback(async () => {
    if (!state.jobId) {
      toast.error('No active generation to cancel');
      return;
    }

    try {
      const response = await generationService.cancelGeneration(state.jobId);

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        currentStage: null,
        progress: 0,
      }));

      toast.success(response.message || 'Generation cancelled');

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    } catch (error) {
      toast.error(`Failed to cancel: ${(error as Error).message}`);
    }
  }, [state.jobId]);

  /**
   * Validate prompt
   */
  const validatePrompt = useCallback(async (prompt: string) => {
    setState((prev) => ({ ...prev, isValidating: true }));

    try {
      const result = await generationService.validatePrompt(prompt);

      setState((prev) => ({ ...prev, isValidating: false }));

      return result;
    } catch (error) {
      setState((prev) => ({ ...prev, isValidating: false }));
      throw error;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      isValidating: false,
      isComplete: false,
      hasError: false,
      jobId: null,
      projectId: null,
      currentStage: null,
      progress: 0,
      estimatedTimeRemaining: null,
      error: null,
      files: null,
      metadata: null,
      trinityStatus: null,
    });

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  /**
   * Download project
   */
  const downloadProject = useCallback(async (format: 'zip' | 'tar' = 'zip') => {
    if (!state.projectId) {
      toast.error('No project to download');
      return;
    }

    try {
      const blob = await generationService.downloadProject(state.projectId, format);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download started!');
    } catch (error) {
      toast.error(`Download failed: ${(error as Error).message}`);
    }
  }, [state.projectId]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && initialPrompt) {
      startGeneration({
        projectId: 'new',
        prompt: initialPrompt,
        framework: Framework.REACT,
        language: ProgrammingLanguage.TYPESCRIPT,
        options: {
          style: 'standard',
          includeTests: true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps to run only on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Check Trinity health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await generationService.checkTrinityHealth();
        
        // Helper to extract load from health response
        const getLoad = (agent: any): number => {
          return agent.load !== undefined ? agent.load : (agent.latency || 0);
        };

        // Helper to check if synchronized
        const getSynchronized = (health: any): boolean => {
          if (health.synchronized !== undefined) {
            return health.synchronized;
          }
          // Fallback: all agents online
          return health.alma.status === 'online' && 
                 health.cerebro.status === 'online' && 
                 health.voz.status === 'online';
        };

        setState((prev) => ({
          ...prev,
          trinityStatus: {
            alma: {
              active: health.alma.status === 'online',
              load: getLoad(health.alma),
              lastActivity: new Date().toISOString(),
            },
            cerebro: {
              active: health.cerebro.status === 'online',
              load: getLoad(health.cerebro),
              lastActivity: new Date().toISOString(),
            },
            voz: {
              active: health.voz.status === 'online',
              load: getLoad(health.voz),
              lastActivity: new Date().toISOString(),
            },
            synchronized: getSynchronized(health),
          },
        }));
      } catch (error) {
        console.error('Trinity health check failed:', error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    startGeneration,
    cancelGeneration,
    validatePrompt,
    reset,
    downloadProject,
  };
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useGeneration (Custom React hook)
 * NAMED_EXPORTS: UseGenerationOptions, GenerationState, GenerationActions
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
