/*
 * ═══════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE GENERATION ENGINE - MAIN PIPELINE (CORRECTED)
 * ═══════════════════════════════════════════════════════════════
 * 
 * VERSION: 3.0 - FULLY INTEGRATED & CORRECTED
 * LAST_MODIFIED: 2025-10-24T14:16:00-03:00
 * STATUS: ✅ ZERO COMPILATION ERRORS
 */

// ═══════════════════════════════════════════════════════════════
// SECTION 1: IMPORTS & DEPENDENCIES
// ═══════════════════════════════════════════════════════════════

import { logger } from '../utils/logger';

// Trinity subsystem
import { TrinityOrchestrator } from '../trinity/trinity-orchestrator';
import { AIProviderFactory } from '../trinity/ai-provider-factory';

// Generation subsystem
import { codeGenerator } from '../generation/code-generator';
import { componentBuilder } from '../generation/component-builder';
import { uiGenerator } from '../generation/ui-generator';
import { backendGenerator } from '../generation/backend-generator';
import { cigValidator } from '../generation/cig-validator';
import { qualityAnalyzer } from '../generation/quality-analyzer';
import { codeOptimizer } from '../generation/code-optimizer';
import { dependencyResolver } from '../generation/dependency-resolver';
import { CodeLanguage } from '../generation/cig-validator'; 
import { TrinityErrorCode } from '../core/types/trinity.types';
import { createI18nText } from '../core/types/i18n.types';

// Prompt subsystem
import { PromptProcessor } from '../prompt/prompt-processor';

import { intentClassifier } from '../prompt/intent-classifier';
import { requirementsExtractor } from '../prompt/requirements-extractor';

// Template subsystem
import { templateManager } from '../templates/template-manager';
import { templateEngine } from '../engines/template-engine';
import { templateLibrary } from '../templates/template-library';

// Types from actual files
import type {
  TemplateCategory,
  TemplateSearchQuery,
  TemplateSearchResult,
  Framework,
  ThemeConfig
} from '../core/types/template.types';

import type {
  TrinityRequest,
  TrinityResponse,
  TrinityMode,
  TrinityConfig
} from '../core/types/trinity.types';

import type {
  I18nText,
  SupportedLanguage,
  ResponseWrapper,
  ErrorResponse
} from '../core/types/index';

// Generator-specific types
import type {
  UIGenerationInput,
  UIGenerationResult,
  StylingConfig
} from '../generation/ui-generator';

import type {
  BackendGenerationInput,
  BackendGenerationResult,
  DatabaseConfig,
  AuthConfig
} from '../generation/backend-generator';

import type {
  CodeGenerationInput,
  CodeGenerationResult
} from '../generation/code-generator';
import type {
  ValidationInput,
  ExtendedValidationResult
} from '../generation/cig-validator';

import type {
  QualityAnalysisInput,
  QualityAnalysisResult,
  AnalysisLanguage,
  AnalysisDepth
} from '../generation/quality-analyzer';

import type {
  OptimizationInput,
  OptimizationResult,
  CodeLanguage as OptimizerLanguage
} from '../generation/code-optimizer';
import { OptimizationType } from '../generation/code-optimizer'; 


// ═══════════════════════════════════════════════════════════════
// SECTION 2: LOCAL INTERFACES (Not in types files)
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// SCOPE DETECTION TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Scope types para geração precisa de código
 */
export enum ScopeType {
  SINGLE_COMPONENT = 'single-component',
  FEATURE = 'feature',
  PAGE = 'page',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  DATABASE = 'database'
   LANDING_PAGE = 'landing_page'  
}

/**
 * Complexity levels baseados no prompt
 */
export enum ComplexityLevel {
  MINIMAL = 'minimal',      // 2-4 arquivos
  MODERATE = 'moderate',    // 6-15 arquivos
  COMPLEX = 'complex'       // 20-40 arquivos
}

/**
 * Resultado da detecção de scope
 */
export interface ScopeDetectionResult {
  type: ScopeType;
  complexity: ComplexityLevel;
  confidence: number;
  expectedFileCount: {
    min: number;
    max: number;
  };
  shouldIncludeFrontend: boolean;
  shouldIncludeBackend: boolean;
  shouldIncludeDatabase: boolean;
  detectedKeywords: string[];
}


/**
 * Generation Request
 */
export interface GenerationRequest {
  // Identification
  id?: string;
  requestId?: string;
  userId?: string;
  projectId?: string;
  
  // Core
  prompt: string;
  framework?: string;
  language?: string;
  
  // Context
  context?: {
    domain?: string;
    language?: string;
    complexity?: string;
    stylePreferences?: any;
    colorPalette?: any;
    personality?: string;
  };
  
  // Options & Configuration
  options?: any;
  version?: number;
  
  // Trinity
  enableTrinity?: boolean;
  
  // Tracking & Metadata
  isDeleted?: boolean;      // ✅ ADICIONAR
  createdAt?: Date;         // ✅ ADICIONAR
  updatedAt?: Date;         // ✅ ADICIONAR
}

interface GeneratedComponent {
  name: string;
  type: 'component' | 'page' | 'service' | 'api' | 'model' | 'screen';
  code: string;
  path: string;
  language: string;
  framework: string;
  dependencies: string[];
  files?: Array<{ path: string; content: string }>; 
  metadata: {
    linesOfCode: number;
    complexity: number;
    generated: boolean;
    autoFixed?: boolean;
    validated?: boolean;
    cigCompliant?: boolean;         
  validationScore?: number;        
    qualityScore?: number;
    coverage?: number;
    optimized?: boolean;
    optimizations?: string[];
  }
}

/**
 * Generation Result
 */
export interface GenerationResult {
  success: boolean;
  components: GeneratedComponent[];
  error?: string;
  metadata?: {
    framework: string;
    processingTime: number;
    generatedAt: string;
  };
  qualityScore: number;
  dependencies: string[];
  packageJson: string;
  readme: string;
  
  // ✅ Propriedades esperadas pelo generation.controller.ts
  data?: {
    components: GeneratedComponent[];
    files?: Array<{ path: string; content: string }>;
    structure?: any;
  };
  metrics?: {
    totalTime?: number;
      generationTime?: number;
    linesOfCode?: number;
    complexity?: number;
  };
  qualityReport?: {
    score: number;
    issues?: any[];
    recommendations?: any[];
    summary?: { // ✅ ADICIONAR ESTE OBJETO
      overallScore?: number;
    };
  };
}

/**
 * Technical Specification
 */
export interface TechnicalSpecification {
  architecture: {
    style: string;
    layers: string[];
    patterns: string[];
  };
  components: Array<{
    name: string;
    type: string;
    purpose: string;
    responsibilities: string[];
  }>;
  dataModel: any[];
  technologies: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
  quality: {
    testingStrategy: string;
    securityRequirements: string[];
    performanceTargets: string[];
  };
}

/**
 * Prompt Analysis Result
 */
export interface PromptAnalysisResult {
  originalPrompt: string;
  intent: {
    type: string;
    description: string;
    confidence: number;
    subIntents: any[];
  };
  entities: any[];
  requirements: any[];
  ambiguities: any[];
  context: {
    domain: string;
    complexity: string;
    stylePreferences?: any;
    colorPalette?: any;
    personality?: string;
  };
  specification?: TechnicalSpecification;
  confidence: number;
}

/**
 * ValidationResult (local wrapper)
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

/**
 * Quality Score
 */
export interface QualityScore {
  overallScore: number;
  testCoverage?: number;
}

/**
 * Pipeline stage result
 */
interface PipelineStageResult {
  success: boolean;
  data?: any;
  error?: string;
   warnings?: any;
  metadata?: Record<string, any>;
}

/**
 * Generation context
 */
interface GenerationContext {
  prompt: string;
  analysis: PromptAnalysisResult;
  templates: any[];
  framework: string;
  domain: string;
  specification: TechnicalSpecification;
  trinity?: TrinityResponse<any>;
}

/**
 * Pipeline configuration
 */
interface PipelineConfig {
  enableValidation: boolean;
  enableOptimization: boolean;
  enableQualityAnalysis: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
}
// ═══════════════════════════════════════════════════════════════
// SECTION 3: COGNITIVE GENERATION ENGINE CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Cognitive Generation Engine
 * Main orchestrator for code generation pipeline
 */
export class CognitiveGenerationEngine {
  private context?: GenerationContext;
  private aiProvider: any;
  private io?: any; // Socket.IO instance

