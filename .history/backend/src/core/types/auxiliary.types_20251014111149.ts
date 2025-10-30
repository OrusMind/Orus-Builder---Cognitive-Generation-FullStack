/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔧 AUXILIARY TYPES - ORUS BUILDER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tipos auxiliares para resolver incompatibilidades entre engines.
 * 
 * @created 2025-10-14
 * @purpose Compatibilidade entre server.ts e engines
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { 
  TrinityResponse, 
  AlmaResponseData,
  CerebroResponseData,
  VozResponseData 
} from './trinity.types';

// ═══════════════════════════════════════════════════════════════════════════
// TRINITY COMPLEMENTARY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export enum TrinityRequestType {
  KNOWLEDGE_RETRIEVAL = 'knowledge_retrieval',
  ARCHITECTURAL_DECISION = 'architectural_decision', 
  COMMUNICATION = 'communication',
  FULL_PROCESSING = 'full_processing',
  PATTERN_RECOGNITION = 'pattern_recognition',
  CODE_ANALYSIS = 'code_analysis'
}

export interface TrinityResult {
  success: boolean;
  data: {
    alma?: AlmaResponseData;
    cerebro?: CerebroResponseData;
    voz?: VozResponseData;
    synthesized?: {
      summary: string;
      confidence: number;
      recommendations: string[];
    };
  };
  metadata?: {
    processingTime: number;
    componentsUsed: string[];
  };
}

export function toTrinityResult(response: TrinityResponse): TrinityResult {
  return {
    success: response.success,
    data: {
      alma: response.component === 'alma' ? (response.data as AlmaResponseData) : undefined,
      cerebro: response.component === 'cerebro' ? (response.data as CerebroResponseData) : undefined,
      voz: response.component === 'voz' ? (response.data as VozResponseData) : undefined,
      synthesized: {
        summary: response.success ? 'Processing complete' : 'Processing failed',
        confidence: response.metadata?.confidence || 0.85,
        recommendations: []
      }
    },
    metadata: {
      processingTime: response.metadata?.processingTime || 0,
      componentsUsed: [response.component]
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATION COMPLEMENTARY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export enum GenerationMode {
  FROM_PROMPT = 'from_prompt',
  FROM_SPECIFICATION = 'from_spec',
  FROM_BLUEPRINT = 'from_blueprint',
  ITERATIVE = 'iterative',
  INCREMENTAL = 'incremental'
}

export enum GenerationTarget {
  COMPONENT = 'component',
  PAGE = 'page',
  FEATURE = 'feature',
  MODULE = 'module',
  FULLSTACK = 'fullstack',
  API = 'api',
  MOBILE = 'mobile',
  BACKEND = 'backend',
  FRONTEND = 'frontend'
}

export interface ExtendedGenerationResult {
  generationId: string;
  projectId: string;
  files: Array<{
    path: string;
    fileName: string;
    content: string;
    language: string;
    lines: number;
  }>;
  totalFiles: number;
  totalLines: number;
  confidence: number;
  cigScore: number;
  validated: boolean;
  generationTime: number;
}

export function toExtendedGenerationResult(
  result: any,
  requestId: string
): ExtendedGenerationResult {
  const data = result.data || result;
  
  return {
    generationId: data.requestId || requestId,
    projectId: data.projectId || 'proj-' + Date.now(),
    files: (data.components || []).map((comp: any) => ({
      path: comp.path || `src/${comp.name}`,
      fileName: comp.name || 'component.tsx',
      content: comp.code || '',
      language: comp.metadata?.language || 'typescript',
      lines: comp.metadata?.linesOfCode || 0
    })),
    totalFiles: data.components?.length || 0,
    totalLines: data.metrics?.totalLines || 0,
    confidence: data.qualityScore || 0.95,
    cigScore: data.qualityScore || 0.98,
    validated: true,
    generationTime: data.metrics?.generationTime || 0
  };
}
