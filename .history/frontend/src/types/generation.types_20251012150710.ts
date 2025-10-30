/**
 * ============================================================================
 * ORUS BUILDER - GENERATION TYPES
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:53:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:53:00-03:00
 * COMPONENT_HASH: orus.frontend.types.generation.20251009.GEN3D4E5
 * 
 * PURPOSE:
 * - Extended generation-specific types
 * - Prompt processing types
 * - Code generation state types
 * - Trinity AI integration types
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: GenerationIntelligenceAgent
 * - COGNITIVE_LEVEL: Supreme
 * - AUTONOMY_DEGREE: 98
 * - TRINITY_INTEGRATED: All (Alma, Cerebro, Voz)
 * ============================================================================
 */

import { Framework, ProgrammingLanguage, GenerationStatus } from './api.types';

// ============================================================================
// GENERATION STATE TYPES
// ============================================================================

/**
 * Generation State
 */
export interface GenerationState {
  status: GenerationStatus;
  progress: number; // 0-100
  currentStep: GenerationStep;
  estimatedTimeRemaining?: number; // seconds
  filesGenerated: number;
  totalFilesEstimated: number;
}

/**
 * Generation Step enum
 */
export enum GenerationStep {
  PARSING_PROMPT = 'parsing_prompt',
  ANALYZING_REQUIREMENTS = 'analyzing_requirements',
  DESIGNING_ARCHITECTURE = 'designing_architecture',
  GENERATING_FILES = 'generating_files',
  VALIDATING_CODE = 'validating_code',
  OPTIMIZING = 'optimizing',
  FINALIZING = 'finalizing',
}

/**
 * Prompt Analysis Result
 */
export interface PromptAnalysisResult {
  intent: PromptIntent;
  entities: ExtractedEntity[];
  requirements: Requirement[];
  confidence: number; // 0-1
  ambiguities: Ambiguity[];
}

/**
 * Prompt Intent
 */
export interface PromptIntent {
  type: IntentType;
  description: string;
  confidence: number;
}

/**
 * Intent Type enum
 */
export enum IntentType {
  CREATE_APP = 'create_app',
  ADD_FEATURE = 'add_feature',
  FIX_BUG = 'fix_bug',
  REFACTOR = 'refactor',
  OPTIMIZE = 'optimize',
  DEPLOY = 'deploy',
}

/**
 * Extracted Entity
 */
export interface ExtractedEntity {
  type: EntityType;
  value: string;
  confidence: number;
}

/**
 * Entity Type enum
 */
export enum EntityType {
  FRAMEWORK = 'framework',
  LANGUAGE = 'language',
  FEATURE = 'feature',
  COMPONENT = 'component',
  LIBRARY = 'library',
  PLATFORM = 'platform',
}

/**
 * Requirement
 */
export interface Requirement {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: RequirementCategory;
  satisfied: boolean;
}

/**
 * Requirement Category enum
 */
export enum RequirementCategory {
  FUNCTIONAL = 'functional',
  NON_FUNCTIONAL = 'non_functional',
  UI_UX = 'ui_ux',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
}

/**
 * Ambiguity
 */
export interface Ambiguity {
  description: string;
  suggestions: string[];
  resolved: boolean;
  resolution?: string;
}

// ============================================================================
// TRINITY AI TYPES
// ============================================================================

/**
 * Trinity Request
 */
export interface TrinityRequest {
  requestId: string;
  action: TrinityAction;
  payload: Record<string, unknown>;
  context?: TrinityContext;
}

/**
 * Trinity Action enum
 */
export enum TrinityAction {
  ANALYZE_PROMPT = 'analyze_prompt',
  SUGGEST_ARCHITECTURE = 'suggest_architecture',
  GENERATE_CODE = 'generate_code',
  REVIEW_CODE = 'review_code',
  OPTIMIZE_CODE = 'optimize_code',
}

/**
 * Trinity Context
 */
export interface TrinityContext {
  projectId?: string;
  userId: string;
  sessionId: string;
  history: TrinityHistoryItem[];
}

/**
 * Trinity History Item
 */
export interface TrinityHistoryItem {
  timestamp: string;
  action: TrinityAction;
  result: string;
}

/**
 * Trinity Response
 */
export interface TrinityResponse {
  requestId: string;
  success: boolean;
  data?: TrinityResponseData;
  error?: string;
  metadata: TrinityMetadata;
}

/**
 * Trinity Response Data
 */
export interface TrinityResponseData {
  alma?: AlmaResponse; // Knowledge
  cerebro?: CerebroResponse; // Logic
  voz?: VozResponse; // Communication
}

/**
 * Alma Response (Knowledge)
 */
export interface AlmaResponse {
  knowledge: string[];
  suggestions: string[];
  references: string[];
}

/**
 * Cerebro Response (Logic)
 */
export interface CerebroResponse {
  architecture: ArchitectureSuggestion;
  patterns: string[];
  bestPractices: string[];
}

/**
 * Voz Response (Communication)
 */
export interface VozResponse {
  explanation: string;
  steps: string[];
  clarifications: string[];
}

/**
 * Trinity Metadata
 */
export interface TrinityMetadata {
  processingTime: number;
  confidence: number;
  modelsUsed: string[];
}

/**
 * Architecture Suggestion
 */
export interface ArchitectureSuggestion {
  type: string;
  components: ComponentSuggestion[];
  diagram?: string; // URL or base64
}

/**
 * Component Suggestion
 */
export interface ComponentSuggestion {
  name: string;
  type: string;
  responsibility: string;
  dependencies: string[];
}

// ============================================================================
// CODE VALIDATION TYPES
// ============================================================================

/**
 * Code Validation Report
 */
export interface CodeValidationReport {
  fileId: string;
  filePath: string;
  status: 'valid' | 'warnings' | 'errors';
  issues: ValidationIssue[];
  metrics: CodeMetrics;
}



/**
 * Validation Issue
 */
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  line: number;
  column: number;
  message: string;
  rule: string;
  fixable: boolean;
  suggestedFix?: string;
}

/**
 * Code Metrics
 */
export interface CodeMetrics {
  lines: number;
  complexity: number;
  maintainability: number; // 0-100
  coverage?: number; // 0-100
  duplications?: number;
}

// frontend/src/types/generation.types.ts
// ADICIONAR no final do arquivo, antes do EXPORT MANIFEST

// ============================================================================
// GENERATED FILE TYPES
// ============================================================================

/**
 * Generated File
 */
export interface GeneratedFile {
  path: string;
  name: string;
  content: string;
  language: string;
  type?: 'component' | 'test' | 'config' | 'style';
  size?: number;
  lines?: number;
}

/**
 * Generated File Collection
 */
export interface GeneratedFileCollection {
  files: GeneratedFile[];
  metadata: GenerationMetadata;
}

/**
 * Generation Metadata
 */
export interface GenerationMetadata {
  generatedAt: string;
  totalFiles: number;
  totalLines: number;
  estimatedSize: number;
  framework: string;
  language: string;
}


/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (types only)
 * NAMED_EXPORTS: All interfaces and enums
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