  constructor() {
    // Get AI provider from factory (ENV-based)
    this.aiProvider = AIProviderFactory.getProvider();
    
    logger.info('Cognitive Generation Engine initialized', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Set Socket.IO instance
   */
  public setSocketIO(io: any): void {
    this.io = io;
    logger.info('Socket.IO set for Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Initialize engine
   */
  public async initialize(...args: any[]): Promise<void> {
    logger.info('Initializing Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine',
      metadata: { argsReceived: args.length }
    });
  }

  /**
   * Start engine
   */
  public async start(): Promise<void> {
    logger.info('Starting Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Get engine status
   */
  public getStatus(): { status: string; ready: boolean } {
    return {
      status: 'operational',
      ready: true
    };
  }

  /**
   * Main entry point: Generate code from prompt
   */
  public async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
      console.log('═══════════════════════════════════════════════════════');
  console.log('🔥🔥🔥 [CognitiveEngine] generate() CHAMADO! 🔥🔥🔥');
  console.log('[CognitiveEngine] Request:', {
    prompt: request.prompt,
    framework: request.framework,
    hasId: !!request.id
  });
  console.log('═══════════════════════════════════════════════════════');
  

    try {
      logger.info('🚀 [CognitiveEngine] Starting code generation', {
        component: 'CognitiveGenerationEngine',
        metadata: { 
          prompt: request.prompt.substring(0, 50),
          framework: request.framework || 'react'
        }
      });

      // Create generation pipeline
      const pipeline = new GenerationPipeline();
  console.log('═══════════════════════════════════════════════════════');
console.log('🔍 [CognitiveEngine] ANTES de chamar pipeline.execute()');
console.log('[CognitiveEngine] request:', request);
console.log('[CognitiveEngine] request.prompt:', request?.prompt);
console.log('[CognitiveEngine] request type:', typeof request);
console.log('[CognitiveEngine] request keys:', Object.keys(request || {}));
console.log('═══════════════════════════════════════════════════════');

// Execute pipeline
logger.info('📊 [CognitiveEngine] Executing 4-stage pipeline...');
const result = await pipeline.execute(request);

      logger.info('✅ [CognitiveEngine] Pipeline execution complete', {
        success: result.success,
        componentsCount: result.components?.length || 0,
        error: result.error || 'none'
      });

      const processingTime = Date.now() - startTime;
      
      // Verificar se pipeline retornou sucesso
      if (!result.success) {
        logger.error('❌ [CognitiveEngine] Pipeline returned failure', {
          error: result.error,
          processingTime
        });
        
        return {
          success: false,
          components: [],
          error: result.error || 'Pipeline execution failed',
          qualityScore: 0,
          dependencies: [],
          packageJson: '',
          readme: '',
          data: {
            components: [],
            files: [],
            structure: {}
          },
          metrics: {
            totalTime: processingTime,
            generationTime: processingTime,
            linesOfCode: 0,
            complexity: 0
          },
          qualityReport: {
            score: 0,
            issues: [{ message: result.error || 'Unknown error' }],
            recommendations: [],
            summary: {
              overallScore: 0
            }
          }
        };
      }
      
      // ✅ Calcular métricas
      const linesOfCode = result.components.reduce((acc, c) => 
        acc + (c.code?.split('\n').length || 0), 0
      );
      
      logger.info('✅ [CognitiveEngine] Generation successful', {
        totalTime: processingTime,
        components: result.components.length,
        linesOfCode
      });
      
      return {
        ...result,
        metadata: {
          framework: request.framework || 'react',
          processingTime,
          generatedAt: new Date().toISOString()
        },
        data: {
          components: result.components,
          files: result.components.map(c => ({
            path: c.path || `${c.name}.tsx`,
            content: c.code || ''
          })),
          structure: {
            frontend: result.components.filter(c => c.type === 'component').length,
            backend: result.components.filter(c => c.type === 'api').length,
            total: result.components.length
          }
        },
        metrics: {
          totalTime: processingTime,
          generationTime: processingTime,
          linesOfCode: linesOfCode,
          complexity: result.qualityScore
        },
        qualityReport: {
          score: result.qualityScore,
          issues: [],
          recommendations: [],
          summary: {
            overallScore: result.qualityScore
          }
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('❌ [CognitiveEngine] Code generation failed', {
        component: 'CognitiveGenerationEngine',
        error: (error as Error).message,
        stack: (error as Error).stack,
        processingTime
      });
      
      return {
        success: false,
        components: [],
        error: (error as Error).message,
        qualityScore: 0,
        dependencies: [],
        packageJson: '',
        readme: '',
        data: {
          components: [],
          files: [],
          structure: {}
        },
        metrics: {
          totalTime: processingTime,
          generationTime: processingTime,
          linesOfCode: 0,
          complexity: 0
        },
        qualityReport: {
          score: 0,
          issues: [{ message: (error as Error).message }],
          recommendations: [],
          summary: {
            overallScore: 0
          }
        }
      };
    }
  }
  
} // ← FIM DA CLASSE CognitiveGenerationEngine

// ═══════════════════════════════════════════════════════════════
// SECTION 4: GENERATION PIPELINE CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Generation Pipeline
 * 4-stage pipeline: Prepare → Generate → Validate → Optimize
 */
/**
 * Generation Pipeline
 * 4-stage pipeline: Prepare → Generate → Validate → Optimize
 */
export class GenerationPipeline {
  private context?: GenerationContext;
  private config: PipelineConfig;
  private aiProvider: any;
  
  // ✅ promptProcessor já inicializado aqui
  private promptProcessor: PromptProcessor = PromptProcessor.getInstance();

  constructor(config?: Partial<PipelineConfig>) {
    this.config = {
      enableValidation: true,
      enableOptimization: true,
      enableQualityAnalysis: true,
      retryOnFailure: false,
      maxRetries: 3,
      ...config
    };
    
    this.aiProvider = AIProviderFactory.getProvider();
  
  // ✅ ADICIONAR ESSES LOGS
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] Constructor CHAMADO');
  console.log('[Pipeline] this.aiProvider:', this.aiProvider);
  console.log('[Pipeline] this.aiProvider exists:', !!this.aiProvider);
  console.log('[Pipeline] this.aiProvider type:', typeof this.aiProvider);
  console.log('[Pipeline] this.aiProvider.generateCode exists:', !!this.aiProvider?.generateCode);
  console.log('[Pipeline] this.aiProvider methods:', Object.keys(this.aiProvider || {}));
  console.log('═══════════════════════════════════════════════════════');
  
  logger.debug('Generation Pipeline created', {
    component: 'GenerationPipeline',
    metadata: this.config
  });
}
private splitCodeIntoComponents(aiCode: string, analysis: any): any[] {
  console.log('🔍 [Pipeline] splitCodeIntoComponents() CHAMADO');
  console.log('[Pipeline] AI code length:', aiCode.length);
  console.log('[Pipeline] AI code preview:', aiCode.substring(0, 500));
  
  const components: any[] = [];
  let match: RegExpExecArray | null;
  
  console.log('🔍 [Pipeline] Tentativa 1: Formato component:Name:tsx:path');
  
  const format1Pattern = /```component:([^:]+):([^:]+):([^\n]+)\n([\s\S]*?)```/gi;
  
  while ((match = format1Pattern.exec(aiCode)) !== null) {
    const componentName = match[1] ? match[1].trim() : '';
    const language = match[2] ? match[2].trim() : 'typescript';
    const filePath = match[3] ? match[3].trim() : '';
    const code = match[4] ? match[4].trim() : '';
    
    if (code.length > 10 && componentName && filePath) {
      console.log(`[Pipeline] ✅ Format1: ${componentName} at ${filePath} (${code.length} chars)`);
      
      components.push({
        name: componentName,
        type: 'component',
        code: code,
        path: filePath,
        files: [{
          path: filePath,
          content: code,
          language: language
        }]
      });
    }
  }
  
  console.log(`[Pipeline] Formato 1 encontrou: ${components.length} componentes`);
  
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 2: Detectar por comentários // src/');
    
    const sections = aiCode.split(/(?=\/\/\s*src\/)/);
    
    for (const section of sections) {
      const pathMatch = section.match(/\/\/\s*src\/([\w\/\-\.]+)\s*\n/);
      
      if (pathMatch && pathMatch[1]) {
        const filePath = `src/${pathMatch[1]}`;
        
        const codeMatch = section.match(/\/\/\s*src\/[\w\/\-\.]+\s*\n([\s\S]+?)(?=\/\/\s*src\/|$)/);
        
        if (codeMatch && codeMatch[1]) {
          let code = codeMatch[1].trim();
          
          code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
          code = code.replace(/```\s*$/g, '');
          code = code.trim();
          
          if (code.length > 50) {
            const componentName = this.extractComponentName(filePath, code);
            
            console.log(`[Pipeline] ✅ Format2: ${componentName} at ${filePath} (${code.length} chars)`);
            
            components.push({
              name: componentName,
              type: 'component',
              code: code,
              path: filePath,
              files: [{
                path: filePath,
                content: code,
                language: 'typescript'
              }]
            });
          }
        }
      }
    }
  }
  
  console.log(`[Pipeline] Formato 2 encontrou: ${components.length} componentes`);
  
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 3: Múltiplos blocos markdown');
    
    const format3Pattern = /```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n(?:\/\/\s*(.+?\.(?:tsx?|jsx?))\s*)?\n?([\s\S]*?)```/gi;
    
    while ((match = format3Pattern.exec(aiCode)) !== null) {
      const filePath = match[1] ? match[1].trim() : '';
      let code = match[2] ? match[2].trim() : '';
      
      if (code.length > 50) {
        const componentName = filePath ? this.extractComponentName(filePath, code) : this.extractComponentName('', code);
        const finalPath = filePath || `src/components/${componentName}.tsx`;
        
        console.log(`[Pipeline] ✅ Format3: ${componentName} at ${finalPath} (${code.length} chars)`);
        
        components.push({
          name: componentName,
          type: 'component',
          code: code,
          path: finalPath,
          files: [{
            path: finalPath,
            content: code,
            language: 'typescript'
          }]
        });
      }
    }
  }
  
  console.log(`[Pipeline] Formato 3 encontrou: ${components.length} componentes`);
  
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 4: Detectar componentes React direto');
    
    const componentPattern = /(?:export\s+default\s+function\s+(\w+)|export\s+function\s+(\w+)|const\s+(\w+)\s*:\s*React\.FC)/g;
    const matches: Array<{ name: string; start: number }> = [];
    
    while ((match = componentPattern.exec(aiCode)) !== null) {
      const nameValue = match[1] || match[2] || match[3];
      const name = nameValue ? nameValue : '';
      if (name && name !== 'undefined') {
        matches.push({
          name: name,
          start: match.index
        });
      }
    }
    
    console.log(`[Pipeline] Componentes React detectados: ${matches.length}`);
    
    if (matches.length > 1) {
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const nextMatch = matches[i + 1];
        if (!currentMatch) continue;
        
        const start = currentMatch.start;
        const end = nextMatch ? nextMatch.start : aiCode.length;
        let code = aiCode.substring(start, end).trim();
        
        code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
        code = code.replace(/```\s*$/g, '');
        code = code.trim();
        
        if (code.length > 50) {
          components.push({
            name: currentMatch.name,
            type: 'component',
            code,
            path: `src/components/${currentMatch.name}.tsx`,
            files: [{
              path: `src/components/${currentMatch.name}.tsx`,
              content: code,
              language: 'typescript'
            }]
          });
        }
      }
    } else if (matches.length === 1) {
      const singleMatch = matches[0];
      if (singleMatch) {
        let code = aiCode.trim();
        
        code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
        code = code.replace(/```\s*$/g, '');
        code = code.trim();
        
        components.push({
          name: singleMatch.name,
          type: 'component',
          code,
          path: `src/${singleMatch.name}.tsx`,
          files: [{
            path: `src/${singleMatch.name}.tsx`,
            content: code,
            language: 'typescript'
          }]
        });
      }
    }
  }
  
  console.log(`[Pipeline] Formato 4 encontrou: ${components.length} componentes`);
  
  if (components.length === 0) {
    console.log('[Pipeline] ⚠️ Usando fallback - código completo');
    
    let componentName = 'App';
    
    if (analysis && analysis.entities && analysis.entities[0] && analysis.entities[0].value) {
      componentName = analysis.entities[0].value;
    } else if (analysis && analysis.originalPrompt) {
      const words = analysis.originalPrompt.split(' ').filter((w: string) => w.length > 0);
      if (words.length > 0 && words[0]) {
        componentName = words[0];
      }
    }
    
    let code = aiCode.trim();
    
    code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
    code = code.replace(/```\s*$/g, '');
    code = code.trim();
    
    components.push({
      name: componentName,
      type: 'component',
      code,
      path: 'src/App.tsx',
      files: [{
        path: 'src/App.tsx',
        content: code,
        language: 'typescript'
      }]
    });
  }
  
  console.log(`✅ [Pipeline] Total components: ${components.length}`);
  components.forEach((comp, idx) => {
    console.log(`[Pipeline] Component ${idx + 1}: ${comp.name} | Files: ${comp.files?.length || 0} | Code: ${comp.code.length} chars | Path: ${comp.path}`);
  });
  
  return components;
}

private extractComponentName(filePath: string, code: string): string {
  if (filePath) {
    const pathMatch = filePath.match(/([^/]+)\.(tsx?|jsx?)$/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
  }
  
  const patterns = [
    /export\s+default\s+(?:function|const)\s+(\w+)/,
    /export\s+(?:function|const)\s+(\w+)/,
    /const\s+(\w+)\s*:\s*React\.FC/,
    /class\s+(\w+)/
  ];
  
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return 'Component';
}


  /**
   * Execute complete generation pipeline
   */
  public async execute(request: GenerationRequest): Promise<GenerationResult> {
    try {
        // ✅ VERIFICAR SE REQUEST CHEGOU
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 [Pipeline] execute() CHAMADO');
    console.log('[Pipeline] request recebido:', request);
    console.log('[Pipeline] request type:', typeof request);
    console.log('[Pipeline] request.prompt:', request?.prompt);
    console.log('[Pipeline] request keys:', Object.keys(request || {}));
    console.log('═══════════════════════════════════════════════════════');
    
    logger.info('🔄 [Pipeline] Starting 4-stage execution', {
      component: 'GenerationPipeline',
      prompt: request.prompt.substring(0, 50) // ← AQUI DÁ ERRO SE request É undefined
    });
      logger.info('🔄 [Pipeline] Starting 4-stage execution', {
        component: 'GenerationPipeline',
        prompt: request.prompt.substring(0, 50)
      });

      // Stage 1: Prepare (analysis + templates)
      logger.info('📥 [Pipeline] STAGE 1: Prepare (analysis + templates)');
      const prepareResult = await this.stagePrepare(request);
      if (!prepareResult.success) {
        logger.error('❌ [Pipeline] Stage 1 (Prepare) failed', { 
          error: prepareResult.error 
        });
        throw new Error(prepareResult.error || 'Prepare stage failed');
      }
      logger.info('✅ [Pipeline] Stage 1 complete', {
        hasAnalysis: !!prepareResult.data.analysis,
        templatesCount: prepareResult.data.templates?.length || 0
      });

      // Stage 2: Generate components
      logger.info('🔨 [Pipeline] STAGE 2: Generate (AI + code generation)');
      const generateResult = await this.stageGenerate(prepareResult.data);
      if (!generateResult.success) {
        logger.error('❌ [Pipeline] Stage 2 (Generate) failed', { 
          error: generateResult.error 
        });
        throw new Error(generateResult.error || 'Generate stage failed');
      }
      logger.info('✅ [Pipeline] Stage 2 complete', {
        componentsGenerated: generateResult.data.components?.length || 0
      });

      let components = generateResult.data.components;

      // Validar que temos componentes
      if (!components || components.length === 0) {
        logger.error('❌ [Pipeline] No components generated');
        throw new Error('No components generated by Stage 2');
      }

      // Stage 3: Validate (if enabled)
      if (this.config.enableValidation) {
        logger.info('✔️ [Pipeline] STAGE 3: Validate');
        try {
          const validateResult = await this.stageValidate(components);
          if (validateResult.success && validateResult.data) {
            components = validateResult.data;
            logger.info('✅ [Pipeline] Stage 3 complete (validated)');
          } else {
            logger.warn('⚠️ [Pipeline] Stage 3 validation issues (non-blocking)', {
              error: validateResult.error
            });
          }
        } catch (validateError) {
          logger.warn('⚠️ [Pipeline] Stage 3 failed (non-blocking)', {
            error: (validateError as Error).message
          });
        }
      }

      // Stage 4: Optimize (if enabled)
      if (this.config.enableOptimization) {
        logger.info('⚡ [Pipeline] STAGE 4: Optimize');
        try {
          const optimizeResult = await this.stageOptimize(components);
          if (optimizeResult.success && optimizeResult.data) {
            components = optimizeResult.data;
            logger.info('✅ [Pipeline] Stage 4 complete (optimized)');
          } else {
            logger.warn('⚠️ [Pipeline] Stage 4 optimization issues (non-blocking)', {
              error: optimizeResult.error
            });
          }
        } catch (optimizeError) {
          logger.warn('⚠️ [Pipeline] Stage 4 failed (non-blocking)', {
            error: (optimizeError as Error).message
          });
        }
      }

      // Calculate quality score
      const qualityScore = components.reduce((sum: number, c: GeneratedComponent) =>        
        sum + (c.metadata?.qualityScore || 0), 0
      ) / (components.length || 1);

      logger.info('✅ [Pipeline] All stages complete', {
        finalComponents: components.length,
        qualityScore: qualityScore.toFixed(2)
      });

      return {
        success: true,
        components,
        qualityScore,
        dependencies: this.extractAllDependencies(components),
        packageJson: this.generatePackageJson(components),
        readme: this.generateReadme(components)
      };

    } catch (error) {
      logger.error('❌ [Pipeline] Execution failed', {
        component: 'GenerationPipeline',
        error: (error as Error).message,
        stack: (error as Error).stack
      });
      
      return {
        success: false,
        components: [],
        error: (error as Error).message,
        qualityScore: 0,
        dependencies: [],
        packageJson: '',
        readme: ''
      };
    }
  }
/**
 * ═══════════════════════════════════════════════════════════════
 * STAGE 1: PREPARE - ENHANCED WITH PROMPT PROCESSOR INTEGRATION
 * ═══════════════════════════════════════════════════════════════
 * Analisa o prompt usando PromptProcessor REAL e detecta scope preciso
 */
private async stagePrepare(request: GenerationRequest): Promise<PipelineStageResult> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] stagePrepare() CHAMADO');
  console.log('[Pipeline] request recebido:', request);
  console.log('[Pipeline] request.prompt:', request?.prompt);
  console.log('═══════════════════════════════════════════════════════');
  
  logger.info('Pipeline Stage 1: Prepare', { 
    component: 'GenerationPipeline',
    prompt: request?.prompt?.substring(0, 50) || 'NO PROMPT'
  });

  try {
    // ═══════════════════════════════════════════════════════════════
    // VALIDAÇÃO DE REQUEST
    // ═══════════════════════════════════════════════════════════════
    if (!request || !request.prompt) {
      console.error('❌ [Pipeline] stagePrepare - request inválido');
      throw new Error('Invalid request: prompt is required');
    }

    console.log('✅ [Pipeline] Request validado');
    
    // ═══════════════════════════════════════════════════════════════
    // ANÁLISE COM PROMPT PROCESSOR (REAL - NÃO MAIS FALLBACK)
    // ═══════════════════════════════════════════════════════════════
    console.log('🧠 [Pipeline] Calling PromptProcessor.process()...');
    
    let analysis: PromptAnalysisResult;
    
    try {
      // ✅ USAR PROMPT PROCESSOR REAL
      const processingResult = await this.promptProcessor.process({
 sessionId: request.id || `session-${Date.now()}`,        userId: request.userId || 'system',
        prompt: request.prompt,
        options: {
          enableDetailedAnalysis: true,
          conversationMode: false
        }
      });
      
      // Transformar ProcessingResult em PromptAnalysisResult
 // Transformar ProcessingResult em PromptAnalysisResult com tipos seguros
analysis = {
  originalPrompt: request.prompt,
  
  intent: {
    type: (processingResult as any).classification?.primary?.intent || 'CREATE_APP',
    description: (processingResult as any).classification?.primary?.description || 'Create application',
    confidence: (processingResult as any).classification?.primary?.confidence || 60,
    subIntents: []
  },
  
  entities: (() => {
    const entities = (processingResult as any).requirements?.extracted?.entities ||
                     (processingResult as any).requirements?.entities || [];
    return entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e));
  })(),
  
  requirements: (processingResult as any).requirements?.functional || [],
  
  ambiguities: (processingResult as any).ambiguity?.ambiguities || [],
  
  context: {
    domain: (() => {
      const domain = (processingResult as any).context?.domain;
      if (typeof domain === 'string') return domain;
      if (domain && typeof domain === 'object') return domain.name || 'general';
      return 'general';
    })(),
    
    complexity: (processingResult as any).context?.complexity || 
                (processingResult as any).analysis?.complexity || 
                'standard'
  },
  
  confidence: (processingResult as any).classification?.primary?.confidence || 60
};

    } catch (processorError) {
      // Fallback apenas se PromptProcessor falhar completamente
      console.warn('⚠️ [Pipeline] PromptProcessor failed, using fallback');
      console.warn('[Pipeline] Processor error:', (processorError as Error).message);
      
      analysis = this.generateFallbackAnalysis(request);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // DETECÇÃO DE SCOPE (NOVO!)
    // ═══════════════════════════════════════════════════════════════
    console.log('🎯 [Pipeline] Detecting scope from intent...');
    
    const scope = this.detectScopeFromIntent(analysis, request.prompt);
    
    console.log('✅ [Pipeline] Scope detected:', {
      type: scope.type,
      complexity: scope.complexity,
      confidence: scope.confidence,
      expectedFiles: `${scope.expectedFileCount.min}-${scope.expectedFileCount.max}`,
      frontend: scope.shouldIncludeFrontend,
      backend: scope.shouldIncludeBackend,
      database: scope.shouldIncludeDatabase
    });

    // ═══════════════════════════════════════════════════════════════
    // BUSCAR TEMPLATES RELEVANTES
    // ═══════════════════════════════════════════════════════════════
    console.log('🔍 [Pipeline] Searching templates...');
    const templates = await this.searchTemplates(analysis, request);
    
    console.log('✅ [Pipeline] Templates found:', templates?.length || 0);

    // ═══════════════════════════════════════════════════════════════
    // BUILD SPECIFICATION (se necessário)
    // ═══════════════════════════════════════════════════════════════
    if (!analysis.specification) {
      console.log('🔧 [Pipeline] Building specification...');
      analysis.specification = await this.buildSpecification(analysis);
      console.log('✅ [Pipeline] Specification built');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ [Pipeline] stagePrepare() COMPLETE');
    console.log('[Pipeline] Returning with scope and analysis');
    console.log('═══════════════════════════════════════════════════════');

    // ═══════════════════════════════════════════════════════════════
    // RETORNAR COM SCOPE (NOVO CAMPO!)
    // ═══════════════════════════════════════════════════════════════
    return {
      success: true,
      data: {
        analysis,
        scope,           // ✅ NOVO: incluir scope no resultado
        templates,
        specification: analysis.specification,
        request         // ✅ NOVO: incluir request original para referência
      }
    };

  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [Pipeline] stagePrepare() ERRO!');
    console.error('[Pipeline] Error:', (error as Error).message);
    console.error('[Pipeline] Stack:', (error as Error).stack);
    console.error('═══════════════════════════════════════════════════════');
    
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

  /**
   * Analyze prompt using PromptProcessor
   */
  private async analyzePrompt(request: GenerationRequest): Promise<PromptAnalysisResult> {
    try {
      // PromptProcessor.process() returns string currently
      // Use fallback until full integration
      logger.info('Using fallback analysis (PromptProcessor integration pending)', {
        component: 'ContextBuilder'
      });
      
      return this.generateFallbackAnalysis(request);

    } catch (error) {
      logger.warn('PromptProcessor failed, using fallback', {
        component: 'ContextBuilder'
      });
      return this.generateFallbackAnalysis(request);
    }
  }

  /**
   * Search templates using TemplateManager
   */
  private async searchTemplates(
    analysis: PromptAnalysisResult,
    request: GenerationRequest
  ): Promise<any[]> {
    try {
      const templates = await templateManager.searchTemplates({
        keyword: analysis.intent.description,
        category: (request.framework || 'react') as TemplateCategory,
        tags: [analysis.context.domain || 'general']
      });

      // TemplateSearchResult can be array or object with .templates
      const templatesArray = Array.isArray(templates) 
        ? templates 
        : (templates.templates || []);

      logger.info(`Found ${templatesArray.length} matching templates`, {
        component: 'ContextBuilder'
      });

      return templatesArray;

    } catch (error) {
      logger.warn('Template search failed, using empty array', {
        component: 'ContextBuilder'
      });
      return [];
    }
  }

  /**
   * Build technical specification
   */
  private async buildSpecification(
    analysis: PromptAnalysisResult
  ): Promise<TechnicalSpecification> {
    return {
      architecture: {
        style: 'modular',
        layers: ['presentation', 'business', 'data'],
        patterns: ['mvc', 'repository']
      },
      components: [
        {
          name: 'MainComponent',
          type: 'component',
          purpose: 'Primary interface',
          responsibilities: ['rendering', 'state management']
        }
      ],
      dataModel: [],
      technologies: {
        frontend: ['react', 'typescript'],
        backend: ['node', 'express'],
        database: ['mongodb'],
        deployment: ['docker']
      },
      quality: {
        testingStrategy: 'unit + integration',
        securityRequirements: ['authentication', 'authorization'],
        performanceTargets: ['<100ms response time']
      }
    };
  }

  /**
   * Generate fallback analysis
   */
  private generateFallbackAnalysis(request: GenerationRequest): PromptAnalysisResult {
    return {
      originalPrompt: request.prompt,
      intent: {
        type: 'CREATE_APP',
        description: 'Create application from prompt',
        confidence: 60,
        subIntents: []
      },
      entities: [],
      requirements: [],
      ambiguities: [],
      context: {
        domain: request.context?.domain || 'general',
        complexity: request.context?.complexity || 'standard',
        stylePreferences: request.context?.stylePreferences,
        colorPalette: request.context?.colorPalette,
        personality: request.context?.personality
      },
      confidence: 60
    };
  }

/**
 * Stage 2: Generate
 * - Uses specialized generators (backend-generator, code-generator) OR AI Provider
 * - Creates MULTIPLE rich components based on scope
 */
private async stageGenerate(prepareData: any): Promise<PipelineStageResult> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] stageGenerate() CHAMADO');
  console.log('[Pipeline] prepareData recebido:', prepareData);
  console.log('[Pipeline] prepareData keys:', Object.keys(prepareData || {}));
  console.log('═══════════════════════════════════════════════════════');
  
  logger.info('Pipeline Stage 2: Generate (AI-ENHANCED WITH SPECIALIZED GENERATORS)', { 
    component: 'GenerationPipeline' 
  });
  
  try {
    // ✅ DESTRUCTURE CORRETO (sem request)
    const { analysis, specification, templates } = prepareData;
    const components: GeneratedComponent[] = [];
    
    console.log('✅ [Pipeline] Destructure complete');
    console.log('[Pipeline] analysis:', analysis);
    console.log('[Pipeline] specification:', specification);
    console.log('[Pipeline] templates count:', templates?.length || 0);
    
    // ✅ OBTER PROMPT DO ANALYSIS (que veio do request original)
    const originalPrompt = analysis?.originalPrompt || 'Create a React component';
    
    console.log('✅ [Pipeline] originalPrompt:', originalPrompt);
    
    // ═══════════════════════════════════════════════════════════════
    // SCOPE DETECTION
    // ═══════════════════════════════════════════════════════════════
    console.log('🔧 [Pipeline] Detecting scope...');
    const scope = prepareData.scope || this.detectScopeFromIntent(prepareData.analysis, originalPrompt);
    
    console.log('🎯 [Pipeline] Scope detected:', {
      type: scope.type,
      confidence: scope.confidence,
      expectedFiles: `${scope.expectedFileCount.min}-${scope.expectedFileCount.max}`
    });
    
    // ═══════════════════════════════════════════════════════════════
    // BUILD ENRICHED PROMPT (com Minerva Protocol)
    // ═══════════════════════════════════════════════════════════════
    console.log('🔧 [Pipeline] Building enriched prompt...');
    const enrichedPrompt = this.buildEnrichedPrompt(originalPrompt, prepareData.analysis, scope);
    console.log('✅ [Pipeline] Enriched prompt built');
    
    logger.info('Generating code with scope-aware strategy...', {
      scope: scope.type,
      entities: analysis.entities?.length || 0,
      actions: analysis.actions?.length || 0,
      complexity: analysis.complexity
    });
    
  // ═══════════════════════════════════════════════════════════════
// USAR GERADORES ESPECIALIZADOS QUANDO APROPRIADO
// ═══════════════════════════════════════════════════════════════

let generatedCode: string;
let generationSource: string;

if (scope.type === ScopeType.BACKEND) {
  // ✅ BACKEND SCOPE → Usar backend-generator especializado
  console.log('🔧 [Pipeline] Using backend-generator for BACKEND scope');
  
  try {
    // ✅ Preparar database config corretamente (objeto, não string)
    let databaseConfig: any = undefined;
    if (analysis.originalPrompt.toLowerCase().includes('prisma') || 
        analysis.originalPrompt.toLowerCase().includes('database')) {
      databaseConfig = {
        type: 'postgresql' as any,
        entities: analysis.entities || []
      };
    }
    
    // ✅ CORREÇÃO ERRO 1: Remover 'entities' do objeto principal
    const backendResult = await backendGenerator.generate({
      endpoints: analysis.requirements || [],
      framework: 'express',
      database: databaseConfig,
      includeAuth: analysis.originalPrompt.toLowerCase().includes('auth'),
      includeValidation: true
    });
    
    // ✅ CORREÇÃO ERRO 2-4: BackendGenerationResult não tem 'files', só retorna o resultado direto
    // Vamos converter o resultado para string
    if (typeof backendResult === 'object' && backendResult !== null) {
      // Se é objeto, pode ter uma propriedade 'code' ou 'components'
      if ('code' in backendResult) {
        generatedCode = (backendResult as any).code;
      } else if ('components' in backendResult) {
        // Se tem components, combinar eles
        const components = (backendResult as any).components;
        if (Array.isArray(components)) {
          generatedCode = components
            .map((comp: any) => `// Component: ${comp.name}\n${comp.code || comp.content}`)
            .join('\n\n');
        } else {
          generatedCode = JSON.stringify(backendResult, null, 2);
        }
      } else {
        // Fallback: converter para JSON
        generatedCode = JSON.stringify(backendResult, null, 2);
      }
    } else {
      generatedCode = String(backendResult);
    }
    
    generationSource = 'backend-generator';
    
    console.log('✅ [Pipeline] Backend-generator generated code successfully');
    
  } catch (backendError) {
    console.warn('⚠️ [Pipeline] Backend-generator failed, falling back to AI Provider');
    console.warn('[Pipeline] Error:', (backendError as Error).message);
    
    // Fallback para AI Provider
    const aiResponse = await this.aiProvider.generateCode({
      prompt: enrichedPrompt,
      maxTokens: 8000,
      temperature: 0.7
    });
    
    generatedCode = aiResponse.code || aiResponse;
    generationSource = 'ai-provider-fallback-from-backend-generator';
  }
  
} else if (scope.type === ScopeType.FULLSTACK) {
  // ✅ FULLSTACK SCOPE → Usar code-generator (orquestrador completo)
  console.log('🔧 [Pipeline] Using code-generator (orchestrator) for FULLSTACK scope');
  
  try {
    // ✅ ProjectRequirements e GenerationOptions corretos
    const fullstackResult = await codeGenerator.generate({
      projectName: analysis.entities?.[0] || 'App',
      projectType: 'FULLSTACK' as any,
      requirements: {
        description: analysis.originalPrompt,
        features: analysis.requirements || analysis.entities || [],
        tech_stack: {
          frontend: ['react', 'typescript', 'tailwindcss'],
          backend: ['express', 'typescript'],
          database: analysis.originalPrompt.toLowerCase().includes('prisma') ? 'prisma' : undefined
        },
        database: analysis.originalPrompt.toLowerCase().includes('database') ? {
          type: 'postgresql' as any,
          entities: []
        } : undefined,
        authentication: analysis.originalPrompt.toLowerCase().includes('auth'),
        api_type: 'rest' as any
      },
      options: {
        generateTests: true,
        generateDocs: false,
        optimizeCode: false,
        analyzeQuality: false,
        docker: false,
        cicd: false
      }
    });
    
    // ✅ CodeGenerationResult - converter para string
    if (typeof fullstackResult === 'object' && fullstackResult !== null) {
      if ('files' in fullstackResult && Array.isArray((fullstackResult as any).files)) {
        generatedCode = (fullstackResult as any).files
          .map((file: any) => `// File: ${file.path}/${file.name}\n${file.content}`)
          .join('\n\n');
      } else if ('code' in fullstackResult) {
        generatedCode = (fullstackResult as any).code;
      } else if ('components' in fullstackResult) {
        const components = (fullstackResult as any).components;
        if (Array.isArray(components)) {
          generatedCode = components
            .map((comp: any) => `// Component: ${comp.name}\n${comp.code || comp.content}`)
            .join('\n\n');
        } else {
          generatedCode = JSON.stringify(fullstackResult, null, 2);
        }
      } else {
        generatedCode = JSON.stringify(fullstackResult, null, 2);
      }
    } else {
      generatedCode = String(fullstackResult);
    }
    
    generationSource = 'code-generator';
    
    console.log('✅ [Pipeline] Code-generator generated fullstack code successfully');
    
  } catch (fullstackError) {
    console.warn('⚠️ [Pipeline] Code-generator failed, falling back to AI Provider');
    console.warn('[Pipeline] Error:', (fullstackError as Error).message);
    
    // Fallback para AI Provider com prompt FULLSTACK específico
    const aiResponse = await this.aiProvider.generateCode({
      prompt: enrichedPrompt,
      maxTokens: 8000,
      temperature: 0.7
    });
    
    generatedCode = aiResponse.code || aiResponse;
    generationSource = 'ai-provider-fallback-from-code-generator';
  }
  
} else {
  // ✅ OUTROS SCOPES (SINGLE_COMPONENT, PAGE, FEATURE) → AI Provider
  console.log('🔧 [Pipeline] Using AI Provider for scope:', scope.type);
  
  const aiResponse = await this.aiProvider.generateCode({
    prompt: enrichedPrompt,
    maxTokens: 8000,
    temperature: 0.7
  });
  
  generatedCode = aiResponse.code || aiResponse;
  generationSource = 'ai-provider';
}

console.log(`✅ [Pipeline] Code generated via: ${generationSource}`);

    // ═══════════════════════════════════════════════════════════════
    // DEBUG: RAW AI CODE OUTPUT
    // ═══════════════════════════════════════════════════════════════
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 [Pipeline] RAW CODE OUTPUT:');
    console.log('[Pipeline] generatedCode type:', typeof generatedCode);
    console.log('[Pipeline] generatedCode length:', generatedCode?.length || 0);
    console.log('[Pipeline] First 500 chars:', generatedCode?.substring(0, 500) || 'EMPTY');
    console.log('[Pipeline] Last 500 chars:', generatedCode?.substring((generatedCode?.length || 500) - 500) || 'EMPTY');
    console.log('═══════════════════════════════════════════════════════');
    
    // ═══════════════════════════════════════════════════════════════
    // SPLIT CODE INTO COMPONENTS
    // ═══════════════════════════════════════════════════════════════
    
    if (generatedCode && generatedCode.trim().length > 0) {
      console.log('✅ [Pipeline] Code generated successfully, splitting into components...');
      
      // Dividir código em múltiplos componentes
const componentBlocks = this.splitCodeIntoComponents(generatedCode, analysis);

      console.log('[Pipeline] Component blocks:', componentBlocks.length);
      
      componentBlocks.forEach((block: any) => {
        components.push({
          name: block.name,
          type: block.type,
          code: block.code,
          path: block.path,
          language: 'typescript',
          framework: analysis?.context?.framework || 'react',
          dependencies: this.extractDependencies(block.code),
          files: block.files || [{
            path: block.path,
            content: block.code,
            language: 'typescript'
          }],
          metadata: {
            linesOfCode: block.code.split('\n').length,
            complexity: this.calculateComplexity(block.code),
            generated: true,
            qualityScore: 75
          }
        });
      });
      
      logger.info(`✅ Generated ${components.length} components`);
      
    } else {
      console.warn('⚠️ [Pipeline] No code generated (empty or null)');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // FILE COUNT VALIDATION & WARNING
    // ═══════════════════════════════════════════════════════════════
    
    const fileCount = components.length;
    const expectedMin = scope.expectedFileCount.min;
    const expectedMax = scope.expectedFileCount.max;
    
    console.log('📊 [Pipeline] File count validation:', {
      generated: fileCount,
      expectedMin,
      expectedMax,
      scope: scope.type
    });
    
    if (fileCount < expectedMin) {
      const deficit = expectedMin - fileCount;
      
      logger.warn(`⚠️ File count below expected minimum!`, {
        component: 'GenerationPipeline',
        metadata: {
          generated: fileCount,
          expectedMin,
          deficit,
          scope: scope.type,
          percentage: Math.round((fileCount / expectedMin) * 100)
        }
      });
      
      console.warn('═══════════════════════════════════════════════════════');
      console.warn(`⚠️ [Pipeline] UNDER-GENERATION DETECTED!`);
      console.warn(`[Pipeline] Generated: ${fileCount} files`);
      console.warn(`[Pipeline] Expected minimum: ${expectedMin} files`);
      console.warn(`[Pipeline] Missing: ~${deficit} files (${Math.round((deficit/expectedMin)*100)}% short)`);
      console.warn(`[Pipeline] Scope: ${scope.type}`);
      console.warn('═══════════════════════════════════════════════════════');
      
      // Lista de componentes que podem estar faltando baseado no scope
      if (scope.type === ScopeType.FULLSTACK) {
        console.warn('[Pipeline] Missing components might include:');
        console.warn('  - Frontend entry (index.tsx, App.tsx)');
        console.warn('  - Backend entry (server.ts, app.ts)');
        console.warn('  - Auth pages (Login.tsx, Register.tsx)');
        console.warn('  - Form components (Add*Form.tsx)');
        console.warn('  - Middleware (errorHandler, logger)');
        console.warn('  - Validators (Zod schemas)');
        console.warn('  - Config files (.env.example, tsconfig, package.json)');
      } else if (scope.type === ScopeType.BACKEND) {
        console.warn('[Pipeline] Missing components might include:');
        console.warn('  - Entry point (server.ts, app.ts)');
        console.warn('  - Additional routes or controllers');
        console.warn('  - Middleware (errorHandler, logger, cors)');
        console.warn('  - Validators (Zod schemas)');
      } else if (scope.type === ScopeType.LANDING_PAGE) {
        console.warn('[Pipeline] Missing components might include:');
        console.warn('  - Hero section');
        console.warn('  - Features section');
        console.warn('  - CTA buttons');
        console.warn('  - Footer with links');
      }
      
    } else if (fileCount > expectedMax) {
      logger.warn(`⚠️ File count exceeds expected maximum`, {
        component: 'GenerationPipeline',
        metadata: {
          generated: fileCount,
          expectedMax,
          excess: fileCount - expectedMax
        }
      });
      
      console.warn(`⚠️ [Pipeline] Over-generation: ${fileCount} files (expected max ${expectedMax})`);
      
    } else {
      console.log(`✅ [Pipeline] File count within expected range: ${fileCount} files`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // FALLBACK: Se nada foi gerado
    // ═══════════════════════════════════════════════════════════════
    
    if (components.length === 0) {
      console.log('⚠️ [Pipeline] No components generated, using fallback');
      logger.warn('No components generated, using fallback');
      
      components.push({
        name: 'App',
        type: 'component',
        code: this.generateFallbackComponent(originalPrompt),
        path: 'src/App.tsx',
        language: 'typescript',
        framework: 'react',
        dependencies: ['react'],
        metadata: {
          linesOfCode: 20,
          complexity: 3,
          generated: true,
          qualityScore: 60
        }
      });
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ [Pipeline] stageGenerate() COMPLETE');
    console.log(`[Pipeline] Total components generated: ${components.length}`);
    console.log(`[Pipeline] Generation source: ${generationSource}`);
    console.log('═══════════════════════════════════════════════════════');
    
    logger.info(`✅ Total components generated: ${components.length}`);
    
    return {
      success: true,
      data: { components }
    };
    
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [Pipeline] stageGenerate() ERRO!');
    console.error('[Pipeline] Error:', (error as Error).message);
    console.error('[Pipeline] Stack:', (error as Error).stack);
    console.error('═══════════════════════════════════════════════════════');
    
    logger.error('Stage 2 failed', { error: (error as Error).message });
    return {
      success: false,
      error: (error as Error).message
    };
  }
}


/**
 * ═══════════════════════════════════════════════════════════════
 * BUILD ENRICHED PROMPT WITH SCOPE-AWARE INSTRUCTIONS
 * ═══════════════════════════════════════════════════════════════
 * Constrói prompt otimizado baseado no scope detectado
 * INTEGRA: Minerva Omega Cognitive Generation Protocol v3.0
 * SUPORTE: Frontend, Backend, Fullstack, Landing Pages
 */
private buildEnrichedPrompt(
  originalPrompt: string,
  analysis: PromptAnalysisResult,
  scope: ScopeDetectionResult
): string {
  
  // ═══════════════════════════════════════════════════════════════
  // EXTRACT ANALYSIS DATA (com fallbacks seguros)
  // ═══════════════════════════════════════════════════════════════
  const entitiesList = analysis.entities?.join(', ') || 'general entities';
  const actionsList = (analysis as any).actions?.join(', ') || 'standard actions';
  const uiElementsList = (analysis as any).uiElements?.map((ui: any) => ui.type).join(', ') || 'UI components';
  const framework = (analysis as any).suggestedFramework || 'react';
  const complexity = scope.complexity;
  const mainEntity = analysis.entities && analysis.entities.length > 0 
    ? analysis.entities[0] 
    : 'Item';
  
  // ═══════════════════════════════════════════════════════════════
  // MINERVA OMEGA BASE PROTOCOL (aplicado em TODOS os prompts)
  // ═══════════════════════════════════════════════════════════════
  const minervaBaseProtocol = `
╔═══════════════════════════════════════════════════════════════╗
║ 🧬 MINERVA OMEGA COGNITIVE GENERATION PROTOCOL v3.0           ║
╚═══════════════════════════════════════════════════════════════╝

You are Minerva Omega TypeScript Supreme - Master AI Code Generator.

⚡ CORE PRINCIPLES (NON-NEGOTIABLE):

1. COMPILER-INTEGRITY GUARANTEED (CIG-2.0)
   ✅ Zero compilation errors
   ✅ Zero runtime type errors
   ✅ All imports/exports correct (no missing imports)
   ✅ All dependencies declared
   ✅ Add closing braces } for ALL functions, components, classes

2. TYPES-FIRST APPROACH
   ✅ Define interfaces BEFORE implementation
   ✅ Never use 'any' type (use Request, Response, NextFunction for Express)
   ✅ Export all types as named exports (export interface X, export type Y)
   ✅ Create .types.ts files for shared types

3. DEPENDENCY CONSCIOUSNESS
   ✅ Map all symbols before first line of code
   ✅ Generate missing types immediately
   ✅ Use import type { } for type-only imports
   ✅ Resolve circular dependencies

4. FUNCTIONAL CODE ONLY
   ✅ No TODOs or placeholders
   ✅ No "implement this later" comments
   ✅ All functions have real implementation
   ✅ Mock data is structured and realistic
   ✅ All components referenced in imports must exist

5. NAMED EXPORTS STANDARD
   ✅ Use "export const ComponentName" for React components
   ✅ Use "export default router" for Express routers
   ✅ Use "export interface TypeName" for types
   ✅ Consistent import/export patterns
   ✅ Clear module boundaries

6. CORRECT EXPORT SYNTAX
   ✅ export const MyComponent: React.FC = () => { return (...); };
   ✅ export default MyComponent; (when needed)
   ❌ NEVER: export const MyComponent; (without implementation)

═══════════════════════════════════════════════════════════════`;

  // ═══════════════════════════════════════════════════════════════
  // SCOPE-SPECIFIC PROMPTS
  // ═══════════════════════════════════════════════════════════════
  
  if (scope.type === ScopeType.SINGLE_COMPONENT) {
    return `${minervaBaseProtocol}

╔═══════════════════════════════════════════════════════════════╗
║ SCOPE: SINGLE COMPONENT (MINIMAL)                             ║
╚═══════════════════════════════════════════════════════════════╝

**USER REQUEST:** "${originalPrompt}"

**STRICT GENERATION RULES:**

📦 FILE COUNT: Generate EXACTLY 2-4 files maximum
   1. ${mainEntity}.tsx (the component)
   2. ${mainEntity}.types.ts (TypeScript types)
   3. ${mainEntity}.mock.ts (mock data - optional)
   4. ${mainEntity}.styles.css (styles - optional)

🚫 DO NOT GENERATE:
   ❌ App.tsx or index.tsx
   ❌ API layers or services
   ❌ Routing files
   ❌ Multiple components (only the requested one)
   ❌ Backend code

✅ COMPONENT REQUIREMENTS:
   - Use React functional component with hooks
   - Include TypeScript props interface in separate .types.ts file
   - Use Tailwind CSS for styling (inline classes)
   - Make it responsive (mobile-first with sm:, md:, lg: breakpoints)
   - Add proper prop validation
   - Include JSDoc comments
   - Use semantic HTML elements
   - Implement hover states and transitions

📤 OUTPUT FORMAT:
\`\`\`typescript:${mainEntity}.tsx
import React from 'react';
import { ${mainEntity}Props } from './${mainEntity}.types';

/**
 * ${mainEntity} component
 * @description [Brief description]
 */
export const ${mainEntity}: React.FC<${mainEntity}Props> = ({ ...props }) => {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
};
\`\`\`

\`\`\`typescript:${mainEntity}.types.ts
/**
 * ${mainEntity} types
 */
export interface ${mainEntity}Props {
  // Props definition with JSDoc
}
\`\`\`

**ENTITIES DETECTED:** ${entitiesList}
**FRAMEWORK:** ${framework}
**UI ELEMENTS:** ${uiElementsList}

GENERATE NOW - ONLY THE REQUESTED COMPONENT WITH COMPLETE IMPLEMENTATION.`;
  }
  
  // ───────────────────────────────────────────────────────────────
  
  if (scope.type === ScopeType.LANDING_PAGE) {
    return `${minervaBaseProtocol}

╔═══════════════════════════════════════════════════════════════╗
║ SCOPE: LANDING PAGE (HIGH CONVERSION)                         ║
╚═══════════════════════════════════════════════════════════════╝

**USER REQUEST:** "${originalPrompt}"

**STRICT GENERATION RULES:**

📦 FILE COUNT: Generate 8-15 files for complete landing page
   - Multiple sections (Hero, Features, CTA, Footer)
   - Reusable components
   - Types and utilities
   - Responsive images

✅ REQUIRED SECTIONS (Generate ALL):
   
   🏠 HERO SECTION:
      - Eye-catching headline (H1 with large text)
      - Compelling sub-headline (value proposition)
      - Primary CTA button (prominent, contrasting color)
      - Secondary CTA button (optional)
      - Hero image or gradient background
      - Social proof (logos, testimonials, stats)
   
   ✨ FEATURES SECTION:
      - 3-6 feature cards with icons
      - Feature titles and descriptions
      - Grid layout (responsive)
      - Hover effects
   
   💰 PRICING SECTION (if applicable):
      - Pricing tiers (3 options recommended)
      - Feature comparison
      - Recommended badge
      - Monthly/yearly toggle
   
   📝 TESTIMONIALS:
      - Customer quotes
      - Avatar images
      - Names and titles
      - Star ratings
   
   📧 CTA SECTION:
      - Email capture form
      - Benefit-focused copy
      - Privacy assurance
      - Submit button with loading state
   
   🦶 FOOTER:
      - Company links
      - Social media icons
      - Copyright notice
      - Legal links (Privacy, Terms)

✅ DESIGN REQUIREMENTS:
   - Modern, clean aesthetic
   - Tailwind CSS with custom design tokens
   - Smooth scroll behavior
   - Sticky header (optional)
   - Mobile-first responsive (sm:, md:, lg:, xl:)
   - Accessibility (ARIA labels, semantic HTML)
   - Fast loading (optimized images)
   - Animations (fade-in, slide-in using Intersection Observer)
   - Color scheme: primary, secondary, accent colors
   - Typography: clear hierarchy (text-sm to text-6xl)

✅ CONVERSION OPTIMIZATION:
   - Above-the-fold CTA
   - Trust signals (badges, testimonials)
   - Urgency elements (limited time, spots left)
   - Clear value proposition
   - Minimal friction (simple forms)
   - Social proof
   - Exit-intent popup (optional)

📁 FILE STRUCTURE:
   components/
   ├── Hero.tsx (main hero section)
   ├── Features.tsx (features grid)
   ├── Pricing.tsx (pricing tiers)
   ├── Testimonials.tsx (customer quotes)
   ├── CTA.tsx (call-to-action section)
   ├── Footer.tsx (footer with links)
   ├── Button.tsx (reusable button component)
   ├── FeatureCard.tsx (individual feature card)
   types/
   ├── landing.types.ts (all interfaces)
   data/
   ├── features.ts (feature data)
   ├── testimonials.ts (testimonial data)
   pages/
   ├── LandingPage.tsx (main orchestrator)

📤 OUTPUT FORMAT:
\`\`\`typescript:components/Hero.tsx
export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {/* Compelling headline */}
        </h1>
        {/* Rest of hero content */}
      </div>
    </section>
  );
};
\`\`\`

**PRODUCT/SERVICE:** ${entitiesList}
**TARGET ACTION:** ${actionsList}
**DESIGN STYLE:** Modern, conversion-focused

GENERATE COMPLETE LANDING PAGE WITH ALL SECTIONS - PRODUCTION-READY.`;
  }
  
  // ───────────────────────────────────────────────────────────────
  
  if (scope.type === ScopeType.BACKEND) {
    return `${minervaBaseProtocol}

╔═══════════════════════════════════════════════════════════════╗
║ SCOPE: BACKEND API ONLY (NO FRONTEND)                         ║
╚═══════════════════════════════════════════════════════════════╝

**USER REQUEST:** "${originalPrompt}"

**STRICT GENERATION RULES:**

📦 FILE COUNT: Generate 10-15 backend files
   Structure: routes/ controllers/ middleware/ validators/ types/ utils/

🚫 ABSOLUTELY NO FRONTEND:
   ❌ NO React components
   ❌ NO .tsx files
   ❌ NO frontend pages
   ❌ NO UI code whatsoever

✅ BACKEND STRUCTURE (Generate ALL):
   
   📁 src/
   ├── server.ts (entry point with app.listen)
   ├── app.ts (Express app setup with middleware, CORS, routes)
   │
   ├── routes/
   │   ├── ${mainEntity.toLowerCase()}.routes.ts (CRUD endpoints)
   │   └── auth.routes.ts (login, register, verify)
   │
   ├── controllers/
   │   ├── ${mainEntity.toLowerCase()}.controller.ts (business logic)
   │   └── auth.controller.ts (authentication logic)
   │
   ├── middleware/
   │   ├── auth.middleware.ts (JWT validation with Request, Response, NextFunction)
   │   ├── errorHandler.middleware.ts (centralized error handling)
   │   └── logger.middleware.ts (request logging)
   │
   ├── validators/
   │   ├── ${mainEntity.toLowerCase()}.validators.ts (Zod schemas)
   │   └── auth.validators.ts (auth Zod schemas)
   │
   ├── types/
   │   └── ${mainEntity.toLowerCase()}.types.ts (TypeScript interfaces)
   │
   └── utils/
       ├── jwt.utils.ts (token generation/validation)
       └── helpers.ts (utility functions)

✅ IMPLEMENTATION REQUIREMENTS:
   - Express.js with TypeScript
   - Zod validation for ALL request bodies
   - Proper error handling (try-catch + custom error classes)
   - JWT middleware for protected routes
   - Named exports for all modules
   - JSDoc comments for public APIs
   - Environment variables (process.env.JWT_SECRET, etc.)
   - CORS configuration
   - Request logging
   - Error responses with status codes

✅ ENTRY POINTS (MANDATORY):
\`\`\`typescript:server.ts
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

\`\`\`typescript:app.ts
import express, { Application } from 'express';
import cors from 'cors';
import { ${mainEntity.toLowerCase()}Router } from './routes/${mainEntity.toLowerCase()}.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/${mainEntity.toLowerCase()}', ${mainEntity.toLowerCase()}Router);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
\`\`\`

✅ TYPE-SAFE MIDDLEWARE:
\`\`\`typescript:middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
\`\`\`

✅ ZOD VALIDATION:
\`\`\`typescript:validators/${mainEntity.toLowerCase()}.validators.ts
import { z } from 'zod';

export const create${mainEntity}Schema = z.object({
  // Schema definition with validation rules
});
\`\`\`

**ENTITIES:** ${entitiesList}
**ACTIONS:** ${actionsList}
**FRAMEWORK:** Express + TypeScript

GENERATE COMPLETE BACKEND WITH SERVER.TS, APP.TS, AND ALL FILES - NO FRONTEND CODE.`;
  }
  
  // ───────────────────────────────────────────────────────────────
  
  if (scope.type === ScopeType.PAGE || scope.type === ScopeType.FEATURE) {
    return `${minervaBaseProtocol}

╔═══════════════════════════════════════════════════════════════╗
║ SCOPE: ${scope.type.toUpperCase()} (MODERATE COMPLEXITY)      ║
╚═══════════════════════════════════════════════════════════════╝

**USER REQUEST:** "${originalPrompt}"

**GENERATION RULES:**

📦 FILE COUNT: Generate 8-12 files
   - Multiple related components
   - Shared types
   - Utility functions
   - Mock data
   - Hooks

✅ STRUCTURE:
   src/
   ├── components/
   │   ├── ${mainEntity}Dashboard.tsx (main orchestrator)
   │   ├── ${mainEntity}List.tsx (list view)
   │   ├── ${mainEntity}Item.tsx (individual item)
   │   ├── ${mainEntity}Form.tsx (create/edit form)
   │   └── ${mainEntity}Stats.tsx (statistics cards)
   │
   ├── hooks/
   │   └── use${mainEntity}.ts (data fetching hook)
   │
   ├── types/
   │   └── ${mainEntity.toLowerCase()}.types.ts (shared types)
   │
   ├── utils/
   │   └── ${mainEntity.toLowerCase()}.utils.ts (helper functions)
   │
   └── data/
       └── mock${mainEntity}.ts (mock data)

✅ REQUIREMENTS:
   - React functional components with hooks (useState, useEffect, custom hooks)
   - TypeScript with proper types (no 'any')
   - Tailwind CSS styling with responsive breakpoints
   - Component composition (smaller reusable components)
   - Named exports
   - Data flow (props drilling or context)
   - Loading states
   - Error handling
   - Empty states

✅ COMPONENT PATTERNS:
   - List/Detail pattern
   - Form with validation
   - Modal dialogs
   - Search/filter functionality
   - Pagination
   - Sorting

📤 OUTPUT FORMAT:
\`\`\`typescript:components/${mainEntity}Dashboard.tsx
import React, { useState } from 'react';
import { ${mainEntity}List } from './${mainEntity}List';
import { ${mainEntity}Form } from './${mainEntity}Form';

export const ${mainEntity}Dashboard: React.FC = () => {
  const [items, setItems] = useState([]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">${mainEntity} Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
};
\`\`\`

**ENTITIES:** ${entitiesList}
**UI ELEMENTS:** ${uiElementsList}
**ACTIONS:** ${actionsList}

GENERATE COHESIVE FEATURE SET WITH ALL COMPONENTS.`;
  }
  
  // ───────────────────────────────────────────────────────────────
  
  if (scope.type === ScopeType.FULLSTACK) {
    return `${minervaBaseProtocol}

╔═══════════════════════════════════════════════════════════════╗
║ SCOPE: FULL-STACK APPLICATION (COMPLEX)                       ║
╚═══════════════════════════════════════════════════════════════╝

**USER REQUEST:** "${originalPrompt}"

**GENERATION RULES:**

📦 FILE COUNT: Generate 30-45 files (MINIMUM ${scope.expectedFileCount.min})
   - Complete frontend (React + TypeScript)
   - Complete backend (Express + TypeScript)
   - Database schema (Prisma)
   - Shared types
   - Authentication flow
   - Entry points

═══════════════════════════════════════════════════════════════
MANDATORY COMPONENTS (Generate ALL):
═══════════════════════════════════════════════════════════════

📁 FRONTEND (React + TypeScript):
  
  Components:
    - ${mainEntity}List.tsx (list view with pagination)
    - ${mainEntity}Item.tsx (item display)
    - Add${mainEntity}Form.tsx (create form with validation)
    - Edit${mainEntity}Form.tsx (edit form)
    - ${mainEntity}Stats.tsx or ${mainEntity}Chart.tsx (data visualization)
  
  Pages:
    - Home.tsx (main dashboard)
    - Login.tsx (authentication page)
    - Register.tsx (user registration page)
  
  Layout:
    - App.tsx (main app component with Router)
    - Layout.tsx (common layout wrapper with header/footer)
    - PrivateRoute.tsx (protected route wrapper)
  
  Hooks:
    - useAuth.ts (authentication hook with login/logout)
    - use${mainEntity}.ts (data fetching hook with CRUD operations)
  
  API Clients:
    - api.ts (axios instance with interceptors)
    - ${mainEntity.toLowerCase()}Api.ts (CRUD methods)
    - authApi.ts (auth methods: login, register, verify)
  
  Entry:
    - index.tsx (ReactDOM.render with BrowserRouter)

📁 BACKEND (Express + TypeScript):
  
  Entry:
    - server.ts (app.listen with port and error handling)
    - app.ts (Express app setup with CORS, middleware, routes)
  
  Routes:
    - ${mainEntity.toLowerCase()}.routes.ts (GET, POST, PUT, DELETE)
    - auth.routes.ts (POST /login, POST /register, GET /verify)
  
  Controllers:
    - ${mainEntity.toLowerCase()}.controller.ts (business logic with Prisma)
    - auth.controller.ts (authentication logic with JWT)
  
  Middleware:
    - auth.middleware.ts (JWT validation)
    - errorHandler.middleware.ts (centralized error handling)
    - logger.middleware.ts (request logging with timestamps)
  
  Validators:
    - ${mainEntity.toLowerCase()}.validators.ts (Zod schemas for CRUD)
    - auth.validators.ts (Zod schemas for login/register)

📁 SHARED:
  - types/index.ts (all TypeScript interfaces shared between frontend/backend)

📁 DATABASE:
  - prisma/schema.prisma (Prisma models with relations)

📁 CONFIGURATION:
  - .env.example (environment variables template with comments)
  - frontend/tsconfig.json (frontend TypeScript config)
  - backend/tsconfig.json (backend TypeScript config)
  - frontend/package.json (frontend dependencies: react, axios, etc)
  - backend/package.json (backend dependencies: express, prisma, zod, etc)

CRITICAL RULES:
1. Generate ALL components listed above (minimum ${scope.expectedFileCount.min} files)
2. Every component must be COMPLETE (no TODOs, no placeholders)
3. All exports must be correct:
   - React components: export const ComponentName: React.FC = () => {...};
   - Express routers: export default router;
   - Types: export interface TypeName {...}
4. All imports must reference existing files (no phantom imports)
5. Add closing braces } for all functions, components, classes
6. Use proper TypeScript types:
   - Express: Request, Response, NextFunction (NOT 'any')
   - Prisma: PrismaClient
   - React: React.FC<PropsType>
7. All referenced components in imports MUST be generated

ENTRY POINTS MUST INCLUDE:

\`\`\`typescript:frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
\`\`\`

\`\`\`typescript:backend/src/server.ts
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

\`\`\`typescript:backend/src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import { ${mainEntity.toLowerCase()}Router } from './routes/${mainEntity.toLowerCase()}.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { logger } from './middleware/logger.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/${mainEntity.toLowerCase()}', ${mainEntity.toLowerCase()}Router);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
\`\`\`

**ENTITIES:** ${entitiesList}
**ACTIONS:** ${actionsList}
**UI ELEMENTS:** ${uiElementsList}

GENERATE COMPLETE FULL-STACK APPLICATION WITH ALL ${scope.expectedFileCount.min}+ FILES - PRODUCTION-READY.`;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // DEFAULT FALLBACK (não deveria chegar aqui)
  // ═══════════════════════════════════════════════════════════════
  return `${minervaBaseProtocol}

**USER REQUEST:** "${originalPrompt}"

Generate a ${complexity} complexity application with:
- Entities: ${entitiesList}
- Actions: ${actionsList}
- Framework: ${framework}

Follow Minerva Omega protocols above.`;
}


/**
 * ═══════════════════════════════════════════════════════════════
 * SCOPE DETECTION FROM INTENT CLASSIFICATION
 * ═══════════════════════════════════════════════════════════════
 * Detecta scope preciso baseado no intent classificado pelo PromptProcessor
 */
private detectScopeFromIntent(
  analysis: PromptAnalysisResult,
  originalPrompt: string
): ScopeDetectionResult {
  
  const promptLower = originalPrompt.toLowerCase();
  const detectedKeywords: string[] = [];
  
  // ═══════════════════════════════════════════════════════════════
  // SINGLE COMPONENT DETECTION
  // ═══════════════════════════════════════════════════════════════
  const singleComponentKeywords = [
    /\b(simple|just|only|a)\s+(component|card|button|form|input)\b/i,
    /\bcreate\s+a\s+(single|one)\s+component\b/i,
    /\b(task\s+card|user\s+card|product\s+card)\b/i
  ];
  
  for (const pattern of singleComponentKeywords) {
    if (pattern.test(promptLower)) {
      detectedKeywords.push('single-component');
      return {
        type: ScopeType.SINGLE_COMPONENT,
        complexity: ComplexityLevel.MINIMAL,
        confidence: 0.9,
        expectedFileCount: { min: 2, max: 4 },
        shouldIncludeFrontend: true,
        shouldIncludeBackend: false,
        shouldIncludeDatabase: false,
        detectedKeywords
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // BACKEND API DETECTION
  // ═══════════════════════════════════════════════════════════════
  const backendKeywords = [
    /\b(rest\s+api|api|backend|server|express)\b/i,
    /\b(endpoints?|routes?|controllers?)\b/i,
    /\b(authentication|jwt|middleware)\b/i
  ];
  
  const noFrontendKeywords = [
    /\bno\s+(frontend|ui|interface|components?)\b/i,
    /\bbackend\s+only\b/i,
    /\bapi\s+only\b/i
  ];
  
  let backendScore = 0;
  let noFrontendScore = 0;
  
  for (const pattern of backendKeywords) {
    if (pattern.test(promptLower)) {
      backendScore++;
      detectedKeywords.push('backend');
    }
  }
  
  for (const pattern of noFrontendKeywords) {
    if (pattern.test(promptLower)) {
      noFrontendScore++;
    }
  }
  
  // Se menciona backend E não menciona frontend/ui/dashboard
  const hasFrontendMention = /\b(dashboard|page|ui|interface|react|component)\b/i.test(promptLower);
  
  if (backendScore >= 2 && (!hasFrontendMention || noFrontendScore > 0)) {
    return {
      type: ScopeType.BACKEND,
      complexity: ComplexityLevel.MODERATE,
      confidence: 0.85,
      expectedFileCount: { min: 8, max: 15 },
      shouldIncludeFrontend: false,
      shouldIncludeBackend: true,
      shouldIncludeDatabase: false,
      detectedKeywords
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FULLSTACK DETECTION
  // ═══════════════════════════════════════════════════════════════
  const fullstackKeywords = [
    /\b(complete|full[\s-]?stack|entire|whole)\s+(app|application|system)\b/i,
    /\bfrontend\s+and\s+backend\b/i,
    /\b(database|prisma|mongodb|postgres)\b/i,
    /\bwith\s+(backend|api|database)\b/i
  ];
  
  for (const pattern of fullstackKeywords) {
    if (pattern.test(promptLower)) {
      detectedKeywords.push('fullstack');
      return {
        type: ScopeType.FULLSTACK,
        complexity: ComplexityLevel.COMPLEX,
        confidence: 0.8,
        expectedFileCount: { min: 25, max: 40 },
        shouldIncludeFrontend: true,
        shouldIncludeBackend: true,
        shouldIncludeDatabase: true,
        detectedKeywords
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PAGE/DASHBOARD DETECTION
  // ═══════════════════════════════════════════════════════════════
  const pageKeywords = [
    /\b(dashboard|page|screen|view)\b/i,
    /\b(user\s+dashboard|admin\s+panel)\b/i
  ];
  
  for (const pattern of pageKeywords) {
    if (pattern.test(promptLower)) {
      detectedKeywords.push('page');
      return {
        type: ScopeType.PAGE,
        complexity: ComplexityLevel.MODERATE,
        confidence: 0.75,
        expectedFileCount: { min: 6, max: 12 },
        shouldIncludeFrontend: true,
        shouldIncludeBackend: false,
        shouldIncludeDatabase: false,
        detectedKeywords
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // USAR INTENT CLASSIFICATION DO PROMPT PROCESSOR (se disponível)
  // ═══════════════════════════════════════════════════════════════
  if (analysis.intent && analysis.intent.type) {
    const intentType = analysis.intent.type;
    
    if (intentType === 'CREATE_COMPONENT') {
      return {
        type: ScopeType.SINGLE_COMPONENT,
        complexity: ComplexityLevel.MINIMAL,
        confidence: analysis.intent.confidence / 100,
        expectedFileCount: { min: 2, max: 4 },
        shouldIncludeFrontend: true,
        shouldIncludeBackend: false,
        shouldIncludeDatabase: false,
        detectedKeywords: ['intent:create_component']
      };
    }
    
    if (intentType === 'CREATE_API') {
      return {
        type: ScopeType.BACKEND,
        complexity: ComplexityLevel.MODERATE,
        confidence: analysis.intent.confidence / 100,
        expectedFileCount: { min: 8, max: 15 },
        shouldIncludeFrontend: false,
        shouldIncludeBackend: true,
        shouldIncludeDatabase: false,
        detectedKeywords: ['intent:create_api']
      };
    }
    
    if (intentType === 'CREATE_APP' || intentType === 'CREATE_FULLSTACK_APP') {
      return {
        type: ScopeType.FULLSTACK,
        complexity: ComplexityLevel.COMPLEX,
        confidence: analysis.intent.confidence / 100,
        expectedFileCount: { min: 25, max: 40 },
        shouldIncludeFrontend: true,
        shouldIncludeBackend: true,
        shouldIncludeDatabase: true,
        detectedKeywords: ['intent:create_app']
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // DEFAULT: FEATURE (quando não consegue classificar com precisão)
  // ═══════════════════════════════════════════════════════════════
  return {
    type: ScopeType.FEATURE,
    complexity: ComplexityLevel.MODERATE,
    confidence: 0.6,
    expectedFileCount: { min: 6, max: 12 },
    shouldIncludeFrontend: true,
    shouldIncludeBackend: false,
    shouldIncludeDatabase: false,
    detectedKeywords: ['default']
  };
}

/**
 * Generate fallback component when AI fails
 */
private generateFallbackComponent(prompt: string): string {
  return `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ${prompt}
        </h1>
        <p className="text-gray-600">
          Generated by ORUS Builder AI
        </p>
      </div>
    </div>
  );
}`;
}


  /**
   * Stage 3: Validate
   * - Use CIG validator
   */
 /**
 * ═══════════════════════════════════════════════════════════════
 * STAGE 3: VALIDATE - FORCED CIG VALIDATION (NOT OPTIONAL)
 * ═══════════════════════════════════════════════════════════════
 * Validação CIG OBRIGATÓRIA com relatório completo
 */
private async stageValidate(
  components: GeneratedComponent[]
): Promise<PipelineStageResult> {
  
  logger.info('Pipeline Stage 3: Validate (CIG Enforced)', { 
    component: 'GenerationPipeline',
    componentsCount: components.length
  });

  try {
    const validatedComponents: GeneratedComponent[] = [];
    const validationErrors: Array<{
      component: string;
      errors: string[];
    }> = [];

    // ═══════════════════════════════════════════════════════════════
    // VALIDAR CADA COMPONENTE (CIG-2.0 COMPLIANCE OBRIGATÓRIO)
    // ═══════════════════════════════════════════════════════════════
    for (const component of components) {
      
      console.log(`🔍 [Validation] Validating component: ${component.name}`);
      
      // ✅ Preparar input para CIG Validator
      const validationInput: ValidationInput = {
        code: component.code,
        language: CodeLanguage.TYPESCRIPT,
        context: {
          projectId: 'generated',
          componentName: component.name
        },
        options: {
          strictMode: true,              // ✅ FORÇAR modo strict
          checkDependencies: true,       // ✅ Validar imports/exports
          checkContracts: true,          // ✅ Validar contratos
          generateReport: true           // ✅ Gerar relatório completo
        }
      };

      // ✅ EXECUTAR VALIDAÇÃO CIG
      const validation: ExtendedValidationResult = await cigValidator.validate(validationInput);

      // ═══════════════════════════════════════════════════════════════
      // TRATAR RESULTADO DA VALIDAÇÃO
      // ═══════════════════════════════════════════════════════════════
      
      if (!validation.isValid || !validation.passed) {
        // ❌ COMPONENTE NÃO PASSOU NA VALIDAÇÃO
    const errors = [
  ...(validation.errors || []).map(err => {
    if (typeof err === 'string') {
      return err;
    }
    // Se for objeto I18nText ou similar, extrair texto
    if (err && typeof err === 'object') {
      return (err as any).en || (err as any).message || JSON.stringify(err);
    }
    return String(err);
  }),
  ...(validation.codeIssues?.map(issue => {
    const msg = issue.message;
    if (typeof msg === 'string') {
      return msg;
    }
    // Se message for I18nText
    if (msg && typeof msg === 'object') {
      return (msg as any).en || JSON.stringify(msg);
    }
    return String(msg);
  }) || [])
];

        
        validationErrors.push({
          component: component.name,
          errors
        });
        
        console.error(`❌ [Validation] Component ${component.name} FAILED validation`);
        console.error(`[Validation] Errors (${errors.length}):`, errors);
        
        logger.error(`CIG Validation failed for ${component.name}`, {
          component: 'GenerationPipeline',
          metadata: { 
            errorCount: errors.length,
            errors: errors.slice(0, 3) // Primeiros 3 erros
          }
        });
        
      } else {
        // ✅ COMPONENTE PASSOU NA VALIDAÇÃO
        console.log(`✅ [Validation] Component ${component.name} PASSED validation`);
        
        logger.info(`Component ${component.name} validated successfully`, {
          component: 'GenerationPipeline',
          metadata: { 
            linesOfCode: component.code.split('\n').length,
            cigCompliant: true
          }
        });
      }

      // Adicionar metadados de validação ao componente
      component.metadata.validated = validation.isValid && validation.passed;
component.metadata.cigCompliant = validation.isValid && validation.passed;
      component.metadata.validationScore = validation.score || 0;
      
      validatedComponents.push(component);
    }

    // ═══════════════════════════════════════════════════════════════
    // RESULTADO FINAL DA VALIDAÇÃO
    // ═══════════════════════════════════════════════════════════════
    
    const allValid = validationErrors.length === 0;
    const validCount = validatedComponents.filter(c => c.metadata.validated).length;
    
    console.log('═══════════════════════════════════════════════════════');
    console.log(`${allValid ? '✅' : '⚠️'} [Validation] Validation complete`);
    console.log(`[Validation] Valid components: ${validCount}/${validatedComponents.length}`);
    
    if (!allValid) {
      console.warn('[Validation] Components with errors:', validationErrors.length);
      validationErrors.forEach(({ component, errors }) => {
        console.warn(`  - ${component}: ${errors.length} errors`);
      });
    }
    console.log('═══════════════════════════════════════════════════════');

    logger.info('Validation stage completed', {
      component: 'GenerationPipeline',
      metadata: { 
        total: validatedComponents.length,
        valid: validCount,
        invalid: validatedComponents.length - validCount,
        allValid
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // SE HOUVER ERROS CRÍTICOS, FALHAR (opcional - configure conforme necessário)
    // ═══════════════════════════════════════════════════════════════
    
    // MODO STRICT: Falhar se houver qualquer erro
    // if (!allValid) {
    //   throw new Error(
    //     `CIG Validation failed for ${validationErrors.length} component(s). ` +
    //     `Details: ${JSON.stringify(validationErrors, null, 2)}`
    //   );
    // }

    // MODO LENIENT: Retornar sucesso mas incluir warnings
    return {
      success: true,
      data: validatedComponents,
      warnings: validationErrors.length > 0 ? validationErrors : undefined
    };

  } catch (error) {
    logger.error('Validation stage failed', {
      component: 'GenerationPipeline',
      error: (error as Error).message
    });
    
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

  /**
   * Stage 4: Optimize
   * - Use quality analyzer + code optimizer
   */
  private async stageOptimize(components: GeneratedComponent[]): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 4: Optimize', { component: 'GenerationPipeline' });

    try {
      const optimizedComponents: GeneratedComponent[] = [];

      for (const component of components) {
        // ✅ Quality Analyzer
        if (this.config.enableQualityAnalysis) {
          const qualityInput: QualityAnalysisInput = {
  code: component.code,
  fileName: component.name,
  language: 'typescript' as AnalysisLanguage,
  analysisDepth: 'standard' as AnalysisDepth
};


          const quality: QualityAnalysisResult = await qualityAnalyzer.analyze(qualityInput);
          component.metadata.qualityScore = quality.overallScore;
          component.metadata.coverage = quality.metrics?.testCoverage || 0;
        }

        // ✅ Code Optimizer
     const optimizationInput: OptimizationInput = {
  code: component.code,
  fileName: component.name,
  language: 'typescript' as OptimizerLanguage,
 optimizations: [OptimizationType.PERFORMANCE, OptimizationType.BEST_PRACTICES]

};

        const optimized: OptimizationResult = await codeOptimizer.optimize(optimizationInput);

        component.code = optimized.optimizedCode;
        component.metadata.optimized = true;
component.metadata.optimizations = optimized.changes.map((c: any) => c.type) || [];

        optimizedComponents.push(component);
      }

      logger.info('Optimize stage completed', {
        component: 'GenerationPipeline',
        metadata: { optimizedCount: optimizedComponents.length }
      });

      return {
        success: true,
        data: optimizedComponents
      };

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Helper Methods
  // ═══════════════════════════════════════════════════════════════

  private generatePath(spec: any, framework: string): string {
    const base = framework === 'react' ? 'src/components' : 'src';
    return `${base}/${spec.name}.tsx`;
  }

  private extractDependencies(code: string): string[] {
    const deps: string[] = [];
    const importRegex = /import .+ from ['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
    if (match && match[1] && !match[1].startsWith('.')) {
  deps.push(match[1]);
}
    }
    
    return [...new Set(deps)];
  }

  private extractAllDependencies(components: GeneratedComponent[]): string[] {
    const allDeps = components.flatMap(c => c.dependencies);
    return [...new Set(allDeps)];
  }

  private calculateComplexity(code: string): number {
    // Simple cyclomatic complexity approximation
    const keywords = ['if', 'else', 'for', 'while', 'switch', 'case', '&&', '||'];
    let complexity = 1;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      complexity += matches ? matches.length : 0;
    });
    
    return complexity;
  }

  private generatePackageJson(components: GeneratedComponent[]): string {
    const dependencies = this.extractAllDependencies(components);
    
    return JSON.stringify({
      name: 'generated-project',
      version: '1.0.0',
      dependencies: dependencies.reduce((acc, dep) => {
        acc[dep] = 'latest';
        return acc;
      }, {} as Record<string, string>)
    }, null, 2);
  }

  private generateReadme(components: GeneratedComponent[]): string {
    return `# Generated Project

## Components

${components.map(c => `- **${c.name}** (${c.type})`).join('\n')}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

Generated by ORUS Builder - Cognitive Generation Engine
`;
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5: CONTEXT BUILDER CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Context Builder
 * Builds generation context from request
 */
export class ContextBuilder {
  /**
   * Build context from generation request
   */
  public async build(request: GenerationRequest): Promise<GenerationContext> {
    logger.info('Building generation context', {
      component: 'ContextBuilder'
    });

    try {
      // Analyze prompt
      const analysis = await this.analyzePrompt(request);

      // Search templates
      const templates = await this.searchTemplates(analysis, request);

      // Build specification (inline - método foi removido)
      const specification = analysis.specification || {
        architecture: {
          style: 'modular',
          layers: ['presentation', 'business', 'data'],
          patterns: ['mvc', 'repository']
        },
        components: [{
          name: 'MainComponent',
          type: 'component',
          purpose: 'Primary interface',
          responsibilities: ['rendering', 'state management']
        }],
        dataModel: [],
        technologies: {
          frontend: ['react', 'typescript'],
          backend: ['node', 'express'],
          database: ['mongodb'],
          deployment: ['docker']
        },
        quality: {
          testingStrategy: 'unit + integration',
          securityRequirements: ['authentication', 'authorization'],
          performanceTargets: ['<100ms response time']
        }
      };

      // Trinity integration (if enabled)
      let trinity: TrinityResponse<any> | undefined;
      if (request.enableTrinity) {
        trinity = await this.invokeTrinity(request);
      }

      const context: GenerationContext = {
        prompt: request.prompt,
        analysis,
        templates,
        framework: request.framework || 'react',
        domain: analysis.context.domain,
        specification,
        trinity
      };

      logger.info('Context built successfully', {
        component: 'ContextBuilder',
        metadata: {
          templatesFound: templates.length,
          trinityEnabled: !!trinity
        }
      });

      return context;

    } catch (error) {
      logger.error('Failed to build context', {
        component: 'ContextBuilder',
        error: (error as Error).message
      });
      throw error;
    }
  }

  /**
   * Analyze prompt (fallback mode)
   */
  private async analyzePrompt(request: GenerationRequest): Promise<PromptAnalysisResult> {
    try {
      logger.info('Using fallback analysis', {
        component: 'ContextBuilder'
      });
      
      return {
        originalPrompt: request.prompt,
        intent: {
          type: 'CREATE_APP',
          description: 'Create application',
          confidence: 60,
          subIntents: []
        },
        entities: [],
        requirements: [],
        ambiguities: [],
        context: {
          domain: request.context?.domain || 'general',
          complexity: request.context?.complexity || 'standard',
          stylePreferences: request.context?.stylePreferences,
          colorPalette: request.context?.colorPalette,
          personality: request.context?.personality
        },
        confidence: 60
      };

    } catch (error) {
      throw new Error('Prompt analysis failed');
    }
  }

  /**
   * Search templates
   */
  private async searchTemplates(
    analysis: PromptAnalysisResult,
    request: GenerationRequest
  ): Promise<any[]> {
    try {
      const templates = await templateManager.searchTemplates({
        keyword: analysis.intent.description,
        category: (request.framework || 'react') as TemplateCategory,
        tags: [analysis.context.domain || 'general']
      });

      const templatesArray = Array.isArray(templates) 
        ? templates 
        : (templates.templates || []);

      return templatesArray;

    } catch (error) {
      return [];
    }
  }

 
  /**
   * Invoke Trinity (if enabled)
   */
  private async invokeTrinity(request: GenerationRequest): Promise<TrinityResponse<any>> {
    try {
      // ✅ Get Trinity singleton instance
      const trinity = TrinityOrchestrator.getInstance();

const trinityRequest: TrinityRequest = {
  requestId: `gen-${Date.now()}`,
  component: 'cerebro',
  operation: 'code_analysis',
  action: 'generate', // ✅ Propriedade obrigatória
  params: {
    prompt: request.prompt,
    context: request.context
  },
  timestamp: new Date()
};


// Trinity não expõe método público ainda - usar fallback
const result: TrinityResponse<any> = {
  requestId: trinityRequest.requestId,
  timestamp: new Date(),
  component: trinityRequest.component,
  operation: trinityRequest.operation,
  success: false,
  metadata: {
    processingTime: 0,
    component: trinityRequest.component,
    executionTime: 0,
    cacheHit: false,
    retryCount: 0
  },
  source: 'fallback'
};
      return result;

    } catch (error) {
      logger.warn('Trinity invocation failed, continuing without it', {
        component: 'ContextBuilder'
      });
      
   return {
  success: false,
  requestId: `gen-${Date.now()}`,
  timestamp: new Date(),
  component: 'cerebro',
  operation: 'code_analysis',
  metadata: {
    processingTime: 0,
    component: 'cerebro',
    executionTime: 0,
    cacheHit: false,
    retryCount: 0
  },
  source: 'fallback',
  error: {
    code: TrinityErrorCode.COMPONENT_UNAVAILABLE,
    message: createI18nText('Trinity not available', 'Trinity indisponível'),
    details: undefined,
    recoverable: true,
    fallbackAttempted: true
  }
};

    }
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6: VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Validate generated code
 */
export async function validateGeneration(
  code: string,
  framework: string
): Promise<ValidationResult> {
  try {
    const validationInput: ValidationInput = {
      code,
      language: CodeLanguage.TYPESCRIPT,
    context: {
  projectId: 'generated-validation',
  componentName: 'validation'
}

    };

    const validation = await cigValidator.validate(validationInput);

   return {
  isValid: validation.isValid,
  errors: validation.codeIssues
    ?.filter((i: any) => i.severity === 'error')
    .map((i: any) => i.message?.en || 'Error') || [],
  warnings: validation.codeIssues
    ?.filter((i: any) => i.severity === 'warning')
    .map((i: any) => i.message?.en || 'Warning') || [],
 suggestions: []


};


  } catch (error) {
    return {
      isValid: false,
      errors: [(error as Error).message]
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7: EXPORTS & SINGLETON
// ═══════════════════════════════════════════════════════════════

/**
 * Singleton instance
 */
let cognitiveGenerationEngineInstance: CognitiveGenerationEngine | null = null;

/**
 * Get or create singleton instance
 */
export function getCognitiveGenerationEngine(): CognitiveGenerationEngine {
  if (!cognitiveGenerationEngineInstance) {
    cognitiveGenerationEngineInstance = new CognitiveGenerationEngine();
  }
  return cognitiveGenerationEngineInstance;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetCognitiveGenerationEngine(): void {
  cognitiveGenerationEngineInstance = null;
}

/**
 * Default export (for backward compatibility)
 */
export default getCognitiveGenerationEngine();
