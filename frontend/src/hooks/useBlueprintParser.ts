/**
 * ============================================================================
 * ORUS BUILDER - USE BLUEPRINT PARSER HOOK
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:00:00-03:00
 * COMPONENT_HASH: orus.frontend.hook.blueprintparser.20251010.UBP0P1Q2
 * 
 * PURPOSE:
 * - Custom React hook for blueprint parsing
 * - State management for upload/parse flow
 * - Auto-generation trigger
 * - Error handling and retry logic
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: BlueprintParsingAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: Full (Blueprint Intelligence)
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import blueprintService from '@services/blueprint.service';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UseBlueprintParserOptions {
  /**
   * Auto-generate on parse complete
   * @default false
   */
  autoGenerate?: boolean;

  /**
   * Success callback
   */
  onSuccess?: (blueprintId: string, projectId?: string) => void;

  /**
   * Error callback
   */
  onError?: (error: Error) => void;
}

export interface BlueprintParserState {
  isUploading: boolean;
  isParsing: boolean;
  isGenerating: boolean;
  hasError: boolean;
  error: Error | null;
  blueprintId: string | null;
  projectId: string | null;
  parsedData: any | null;
}

export interface BlueprintParserActions {
  uploadAndParse: (file: File, content: string) => Promise<void>;
  generateProject: (blueprintId: string, options?: any) => Promise<void>;
  reset: () => void;
}

// ============================================================================
// USE BLUEPRINT PARSER HOOK
// ============================================================================

export function useBlueprintParser(options: UseBlueprintParserOptions = {}) {
  const { autoGenerate = false, onSuccess, onError } = options;

  const [state, setState] = useState<BlueprintParserState>({
    isUploading: false,
    isParsing: false,
    isGenerating: false,
    hasError: false,
    error: null,
    blueprintId: null,
    projectId: null,
    parsedData: null,
  });

  /**
   * Upload and parse blueprint
   */
  const uploadAndParse = useCallback(async (file: File, content: string) => {
    setState((prev) => ({
      ...prev,
      isUploading: true,
      isParsing: true,
      hasError: false,
      error: null,
    }));

    try {
      const fileType = file.name.split('.').pop() as 'docx' | 'md' | 'txt' | 'pdf';

      const response = await blueprintService.uploadBlueprint({
        content,
        fileName: file.name,
        fileType,
      });

      setState((prev) => ({
        ...prev,
        isUploading: false,
        isParsing: false,
        blueprintId: response.blueprintId,
        parsedData: response,
      }));

      toast.success(`Blueprint parsed successfully! (${response.confidence}% ORUS match)`);

      // Auto-generate if enabled
      if (autoGenerate) {
        await generateProject(response.blueprintId);
      } else if (onSuccess) {
        onSuccess(response.blueprintId);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isUploading: false,
        isParsing: false,
        hasError: true,
        error: error as Error,
      }));

      toast.error(`Failed to parse blueprint: ${(error as Error).message}`);

      if (onError) {
        onError(error as Error);
      }
    }
  }, [autoGenerate, onSuccess, onError]);

  /**
   * Generate project from blueprint
   */
  const generateProject = useCallback(async (blueprintId: string, options?: any) => {
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      hasError: false,
      error: null,
    }));

    try {
      const response = await blueprintService.generateFromBlueprint({
        blueprintId,
        options,
      });

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        projectId: response.projectId,
      }));

      toast.success(response.message || 'Project generation started!');

      if (onSuccess) {
        onSuccess(blueprintId, response.projectId);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        hasError: true,
        error: error as Error,
      }));

      toast.error(`Failed to generate project: ${(error as Error).message}`);

      if (onError) {
        onError(error as Error);
      }
    }
  }, [onSuccess, onError]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isUploading: false,
      isParsing: false,
      isGenerating: false,
      hasError: false,
      error: null,
      blueprintId: null,
      projectId: null,
      parsedData: null,
    });
  }, []);

  const actions: BlueprintParserActions = {
    uploadAndParse,
    generateProject,
    reset,
  };

  return [state, actions] as const;
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useBlueprintParser (Blueprint parser hook)
 * NAMED_EXPORTS: UseBlueprintParserOptions, BlueprintParserState
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
